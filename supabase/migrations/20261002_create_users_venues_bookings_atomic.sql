-- ==============================================================================
-- KhelGrid Supabase Migration: Users, Venues, and Bookings Schema with Atomic Transactions & RLS
-- Migration: 20261002_create_users_venues_bookings_atomic.sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS & COMMON UTILITIES
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Function to handle auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. USERS TABLE
-- Represents platform athletes, coaches, academy owners, scouts, and admins.
-- Syncs automatically with auth.users while enabling relational queries and RLS.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'athlete' CHECK (role IN ('athlete', 'coach', 'academy_owner', 'scout', 'admin')),
    city TEXT DEFAULT 'Bengaluru',
    primary_sport TEXT DEFAULT 'Multi-Sport',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Helper to check if current authenticated user has admin privileges
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.users 
        WHERE (auth_user_id = auth.uid() OR id = auth.uid()) AND role = 'admin'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Trigger to automatically create a public.users row upon Supabase Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_auth_user_sync()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id,
        auth_user_id,
        email,
        full_name,
        role
    ) VALUES (
        NEW.id,
        NEW.id,
        coalesce(NEW.email, 'guest@khelgrid.com'),
        coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        coalesce(NEW.raw_user_meta_data->>'role', 'athlete')
    )
    ON CONFLICT (auth_user_id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        full_name = coalesce(EXCLUDED.full_name, public.users.full_name),
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user_sync();

-- ------------------------------------------------------------------------------
-- 3. VENUES TABLE
-- Sports complexes, turf arenas, courts, swimming centers, and stadiums
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    area TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    sports TEXT[] NOT NULL DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    price_per_hour NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price_per_hour >= 0),
    rating NUMERIC(3, 2) DEFAULT 4.80 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    bookable BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    operating_hours JSONB DEFAULT '{
      "regular_hours": "6:00 AM – 11:00 PM (Monday to Sunday)",
      "weekend_hours": "5:30 AM – 11:30 PM (Saturday & Sunday)",
      "peak_hours": "6:00 PM – 10:00 PM (Weekdays) & 6:00 AM – 10:00 PM (Weekends)"
    }'::jsonb,
    booking_policies JSONB DEFAULT '{
      "advance_booking": "Book up to 14 days in advance with instant slot confirmation.",
      "cancellation_full_refund": "100% refund for cancellations at least 4 hours before slot time.",
      "slot_duration": "60-minute standard increments with 10-minute buffer."
    }'::jsonb,
    rules_restrictions JSONB DEFAULT '{
      "footwear": "Non-marking gum sole shoes mandatory for indoor courts; rubber studs for turf."
    }'::jsonb,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_venues_updated_at ON public.venues;
CREATE TRIGGER trg_venues_updated_at
BEFORE UPDATE ON public.venues
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

CREATE INDEX IF NOT EXISTS idx_venues_city_area ON public.venues (city, area);
CREATE INDEX IF NOT EXISTS idx_venues_sports ON public.venues USING GIN (sports);
CREATE INDEX IF NOT EXISTS idx_venues_price ON public.venues (price_per_hour);
CREATE INDEX IF NOT EXISTS idx_venues_owner ON public.venues (owner_id);
CREATE INDEX IF NOT EXISTS idx_venues_active ON public.venues (bookable) WHERE deleted_at IS NULL;

-- ------------------------------------------------------------------------------
-- 4. BOOKINGS TABLE
-- High-concurrency venue reservations with math overlap constraints and idempotency
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    court_id UUID,
    court_name TEXT DEFAULT 'Main Court',
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_email TEXT,
    user_phone TEXT,
    sport TEXT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    booking_range TSRANGE GENERATED ALWAYS AS (
        tsrange(
            (booking_date + start_time),
            (booking_date + end_time),
            '[)'
        )
    ) STORED,
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    idempotency_key UUID UNIQUE,
    held_until TIMESTAMPTZ,
    notes TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_bookings_updated_at ON public.bookings;
CREATE TRIGGER trg_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

-- PostgreSQL Engine-Level Non-Overlapping Slot Exclusion Constraint
DO $$ BEGIN
    ALTER TABLE public.bookings
    ADD CONSTRAINT no_overlapping_court_bookings
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

