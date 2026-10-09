import { adsConfig, hasValidPublisherId } from "@/config/ads";
import type { TCData } from "@/components/ads/adsbygoogle";

/**
 * Google User Messaging Platform (UMP) / Google Privacy & Messaging Web Integration.
 *
 * Implements:
 * 1. Google Consent Mode v2 (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`).
 * 2. IAB Europe Transparency and Consent Framework (TCF) v2.2 locator & stub (`window.__tcfapi`).
 * 3. Google Privacy & Messaging presence detection iframe (`googlefcPresent`).
 * 4. Google UMP Revocation / Privacy Options trigger (`window.googlefc.showRevocationMessage`).
 */

let initialized = false;

/**
 * Initializes the client-side Google UMP / TCF v2.2 and Consent Mode v2 machinery.
 * Safe to call multiple times (idempotent).
 */
export function initUmpConsent(): void {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  try {
    // 1. Google Consent Mode v2 Default Signals
    window.dataLayer = window.dataLayer ?? [];
    if (!window.gtag) {
      window.gtag = (...args: unknown[]) => {
        if (Array.isArray(window.dataLayer)) {
          window.dataLayer.push(args as unknown as Record<string, unknown>);
        }
      };
    }

    // Default to privacy-preserving state pending CMP choice
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
      wait_for_update: 500,
    });

    // 2. IAB Europe TCF v2.2 Locator & Stub
    initTcfApiStub();

    // 3. Google Privacy & Messaging (Funding Choices) Presence Signaling
    initGooglefcPresentSignal();

    // 4. Listen to TCF v2.2 events for real-time consent updates
    listenToTcfConsentChanges();
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[UMP] Error initializing Web UMP consent:", err);
    }
  }
}

/**
 * Installs the standard IAB Europe TCF v2.2 locator iframe and in-memory queue.
 */
function initTcfApiStub(): void {
  if (typeof window === "undefined") return;

  const win = window as unknown as {
    __tcfapi?: (
      command: string,
      version: number,
      callback?: (tcData: TCData | null, success: boolean) => void,
      parameter?: unknown,
    ) => void;
    frames: Record<string, Window>;
  };

  if (!win.__tcfapi) {
    const queue: Array<unknown[]> = [];

    const tcfapi = function (
      command: string,
      version: number,
      callback?: (tcData: TCData | null, success: boolean) => void,
      parameter?: unknown,
    ) {
      if (!command) return;
      if (command === "ping") {
        if (typeof callback === "function") {
          callback(
            {
              gdprApplies: true,
              cmpLoaded: false,
              cmpStatus: "stub",
            },
            true,
          );
        }
      } else {
        queue.push([command, version, callback, parameter]);
      }
    };

    (tcfapi as unknown as { a: Array<unknown[]> }).a = queue;
    win.__tcfapi = tcfapi;

    const addLocator = () => {
      if (!win.frames["__tcfapiLocator"]) {
        if (document.body) {
          const iframe = document.createElement("iframe");
          iframe.style.cssText = "display:none";
          iframe.name = "__tcfapiLocator";
          iframe.setAttribute("aria-hidden", "true");
          document.body.appendChild(iframe);
        } else {
          setTimeout(addLocator, 5);
        }
      }
    };
    addLocator();
  }
}

/**
 * Signals to Google AdSense that Google's certified CMP (Privacy & Messaging) is present.
 */
function initGooglefcPresentSignal(): void {
  if (typeof window === "undefined") return;

  const signal = () => {
    if (!window.frames["googlefcPresent"]) {
      if (document.body) {
        const iframe = document.createElement("iframe");
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.style.border = "none";
        iframe.style.zIndex = "-1000";
        iframe.style.left = "-1000px";
        iframe.style.top = "-1000px";
        iframe.style.position = "absolute";
        iframe.name = "googlefcPresent";
        iframe.setAttribute("aria-hidden", "true");
        document.body.appendChild(iframe);
      } else {
        setTimeout(signal, 5);
      }
    }
  };
  signal();
}

/**
 * Listens for consent updates from the CMP via the TCF v2.2 addEventListener command.
 */
function listenToTcfConsentChanges(): void {
  if (typeof window === "undefined" || !window.__tcfapi) return;

  try {
    window.__tcfapi("addEventListener", 2, (tcData: TCData | null, success: boolean) => {
      if (!success || !tcData) return;

      if (tcData.eventStatus === "tcloaded" || tcData.eventStatus === "useractioncomplete") {
        const consents = tcData.purpose?.consents ?? {};
        // Purpose 1: Store and/or access information on a device
        const storageAllowed = Boolean(consents[1]);
        // Purpose 3: Create personalized ads profile & Purpose 4: Select personalized ads
        const personalAdsAllowed = Boolean(consents[3] && consents[4]);

        updateConsentMode(storageAllowed, personalAdsAllowed);
      }
    });
  } catch {
    // Suppress if CMP is still initializing
  }
}

/**
 * Updates Google Consent Mode v2 signals when user choices change.
 */
export function updateConsentMode(storageAllowed: boolean, personalizedAllowed: boolean): void {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("consent", "update", {
    ad_storage: storageAllowed ? "granted" : "denied",
    ad_user_data: storageAllowed ? "granted" : "denied",
    ad_personalization: personalizedAllowed ? "granted" : "denied",
    analytics_storage: "granted",
  });
}

/**
 * Presents Google's User Messaging Platform (UMP) / Privacy & Messaging form
 * to review or revoke consent.
 *
 * @returns true if Google's UMP form was triggered, false if unavailable.
 */
export function showPrivacyOptionsForm(): boolean {
  if (typeof window === "undefined") return false;

  const fc = window.googlefc;
  if (fc && typeof fc.showRevocationMessage === "function") {
    try {
      fc.showRevocationMessage();
      return true;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn("[UMP] Error triggering Google UMP revocation form:", err);
      }
    }
  }

  return false;
}

/**
 * URL for Google Funding Choices / Privacy & Messaging CMP loader for the configured publisher.
 */
export function getUmpScriptSrc(): string | null {
  if (!hasValidPublisherId()) return null;
  return `https://fundingchoicesmessages.google.com/i/${adsConfig.publisherId}?ers=1`;
}
