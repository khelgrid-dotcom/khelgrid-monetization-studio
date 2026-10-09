-- ==============================================================================
-- KhelGrid Supabase Migration: Notification Subscriptions & Trials Push Worker
-- Migration: 20260930_notification_subscriptions_and_trials_worker.sql
-- ==============================================================================

-- 1. PROFILES TABLE COMPATIBILITY
-- Ensure 'profiles' table exists as an alias/view to user_profiles if not already created
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        CREATE OR REPLACE VIEW public.profiles AS
        SELECT * FROM public.user_profiles;
    END IF;
END $$;

-- 2. NOTIFICATION SUBSCRIPTIONS TABLE
-- Stores FCM push tokens along with targeted sport and city preferences
CREATE TABLE IF NOT EXISTS public.notification_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fcm_token TEXT NOT NULL,
    sport TEXT NOT NULL DEFAULT 'All',
    city TEXT NOT NULL DEFAULT 'All',
    device_type TEXT NOT NULL DEFAULT 'android' CHECK (device_type IN ('android', 'web', 'ios')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notify_new_trials BOOLEAN NOT NULL DEFAULT TRUE,
    notify_deadlines BOOLEAN NOT NULL DEFAULT TRUE,
    last_notified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_notification_subscriptions UNIQUE (fcm_token, sport, city)
);

-- Fast lookup indexes for matching trials with subscriber preferences
CREATE INDEX IF NOT EXISTS idx_notif_sub_sport_city 
ON public.notification_subscriptions (sport, city) 
WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_notif_sub_fcm 
ON public.notification_subscriptions (fcm_token);

CREATE INDEX IF NOT EXISTS idx_notif_sub_user_id 
ON public.notification_subscriptions (user_id);

-- 3. NOTIFICATION QUEUE TABLE
-- Outbox table storing pending, processing, and dispatched push notifications
CREATE TABLE IF NOT EXISTS public.notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES public.notification_subscriptions(id) ON DELETE CASCADE,
    trial_id UUID REFERENCES public.trials(id) ON DELETE SET NULL,
    fcm_token TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
    attempts INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_queue_status_sched 
ON public.notification_queue (status, scheduled_at) 
WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_notif_queue_trial_id 
ON public.notification_queue (trial_id);

-- 4. TRIGGER FUNCTION: ENQUEUE NOTIFICATIONS ON NEW TRIAL PUBLISHED
-- Automatically runs whenever a new trial is added or set to 'active' status
CREATE OR REPLACE FUNCTION notify_athletes_on_trial_published()
RETURNS TRIGGER AS $$
DECLARE
    v_subscriber RECORD;
    v_title TEXT;
    v_body TEXT;
    v_enqueued_count INT := 0;
BEGIN
    -- Only trigger when trial is published/active
    IF NEW.status = 'active' AND (TG_OP = 'INSERT' OR OLD.status <> 'active') THEN
        v_title := '🎯 New ' || NEW.sport || ' Trial in ' || NEW.city || '!';
        v_body := NEW.academy_name || ' announced: ' || NEW.title || '. Check eligibility and spots now.';

        -- Match active subscribers whose preferences match sport and city (or 'All')
        FOR v_subscriber IN
            SELECT id, fcm_token
            FROM public.notification_subscriptions
            WHERE is_active = TRUE
              AND notify_new_trials = TRUE
              AND (sport = NEW.sport OR sport = 'All')
              AND (city = NEW.city OR city = 'All')
        LOOP
            INSERT INTO public.notification_queue (
                subscription_id,
                trial_id,
                fcm_token,
                title,
                body,
                payload,
                status
            ) VALUES (
                v_subscriber.id,
                NEW.id,
                v_subscriber.fcm_token,
                v_title,
                v_body,
                jsonb_build_object(
                    'trial_id', NEW.id,
                    'sport', NEW.sport,
                    'city', NEW.city,
                    'academy_name', NEW.academy_name,
                    'trial_date', NEW.trial_date,
                    'type', 'new_trial_alert'
                ),
                'pending'
            );

            -- Update last_notified_at
            UPDATE public.notification_subscriptions
            SET last_notified_at = NOW()
            WHERE id = v_subscriber.id;

            v_enqueued_count := v_enqueued_count + 1;
        END LOOP;

        RAISE NOTICE 'Enqueued % push notifications for trial %', v_enqueued_count, NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_athletes_new_trial ON public.trials;
