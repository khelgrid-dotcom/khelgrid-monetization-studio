import { sendGtagEvent } from "./analytics";

// Ad-specific analytics using shared sendGtagEvent helper.
export type AdEvent = {
  event: "ad_request" | "ad_impression" | "ad_blocked" | "ad_consent";
  slot?: string;
  format?: string;
  value?: string;
};

export function trackAdEvent(evt: AdEvent) {
  sendGtagEvent(
    evt.event,
    {
      slot: evt.slot,
      format: evt.format,
      value: evt.value,
    },
    "ads",
  );
}
