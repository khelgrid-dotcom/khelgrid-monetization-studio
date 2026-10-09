-- ==============================================================================
-- KhelGrid Supabase Migration: Sports Entities Schema (Idempotent)
-- Tables: venues, trials, coaching_programs, venue_bookings, trial_applications, coaching_enrollments
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to handle auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 1. VENUES TABLE
-- Represents sports grounds, turf complexes, badminton arenas, and stadiums
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    area TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    sports TEXT[] NOT NULL DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    price_per_hour NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    rating NUMERIC(3, 2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    featured BOOLEAN DEFAULT FALSE,
    bookable BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_venues_updated_at ON public.venues;
CREATE TRIGGER set_venues_updated_at
BEFORE UPDATE ON public.venues
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes for Venues
CREATE INDEX IF NOT EXISTS idx_venues_city_area ON public.venues (city, area);
CREATE INDEX IF NOT EXISTS idx_venues_sports ON public.venues USING GIN (sports);
CREATE INDEX IF NOT EXISTS idx_venues_rating ON public.venues (rating DESC);
CREATE INDEX IF NOT EXISTS idx_venues_price ON public.venues (price_per_hour);

-- ------------------------------------------------------------------------------
-- 2. TRIALS TABLE
-- Represents scout trials, academy selection camps, and state athlete screening
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
    academy_name TEXT NOT NULL,
    title TEXT NOT NULL,
    sport TEXT NOT NULL,
    city TEXT NOT NULL,
    venue_name TEXT,
    trial_date DATE NOT NULL,
    reporting_time TEXT,
    fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (fee >= 0),
    spots_total INTEGER NOT NULL DEFAULT 0 CHECK (spots_total >= 0),
    spots_available INTEGER NOT NULL DEFAULT 0 CHECK (spots_available >= 0),
    tag TEXT DEFAULT 'Open',
    eligibility TEXT,
    required_documents TEXT[] DEFAULT '{}',
    selection_process TEXT,
    registration_deadline TIMESTAMPTZ,
    source_url TEXT,
    source_label TEXT,
    last_verified TIMESTAMPTZ DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_trials_updated_at ON public.trials;
CREATE TRIGGER set_trials_updated_at
BEFORE UPDATE ON public.trials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes for Trials
CREATE INDEX IF NOT EXISTS idx_trials_sport_city ON public.trials (sport, city);
CREATE INDEX IF NOT EXISTS idx_trials_trial_date ON public.trials (trial_date);
CREATE INDEX IF NOT EXISTS idx_trials_status ON public.trials (status);
CREATE INDEX IF NOT EXISTS idx_trials_venue_id ON public.trials (venue_id);

-- ------------------------------------------------------------------------------
-- 3. COACHING PROGRAMS TABLE
-- Represents structured coaching, beginner-to-advanced academies, and batches
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coaching_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID REFERENCES public.venues(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    coach_name TEXT NOT NULL,
    sport TEXT NOT NULL,
    city TEXT NOT NULL,
    area TEXT,
    level TEXT NOT NULL DEFAULT 'All Levels' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
    price_per_month NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price_per_month >= 0),
    rating NUMERIC(3, 2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    image_url TEXT,
    schedule_details JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_coaching_programs_updated_at ON public.coaching_programs;
CREATE TRIGGER set_coaching_programs_updated_at
BEFORE UPDATE ON public.coaching_programs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes for Coaching Programs
CREATE INDEX IF NOT EXISTS idx_coaching_sport_city ON public.coaching_programs (sport, city);
CREATE INDEX IF NOT EXISTS idx_coaching_level ON public.coaching_programs (level);
CREATE INDEX IF NOT EXISTS idx_coaching_venue_id ON public.coaching_programs (venue_id);

-- ------------------------------------------------------------------------------
-- 4. RELATIONSHIPS & USER TRANSACTION TABLES
-- Bookings, Trial Registrations, and Coaching Enrollments
-- ------------------------------------------------------------------------------

-- Venue Bookings
CREATE TABLE IF NOT EXISTS public.venue_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    user_phone TEXT,
    sport TEXT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_venue_bookings_updated_at ON public.venue_bookings;
CREATE TRIGGER set_venue_bookings_updated_at
BEFORE UPDATE ON public.venue_bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_bookings_venue_date ON public.venue_bookings (venue_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.venue_bookings (user_id);

-- Trial Applications
CREATE TABLE IF NOT EXISTS public.trial_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trial_id UUID NOT NULL REFERENCES public.trials(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    athlete_name TEXT NOT NULL,
    athlete_age INTEGER,
    playing_position TEXT,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    sports_cv_data JSONB DEFAULT '{}'::JSONB,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'shortlisted', 'rejected', 'attended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_trial_applications_updated_at ON public.trial_applications;
CREATE TRIGGER set_trial_applications_updated_at
BEFORE UPDATE ON public.trial_applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_trial_apps_trial_id ON public.trial_applications (trial_id);
CREATE INDEX IF NOT EXISTS idx_trial_apps_user_id ON public.trial_applications (user_id);

-- Coaching Enrollments
CREATE TABLE IF NOT EXISTS public.coaching_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES public.coaching_programs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    student_name TEXT NOT NULL,
    student_age INTEGER,
    contact_phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'paused', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_coaching_enrollments_updated_at ON public.coaching_enrollments;
CREATE TRIGGER set_coaching_enrollments_updated_at
BEFORE UPDATE ON public.coaching_enrollments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_coaching_enroll_program ON public.coaching_enrollments (program_id);
CREATE INDEX IF NOT EXISTS idx_coaching_enroll_user ON public.coaching_enrollments (user_id);

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_enrollments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating to allow clean reruns
DROP POLICY IF EXISTS "Public read access for venues" ON public.venues;
CREATE POLICY "Public read access for venues"
ON public.venues FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public read access for trials" ON public.trials;
CREATE POLICY "Public read access for trials"
ON public.trials FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public read access for coaching programs" ON public.coaching_programs;
CREATE POLICY "Public read access for coaching programs"
ON public.coaching_programs FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can view their own bookings" ON public.venue_bookings;
CREATE POLICY "Users can view their own bookings"
ON public.venue_bookings FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can create bookings" ON public.venue_bookings;
CREATE POLICY "Users can create bookings"
ON public.venue_bookings FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own trial applications" ON public.trial_applications;
CREATE POLICY "Users can view their own trial applications"
ON public.trial_applications FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can submit trial applications" ON public.trial_applications;
CREATE POLICY "Users can submit trial applications"
ON public.trial_applications FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.coaching_enrollments;
CREATE POLICY "Users can view their own enrollments"
ON public.coaching_enrollments FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can enroll in coaching" ON public.coaching_enrollments;
CREATE POLICY "Users can enroll in coaching"
ON public.coaching_enrollments FOR INSERT
WITH CHECK (true);