CREATE TRIGGER trg_notify_athletes_new_trial
AFTER INSERT OR UPDATE OF status ON public.trials
FOR EACH ROW
EXECUTE FUNCTION notify_athletes_on_trial_published();

-- 5. FUNCTION: ENQUEUE APPROACHING DEADLINE NOTIFICATIONS
-- Finds trials with deadlines in the next 24-48 hours and enqueues urgency alerts
CREATE OR REPLACE FUNCTION check_and_enqueue_deadline_alerts()
RETURNS INTEGER AS $$
DECLARE
    v_trial RECORD;
    v_subscriber RECORD;
    v_title TEXT;
    v_body TEXT;
    v_count INT := 0;
BEGIN
    FOR v_trial IN
        SELECT id, title, sport, city, academy_name, registration_deadline
        FROM public.trials
        WHERE status = 'active'
          AND registration_deadline IS NOT NULL
          AND registration_deadline BETWEEN NOW() AND NOW() + INTERVAL '48 hours'
    LOOP
        v_title := '⏰ Urgent: ' || v_trial.sport || ' Trial Deadline Approaching!';
        v_body := 'Registration for ' || v_trial.title || ' closes in less than 48 hours. Secure your spot.';

        FOR v_subscriber IN
            SELECT s.id, s.fcm_token
            FROM public.notification_subscriptions s
            WHERE s.is_active = TRUE
              AND s.notify_deadlines = TRUE
              AND (s.sport = v_trial.sport OR s.sport = 'All')
              AND (s.city = v_trial.city OR s.city = 'All')
              AND NOT EXISTS (
                  -- Prevent duplicate deadline alerts for same trial within 24 hours
                  SELECT 1 FROM public.notification_queue q
                  WHERE q.subscription_id = s.id
                    AND q.trial_id = v_trial.id
                    AND q.created_at > NOW() - INTERVAL '24 hours'
              )
        LOOP
            INSERT INTO public.notification_queue (
                subscription_id,
                trial_id,
                fcm_token,
                title,
                body,
                payload,
                status
            ) VALUES (
                v_subscriber.id,
                v_trial.id,
                v_subscriber.fcm_token,
                v_title,
                v_body,
                jsonb_build_object(
                    'trial_id', v_trial.id,
                    'sport', v_trial.sport,
                    'city', v_trial.city,
                    'deadline', v_trial.registration_deadline,
                    'type', 'deadline_warning'
                ),
                'pending'
            );

            v_count := v_count + 1;
        END LOOP;
    END LOOP;

    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- 6. WORKER BATCH PROCESSOR
-- Fetches pending notifications, marks them processing, and can be invoked by pg_cron or edge functions
CREATE OR REPLACE FUNCTION process_notification_worker_batch(p_batch_size INT DEFAULT 50)
RETURNS TABLE (
    processed_count INT,
    pending_remaining INT
) AS $$
DECLARE
    v_processed INT := 0;
    v_remaining INT := 0;
BEGIN
    -- Update batch of pending items to processing
    WITH batch AS (
        SELECT id
        FROM public.notification_queue
        WHERE status = 'pending' AND scheduled_at <= NOW()
        ORDER BY scheduled_at ASC
        LIMIT p_batch_size
        FOR UPDATE SKIP LOCKED
    )
    UPDATE public.notification_queue q
    SET status = 'processing',
        attempts = q.attempts + 1
    FROM batch
    WHERE q.id = batch.id;

    GET DIAGNOSTICS v_processed = ROW_COUNT;

    SELECT COUNT(*) INTO v_remaining
    FROM public.notification_queue
    WHERE status = 'pending';

    RETURN QUERY SELECT v_processed, v_remaining;
END;
$$ LANGUAGE plpgsql;

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.notification_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own subscriptions
DROP POLICY IF EXISTS "Users can manage own notification subscriptions" ON public.notification_subscriptions;
CREATE POLICY "Users can manage own notification subscriptions"
ON public.notification_subscriptions
FOR ALL
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow public reads and inserts for guest/device tokens
DROP POLICY IF EXISTS "Public can register fcm device tokens" ON public.notification_subscriptions;
CREATE POLICY "Public can register fcm device tokens"
ON public.notification_subscriptions
FOR INSERT
WITH CHECK (true);

-- Notification queue is server-managed
DROP POLICY IF EXISTS "Service role access for notification queue" ON public.notification_queue;
CREATE POLICY "Service role access for notification queue"
ON public.notification_queue
FOR ALL
USING (true)
WITH CHECK (true);
