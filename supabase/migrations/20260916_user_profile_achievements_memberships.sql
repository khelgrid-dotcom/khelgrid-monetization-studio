-- ==============================================================================
-- KhelGrid Supabase Migration: User Profiles, Sports Achievements & Memberships
-- Migration: 20260916_user_profile_achievements_memberships.sql
-- ==============================================================================

-- 1. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    primary_sport TEXT NOT NULL DEFAULT 'Cricket',
    secondary_sports TEXT[] DEFAULT '{}',
    city TEXT NOT NULL DEFAULT 'Bengaluru',
    age_category TEXT DEFAULT 'U-19',
    playing_position TEXT,
    bio TEXT,
    skill_level TEXT DEFAULT 'Intermediate',
    membership_tier TEXT DEFAULT 'pro',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- 2. SPORTS ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.sports_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    title TEXT NOT NULL,
    sport TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'tournament' CHECK (category IN ('tournament', 'selection', 'award', 'milestone', 'certification')),
    level TEXT NOT NULL DEFAULT 'State' CHECK (level IN ('Club', 'District', 'State', 'Zonal', 'National')),
    organization TEXT NOT NULL,
    year INTEGER NOT NULL,
    position_rank TEXT,
    description TEXT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_badge TEXT,
    certificate_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sports_achievements_user_id ON public.sports_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_sports_achievements_sport ON public.sports_achievements(sport);

-- 3. USER MEMBERSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.user_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    plan_name TEXT NOT NULL,
    tier TEXT NOT NULL DEFAULT 'pro' CHECK (tier IN ('free', 'pro', 'elite', 'academy')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'renewed', 'expired', 'paused')),
    sport TEXT NOT NULL DEFAULT 'Multi-Sport',
    venue_name TEXT,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 year'),
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    perks TEXT[] DEFAULT '{}',
    allocated_hours_per_month INTEGER NOT NULL DEFAULT 12,
    used_hours_this_month INTEGER NOT NULL DEFAULT 3,
    price_paid NUMERIC(10, 2) NOT NULL DEFAULT 4999.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_memberships_user_id ON public.user_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_status ON public.user_memberships(status);

-- 4. RLS POLICIES
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public select user_profiles" ON public.user_profiles;
CREATE POLICY "Public select user_profiles" ON public.user_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert user_profiles" ON public.user_profiles;
CREATE POLICY "Public insert user_profiles" ON public.user_profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update user_profiles" ON public.user_profiles;
CREATE POLICY "Public update user_profiles" ON public.user_profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public select sports_achievements" ON public.sports_achievements;
CREATE POLICY "Public select sports_achievements" ON public.sports_achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert sports_achievements" ON public.sports_achievements;
CREATE POLICY "Public insert sports_achievements" ON public.sports_achievements FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update sports_achievements" ON public.sports_achievements;
CREATE POLICY "Public update sports_achievements" ON public.sports_achievements FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public delete sports_achievements" ON public.sports_achievements;
CREATE POLICY "Public delete sports_achievements" ON public.sports_achievements FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public select user_memberships" ON public.user_memberships;
CREATE POLICY "Public select user_memberships" ON public.user_memberships FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert user_memberships" ON public.user_memberships;
CREATE POLICY "Public insert user_memberships" ON public.user_memberships FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update user_memberships" ON public.user_memberships;
CREATE POLICY "Public update user_memberships" ON public.user_memberships FOR UPDATE USING (true);
