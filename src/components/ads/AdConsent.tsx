import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AdsByGoogleQueue } from "./adsbygoogle";


/**
 * Minimal, dependency-free consent layer for ads.
 *
 * - "unknown"  → no ads requested at all (safe default for GDPR regions)
 * - "granted"  → personalized ads allowed
 * - "denied"   → non-personalized ads only (NPA flag set on adsbygoogle)
 *
 * India (the primary audience) does not require an opt-in banner, so the
 * `requireConsent` flag lets you serve ads immediately outside the EEA/UK
 * while still honouring an explicit "denied" choice.
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

  useEffect(() => {
    setConsent(readStored());
  }, []);

  const persist = useCallback((next: ConsentState) => {
    setConsent(next);
    try {
      if (next === "unknown") window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage blocked — in-memory consent still applies for this session
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

  const value = useMemo<AdConsentValue>(
    () => ({
      consent,
      canServeAds: requireConsent ? consent !== "unknown" : true,
      nonPersonalized: consent === "denied",
      grant: () => persist("granted"),
      deny: () => persist("denied"),
      reset: () => persist("unknown"),
    }),
    [consent, persist, requireConsent],
  );

  return <AdConsentContext.Provider value={value}>{children}</AdConsentContext.Provider>;
}

export function useAdConsent(): AdConsentValue {
  const ctx = useContext(AdConsentContext);
  // Ads must never crash a page that forgot the provider.
  return (
    ctx ?? {
      consent: "unknown",
      canServeAds: true,
      nonPersonalized: false,
      grant: () => {},
      deny: () => {},
      reset: () => {},
    }
  );
}