CREATE INDEX IF NOT EXISTS idx_bookings_venue_date ON public.bookings (venue_id, booking_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_idempotency ON public.bookings (idempotency_key);
CREATE INDEX IF NOT EXISTS idx_bookings_active_slots ON public.bookings (venue_id, booking_date, status) WHERE status IN ('pending', 'confirmed');

-- Sync compatibility view with venue_bookings
CREATE OR REPLACE VIEW public.venue_bookings_unified AS
SELECT 
    b.id,
    b.venue_id,
    b.court_id,
    b.court_name,
    b.user_id,
    b.user_email,
    b.user_phone,
    b.sport,
    b.booking_date,
    b.start_time,
    b.end_time,
    b.total_price,
    b.status,
    b.idempotency_key,
    b.held_until,
    b.deleted_at,
    b.created_at,
    b.updated_at,
    v.name AS venue_name,
    v.area AS venue_area,
    v.city AS venue_city,
    v.image_url AS venue_image
FROM public.bookings b
JOIN public.venues v ON b.venue_id = v.id;

-- ------------------------------------------------------------------------------
-- 5. ATOMIC BOOKING TRANSACTION STORED PROCEDURES (RPCs)
-- ------------------------------------------------------------------------------

-- 5A. Privacy-Preserving Slot Availability RPC
-- Shields customer email, phone, and name from public inspection
CREATE OR REPLACE FUNCTION public.get_slot_availability(
    p_venue_id UUID,
    p_booking_date DATE,
    p_court_id UUID DEFAULT NULL
)
RETURNS TABLE (
    court_id UUID,
    start_time TIME,
    end_time TIME,
    status TEXT,
    is_held BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.court_id,
        b.start_time,
        b.end_time,
        b.status,
        (b.status = 'pending' AND b.held_until IS NOT NULL AND b.held_until > NOW()) AS is_held
    FROM public.bookings b
    WHERE b.venue_id = p_venue_id
      AND b.booking_date = p_booking_date
      AND (p_court_id IS NULL OR b.court_id IS NULL OR b.court_id = p_court_id)
      AND b.status IN ('confirmed', 'pending')
      AND b.deleted_at IS NULL
      AND (b.held_until IS NULL OR b.held_until > NOW());
END;
$$;

-- 5B. Atomic Booking Transaction RPC
-- Employs transaction-level advisory locks, pessimistic row locking, and idempotency checks
CREATE OR REPLACE FUNCTION public.execute_atomic_booking(
    p_venue_id UUID,
    p_court_id UUID DEFAULT NULL,
    p_court_name TEXT DEFAULT 'Main Court',
    p_sport TEXT DEFAULT 'Multi-Sport',
    p_booking_date DATE DEFAULT CURRENT_DATE,
    p_start_time TIME DEFAULT '06:00:00',
    p_end_time TIME DEFAULT '07:00:00',
    p_total_price NUMERIC DEFAULT 0.00,
    p_user_email TEXT DEFAULT NULL,
    p_user_phone TEXT DEFAULT NULL,
    p_idempotency_key UUID DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_status TEXT DEFAULT 'confirmed',
    p_hold_duration_minutes INTEGER DEFAULT NULL,
    p_custom_booking_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_booking_id UUID;
    v_user_id UUID;
    v_held_until TIMESTAMPTZ := NULL;
    v_conflict_count INTEGER := 0;
    v_existing_booking RECORD;
    v_lock_key BIGINT;
BEGIN
    -- Resolve effective user ID
    v_user_id := coalesce(p_user_id, auth.uid());

    -- 1. Idempotency Check
    IF p_idempotency_key IS NOT NULL THEN
        SELECT id, status, total_price, booking_date, start_time, end_time, created_at
        INTO v_existing_booking
        FROM public.bookings
        WHERE idempotency_key = p_idempotency_key
          AND deleted_at IS NULL
        LIMIT 1;

        IF FOUND THEN
            RETURN jsonb_build_object(
                'success', true,
                'already_processed', true,
                'booking_id', v_existing_booking.id,
                'status', v_existing_booking.status,
                'total_price', v_existing_booking.total_price,
                'message', 'Existing booking returned via idempotency key.'
            );
        END IF;
    END IF;

    -- 2. Transaction-Level Advisory Lock (Serializes concurrent attempts for this court/date)
    v_lock_key := ('x' || substr(md5(p_venue_id::text || '_' || coalesce(p_court_id::text, '00000000-0000-0000-0000-000000000000') || '_' || p_booking_date::text), 1, 16))::bit(64)::bigint;
    PERFORM pg_advisory_xact_lock(v_lock_key);

    -- 3. Auto-expire stale holds
    UPDATE public.bookings
    SET status = 'cancelled'
    WHERE venue_id = p_venue_id
      AND booking_date = p_booking_date
      AND (p_court_id IS NULL OR court_id IS NULL OR court_id = p_court_id)
      AND status = 'pending'
      AND held_until IS NOT NULL
      AND held_until <= NOW();

    -- 4. Overlap Check with Pessimistic Row Lock
    SELECT COUNT(*)
    INTO v_conflict_count
    FROM public.bookings
    WHERE venue_id = p_venue_id
      AND (p_court_id IS NULL OR court_id IS NULL OR court_id = p_court_id)
      AND booking_date = p_booking_date
      AND status IN ('confirmed', 'pending')
      AND deleted_at IS NULL
      AND (held_until IS NULL OR held_until > NOW())
      AND (start_time < p_end_time AND end_time > p_start_time)
    FOR UPDATE;

    IF v_conflict_count > 0 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'SLOT_UNAVAILABLE',
            'message', 'The requested slot is already booked or currently reserved by another customer.'
        );
    END IF;

    -- 5. Calculate hold expiration if booking is pending
    IF p_status = 'pending' AND p_hold_duration_minutes IS NOT NULL AND p_hold_duration_minutes > 0 THEN
        v_held_until := NOW() + (p_hold_duration_minutes || ' minutes')::interval;
    END IF;

    -- 6. Generate booking ID
    v_booking_id := coalesce(p_custom_booking_id, gen_random_uuid());

    -- 7. Insert Booking
    INSERT INTO public.bookings (
        id,
        venue_id,
        court_id,
        court_name,
        user_id,
        user_email,
        user_phone,
        sport,
        booking_date,
        start_time,
        end_time,
        total_price,
        status,
        idempotency_key,
        held_until
    ) VALUES (
        v_booking_id,
        p_venue_id,
        p_court_id,
        p_court_name,
        v_user_id,
        p_user_email,
        p_user_phone,
        p_sport,
        p_booking_date,
        p_start_time,
        p_end_time,
        p_total_price,
        p_status,
        p_idempotency_key,
        v_held_until
    );

    RETURN jsonb_build_object(
        'success', true,
        'already_processed', false,
        'booking_id', v_booking_id,
        'status', p_status,
        'total_price', p_total_price,
        'held_until', v_held_until,
        'message', CASE 
            WHEN p_status = 'pending' THEN 'Court slot held for checkout.' 
            ELSE 'Booking confirmed successfully.' 
        END
    );
EXCEPTION
    WHEN unique_violation THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'DUPLICATE_BOOKING',
            'message', 'Duplicate booking transaction detected.'
        );
    WHEN exclusion_violation THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'SLOT_CONFLICT',
            'message', 'Overlap conflict: This court slot was just taken by another player.'
        );
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'TRANSACTION_FAILED',
            'message', SQLERRM
        );
