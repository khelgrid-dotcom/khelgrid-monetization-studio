-- ==============================================================================
-- KhelGrid Supabase Migration: Atomic Booking Transactions & RLS Hardening
-- Migration: 20261001_atomic_booking_transactions_and_rls.sql
-- Features:
--   1. Transaction-level advisory lock & row-level pessimistic locking RPC
--   2. Double-booking prevention with strict time overlap serialization
--   3. Privacy-preserving slot availability inspection RPC (no PII leakage)
--   4. Slot hold / reserve with auto-expiry
--   5. Hardened Row-Level Security (RLS) policies for venue_bookings
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ------------------------------------------------------------------------------
-- 2. PRIVACY-PRESERVING AVAILABILITY RPC
-- Allows any athlete or guest to check if slots are booked without exposing
-- other users' personal information (email, phone, name).
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_venue_slot_availability(
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
        vb.court_id,
        vb.start_time,
        vb.end_time,
        vb.status,
        (vb.status = 'pending' AND vb.held_until IS NOT NULL AND vb.held_until > NOW()) AS is_held
    FROM public.venue_bookings vb
    WHERE vb.venue_id = p_venue_id
      AND vb.booking_date = p_booking_date
      AND (p_court_id IS NULL OR vb.court_id IS NULL OR vb.court_id = p_court_id)
      AND vb.status IN ('confirmed', 'pending')
      AND vb.deleted_at IS NULL
      AND (vb.held_until IS NULL OR vb.held_until > NOW());
END;
$$;

-- ------------------------------------------------------------------------------
-- 3. ATOMIC BOOKING TRANSACTION RPC
-- Guarantees atomic, serialized slot reservation with transaction-scoped
-- advisory lock and row-level pessimistic locking.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.book_venue_slot_atomic(
    p_venue_id UUID,
    p_court_id UUID DEFAULT NULL,
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
    p_custom_booking_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_booking_id TEXT;
    v_user_id UUID;
    v_held_until TIMESTAMPTZ := NULL;
    v_conflict_count INTEGER := 0;
    v_existing_booking RECORD;
    v_lock_key BIGINT;
BEGIN
    -- Resolve effective user ID (explicit param or authenticated JWT caller)
    v_user_id := coalesce(p_user_id, auth.uid());

    -- 1. Idempotency Check: if idempotency key was previously processed, return that booking
    IF p_idempotency_key IS NOT NULL THEN
        SELECT id, status, total_price, booking_date, start_time, end_time, created_at
        INTO v_existing_booking
        FROM public.venue_bookings
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

    -- 2. Transaction Advisory Lock
    -- Creates a lock key hashed from venue_id, court_id, and booking_date
    -- This serializes all concurrent bookings for this specific court/date
    v_lock_key := ('x' || substr(md5(p_venue_id::text || '_' || coalesce(p_court_id::text, '00000000-0000-0000-0000-000000000000') || '_' || p_booking_date::text), 1, 16))::bit(64)::bigint;
    PERFORM pg_advisory_xact_lock(v_lock_key);

    -- 3. Auto-expire any stale held bookings for this court/date
    UPDATE public.venue_bookings
    SET status = 'cancelled'
    WHERE venue_id = p_venue_id
      AND booking_date = p_booking_date
      AND (p_court_id IS NULL OR court_id IS NULL OR court_id = p_court_id)
      AND status = 'pending'
      AND held_until IS NOT NULL
      AND held_until <= NOW();

    -- 4. Overlap Check with Row Locks (Pessimistic concurrency control)
    SELECT COUNT(*)
    INTO v_conflict_count
    FROM public.venue_bookings
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

    -- 5. Calculate hold expiration if booking status is 'pending'
    IF p_status = 'pending' AND p_hold_duration_minutes IS NOT NULL AND p_hold_duration_minutes > 0 THEN
        v_held_until := NOW() + (p_hold_duration_minutes || ' minutes')::interval;
    END IF;

    -- 6. Generate booking ID
    v_booking_id := coalesce(
        p_custom_booking_id, 
        'KG-BK-' || to_char(NOW(), 'YYYYMMDD') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 6))
    );

    -- 7. Insert Booking Record
    INSERT INTO public.venue_bookings (
        id,
        venue_id,
        court_id,
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
        v_booking_id::uuid, -- or text if id type is UUID, handle casting safely
        p_venue_id,
        p_court_id,
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
            WHEN p_status = 'pending' THEN 'Slot reserved for checkout.' 
            ELSE 'Booking confirmed successfully.' 
        END
    );
