-- ==============================================================================
-- KhelGrid Supabase Migration: Add Structured Venue Policies, Operating Hours & Restrictions
-- Migration: 20260916_venue_policies_and_hours.sql
-- ==============================================================================

-- 1. ADD COLUMNS FOR STRUCTURED VENUE POLICIES IF NOT ALREADY PRESENT
ALTER TABLE public.venues
ADD COLUMN IF NOT EXISTS operating_hours JSONB DEFAULT '{
  "regular_hours": "6:00 AM – 11:00 PM (Monday to Sunday)",
  "weekend_hours": "5:30 AM – 11:30 PM (Saturday & Sunday)",
  "peak_hours": "6:00 PM – 10:00 PM (Weekdays) & 6:00 AM – 10:00 PM (Weekends)",
  "floodlight_hours": "6:30 PM – 11:00 PM (Tournament grade 500-lux LED lighting included)",
  "maintenance_window": "11:00 PM – 5:30 AM (Daily ground rolling & sanitation)",
  "last_entry": "10:15 PM"
}'::jsonb;

ALTER TABLE public.venues
ADD COLUMN IF NOT EXISTS booking_policies JSONB DEFAULT '{
  "advance_booking": "Book up to 14 days in advance with real-time slot locking and instant confirmation.",
  "cancellation_full_refund": "100% full refund for cancellations initiated at least 4 hours prior to slot start.",
  "cancellation_partial_refund": "50% refund processed for cancellations initiated 2 to 4 hours prior to game start.",
  "cancellation_no_refund": "Under 2 hours before slot start or no-shows are non-refundable.",
  "rescheduling": "1 complimentary slot reschedule permitted up to 4 hours prior to match time directly from My Bookings.",
  "slot_duration": "Standard 60-minute increments with a 10-minute transition buffer between back-to-back games.",
  "weather_policy": "100% weather disruption guarantee: automatic reschedule token or full refund if rain renders surface unplayable.",
  "id_verification": "Digital booking voucher or reference ID on mobile required at check-in desk."
}'::jsonb;

ALTER TABLE public.venues
ADD COLUMN IF NOT EXISTS rules_restrictions JSONB DEFAULT '{
  "footwear_indoor": "Non-marking gum sole shoes strictly mandatory on indoor wooden and synthetic courts.",
  "footwear_turf": "Rubber studs, multi-ground turf boots, or flat sneakers required; metal cleats strictly banned.",
  "dress_code": "Athletic sportswear, team jerseys, shorts, or dry-fit tracksuits required. Bare-chested play prohibited.",
  "prohibited_items": [
    "Metal cleats / spikes",
    "Chewing gum & outside cooked food on playing surface",
    "Smoking, tobacco, paan, and vaping on premises",
    "Alcoholic beverages and banned substances",
    "Glass bottles & sharp items",
    "Pets on playing turf or court enclosures"
  ],
  "age_guidelines": "Open to all age categories. Minors aged 14 and under must be accompanied by an adult or coach.",
  "spectators": "Dedicated viewing gallery accommodates up to 20 non-playing spectators per court.",
  "equipment": "Bring your personal sports gear or rent tournament-grade racquets and balls at reception from ₹50."
}'::jsonb;

-- 2. UPDATE ANY EXISTING VENUES WITH CUSTOM SPORT-AWARE POLICIES
UPDATE public.venues
SET 
  operating_hours = '{
    "regular_hours": "6:00 AM – 11:00 PM (Monday to Sunday)",
    "weekend_hours": "5:30 AM – 11:30 PM (Saturday & Sunday)",
    "peak_hours": "6:00 PM – 10:00 PM (Weekdays) & All Day (Weekends)",
    "floodlight_hours": "6:30 PM – 11:00 PM (Tournament grade 500-lux LED lighting included)",
    "maintenance_window": "11:00 PM – 5:30 AM (Daily ground rolling & sanitation)",
    "last_entry": "10:15 PM"
  }'::jsonb,
  booking_policies = '{
    "advance_booking": "Book up to 14 days in advance with real-time slot locking and instant confirmation.",
    "cancellation_full_refund": "100% full refund for cancellations initiated at least 4 hours prior to slot start.",
    "cancellation_partial_refund": "50% refund processed for cancellations initiated 2 to 4 hours prior to game start.",
    "cancellation_no_refund": "Under 2 hours before slot start or no-shows are non-refundable.",
    "rescheduling": "1 complimentary slot reschedule permitted up to 4 hours prior to match time directly from My Bookings.",
    "slot_duration": "Standard 60-minute increments with a 10-minute transition buffer between back-to-back games.",
    "weather_policy": "100% weather disruption guarantee: automatic reschedule token or full refund if rain renders surface unplayable.",
    "id_verification": "Digital booking voucher or reference ID on mobile required at check-in desk."
  }'::jsonb,
  rules_restrictions = '{
    "footwear_indoor": "Non-marking gum sole shoes strictly mandatory on indoor wooden and synthetic courts.",
    "footwear_turf": "Rubber studs, multi-ground turf boots, or flat sneakers required; metal cleats strictly banned.",
    "dress_code": "Athletic sportswear, team jerseys, shorts, or dry-fit tracksuits required. Bare-chested play prohibited.",
    "prohibited_items": [
      "Metal cleats / spikes",
      "Chewing gum & outside cooked food on playing surface",
      "Smoking, tobacco, paan, and vaping on premises",
      "Alcoholic beverages and banned substances",
      "Glass bottles & sharp items",
      "Pets on playing turf or court enclosures"
    ],
    "age_guidelines": "Open to all age categories. Minors aged 14 and under must be accompanied by an adult or coach.",
    "spectators": "Dedicated viewing gallery accommodates up to 20 non-playing spectators per court.",
    "equipment": "Bring your personal sports gear or rent tournament-grade racquets and balls at reception from ₹50."
  }'::jsonb
WHERE operating_hours IS NULL OR booking_policies IS NULL OR rules_restrictions IS NULL;