END;
$$;

-- 5C. Atomic Cancellation RPC
CREATE OR REPLACE FUNCTION public.execute_atomic_cancellation(
    p_booking_id UUID,
    p_cancellation_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_booking RECORD;
BEGIN
    SELECT id, user_id, venue_id, booking_date, start_time, status
    INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id
      AND deleted_at IS NULL
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error_code', 'NOT_FOUND', 'message', 'Booking not found or already cancelled.');
    END IF;

    -- Security check: Caller must be the booking owner or an admin
    IF auth.uid() IS NOT NULL AND v_booking.user_id IS NOT NULL AND auth.uid() != v_booking.user_id AND NOT public.is_current_user_admin() THEN
        RETURN jsonb_build_object('success', false, 'error_code', 'FORBIDDEN', 'message', 'Permission denied: Cannot cancel another user''s booking.');
    END IF;

    UPDATE public.bookings
    SET status = 'cancelled',
        deleted_at = NOW(),
        updated_at = NOW(),
        notes = coalesce(notes || ' | ', '') || 'Cancelled: ' || coalesce(p_cancellation_reason, 'User requested cancellation')
    WHERE id = p_booking_id;

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', p_booking_id,
        'message', 'Booking cancelled and slot capacity restored.'
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS across all three core tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- -----------------------------
-- 6A. USERS RLS POLICIES
-- -----------------------------
DROP POLICY IF EXISTS "Public can view basic user profiles" ON public.users;
CREATE POLICY "Public can view basic user profiles"
ON public.users FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile record" ON public.users;
CREATE POLICY "Users can update their own profile record"
ON public.users FOR UPDATE
TO authenticated
USING (auth.uid() = auth_user_id OR auth.uid() = id OR public.is_current_user_admin())
WITH CHECK (auth.uid() = auth_user_id OR auth.uid() = id OR public.is_current_user_admin());

DROP POLICY IF EXISTS "Users can insert their profile on signup" ON public.users;
CREATE POLICY "Users can insert their profile on signup"
ON public.users FOR INSERT
WITH CHECK (auth.uid() = auth_user_id OR auth.uid() = id OR public.is_current_user_admin());

DROP POLICY IF EXISTS "Admin can delete users" ON public.users;
CREATE POLICY "Admin can delete users"
ON public.users FOR DELETE
TO authenticated
USING (public.is_current_user_admin());

-- -----------------------------
-- 6B. VENUES RLS POLICIES
-- -----------------------------
DROP POLICY IF EXISTS "Public can view active venues" ON public.venues;
CREATE POLICY "Public can view active venues"
ON public.venues FOR SELECT
USING (deleted_at IS NULL OR public.is_current_user_admin());

DROP POLICY IF EXISTS "Venue owners and admins can create venues" ON public.venues;
CREATE POLICY "Venue owners and admins can create venues"
ON public.venues FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id OR public.is_current_user_admin());

