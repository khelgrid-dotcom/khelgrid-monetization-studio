-- ==============================================================================
-- KhelGrid Supabase Database Seed Data
-- Run this in your Supabase SQL Editor to populate venues, trials, coaching programs and sample bookings.
-- ==============================================================================

-- 1. SEED VENUES ACROSS MAJOR INDIAN CITIES
INSERT INTO public.venues (id, name, slug, area, city, address, sports, amenities, price_per_hour, rating, reviews_count, featured, bookable, image_url, contact_phone, contact_email)
VALUES
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Play Arena Sarjapur',
    'play-arena-sarjapur',
    'Sarjapur Road',
    'Bengaluru',
    'Sy No 75, Central Jail Road, Opp Silverwood Regency, Kasavanahalli, Bengaluru, Karnataka 560035',
    ARRAY['Football', 'Badminton', 'Cricket', 'Swimming', 'Tennis'],
    ARRAY['Floodlights', 'Parking', 'Changing Rooms', 'Cafeteria', 'Equipment Rental', 'Pro Shop'],
    1200.00,
    4.8,
    342,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    '+91 99000 99911',
    'sarjapur@playarena.in'
  ),
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Decathlon Anubhava Arena',
    'decathlon-anubhava-arena',
    'Yelahanka',
    'Bengaluru',
    'Airport Road, Bellahalli Cross, Yelahanka, Bengaluru, Karnataka 560064',
    ARRAY['Football', 'Basketball', 'Badminton', 'Cricket', 'Skating'],
    ARRAY['Floodlights', 'Free Parking', 'Changing Rooms', 'Decathlon Store', 'Water Station'],
    950.00,
    4.7,
    215,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
    '+91 80 4646 5000',
    'anubhava@decathlon.in'
  ),
  (
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Dribble Football Turf',
    'dribble-football-turf',
    'Indiranagar',
    'Bengaluru',
    '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    ARRAY['Football', 'Box Cricket'],
    ARRAY['FIFA 2-Star Turf', 'Floodlights', 'Bibs & Balls Provided', 'Restroom', 'Locker Room'],
    1400.00,
    4.9,
    410,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80',
    '+91 98450 12345',
    'bookings@dribbleturf.com'
  ),
  (
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'Siri Fort Sports Complex',
    'siri-fort-sports-complex',
    'August Kranti Marg',
    'Delhi NCR',
    'Siri Fort Institutional Area, August Kranti Marg, New Delhi 110049',
    ARRAY['Badminton', 'Tennis', 'Squash', 'Swimming', 'Table Tennis'],
    ARRAY['Olympic Standard Courts', 'Coaching Academy', 'Locker Rooms', 'Cafeteria', 'Ample Parking'],
    650.00,
    4.6,
    580,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    '+91 11 2649 7482',
    'sirifort@dda.gov.in'
  ),
  (
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
    'Vasant Kunj Turf & Arena',
    'vasant-kunj-turf',
    'Vasant Kunj',
    'Delhi NCR',
    'Pocket 8, Sector C, Vasant Kunj, New Delhi 110070',
    ARRAY['Football', 'Cricket'],
    ARRAY['Floodlights', 'Dressing Room', 'Water Dispenser', 'Seating Stands'],
    1100.00,
    4.5,
    148,
    FALSE,
    TRUE,
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    '+91 98110 56789',
    'vkarena@khelgrid.com'
  ),
  (
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
    'Padel & Turf Club Bandra',
    'padel-turf-bandra',
    'Bandra West',
    'Mumbai',
    'Carter Road, Bandra West, Mumbai, Maharashtra 400050',
    ARRAY['Football', 'Padel', 'Badminton'],
    ARRAY['Sea-facing Cafe', 'Valet Parking', 'Air-Conditioned Lounge', 'Showers'],
    1800.00,
    4.9,
    620,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    '+91 98200 11223',
    'bandraturf@khelgrid.com'
  ),
  (
    'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
    'Gachibowli Stadium Astro Turf',
    'gachibowli-stadium-turf',
    'Gachibowli',
    'Hyderabad',
    'Old Mumbai Highway, Gachibowli, Hyderabad, Telangana 500032',
    ARRAY['Football', 'Athletics', 'Hockey', 'Badminton'],
    ARRAY['National Standard Track', 'Dressing Rooms', 'VIP Pavilion', 'First Aid'],
    1350.00,
    4.8,
    430,
    TRUE,
    TRUE,
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    '+91 40 2300 0011',
    'sports@telangana.gov.in'
  ),
  (
    'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
    'Koramangala Indoor Badminton Hub',
    'koramangala-badminton-hub',
    'Koramangala 4th Block',
    'Bengaluru',
    '80 Feet Rd, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    ARRAY['Badminton', 'Table Tennis'],
    ARRAY['Wooden Synthetic Courts', 'AC Lounge', 'Yonex Stringing Service', 'Lockers'],
    550.00,
    4.7,
    195,
    FALSE,
    TRUE,
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    '+91 80 2553 4455',
    'koramangala@badmintonhub.in'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sports = EXCLUDED.sports,
  amenities = EXCLUDED.amenities,
  price_per_hour = EXCLUDED.price_per_hour,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  image_url = EXCLUDED.image_url;

-- 2. SEED SAMPLE TRIALS LINKED TO REAL VENUES
INSERT INTO public.trials (id, venue_id, academy_name, title, sport, city, venue_name, trial_date, reporting_time, fee, spots_total, spots_available, tag, eligibility, required_documents, status)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Bengaluru FC Youth Academy',
    'U-15 & U-17 Elite State Scout Trials',
    'Football',
    'Bengaluru',
    'Play Arena Sarjapur',
    CURRENT_DATE + INTERVAL '5 days',
    '07:30 AM',
    0.00,
    80,
    18,
    'Scout Verified',
    'Born between 2009 and 2012. Must bring Aadhaar Card & medical fitness certificate.',
    ARRAY['Aadhaar Card', 'Birth Certificate', 'Passport Photo', 'Medical Fitness Certificate'],
    'active'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'Delhi Badminton Excellence Trust',
    'Sub-Junior District Selection Screening',
    'Badminton',
    'Delhi NCR',
    'Siri Fort Sports Complex',
    CURRENT_DATE + INTERVAL '9 days',
    '08:00 AM',
    250.00,
    64,
    12,
    'Official Trial',
    'Boys & Girls U-13. Valid BAI ID required.',
    ARRAY['BAI Player Card', 'Date of Birth Proof'],
    'active'
  )
