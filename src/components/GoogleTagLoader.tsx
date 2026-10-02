import { useGoogleAnalytics } from "@/hooks/use-google-analytics";

/**
 * Component mounted at the root shell to initialize Google Tag & GA4 tracking.
 * Delegates to useGoogleAnalytics hook to eliminate duplicate initialization,
 * page view tracking, and user engagement monitoring logic.
 */
export function GoogleTagLoader() {
  useGoogleAnalytics();
  return null;
}