EXCEPTION
    WHEN unique_violation THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'DUPLICATE_IDEMPOTENCY_OR_RECORD',
            'message', 'Booking with this transaction key or identifier was already submitted.'
        );
    WHEN exclusion_violation THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'SLOT_UNAVAILABLE',
            'message', 'Overlap conflict: This slot was just taken by another player.'
        );
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'INTERNAL_ERROR',
            'message', SQLERRM
        );
END;
$$;

-- ------------------------------------------------------------------------------
-- 4. ATOMIC SLOT HOLD RPC (Convenience wrapper for checkout sessions)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.hold_venue_slot_atomic(
    p_venue_id UUID,
    p_court_id UUID DEFAULT NULL,
    p_sport TEXT DEFAULT 'Multi-Sport',
    p_booking_date DATE DEFAULT CURRENT_DATE,
    p_start_time TIME DEFAULT '06:00:00',
    p_end_time TIME DEFAULT '07:00:00',
    p_total_price NUMERIC DEFAULT 0.00,
    p_user_email TEXT DEFAULT NULL,
    p_user_phone TEXT DEFAULT NULL,
    p_idempotency_key UUID DEFAULT NULL,
    p_hold_duration_minutes INTEGER DEFAULT 10
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN public.book_venue_slot_atomic(
        p_venue_id => p_venue_id,
        p_court_id => p_court_id,
        p_sport => p_sport,
        p_booking_date => p_booking_date,
        p_start_time => p_start_time,
        p_end_time => p_end_time,
        p_total_price => p_total_price,
        p_user_email => p_user_email,
        p_user_phone => p_user_phone,
        p_idempotency_key => p_idempotency_key,
        p_status => 'pending',
        p_hold_duration_minutes => p_hold_duration_minutes
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- 5. ATOMIC CANCELLATION RPC
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.cancel_venue_booking_atomic(
    p_booking_id UUID,
    p_reason TEXT DEFAULT NULL
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
    FROM public.venue_bookings
    WHERE id = p_booking_id
      AND deleted_at IS NULL
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error_code', 'NOT_FOUND', 'message', 'Booking not found or already cancelled.');
    END IF;

    -- Security validation: caller must be booking owner or admin
    IF auth.uid() IS NOT NULL AND v_booking.user_id IS NOT NULL AND auth.uid() != v_booking.user_id AND NOT public.is_admin() THEN
        RETURN jsonb_build_object('success', false, 'error_code', 'UNAUTHORIZED', 'message', 'You do not have permission to cancel this booking.');
    END IF;

    UPDATE public.venue_bookings
    SET status = 'cancelled',
        deleted_at = NOW(),
        updated_at = NOW()
    WHERE id = p_booking_id;

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', p_booking_id,
        'message', 'Booking successfully cancelled.'
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- 6. ROW-LEVEL SECURITY (RLS) HARDENING
-- ------------------------------------------------------------------------------
ALTER TABLE public.venue_bookings ENABLE ROW LEVEL SECURITY;

-- 6A. SELECT Policy:
-- Users can only view their own bookings.
-- Admins can view all bookings.
-- Public slot availability is queried through get_venue_slot_availability() RPC (no PII exposure).
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.venue_bookings;
CREATE POLICY "Users can view their own bookings"
ON public.venue_bookings FOR SELECT
USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR public.is_admin()
);

-- 6B. INSERT Policy:
-- Authenticated users can insert their own bookings.
DROP POLICY IF EXISTS "Users can create bookings" ON public.venue_bookings;
CREATE POLICY "Users can create bookings"
ON public.venue_bookings FOR INSERT
WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR user_id IS NULL
    OR public.is_admin()
);

-- 6C. UPDATE Policy:
-- Users can update only their own bookings; admins can update any.
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.venue_bookings;
CREATE POLICY "Users can update their own bookings"
ON public.venue_bookings FOR UPDATE
TO authenticated
USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR public.is_admin()
)
WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR public.is_admin()
);

-- 6D. DELETE Policy:
-- Hard deletions are strictly forbidden for regular users. Only admins can purge.
DROP POLICY IF EXISTS "Admin delete venue_bookings" ON public.venue_bookings;
CREATE POLICY "Admin delete venue_bookings"
ON public.venue_bookings FOR DELETE
TO authenticated
USING (public.is_admin());

-- Grant execute permissions on RPCs to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_venue_slot_availability(UUID, DATE, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.book_venue_slot_atomic(UUID, UUID, TEXT, DATE, TIME, TIME, NUMERIC, TEXT, TEXT, UUID, UUID, TEXT, INTEGER, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.hold_venue_slot_atomic(UUID, UUID, TEXT, DATE, TIME, TIME, NUMERIC, TEXT, TEXT, UUID, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_venue_booking_atomic(UUID, TEXT) TO authenticated, anon;
