import { supabase, isSupabaseConfigured } from "./supabase";
import { VENUES, type Venue } from "@/data/playo";

export interface BookingRecord {
  id: string;
  venue_id: string;
  venue_name: string;
  venue_area: string;
  venue_city: string;
  venue_image?: string;
  sport: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  price_per_hour: number;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  user_email: string;
  user_phone?: string;
  created_at: string;
  synced_to_db: boolean;
}

interface SupabaseBookingJoinedRow {
  id: string;
  venue_id: string;
  venues?: {
    name?: string;
    area?: string;
    city?: string;
    image_url?: string;
  } | null;
  sport: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number | string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  user_email?: string;
  user_phone?: string;
  created_at?: string;
}

const STORAGE_KEY = "khelgrid_venue_bookings";

/**
 * Converts 12-hour time (e.g. "6:00 PM") to 24-hour SQL format (e.g. "18:00:00")
 */
export function formatTimeToSQL(timeStr: string): string {
  if (!timeStr) return "06:00:00";
  const trimmed = timeStr.trim();

  // If already in 24-hour format
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
    return trimmed.length === 5 ? `${trimmed}:00` : trimmed;
  }

  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return "06:00:00";

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const modifier = match[3]?.toUpperCase();

  if (modifier === "PM" && hours < 12) {
    hours += 12;
  } else if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${minutes}:00`;
}

/**
 * Calculate end time given a start time string (e.g. "6:00 PM") and duration hours
 */
export function calculateEndTimeSQL(timeStr: string, durationHours: number = 1): string {
  const sqlStart = formatTimeToSQL(timeStr);
  const [h, m, s] = sqlStart.split(":").map(Number);
  const endHour = (h + durationHours) % 24;
  return `${String(endHour).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s || 0).padStart(2, "0")}`;
}

/**
 * Retrieves all user venue bookings. Merges Supabase remote records with local storage.
 */
export async function getVenueBookings(): Promise<BookingRecord[]> {
  const localList: BookingRecord[] = [];

  // Load from localStorage first
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        localList.push(...JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load bookings from localStorage", e);
    }
  }

  // If Supabase is configured, fetch live records and merge
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("venue_bookings")
        .select("*, venues(name, area, city, image_url)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const rows = data as unknown as SupabaseBookingJoinedRow[];
        // Map database records
        const dbBookings: BookingRecord[] = rows.map((item) => ({
          id: item.id,
          venue_id: item.venue_id,
          venue_name: item.venues?.name || "Sports Venue",
          venue_area: item.venues?.area || "Area",
          venue_city: item.venues?.city || "City",
          venue_image: item.venues?.image_url,
          sport: item.sport,
          booking_date: item.booking_date,
          start_time: item.start_time,
          end_time: item.end_time,
          duration_hours: 1,
          price_per_hour: Number(item.total_price),
          total_price: Number(item.total_price),
          status: item.status,
          user_email: item.user_email || "guest@khelgrid.com",
          user_phone: item.user_phone || "",
          created_at: item.created_at || new Date().toISOString(),
          synced_to_db: true,
        }));

        // Merge DB and local (DB takes precedence by id)
        const dbMap = new Map(dbBookings.map((b) => [b.id, b]));
        const merged = [...dbBookings];

        for (const local of localList) {
          if (!dbMap.has(local.id)) {
            merged.push(local);
          }
        }
        return merged;
      }
    } catch (err) {
      console.warn("Error fetching bookings from Supabase:", err);
    }
  }

  return localList;
}

/**
 * Persists a new booking to Supabase and localStorage
 */
export async function createVenueBooking(params: {
  venue: {
    id: string;
    name: string;
    area: string;
    city: string;
    price_per_hour: number;
    sports: string[];
    image_url?: string;
  };
  sport: string;
  booking_date: string;
  start_time: string;
  duration_hours?: number;
  user_email?: string;
  user_phone?: string;
}): Promise<{
  success: boolean;
  booking: BookingRecord;
  message: string;
}> {
  const duration = params.duration_hours || 1;
  const totalPrice = params.venue.price_per_hour * duration;
  const startTimeSQL = formatTimeToSQL(params.start_time);
  const endTimeSQL = calculateEndTimeSQL(params.start_time, duration);

  const bookingId = `KG-BK-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const bookingRecord: BookingRecord = {
    id: bookingId,
    venue_id: params.venue.id,
    venue_name: params.venue.name,
    venue_area: params.venue.area,
    venue_city: params.venue.city,
    venue_image: params.venue.image_url,
    sport: params.sport,
    booking_date: params.booking_date,
    start_time: params.start_time,
    end_time: endTimeSQL,
    duration_hours: duration,
    price_per_hour: params.venue.price_per_hour,
    total_price: totalPrice,
    status: "confirmed",
    user_email: params.user_email || "guest@khelgrid.com",
    user_phone: params.user_phone || "",
    created_at: new Date().toISOString(),
    synced_to_db: false,
  };

  // 1. Try to sync to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      // First ensure the venue exists in the database to satisfy foreign keys
      const { data: existingVenue } = await supabase
        .from("venues")
        .select("id")
        .eq("id", params.venue.id)
        .maybeSingle();

      if (!existingVenue) {
        // Upsert the venue definition
        await supabase.from("venues").upsert({
          id: params.venue.id,
          name: params.venue.name,
          area: params.venue.area,
          city: params.venue.city,
          sports: params.venue.sports,
          price_per_hour: params.venue.price_per_hour,
          image_url: params.venue.image_url || null,
          bookable: true,
          rating: 4.8,
          reviews_count: 24,
        });
      }

      // Insert the booking
      const { data: inserted, error } = await supabase
        .from("venue_bookings")
        .insert({
          id: bookingId,
          venue_id: params.venue.id,
          sport: bookingRecord.sport,
          booking_date: bookingRecord.booking_date,
          start_time: startTimeSQL,
          end_time: endTimeSQL,
          total_price: totalPrice,
          status: "confirmed",
          user_email: bookingRecord.user_email,
          user_phone: bookingRecord.user_phone,
        })
        .select()
        .single();

      if (!error && inserted) {
        bookingRecord.synced_to_db = true;
      }
    } catch (dbErr) {
      console.warn("Supabase booking insert warning:", dbErr);
    }
  }

  // 2. Always persist to localStorage for instant client durability
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const list: BookingRecord[] = stored ? JSON.parse(stored) : [];
      list.unshift(bookingRecord);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent("khelgrid_booking_created", { detail: bookingRecord }));
    } catch (e) {
      console.warn("LocalStorage write error:", e);
    }
  }

  return {
    success: true,
    booking: bookingRecord,
    message: bookingRecord.synced_to_db
      ? "Booking confirmed and synced to cloud"
      : "Booking confirmed and saved to your device",
  };
}

