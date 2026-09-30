-- ==============================================================================
-- KhelGrid Supabase Migration: Notification Subscriptions with preferred_sports Array
-- Migration: 20260930_notification_subscriptions_preferred_sports.sql
-- Fields: user_id, fcm_token, preferred_sports (TEXT[]), city (TEXT)
-- ==============================================================================

-- 1. Ensure Table Structure with user_id, fcm_token, preferred_sports (array), and city (string)
CREATE TABLE IF NOT EXISTS public.notification_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fcm_token TEXT NOT NULL,
    preferred_sports TEXT[] NOT NULL DEFAULT '{"Cricket"}',
    city TEXT NOT NULL DEFAULT 'Bengaluru',
    notify_live_trials BOOLEAN NOT NULL DEFAULT TRUE,
    notify_deadlines BOOLEAN NOT NULL DEFAULT TRUE,
    device_type TEXT NOT NULL DEFAULT 'web' CHECK (device_type IN ('android', 'web', 'ios')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_notified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Alter table if columns are missing from prior migrations
DO $$
BEGIN
    -- Add preferred_sports column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'notification_subscriptions' 
          AND column_name = 'preferred_sports'
    ) THEN
        ALTER TABLE public.notification_subscriptions 
        ADD COLUMN preferred_sports TEXT[] NOT NULL DEFAULT '{"Cricket"}';
    END IF;

    -- Add notify_live_trials column if not exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'notification_subscriptions' 
          AND column_name = 'notify_live_trials'
    ) THEN
        ALTER TABLE public.notification_subscriptions 
        ADD COLUMN notify_live_trials BOOLEAN NOT NULL DEFAULT TRUE;
    END IF;

    -- Ensure city column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'notification_subscriptions' 
          AND column_name = 'city'
    ) THEN
        ALTER TABLE public.notification_subscriptions 
        ADD COLUMN city TEXT NOT NULL DEFAULT 'Bengaluru';
    END IF;
END $$;

-- 3. Optimized Indexes for Array & City Filtering
CREATE INDEX IF NOT EXISTS idx_notif_sub_preferred_sports 
ON public.notification_subscriptions USING GIN (preferred_sports)
WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_notif_sub_city 
ON public.notification_subscriptions (city)
WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_notif_sub_fcm_token 
ON public.notification_subscriptions (fcm_token);

CREATE INDEX IF NOT EXISTS idx_notif_sub_user_id 
ON public.notification_subscriptions (user_id);

-- 4. Trigger to Update updated_at
CREATE OR REPLACE FUNCTION update_notif_sub_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notif_sub_updated_at ON public.notification_subscriptions;
CREATE TRIGGER trg_notif_sub_updated_at
BEFORE UPDATE ON public.notification_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_notif_sub_timestamp();

-- 5. Row Level Security Policies
ALTER TABLE public.notification_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own notification subscriptions" ON public.notification_subscriptions;
CREATE POLICY "Users can read own notification subscriptions"
ON public.notification_subscriptions
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can insert or update own notification subscriptions" ON public.notification_subscriptions;
CREATE POLICY "Users can insert or update own notification subscriptions"
ON public.notification_subscriptions
FOR ALL
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
