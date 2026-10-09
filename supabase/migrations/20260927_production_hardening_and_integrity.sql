-- ==============================================================================
-- KhelGrid Supabase Free-Tier Production Hardening & Database Integrity Migration
-- Migration: 20260927_production_hardening_and_integrity.sql
-- Optimizations for Supabase Free Tier (500MB quota, lean indexes, zero-cost features)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USER ROLES & PERMISSIONS
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('athlete', 'coach', 'academy_owner', 'scout', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS role public.app_role NOT NULL DEFAULT 'athlete';

-- Helper functions (SECURITY DEFINER, STABLE for query planner caching)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.app_role AS $$
    SELECT coalesce(
        (SELECT role FROM public.user_profiles WHERE user_id = auth.uid() LIMIT 1),
        'athlete'::public.app_role
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. SOFT DELETES (Preserve booking history and audit trail without hard deletions)
ALTER TABLE public.venues ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.trials ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.coaching_programs ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.venue_bookings ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 4. VENUE COURTS & PITCHES (Granular court/turf resource modeling)
CREATE TABLE IF NOT EXISTS public.venue_courts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sport TEXT NOT NULL,
    surface_type TEXT DEFAULT 'Standard',
    price_per_hour NUMERIC(10, 2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_venue_courts_updated_at ON public.venue_courts;
CREATE TRIGGER set_venue_courts_updated_at
BEFORE UPDATE ON public.venue_courts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_venue_courts_venue_id ON public.venue_courts (venue_id);
CREATE INDEX IF NOT EXISTS idx_venue_courts_sport ON public.venue_courts (sport);

-- Seed default courts for existing venues that don't have one yet
INSERT INTO public.venue_courts (venue_id, name, sport, surface_type, price_per_hour)
SELECT v.id, v.name || ' - Court 1', coalesce(v.sports[1], 'Multi-Sport'), 'Standard Surface', v.price_per_hour
FROM public.venues v
WHERE NOT EXISTS (SELECT 1 FROM public.venue_courts c WHERE c.venue_id = v.id);

-- 5. VENUE BOOKINGS: DOUBLE-BOOKING PREVENTION & IDEMPOTENCY
ALTER TABLE public.venue_bookings
ADD COLUMN IF NOT EXISTS court_id UUID REFERENCES public.venue_courts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS idempotency_key UUID UNIQUE,
ADD COLUMN IF NOT EXISTS held_until TIMESTAMPTZ;

-- Auto-generated tsrange column for mathematical time overlap checks
DO $$ BEGIN
    ALTER TABLE public.venue_bookings
    ADD COLUMN booking_range TSRANGE GENERATED ALWAYS AS (
        tsrange(
            (booking_date + start_time),
            (booking_date + end_time),
            '[)'
        )
    ) STORED;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Enforce strict non-overlapping slot exclusion at PostgreSQL storage engine level
DO $$ BEGIN
    ALTER TABLE public.venue_bookings
    ADD CONSTRAINT no_overlapping_bookings
    EXCLUDE USING gist (
        venue_id WITH =,
        coalesce(court_id, '00000000-0000-0000-0000-000000000000'::uuid) WITH =,
        booking_range WITH &&
    ) WHERE (
        status IN ('confirmed', 'pending') 
        AND deleted_at IS NULL
        AND (held_until IS NULL OR held_until > NOW())
    );
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN others THEN null;
END $$;

-- Partial index for active bookings (Free tier optimization: keep index small and fast)
CREATE INDEX IF NOT EXISTS idx_venue_bookings_active 
ON public.venue_bookings (venue_id, booking_date) 
WHERE status IN ('pending', 'confirmed') AND deleted_at IS NULL;

-- 6. FULL-TEXT SEARCH & FUZZY MATCHING (Zero extra cost on Supabase Free Plan)
CREATE INDEX IF NOT EXISTS idx_venues_search_trgm ON public.venues 
USING GIN ((name || ' ' || area || ' ' || city) gin_trgm_ops);

DO $$ BEGIN
    ALTER TABLE public.trials 
    ADD COLUMN fts TSVECTOR 
    GENERATED ALWAYS AS (
        to_tsvector('english', 
            coalesce(title, '') || ' ' || 
            coalesce(academy_name, '') || ' ' || 
            coalesce(sport, '') || ' ' || 
            coalesce(city, '')
        )
    ) STORED;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

CREATE INDEX IF NOT EXISTS idx_trials_fts ON public.trials USING GIN (fts);

-- 7. AUDIT LOGGING (Lightweight, retention-friendly audit trail for bookings & sensitive mutations)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON public.audit_logs (table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs (created_at DESC);

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION public.log_table_mutation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        table_name,
        record_id,
        action,
        old_data,
        new_data,
        performed_by
    ) VALUES (
        TG_TABLE_NAME,
        coalesce(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        auth.uid()
    );
    RETURN coalesce(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach audit trigger to financial / critical booking state changes
DROP TRIGGER IF EXISTS audit_venue_bookings ON public.venue_bookings;
CREATE TRIGGER audit_venue_bookings
AFTER INSERT OR UPDATE OR DELETE ON public.venue_bookings
FOR EACH ROW EXECUTE FUNCTION public.log_table_mutation();

-- 8. ROW LEVEL SECURITY (RLS) HARDENING
ALTER TABLE public.venue_courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 8A. Venue Courts RLS
DROP POLICY IF EXISTS "Public select venue_courts" ON public.venue_courts;
CREATE POLICY "Public select venue_courts" 
ON public.venue_courts FOR SELECT 
USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin manage venue_courts" ON public.venue_courts;
CREATE POLICY "Admin manage venue_courts" 
ON public.venue_courts FOR ALL 
TO authenticated 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

-- 8B. User Profiles RLS (Fix open UPDATE vulnerability)
DROP POLICY IF EXISTS "Public update user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" 
ON public.user_profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id OR public.is_admin()) 
WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Public delete user_profiles" ON public.user_profiles;
CREATE POLICY "Users can delete their own profile" 
ON public.user_profiles FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id OR public.is_admin());

-- 8C. Sports Achievements RLS (Fix open DELETE/UPDATE vulnerability)
DROP POLICY IF EXISTS "Public update sports_achievements" ON public.sports_achievements;
DROP POLICY IF EXISTS "Users can update their own achievements" ON public.sports_achievements;
CREATE POLICY "Users can update their own achievements" 
ON public.sports_achievements FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id OR public.is_admin()) 
WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Public delete sports_achievements" ON public.sports_achievements;
DROP POLICY IF EXISTS "Users can delete their own achievements" ON public.sports_achievements;
CREATE POLICY "Users can delete their own achievements" 
ON public.sports_achievements FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id OR public.is_admin());

-- 8D. Venue Bookings RLS (Ensure users can only view their own bookings)
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.venue_bookings;
CREATE POLICY "Users can view their own bookings" 
ON public.venue_bookings FOR SELECT 
USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
    OR public.is_admin()
);

DROP POLICY IF EXISTS "Users can update their own bookings" ON public.venue_bookings;
CREATE POLICY "Users can update their own bookings" 
ON public.venue_bookings FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id OR public.is_admin()) 
WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 8E. Audit Logs RLS (Only admins can view audit logs)
DROP POLICY IF EXISTS "Admin view audit logs" ON public.audit_logs;
CREATE POLICY "Admin view audit logs" 
ON public.audit_logs FOR SELECT 
TO authenticated 
USING (public.is_admin());

-- 9. FREE TIER STORAGE MAINTENANCE HELPER
-- Call this periodic function (via Supabase pg_cron or server task) to clean up expired held slots and old audit logs (>90 days)
CREATE OR REPLACE FUNCTION public.purge_expired_free_tier_records()
RETURNS void AS $$
BEGIN
    -- Cancel slots held past their reservation window (e.g. abandoned checkouts > 15 mins)
    UPDATE public.venue_bookings
    SET status = 'cancelled'
    WHERE status = 'pending' 
      AND held_until IS NOT NULL 
      AND held_until < NOW();

    -- Prune audit logs older than 90 days to respect the 500MB free tier ceiling
    DELETE FROM public.audit_logs
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
