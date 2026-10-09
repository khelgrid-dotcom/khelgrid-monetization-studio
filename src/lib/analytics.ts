// Lightweight analytics helper. Forwards events to window.gtag / dataLayer
// when present, and always mirrors to console.debug for local visibility.
export type NavClickEvent = {
  event: "nav_click";
  label: string;
  destination: string;
  source: "sidebar_desktop" | "sidebar_mobile";
};

type AnalyticsEvent = NavClickEvent;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(evt: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", evt.event, {
      event_name: evt.event,
      label: evt.label,
      destination: evt.destination,
      source: evt.source,
    });
    window.dataLayer?.push({ ...evt });
  } catch {
    // no-op
  }
  // eslint-disable-next-line no-console
  console.debug("[analytics]", evt);
}

// Shared constants so both sidebars emit the same values for /play.
export const PLAY_NAV_LABEL = "Play · Find games";
export const PLAY_NAV_DESTINATION = "/play";

export type NavSource = NavClickEvent["source"];

/** Single builder for the /play click event, so every surface sends identical fields. */
export function buildPlayNavClickEvent(source: NavSource): NavClickEvent {
  return {
    event: "nav_click",
    label: PLAY_NAV_LABEL,
    destination: PLAY_NAV_DESTINATION,
    source,
  };
}

/** Records a /play click from either sidebar. */
export function trackPlayNavClick(source: NavSource) {
  trackEvent(buildPlayNavClickEvent(source));
}
