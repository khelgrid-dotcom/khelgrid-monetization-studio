import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
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
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || !ready || consent !== "unknown" || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie and advertising consent"
      className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] z-50 mx-auto max-w-2xl px-3 md:bottom-4"
    >
      <div className="relative flex flex-col gap-2.5 rounded-2xl border border-border/80 bg-card/95 p-3 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center sm:gap-3 sm:p-4">
        {/* Dismiss Button */}
        <button
          type="button"
          aria-label="Dismiss cookie notice"
          onClick={() => {
            setDismissed(true);
            deny();
          }}
          className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer sm:hidden"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-2.5 pr-6 sm:pr-0">
          <Cookie className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden="true" />
          <p className="flex-1 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
            We use cookies to support sports trials and keep KhelGrid free. Accept personalized
            offers or continue with standard mode.
          </p>
        </div>

        <div className="flex shrink-0 gap-1.5 sm:gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2.5 text-xs flex-1 sm:flex-none cursor-pointer"
            onClick={() => {
              deny();
              trackAdEvent({ event: "ad_consent", value: "denied" });
            }}
          >
            Standard
          </Button>
          <Button
            size="sm"
            className="h-8 px-3 text-xs flex-1 bg-gradient-hero text-primary-foreground font-semibold hover:opacity-95 sm:flex-none cursor-pointer"
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
