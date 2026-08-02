import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAdConsent } from "./AdConsent";
import { trackAdEvent } from "@/lib/ad-analytics";

/**
 * Lightweight consent bar. Only renders when a choice hasn't been made yet.
 * Declining keeps ads on, but non-personalized (AdSense NPA flag).
 */
export function AdConsentBanner() {
  const { consent, grant, deny } = useAdConsent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || consent !== "unknown") return null;

  return (
    <div
      role="region"
      aria-label="Advertising consent"
      className="fixed inset-x-0 bottom-14 z-50 mx-auto max-w-3xl px-3 md:bottom-4"
    >
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-xl sm:flex-row sm:items-center">
        <p className="flex-1 text-xs text-muted-foreground sm:text-sm">
          We show ads to keep KhelGrid free. Allow personalized ads for more relevant sports offers, or
          continue with non-personalized ads.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            variant="outline"
            className="min-h-11 flex-1 sm:flex-none"
            onClick={() => {
              deny();
              trackAdEvent({ event: "ad_consent", value: "denied" });
            }}
          >
            Non-personalized
          </Button>
          <Button
            size="sm"
            className="min-h-11 flex-1 bg-gradient-hero text-primary-foreground hover:opacity-95 sm:flex-none"
            onClick={() => {
              grant();
              trackAdEvent({ event: "ad_consent", value: "granted" });
            }}
          >
            Allow ads
          </Button>
        </div>
      </div>
    </div>
  );
}
