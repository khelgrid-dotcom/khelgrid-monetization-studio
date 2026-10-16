-- KhelGrid core production schema baseline.
-- Reconciliation migration: safe to run against an existing database.
-- This migration NEVER drops the core tables or existing rows.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  username text UNIQUE,
  email text,
  phone text,
  avatar_url text,
  bio text,
  city text,
  state text,
  country text DEFAULT 'India',
  role text NOT NULL DEFAULT 'athlete' CHECK (role IN ('athlete','coach','academy','organizer','admin')),
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro')),
  is_verified boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  category text,
  description text,
  icon_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.athletes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  sport_id uuid REFERENCES public.sports(id) ON DELETE SET NULL,
  secondary_sports uuid[] NOT NULL DEFAULT '{}',
  date_of_birth date,
  gender text,
  position text,
  playing_level text,
  dominant_hand text,
  height_cm numeric(5,2),
  weight_kg numeric(6,2),
  city text,
  state text,
  achievements jsonb NOT NULL DEFAULT '[]'::jsonb,
  certificates jsonb NOT NULL DEFAULT '[]'::jsonb,
  statistics jsonb NOT NULL DEFAULT '{}'::jsonb,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  sports_cv_url text,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.coaches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  sport_id uuid REFERENCES public.sports(id) ON DELETE SET NULL,
  specialization text,
  experience_years integer NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
  qualification text,
  certifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  hourly_rate numeric(10,2) NOT NULL DEFAULT 0 CHECK (hourly_rate >= 0),
  city text,
  state text,
  bio text,
  availability jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.academies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  sport_ids uuid[] NOT NULL DEFAULT '{}',
  city text,
  state text,
  address text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  phone text,
  email text,
  website text,
  logo_url text,
  facilities jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_verified boolean NOT NULL DEFAULT false,
  verification_status text NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending','submitted','verified','rejected','suspended')),
  rating numeric(3,2) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  reviews_count integer NOT NULL DEFAULT 0 CHECK (reviews_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  academy_id uuid REFERENCES public.academies(id) ON DELETE SET NULL,
  sport_id uuid REFERENCES public.sports(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text UNIQUE,
  opportunity_type text NOT NULL DEFAULT 'trial'
    CHECK (opportunity_type IN ('trial','tournament','scholarship','coaching','job','camp','event','other')),
  description text,
  eligibility jsonb NOT NULL DEFAULT '{}'::jsonb,
  location_name text,
  city text,
  state text,
  address text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  start_at timestamptz,
  end_at timestamptz,
  registration_deadline timestamptz,
  fee numeric(10,2) NOT NULL DEFAULT 0 CHECK (fee >= 0),
  capacity integer CHECK (capacity IS NULL OR capacity > 0),
  applications_count integer NOT NULL DEFAULT 0 CHECK (applications_count >= 0),
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','published','closed','cancelled','completed')),
  is_featured boolean NOT NULL DEFAULT false,
  requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','under_review','shortlisted','selected','rejected','withdrawn','attended')),
  cover_note text,
  cv_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  organizer_note text,
  applied_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (opportunity_id, athlete_id)
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id uuid REFERENCES public.venues(id) ON DELETE SET NULL,
  opportunity_id uuid REFERENCES public.opportunities(id) ON DELETE SET NULL,
  coach_id uuid REFERENCES public.coaches(id) ON DELETE SET NULL,
  booking_type text NOT NULL DEFAULT 'venue'
    CHECK (booking_type IN ('venue','coach','session','event','other')),
  booking_date date,
  start_time time,
  end_time time,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  total_amount numeric(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','cancelled','completed','refunded')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  opportunity_id uuid REFERENCES public.opportunities(id) ON DELETE SET NULL,
  application_id uuid REFERENCES public.applications(id) ON DELETE SET NULL,
  amount numeric(12,2) NOT NULL CHECK (amount >= 0),
  currency text NOT NULL DEFAULT 'INR',
  provider text,
  provider_payment_id text,
  provider_order_id text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','processing','paid','failed','refunded','partially_refunded')),
  payment_type text NOT NULL DEFAULT 'purchase'
    CHECK (payment_type IN ('purchase','application_fee','booking','wallet_topup','subscription','refund','other')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  transaction_type text NOT NULL
    CHECK (transaction_type IN ('credit','debit','refund','bonus','adjustment')),
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  balance_after numeric(12,2),
  reference_type text,
  reference_id uuid,
  description text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  academy_id uuid REFERENCES public.academies(id) ON DELETE CASCADE,
  coach_id uuid REFERENCES public.coaches(id) ON DELETE CASCADE,
  opportunity_id uuid REFERENCES public.opportunities(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text,
  review_text text,
  response_text text,
  is_verified_transaction boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'published'
    CHECK (status IN ('pending','published','hidden','flagged')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(academy_id, coach_id) = 1)
);

CREATE TABLE IF NOT EXISTS public.organizer_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  academy_id uuid REFERENCES public.academies(id) ON DELETE CASCADE,
  verification_type text NOT NULL DEFAULT 'organizer'
    CHECK (verification_type IN ('organizer','academy','coach','identity','business','payment')),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','submitted','under_review','verified','rejected','expired','suspended')),
  documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewer_note text,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opened_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  respondent_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  application_id uuid REFERENCES public.applications(id) ON DELETE SET NULL,
  reason text NOT NULL,
  description text,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','under_review','awaiting_response','resolved','rejected','closed')),
  resolution text,
  refund_amount numeric(12,2) NOT NULL DEFAULT 0 CHECK (refund_amount >= 0),
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  action_url text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_read boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','signed_up','qualified','rewarded','expired')),
  reward_amount numeric(10,2) NOT NULL DEFAULT 0 CHECK (reward_amount >= 0),
  rewarded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referrer_id, referred_user_id)
);

CREATE TABLE IF NOT EXISTS public.saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  search_type text NOT NULL DEFAULT 'opportunities'
    CHECK (search_type IN ('opportunities','coaches','academies','venues','matchups')),
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  alert_enabled boolean NOT NULL DEFAULT true,
  alert_frequency text NOT NULL DEFAULT 'instant'
    CHECK (alert_frequency IN ('instant','daily','weekly','none')),
  last_alerted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.matchups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  matched_athlete_id uuid REFERENCES public.athletes(id) ON DELETE CASCADE,
  sport_id uuid REFERENCES public.sports(id) ON DELETE SET NULL,
  score numeric(5,2) NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'suggested'
    CHECK (status IN ('suggested','accepted','declined','expired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (athlete_id <> matched_athlete_id),
  UNIQUE (athlete_id, matched_athlete_id)
);

CREATE INDEX IF NOT EXISTS idx_athletes_sport ON public.athletes(sport_id);
CREATE INDEX IF NOT EXISTS idx_coaches_sport ON public.coaches(sport_id);
CREATE INDEX IF NOT EXISTS idx_academies_owner ON public.academies(owner_profile_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_organizer ON public.opportunities(organizer_profile_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_sport_status ON public.opportunities(sport_id,status);
CREATE INDEX IF NOT EXISTS idx_opportunities_city_status ON public.opportunities(city,status);
CREATE INDEX IF NOT EXISTS idx_applications_athlete ON public.applications(athlete_id);
CREATE INDEX IF NOT EXISTS idx_applications_opportunity ON public.applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_status ON public.payments(user_id,status);
CREATE INDEX IF NOT EXISTS idx_wallet_user_created ON public.wallet_transactions(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id,is_read,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON public.saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_matchups_athlete_status ON public.matchups(athlete_id,status);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matchups ENABLE ROW LEVEL SECURITY;

-- Private profile data: only the owner can read/write it.
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING ((SELECT auth.uid()) = id);
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = id);
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "sports_select_public" ON public.sports;
CREATE POLICY "sports_select_public" ON public.sports FOR SELECT TO anon,authenticated USING (is_active = true);

DROP POLICY IF EXISTS "athletes_select" ON public.athletes;
CREATE POLICY "athletes_select" ON public.athletes FOR SELECT TO anon,authenticated USING (is_public = true OR profile_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "athletes_insert" ON public.athletes;
CREATE POLICY "athletes_insert" ON public.athletes FOR INSERT TO authenticated WITH CHECK (profile_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "athletes_update" ON public.athletes;
CREATE POLICY "athletes_update" ON public.athletes FOR UPDATE TO authenticated USING (profile_id = (SELECT auth.uid())) WITH CHECK (profile_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "coaches_select" ON public.coaches;
CREATE POLICY "coaches_select" ON public.coaches FOR SELECT TO anon,authenticated USING (true);
DROP POLICY IF EXISTS "coaches_insert" ON public.coaches;
CREATE POLICY "coaches_insert" ON public.coaches FOR INSERT TO authenticated WITH CHECK (profile_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "coaches_update" ON public.coaches;
CREATE POLICY "coaches_update" ON public.coaches FOR UPDATE TO authenticated USING (profile_id = (SELECT auth.uid())) WITH CHECK (profile_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "academies_select" ON public.academies;
CREATE POLICY "academies_select" ON public.academies FOR SELECT TO anon,authenticated USING (verification_status = 'verified' OR owner_profile_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "academies_insert" ON public.academies;
CREATE POLICY "academies_insert" ON public.academies FOR INSERT TO authenticated WITH CHECK (owner_profile_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "academies_update" ON public.academies;
CREATE POLICY "academies_update" ON public.academies FOR UPDATE TO authenticated USING (owner_profile_id = (SELECT auth.uid())) WITH CHECK (owner_profile_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "opportunities_select" ON public.opportunities;
CREATE POLICY "opportunities_select" ON public.opportunities FOR SELECT TO anon,authenticated USING (status = 'published' OR organizer_profile_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "opportunities_insert" ON public.opportunities;
CREATE POLICY "opportunities_insert" ON public.opportunities FOR INSERT TO authenticated WITH CHECK (organizer_profile_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "opportunities_update" ON public.opportunities;
CREATE POLICY "opportunities_update" ON public.opportunities FOR UPDATE TO authenticated USING (organizer_profile_id = (SELECT auth.uid())) WITH CHECK (organizer_profile_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "applications_select" ON public.applications;
CREATE POLICY "applications_select" ON public.applications FOR SELECT TO authenticated USING (
  athlete_id IN (SELECT id FROM public.athletes WHERE profile_id = (SELECT auth.uid()))
  OR opportunity_id IN (SELECT id FROM public.opportunities WHERE organizer_profile_id = (SELECT auth.uid()))
);
DROP POLICY IF EXISTS "applications_insert" ON public.applications;
CREATE POLICY "applications_insert" ON public.applications FOR INSERT TO authenticated WITH CHECK (
  athlete_id IN (SELECT id FROM public.athletes WHERE profile_id = (SELECT auth.uid()))
);
DROP POLICY IF EXISTS "applications_update" ON public.applications;
CREATE POLICY "applications_update" ON public.applications FOR UPDATE TO authenticated USING (
  athlete_id IN (SELECT id FROM public.athletes WHERE profile_id = (SELECT auth.uid()))
  OR opportunity_id IN (SELECT id FROM public.opportunities WHERE organizer_profile_id = (SELECT auth.uid()))
) WITH CHECK (
  athlete_id IN (SELECT id FROM public.athletes WHERE profile_id = (SELECT auth.uid()))
  OR opportunity_id IN (SELECT id FROM public.opportunities WHERE organizer_profile_id = (SELECT auth.uid()))
);

DROP POLICY IF EXISTS "bookings_select" ON public.bookings;
CREATE POLICY "bookings_select" ON public.bookings FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "bookings_insert" ON public.bookings;
CREATE POLICY "bookings_insert" ON public.bookings FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "bookings_update" ON public.bookings;
CREATE POLICY "bookings_update" ON public.bookings FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "payments_select" ON public.payments;
CREATE POLICY "payments_select" ON public.payments FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "wallet_select" ON public.wallet_transactions;
CREATE POLICY "wallet_select" ON public.wallet_transactions FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "reviews_select" ON public.reviews;
CREATE POLICY "reviews_select" ON public.reviews FOR SELECT TO anon,authenticated USING (status = 'published' OR reviewer_profile_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "reviews_insert" ON public.reviews;
CREATE POLICY "reviews_insert" ON public.reviews FOR INSERT TO authenticated WITH CHECK (reviewer_profile_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "reviews_update" ON public.reviews;
CREATE POLICY "reviews_update" ON public.reviews FOR UPDATE TO authenticated USING (reviewer_profile_id = (SELECT auth.uid())) WITH CHECK (reviewer_profile_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "verification_select" ON public.organizer_verifications;
CREATE POLICY "verification_select" ON public.organizer_verifications FOR SELECT TO authenticated USING (profile_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "verification_insert" ON public.organizer_verifications;
CREATE POLICY "verification_insert" ON public.organizer_verifications FOR INSERT TO authenticated WITH CHECK (profile_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "verification_update" ON public.organizer_verifications;
CREATE POLICY "verification_update" ON public.organizer_verifications FOR UPDATE TO authenticated USING (profile_id = (SELECT auth.uid())) WITH CHECK (profile_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "disputes_select" ON public.disputes;
CREATE POLICY "disputes_select" ON public.disputes FOR SELECT TO authenticated USING (opened_by = (SELECT auth.uid()) OR respondent_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "disputes_insert" ON public.disputes;
CREATE POLICY "disputes_insert" ON public.disputes FOR INSERT TO authenticated WITH CHECK (opened_by = (SELECT auth.uid()));
DROP POLICY IF EXISTS "disputes_update" ON public.disputes;
CREATE POLICY "disputes_update" ON public.disputes FOR UPDATE TO authenticated USING (opened_by = (SELECT auth.uid())) WITH CHECK (opened_by = (SELECT auth.uid()));

DROP POLICY IF EXISTS "notifications_select" ON public.notifications;
CREATE POLICY "notifications_select" ON public.notifications FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "notifications_update" ON public.notifications;
CREATE POLICY "notifications_update" ON public.notifications FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "referrals_select" ON public.referrals;
CREATE POLICY "referrals_select" ON public.referrals FOR SELECT TO authenticated USING (referrer_id = (SELECT auth.uid()) OR referred_user_id = (SELECT auth.uid()));
DROP POLICY IF EXISTS "referrals_insert" ON public.referrals;
CREATE POLICY "referrals_insert" ON public.referrals FOR INSERT TO authenticated WITH CHECK (referrer_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "saved_searches_all" ON public.saved_searches;
CREATE POLICY "saved_searches_all" ON public.saved_searches FOR ALL TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "matchups_select" ON public.matchups;
CREATE POLICY "matchups_select" ON public.matchups FOR SELECT TO authenticated USING (
  athlete_id IN (SELECT id FROM public.athletes WHERE profile_id = (SELECT auth.uid()))
  OR matched_athlete_id IN (SELECT id FROM public.athletes WHERE profile_id = (SELECT auth.uid()))
);

DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at_sports ON public.sports;
CREATE TRIGGER set_updated_at_sports BEFORE UPDATE ON public.sports FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at_athletes ON public.athletes;
CREATE TRIGGER set_updated_at_athletes BEFORE UPDATE ON public.athletes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at_coaches ON public.coaches;
CREATE TRIGGER set_updated_at_coaches BEFORE UPDATE ON public.coaches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at_academies ON public.academies;
CREATE TRIGGER set_updated_at_academies BEFORE UPDATE ON public.academies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at_opportunities ON public.opportunities;
CREATE TRIGGER set_updated_at_opportunities BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at_applications ON public.applications;
CREATE TRIGGER set_updated_at_applications BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at_bookings ON public.bookings;
CREATE TRIGGER set_updated_at_bookings BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at_payments ON public.payments;
CREATE TRIGGER set_updated_at_payments BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at_reviews ON public.reviews;
CREATE TRIGGER set_updated_at_reviews BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at_organizer_verifications ON public.organizer_verifications;
CREATE TRIGGER set_updated_at_organizer_verifications BEFORE UPDATE ON public.organizer_verifications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at_disputes ON public.disputes;
CREATE TRIGGER set_updated_at_disputes BEFORE UPDATE ON public.disputes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at_payments ON public.payments;
CREATE TRIGGER set_updated_at_payments BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at_saved_searches ON public.saved_searches;
CREATE TRIGGER set_updated_at_saved_searches BEFORE UPDATE ON public.saved_searches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS set_updated_at_matchups ON public.matchups;
CREATE TRIGGER set_updated_at_matchups BEFORE UPDATE ON public.matchups FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT SELECT ON public.sports TO anon, authenticated;
GRANT SELECT ON public.athletes, public.coaches, public.academies, public.opportunities, public.reviews TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles, public.athletes, public.coaches, public.academies, public.opportunities, public.applications, public.bookings, public.reviews, public.organizer_verifications, public.disputes, public.notifications, public.referrals, public.saved_searches, public.matchups TO authenticated;
GRANT SELECT ON public.payments, public.wallet_transactions TO authenticated;