ON CONFLICT (id) DO NOTHING;

-- 3. SEED SAMPLE COACHING PROGRAMS
INSERT INTO public.coaching_programs (id, venue_id, title, coach_name, sport, city, area, level, price_per_month, rating, reviews_count, image_url)
VALUES
  (
    '33333333-3333-3333-3333-333333333333',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Pro Touch Football Development Center',
    'Coach Rajesh Nair (AFC A License)',
    'Football',
    'Bengaluru',
    'Indiranagar',
    'Intermediate',
    3500.00,
    4.9,
    88,
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'Smash Point Elite Badminton Academy',
    'Coach Sunita Verma (Ex-National Player)',
    'Badminton',
    'Delhi NCR',
    'August Kranti Marg',
    'All Levels',
    4200.00,
    4.8,
    114,
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80'
  )
ON CONFLICT (id) DO NOTHING;

-- 4. ENSURE ROW LEVEL SECURITY IS PERMISSIVE FOR INSERT & SELECT
DO $$
BEGIN
  -- Venues
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'venues' AND policyname = 'Public select venues') THEN
    CREATE POLICY "Public select venues" ON public.venues FOR SELECT USING (true);
  END IF;

  -- Venue Bookings
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'venue_bookings' AND policyname = 'Allow public insert bookings') THEN
    CREATE POLICY "Allow public insert bookings" ON public.venue_bookings FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'venue_bookings' AND policyname = 'Allow public select bookings') THEN
    CREATE POLICY "Allow public select bookings" ON public.venue_bookings FOR SELECT USING (true);
  END IF;
END $$;
