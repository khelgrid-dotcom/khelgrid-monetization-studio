import { useState } from "react";
import { X } from "lucide-react";
import { AD_SLOTS, adsConfig, hasValidPublisherId } from "@/config/ads";
import { MobileStickyAd } from "./AdUnits";

/**
 * Dismissible mobile sticky ad, anchored just above the BottomTabBar.
 * Rendered once from the root layout.
 */
export function StickyMobileAdSlot() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  if (adsConfig.enableAutoAds) return null; // Auto Ads own anchor placements
  if (!hasValidPublisherId() || !AD_SLOTS.mobileSticky) return null;

  return (
    <div className="fixed inset-x-0 bottom-14 z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      <div className="relative">
        <button
          type="button"
          aria-label="Close advertisement"
          onClick={() => setDismissed(true)}
          className="absolute right-1 top-1 z-10 grid h-6 w-6 place-items-center rounded-full bg-secondary/80 text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <MobileStickyAd adSlot="mobileSticky" />
      </div>
    </div>
  );
}
