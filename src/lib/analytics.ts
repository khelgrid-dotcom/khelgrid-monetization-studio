// Consolidated lightweight analytics helper. Forwards events to window.gtag / dataLayer
// when present, and always mirrors to console.debug for local visibility.

export type NavClickEvent = {
  event: "nav_click";
  label: string;
  destination: string;
  source: "sidebar_desktop" | "sidebar_mobile";
};

export type AnalyticsEvent = NavClickEvent;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Single source of truth for sending events to Google Analytics gtag and dataLayer.
 * Removes duplication across core analytics, ad tracking, and user engagement.
 * Hardened to prevent exceptions if ad-blockers stub or alter window globals.
 */
export function sendGtagEvent(
  eventName: string,
  params: Record<string, unknown> = {},
  debugNamespace: string = "analytics",
) {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params });
    }
  } catch {
    // Graceful no-op when gtag fails or is blocked by privacy extensions
  }
  if (import.meta.env.DEV) {
    console.debug(`[${debugNamespace}]`, eventName, params);
  }
}

export function trackEvent(evt: AnalyticsEvent) {
  sendGtagEvent(
    evt.event,
    {
      label: evt.label,
      destination: evt.destination,
      source: evt.source,
    },
    "analytics",
  );
}

export function trackPageView(pagePath: string, pageTitle?: string) {
  sendGtagEvent(
    "page_view",
    {
      page_path: pagePath,
      page_location: typeof window !== "undefined" ? window.location.href : "",
      page_title: pageTitle || (typeof document !== "undefined" ? document.title : ""),
    },
    "analytics",
  );
}

export function trackUserEngagement(action: string, params: Record<string, unknown> = {}) {
  sendGtagEvent(
    "user_engagement",
    {
      action,
      ...params,
    },
    "engagement",
  );
}

// Shared constants so both sidebars emit the same values for /play.
export const PLAY_NAV_LABEL = "Play · Find games";
export const PLAY_NAV_DESTINATION = "/play";
