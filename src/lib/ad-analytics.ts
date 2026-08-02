// Ad-specific analytics. Mirrors src/lib/analytics.ts conventions: forwards to
// window.gtag / dataLayer when present, always mirrors to console.debug.
export type AdEvent = {
  event: "ad_request" | "ad_impression" | "ad_blocked" | "ad_consent";
  slot?: string;
  format?: string;
  value?: string;
};

export function trackAdEvent(evt: AdEvent) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", evt.event, {
      slot: evt.slot,
      format: evt.format,
      value: evt.value,
    });
    window.dataLayer?.push({ ...evt });
  } catch {
    // no-op
  }
  // eslint-disable-next-line no-console
  console.debug("[ads]", evt);
}
