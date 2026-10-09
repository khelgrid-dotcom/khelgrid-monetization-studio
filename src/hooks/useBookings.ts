import { useState, useEffect, useCallback, useRef } from "react";
import {
  getVenueBookings,
  createVenueBooking,
  cancelVenueBooking,
  holdVenueSlot,
  checkSlotAvailability,
  type BookingRecord,
} from "@/lib/booking-service";

export interface CreateBookingParams {
  venue: {
    id: string;
    name: string;
    area: string;
    city: string;
    price_per_hour: number;
    sports: string[];
    image_url?: string;
  };
  court_id?: string;
  court_name?: string;
  sport: string;
  booking_date: string;
  start_time: string;
  duration_hours?: number;
  user_email?: string;
  user_phone?: string;
  idempotency_key?: string;
}

export interface UseBookingsOptions {
  /**
   * Whether to automatically fetch bookings on initial render.
   * Defaults to true.
   */
  autoFetch?: boolean;
  /**
   * Optional initial list of bookings to pre-populate state.
   */
  initialBookings?: BookingRecord[];
  /**
   * Optional venue ID filter to only include bookings for a specific venue.
   */
  venueIdFilter?: string;
}

export interface UseBookingsReturn {
  bookings: BookingRecord[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  fetchBookings: () => Promise<BookingRecord[]>;
  createBooking: (params: CreateBookingParams) => Promise<{
    success: boolean;
    booking?: BookingRecord;
    message: string;
  }>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<boolean>;
  holdSlot: typeof holdVenueSlot;
  checkAvailability: typeof checkSlotAvailability;
  clearError: () => void;
}

/**
 * Custom React hook to fetch, create, and manage venue bookings with
 * atomic concurrency handling, loading indicators, and error states.
 */
export function useBookings(options: UseBookingsOptions = {}): UseBookingsReturn {
  const { autoFetch = true, initialBookings = [], venueIdFilter } = options;

  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Fetch all bookings for the active user or platform.
   */
  const fetchBookings = useCallback(async (): Promise<BookingRecord[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const records = await getVenueBookings();
      const filtered = venueIdFilter
        ? records.filter((b) => b.venue_id === venueIdFilter)
        : records;

      if (isMountedRef.current) {
        setBookings(filtered);
      }
      return filtered;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load bookings. Please try again.";
      if (isMountedRef.current) {
        setError(message);
      }
      return [];
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [venueIdFilter]);

  /**
   * Create an atomic booking reservation.
   */
  const createBooking = useCallback(
    async (
      params: CreateBookingParams,
    ): Promise<{
      success: boolean;
      booking?: BookingRecord;
      message: string;
    }> => {
      setIsCreating(true);
      setError(null);

      try {
        const result = await createVenueBooking(params);

        if (!result.success) {
          const errMsg = result.message || "Unable to reserve slot.";
          if (isMountedRef.current) {
            setError(errMsg);
          }
          return {
            success: false,
            message: errMsg,
          };
        }

        if (result.booking && isMountedRef.current) {
          setBookings((prev) => {
            const exists = prev.some((b) => b.id === result.booking?.id);
            if (exists) {
              return prev.map((b) => (b.id === result.booking?.id ? result.booking! : b));
            }
            return [result.booking!, ...prev];
          });
        }

        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while processing your booking.";
        if (isMountedRef.current) {
          setError(message);
        }
        return {
          success: false,
          message,
        };
      } finally {
        if (isMountedRef.current) {
          setIsCreating(false);
        }
      }
    },
    [],
  );

  /**
   * Cancel an existing booking and update state accordingly.
   */
  const cancelBooking = useCallback(
    async (bookingId: string, reason?: string): Promise<boolean> => {
      try {
        const success = await cancelVenueBooking(bookingId, reason);
        if (success && isMountedRef.current) {
          setBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" as const } : b)),
          );
        }
        return success;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to cancel booking. Please try again.";
        if (isMountedRef.current) {
          setError(message);
        }
        return false;
      }
    },
    [],
  );

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchBookings();
    }
  }, [autoFetch, fetchBookings]);

  // Synchronize across browser events
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBookingSync = () => {
      fetchBookings();
    };

    window.addEventListener("khelgrid_booking_created", handleBookingSync);
    return () => {
      window.removeEventListener("khelgrid_booking_created", handleBookingSync);
    };
  }, [fetchBookings]);

  return {
    bookings,
    isLoading,
    isCreating,
    error,
    fetchBookings,
    createBooking,
    cancelBooking,
    holdSlot: holdVenueSlot,
    checkAvailability: checkSlotAvailability,
    clearError,
  };
}
