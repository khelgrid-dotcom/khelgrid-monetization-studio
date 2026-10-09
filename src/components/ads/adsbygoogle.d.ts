/** Global typings for the Google AdSense loader. */
export type AdsByGoogleQueue = Array<Record<string, unknown>> & {
  requestNonPersonalizedAds?: 0 | 1;
  loaded?: boolean;
  push: (params: Record<string, unknown>) => number;
};

/** Google User Messaging Platform (UMP) & Privacy & Messaging web interface */
export interface GoogleFc {
  showRevocationMessage?: () => void;
  callbackQueue?: Array<() => void>;
  getConsentStatus?: () => number;
  controlledMessagingFunction?: (status: Record<string, unknown>) => void;
}

export interface TCData {
  eventStatus?: "tcloaded" | "cmpuishown" | "useractioncomplete";
  cmpStatus?: "stub" | "loading" | "loaded" | "error";
  gdprApplies?: boolean;
  purpose?: {
    consents?: Record<number, boolean>;
    legitimateInterests?: Record<number, boolean>;
  };
  vendor?: {
    consents?: Record<number, boolean>;
  };
  tcString?: string;
  listenerId?: number;
}

export type TcfApiCallback = (tcData: TCData | null, success: boolean) => void;

export type TcfApiFunction = (
  command: string,
  version: number,
  callback?: TcfApiCallback,
  parameter?: unknown,
) => void;

declare global {
  interface Window {
    adsbygoogle?: AdsByGoogleQueue;
    googlefc?: GoogleFc;
    __tcfapi?: TcfApiFunction;
  }
}
