/** Global typings for the Google AdSense loader. */
export type AdsByGoogleQueue = Array<Record<string, unknown>> & {
  requestNonPersonalizedAds?: 0 | 1;
  loaded?: boolean;
  push: (params: Record<string, unknown>) => number;
};

declare global {
  interface Window {
    adsbygoogle?: AdsByGoogleQueue;
  }
}
