import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AdsByGoogleQueue } from "./adsbygoogle";
import { initUmpConsent, updateConsentMode, showPrivacyOptionsForm } from "@/lib/ump-web";

/**
 * User Messaging Platform (UMP) and Consent layer for AdSense and Google Ads.
 *
 * - "unknown"  → no ads requested at all (safe default for GDPR regions)
 * - "granted"  → personalized ads allowed + Consent Mode v2 granted
 * - "denied"   → non-personalized ads only (NPA flag set + Consent Mode denied)
 */
export type ConsentState = "unknown" | "granted" | "denied";

const STORAGE_KEY = "khelgrid.ads.consent";

type AdConsentValue = {
  consent: ConsentState;
  /** The AdSense loader script may be injected right now. */
  canLoadScript: boolean;
  /** Ads may be requested right now. */
  canServeAds: boolean;
  /** Ads must be non-personalized. */
  nonPersonalized: boolean;
  /** True once the stored choice has been read on the client. */
  ready: boolean;
  grant: () => void;
  deny: () => void;
  reset: () => void;
  /** Opens Google UMP privacy options form if present, or opens the consent manager. */
  openPrivacyOptions: () => void;
};

const AdConsentContext = createContext<AdConsentValue | null>(null);

function readStored(): ConsentState {
  if (typeof window === "undefined") return "unknown";
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : "unknown";
  } catch {
    return "unknown";
  }
}

export function AdConsentProvider({
  children,
  requireConsent = false,
}: {
  children: ReactNode;
  /** When true, no ad is requested until the visitor answers the banner. */
  requireConsent?: boolean;
}) {
  // Always start "unknown" so SSR and the first client render match.
  const [consent, setConsent] = useState<ConsentState>("unknown");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initUmpConsent();
    const stored = readStored();
    setConsent(stored);
    setReady(true);
    if (stored === "granted") {
      updateConsentMode(true, true);
    } else if (stored === "denied") {
      updateConsentMode(false, false);
    }
  }, []);

  const persist = useCallback((next: ConsentState) => {
    setConsent(next);
    try {
      if (next === "unknown") {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
    } catch {
      // storage blocked — in-memory consent still applies for this session
    }

    if (next === "granted") {
      updateConsentMode(true, true);
    } else if (next === "denied") {
      updateConsentMode(false, false);
    }
  }, []);

  // Tell Google to withhold personalization when consent was declined.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (consent !== "denied") return;
    try {
      const queue = (window.adsbygoogle ??= [] as unknown as AdsByGoogleQueue);
      queue.requestNonPersonalizedAds = 1;
    } catch {
      // no-op
    }
  }, [consent]);

  const openPrivacyOptions = useCallback(() => {
    const shown = showPrivacyOptionsForm();
    if (!shown) {
      persist("unknown");
    }
  }, [persist]);

  const value = useMemo<AdConsentValue>(() => {
    const answered = consent !== "unknown";
    const allowed = requireConsent ? ready && answered : ready;
    return {
      consent,
      canLoadScript: allowed,
      canServeAds: allowed,
      nonPersonalized: consent === "denied",
      ready,
      grant: () => persist("granted"),
      deny: () => persist("denied"),
      reset: () => persist("unknown"),
      openPrivacyOptions,
    };
  }, [consent, openPrivacyOptions, persist, ready, requireConsent]);

  return <AdConsentContext.Provider value={value}>{children}</AdConsentContext.Provider>;
}

export function useAdConsent(): AdConsentValue {
  const ctx = useContext(AdConsentContext);
  return (
    ctx ?? {
      consent: "unknown",
      canLoadScript: false,
      canServeAds: false,
      nonPersonalized: true,
      ready: false,
      grant: () => {},
      deny: () => {},
      reset: () => {},
      openPrivacyOptions: () => {},
    }
  );
}
