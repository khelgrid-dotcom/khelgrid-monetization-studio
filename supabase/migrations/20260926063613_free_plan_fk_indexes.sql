-- Targeted foreign-key indexes for KhelGrid high-traffic paths.
-- We intentionally do not index every FK to avoid Free-plan over-indexing.
create index if not exists idx_bookings_coach on public.bookings (coach_id);
create index if not exists idx_bookings_opportunity on public.bookings (opportunity_id);
create index if not exists idx_bookings_venue on public.bookings (venue_id);
create index if not exists idx_opportunities_academy on public.opportunities (academy_id);
create index if not exists idx_payments_application on public.payments (application_id);
create index if not exists idx_payments_booking on public.payments (booking_id);
create index if not exists idx_payments_opportunity on public.payments (opportunity_id);
create index if not exists idx_wallet_payment on public.wallet_transactions (payment_id);
create index if not exists idx_reviews_academy on public.reviews (academy_id);
create index if not exists idx_reviews_coach on public.reviews (coach_id);
create index if not exists idx_reviews_opportunity on public.reviews (opportunity_id);
create index if not exists idx_reviews_reviewer on public.reviews (reviewer_profile_id);
create index if not exists idx_organizer_verifications_profile on public.organizer_verifications (profile_id);
create index if not exists idx_organizer_verifications_academy on public.organizer_verifications (academy_id);
create index if not exists idx_referrals_referred_user on public.referrals (referred_user_id);
create index if not exists idx_matchups_matched_athlete on public.matchups (matched_athlete_id);