/**
 * Cancel an existing booking
 */
export async function cancelVenueBooking(bookingId: string): Promise<boolean> {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const list: BookingRecord[] = JSON.parse(stored);
        const updated = list.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" as const } : b,
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("khelgrid_booking_created"));
      }
    } catch (e) {
      console.warn(e);
    }
  }

  if (isSupabaseConfigured) {
    try {
      await supabase.from("venue_bookings").update({ status: "cancelled" }).eq("id", bookingId);
    } catch (e) {
      console.warn(e);
    }
  }

  return true;
}

/**
 * Helper to seed all default Playo venues directly into the connected Supabase database
 */
export async function seedAllVenuesToDatabase(): Promise<{
  success: boolean;
  count: number;
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return { success: false, count: 0, error: "Supabase anon key is not configured yet." };
  }

  try {
    const venuesToInsert = VENUES.map((v) => ({
      id: v.id,
      name: v.name,
      slug: v.id,
      area: v.area,
      city: v.city,
      address: `${v.area}, ${v.city}`,
      sports: v.sports,
      amenities: ["Floodlights", "Changing Rooms", "Parking", "Drinking Water"],
      price_per_hour: v.pricePerHour,
      rating: v.rating,
      reviews_count: v.reviews,
      featured: Boolean(v.featured),
      bookable: Boolean(v.bookable),
      image_url: v.image,
      contact_phone: "+91 98765 43210",
      contact_email: "support@khelgrid.com",
      operating_hours: {
        regular_hours: "6:00 AM – 11:00 PM (Monday to Sunday)",
        weekend_hours: "5:30 AM – 11:30 PM (Saturday & Sunday)",
        peak_hours: "6:00 PM – 10:00 PM (Weekdays) & All Day (Weekends)",
        floodlight_hours: "6:30 PM – 11:00 PM (Tournament grade 500-lux LED lighting included)",
        maintenance_window: "11:00 PM – 5:30 AM (Daily ground rolling & sanitation)",
        last_entry: "10:15 PM",
      },
      booking_policies: {
        advance_booking:
          "Book up to 14 days in advance with real-time slot locking and instant confirmation.",
        cancellation_full_refund:
          "100% full refund for cancellations initiated at least 4 hours prior to slot start.",
        cancellation_partial_refund:
          "50% refund processed for cancellations initiated 2 to 4 hours prior to game start.",
        cancellation_no_refund: "Under 2 hours before slot start or no-shows are non-refundable.",
        rescheduling:
          "1 complimentary slot reschedule permitted up to 4 hours prior to match time directly from My Bookings.",
        slot_duration:
          "Standard 60-minute increments with a 10-minute transition buffer between back-to-back games.",
        weather_policy:
          "100% weather disruption guarantee: automatic reschedule token or full refund if rain renders surface unplayable.",
        id_verification:
          "Digital booking voucher or reference ID on mobile required at check-in desk.",
      },
      rules_restrictions: {
        footwear_indoor:
          "Non-marking gum sole shoes strictly mandatory on indoor wooden and synthetic courts.",
        footwear_turf:
          "Rubber studs, multi-ground turf boots, or flat sneakers required; metal cleats strictly banned.",
        dress_code:
          "Athletic sportswear, team jerseys, shorts, or dry-fit tracksuits required. Bare-chested play prohibited.",
        prohibited_items: [
          "Metal cleats / spikes",
          "Chewing gum & outside cooked food on playing surface",
          "Smoking, tobacco, paan, and vaping on premises",
          "Alcoholic beverages and banned substances",
          "Glass bottles & sharp items",
          "Pets on playing turf or court enclosures",
        ],
        age_guidelines:
          "Open to all age categories. Minors aged 14 and under must be accompanied by an adult or coach.",
        spectators:
          "Dedicated viewing gallery accommodates up to 20 non-playing spectators per court.",
        equipment:
          "Bring your personal sports gear or rent tournament-grade racquets and balls at reception from ₹50.",
      },
    }));

    const { data, error } = await supabase
      .from("venues")
      .upsert(venuesToInsert, { onConflict: "id" })
      .select("id");

    if (error) {
      return { success: false, count: 0, error: error.message };
    }

    const insertedRows = data as unknown as { id: string }[] | null;
    return { success: true, count: insertedRows?.length || venuesToInsert.length };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to seed venues";
    return { success: false, count: 0, error: message };
  }
}
