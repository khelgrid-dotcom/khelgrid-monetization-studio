import { useEffect, useRef } from "react";
import { monetagConfig } from "@/config/ads";
import { useAdConsent } from "./AdConsent";

export interface MonetagLoaderProps {
  /**
   * Optional override for Monetag zone ID.
   * If omitted, uses `monetagConfig.zoneId` (from `VITE_MONETAG_ZONE_ID`).
   */
  zoneId?: string;

  /**
   * Optional custom script URL.
   * If omitted, uses `monetagConfig.scriptUrl`.
   */
  scriptUrl?: string;

  /**
   * Optional flag to force loading even if VITE_MONETAG_ZONE_ID is unset.
   * Useful when testing or when a zone is injected dynamically.
   */
  forceLoad?: boolean;

  /**
   * Whether to register the /sw.js service worker for Monetag web push notifications.
   * Defaults to false unless push notifications are configured.
   */
  registerServiceWorker?: boolean;
}

const SCRIPT_ELEMENT_ID = "monetag-tag-script";

/**
 * Initializes and manages the Monetag monetization script on KhelGrid.
 *
 * Guarantees:
 * 1. Safe client-side execution — completely harmless during SSR or prerendering.
 * 2. Idempotent — will never inject duplicate script tags.
 * 3. Respects user consent policy via `useAdConsent()`.
 * 4. Gracefully defers when zone ID is not yet provided, without console spam or hydration errors.
 */
export function MonetagLoader({
  zoneId: propZoneId,
  scriptUrl: propScriptUrl,
  forceLoad = false,
  registerServiceWorker = false,
}: MonetagLoaderProps = {}) {
  const { canLoadScript } = useAdConsent();
  const initAttempted = useRef(false);

  const zoneId = (propZoneId ?? monetagConfig.zoneId).trim();
  const scriptUrl = (propScriptUrl ?? monetagConfig.scriptUrl).trim();
  const isEnabled = monetagConfig.enabled;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isEnabled) return;
    if (!canLoadScript) return;
    if (initAttempted.current) return;

    // Check if script is already present in document
    if (
      document.getElementById(SCRIPT_ELEMENT_ID) ||
      document.querySelector('script[src*="tag.min.js"]') ||
      document.querySelector('script[src*="quge5.com"]')
    ) {
      initAttempted.current = true;
      return;
    }

    // Only inject if a zoneId is provided or forceLoad is requested
    if (!zoneId && !forceLoad) {
      if (import.meta.env.DEV) {
        // Safe development informational log
        console.info(
          "[Monetag] MultiTag loader ready. Configure VITE_MONETAG_ZONE_ID to activate ad delivery on live domain.",
        );
      }
      return;
    }

    initAttempted.current = true;

    try {
      const script = document.createElement("script");
      script.id = SCRIPT_ELEMENT_ID;
      script.src = scriptUrl;
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      if (zoneId) {
        script.setAttribute("data-zone", zoneId);
      }

      script.onerror = () => {
        // Adblockers or local DNS may reject third-party ad networks; fail gracefully
        if (import.meta.env.DEV) {
          console.warn("[Monetag] Script load was blocked or unreachable.");
        }
      };

      (document.head || document.body).appendChild(script);

      // Register Monetag service worker if enabled and supported
      if (registerServiceWorker && "serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((err) => {
          if (import.meta.env.DEV) {
            console.warn("[Monetag] Service worker registration notice:", err);
          }
        });
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn("[Monetag] Unexpected error injecting ad script:", err);
      }
    }
  }, [zoneId, scriptUrl, isEnabled, canLoadScript, forceLoad, registerServiceWorker]);

  return null;
}
