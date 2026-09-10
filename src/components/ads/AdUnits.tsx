import { AdUnit, type AdUnitProps } from "./AdUnit";

type Variant = Omit<AdUnitProps, "adSlot"> & { adSlot: AdUnitProps["adSlot"] };

/** Full-width leaderboard / banner. Good above or below main content. */
export function BannerAd({ minHeight = 100, className = "", ...rest }: Variant) {
  return (
    <AdUnit
      adFormat="horizontal"
      minHeight={minHeight}
      className={`mx-auto ${className}`}
      ariaLabel="Banner advertisement"
      {...rest}
    />
  );
}

/** Fluid, fully responsive unit that adapts to whatever container it is in. */
export function ResponsiveAd({ minHeight = 250, ...rest }: Variant) {
  return <AdUnit adFormat="auto" responsive minHeight={minHeight} ariaLabel="Advertisement" {...rest} />;
}

/** Tall unit for the desktop sidebar. Hidden on small screens. */
export function SidebarAd({ minHeight = 600, className = "", ...rest }: Variant) {
  return (
    <AdUnit
      adFormat="vertical"
      minHeight={minHeight}
      className={`hidden lg:block ${className}`}
      ariaLabel="Sidebar advertisement"
      {...rest}
    />
  );
}

/** In-article / in-feed fluid unit for guides and long-form pages. */
export function InArticleAd({ minHeight = 200, layoutKey, ...rest }: Variant) {
  return (
    <AdUnit
      adFormat="fluid"
      minHeight={minHeight}
      layoutKey={layoutKey}
      ariaLabel="In-article advertisement"
      {...rest}
    />
  );
}

/** Rectangle unit designed to sit inline inside a card grid. */
export function InFeedAd({ minHeight = 250, className = "", ...rest }: Variant) {
  return (
    <AdUnit
      adFormat="rectangle"
      minHeight={minHeight}
      className={`my-0 rounded-2xl ${className}`}
      ariaLabel="Sponsored placement"
      {...rest}
    />
  );
}

/**
 * Mobile-only sticky footer ad. Sits above the BottomTabBar and can be
 * dismissed, which is required by AdSense's better-ads policy.
 */
export function MobileStickyAd({ minHeight = 60, ...rest }: Variant) {
  return (
    <AdUnit
      adFormat="horizontal"
      minHeight={minHeight}
      className="my-0"
      label={null}
      ariaLabel="Sticky advertisement"
      {...rest}
    />
  );
}
