import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdConsent } from "./AdConsent";
import { trackAdEvent } from "@/lib/ad-analytics";

/**
 * Cookie / advertising consent banner.
 *
 * Renders until a choice is stored. Until then no AdSense script is injected
 * and no ad unit requests a fill (see AdSenseLoader + AdUnit).
 * - "Accept all"        → personalized ads
 * - "Non-personalized"  → ads load with the AdSense NPA flag set
 */
export function AdConsentBanner() {
  const { consent, ready, grant, deny } = useAdConsent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || !ready || consent !== "unknown") return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie and advertising consent"
      className="fixed inset-x-0 bottom-14 z-50 mx-auto max-w-3xl px-3 md:bottom-4"
    >
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-xl sm:flex-row sm:items-center">
        <Cookie className="hidden h-5 w-5 shrink-0 text-primary sm:block" aria-hidden="true" />
        <p className="flex-1 text-xs text-muted-foreground sm:text-sm">
          We use cookies to show ads that keep KhelGrid free. Accept to see personalized sports offers,
          or continue with non-personalized ads. You can change this anytime.
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
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Small link/button to re-open the banner so a choice can be changed. */
export function CookieSettingsButton({ className = "" }: { className?: string }) {
  const { reset } = useAdConsent();
  return (
    <button
      type="button"
      onClick={reset}
      className={`text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline ${className}`}
    >
      Cookie settings
    </button>
  );
}
