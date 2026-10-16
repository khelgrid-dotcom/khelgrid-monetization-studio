-- KhelGrid Free-plan database optimization and security hardening
DROP TABLE IF EXISTS public.trial_applications CASCADE;
DROP TABLE IF EXISTS public.trials CASCADE;
DROP TABLE IF EXISTS public.coaching_enrollments CASCADE;
DROP TABLE IF EXISTS public.coaching_programs CASCADE;
DROP TABLE IF EXISTS public.venue_bookings CASCADE;
DROP TABLE IF EXISTS public.user_memberships CASCADE;
DROP TABLE IF EXISTS public.sports_achievements CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.sports_entities CASCADE;
DROP TABLE IF EXISTS public."State" CASCADE;

ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_temp;
ALTER FUNCTION public.set_updated_at() SET search_path = public, pg_temp;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;

DROP INDEX IF EXISTS public.idx_notifications_user_unread;
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON public.notifications (user_id, created_at DESC)
  WHERE is_read = false;

CREATE OR REPLACE FUNCTION public.cleanup_old_notifications()
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE deleted_count integer;
BEGIN
  DELETE FROM public.notifications
  WHERE is_read = true
    AND created_at < now() - interval '90 days';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_old_notifications() FROM PUBLIC, anon, authenticated;

-- pg_cron is intentionally not enabled by this migration on Free-plan projects.
-- The cleanup function can be scheduled later through an existing scheduler.
