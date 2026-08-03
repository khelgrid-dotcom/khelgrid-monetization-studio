import { useEffect } from "react";
import { adsConfig, adsenseScriptSrc, hasValidPublisherId } from "@/config/ads";
import { useAdConsent } from "./AdConsent";
import type { AdsByGoogleQueue } from "./adsbygoogle";

const SCRIPT_ID = "adsbygoogle-loader";

/**
 * Injects the global AdSense script — but only once consent has been resolved.
 *
 * This is deliberately client-side (not a `head().scripts` entry) so that no
 * request ever reaches Google before the visitor answers the cookie banner,
 * which is what GDPR/consent rules require. The non-personalized-ads flag is
 * pushed onto the queue *before* the script is appended, so a "denied" choice
 * applies to the very first ad request.
 */
export function AdSenseLoader() {
  const { canLoadScript, nonPersonalized } = useAdConsent();

  useEffect(() => {
    if (!hasValidPublisherId() || !canLoadScript) return;
    if (document.getElementById(SCRIPT_ID)) return;

    // Must be set before the loader executes.
    const queue = (window.adsbygoogle ??= [] as unknown as AdsByGoogleQueue);
    queue.requestNonPersonalizedAds = nonPersonalized ? 1 : 0;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = adsenseScriptSrc();
    script.async = true;
    script.crossOrigin = "anonymous";
    if (adsConfig.enableAutoAds) script.setAttribute("data-overlays", "bottom");
    document.head.appendChild(script);
  }, [canLoadScript, nonPersonalized]);

  return null;
}
