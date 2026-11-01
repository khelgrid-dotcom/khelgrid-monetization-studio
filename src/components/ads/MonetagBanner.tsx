import { useEffect, useRef, useState, type CSSProperties } from "react";
import { monetagConfig } from "@/config/ads";
import { useAdConsent } from "./AdConsent";

export interface MonetagBannerProps {
  /**
   * The Monetag ad zone ID for this unit.
   * If omitted, falls back to `monetagConfig.zoneId`.
   */
  zoneId?: string;

  /**
   * Custom className for container layout.
   */
  className?: string;

  /**
   * Minimum height to reserve to avoid Cumulative Layout Shift (CLS).
   * Default: "90px".
   */
  minHeight?: number | string;

  /**
   * Optional custom inline styles.
   */
  style?: CSSProperties;
}

/**
 * Container component for Monetag native or banner ad placements.
 * Defers rendering until client hydration completes and user consent allows ads.
 */
export function MonetagBanner({
  zoneId: propZoneId,
  className = "",
  minHeight = "90px",
  style,
}: MonetagBannerProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { canServeAds } = useAdConsent();

  const zoneId = (propZoneId ?? monetagConfig.zoneId).trim();
  const heightStyle = typeof minHeight === "number" ? `${minHeight}px` : minHeight;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated || !monetagConfig.enabled || !canServeAds) {
    return (
      <div
        className={`monetag-banner-container overflow-hidden rounded-md border border-dashed border-border/40 bg-muted/20 text-center text-xs text-muted-foreground ${className}`}
        style={{ minHeight: heightStyle, ...style }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`monetag-banner-container flex items-center justify-center overflow-hidden ${className}`}
      style={{ minHeight: heightStyle, ...style }}
      data-monetag-zone={zoneId || undefined}
    >
      {/* If zone is configured, this slot serves as the DOM target for Monetag ad rendering */}
      <div id={zoneId ? `monetag-zone-${zoneId}` : undefined} className="w-full text-center" />
    </div>
  );
}