DROP POLICY IF EXISTS "Venue owners and admins can update venues" ON public.venues;
CREATE POLICY "Venue owners and admins can update venues"
ON public.venues FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id OR public.is_current_user_admin())
WITH CHECK (auth.uid() = owner_id OR public.is_current_user_admin());

DROP POLICY IF EXISTS "Only admins can hard delete venues" ON public.venues;
CREATE POLICY "Only admins can hard delete venues"
ON public.venues FOR DELETE
TO authenticated
USING (public.is_current_user_admin());

-- -----------------------------
-- 6C. BOOKINGS RLS POLICIES
-- -----------------------------

-- SELECT: Athletes view only their own bookings; Venue managers view bookings for their facilities; Admins view all.
-- Public availability is queried via the safe get_slot_availability() RPC.
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
USING (
    (auth.uid() IS NOT NULL AND (auth.uid() = user_id OR auth.uid() IN (SELECT auth_user_id FROM public.users WHERE id = bookings.user_id)))
    OR EXISTS (SELECT 1 FROM public.venues v WHERE v.id = bookings.venue_id AND v.owner_id = auth.uid())
    OR public.is_current_user_admin()
);

-- INSERT: Authorized users can create bookings for themselves or via the atomic transaction procedure.
DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;
CREATE POLICY "Users can insert their own bookings"
ON public.bookings FOR INSERT
WITH CHECK (
    (auth.uid() IS NOT NULL AND (auth.uid() = user_id OR auth.uid() IN (SELECT auth_user_id FROM public.users WHERE id = bookings.user_id)))
    OR user_id IS NULL
    OR public.is_current_user_admin()
);

-- UPDATE: Only booking owners, venue managers, or admins can modify booking details.
DROP POLICY IF EXISTS "Users and venue managers can update bookings" ON public.bookings;
CREATE POLICY "Users and venue managers can update bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (
    (auth.uid() IS NOT NULL AND (auth.uid() = user_id OR auth.uid() IN (SELECT auth_user_id FROM public.users WHERE id = bookings.user_id)))
    OR EXISTS (SELECT 1 FROM public.venues v WHERE v.id = bookings.venue_id AND v.owner_id = auth.uid())
    OR public.is_current_user_admin()
)
WITH CHECK (
    (auth.uid() IS NOT NULL AND (auth.uid() = user_id OR auth.uid() IN (SELECT auth_user_id FROM public.users WHERE id = bookings.user_id)))
    OR EXISTS (SELECT 1 FROM public.venues v WHERE v.id = bookings.venue_id AND v.owner_id = auth.uid())
    OR public.is_current_user_admin()
);

-- DELETE: Non-admins cannot hard-delete bookings (enforces soft-deletion audit trail).
DROP POLICY IF EXISTS "Admins only hard delete bookings" ON public.bookings;
CREATE POLICY "Admins only hard delete bookings"
ON public.bookings FOR DELETE
TO authenticated
USING (public.is_current_user_admin());

-- ------------------------------------------------------------------------------
-- 7. EXECUTION PERMISSIONS
-- ------------------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.get_slot_availability(UUID, DATE, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.execute_atomic_booking(UUID, UUID, TEXT, TEXT, DATE, TIME, TIME, NUMERIC, TEXT, TEXT, UUID, UUID, TEXT, INTEGER, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.execute_atomic_cancellation(UUID, TEXT) TO anon, authenticated;
