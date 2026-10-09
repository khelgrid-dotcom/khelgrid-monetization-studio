/**
 * Google tag (gtag.js) configuration for KhelGrid.
 *
 * Both IDs come from the same "khelgrid" Google tag:
 *   - G-BETWHB02PX  → GA4 measurement ID
 *   - GT-5MRCX3M8   → Google tag ID (Tag Manager / Google tag)
 *
 * They are public values, so env overrides are optional.
 */
const DEFAULT_GA_ID = "G-BETWHB02PX";
const DEFAULT_GOOGLE_TAG_ID = "GT-5MRCX3M8";

const GA_ID_RE = /^(G|GT|AW|DC|UA)-[A-Z0-9-]+$/i;

export const analyticsConfig = {
  /** GA4 measurement ID. */
  measurementId:
    ((import.meta.env["VITE_GA_MEASUREMENT_ID"] as string | undefined) ?? "").trim() || DEFAULT_GA_ID,
  /** Google tag ID (loaded alongside the GA4 ID). */
  googleTagId:
    ((import.meta.env["VITE_GOOGLE_TAG_ID"] as string | undefined) ?? "").trim() || DEFAULT_GOOGLE_TAG_ID,
  /** Don't send hits from the dev preview. */
  enabled: !import.meta.env.DEV,
} as const;

/** Every tag ID that should be configured on load. */
export function googleTagIds(): string[] {
  return [analyticsConfig.measurementId, analyticsConfig.googleTagId].filter(
    (id) => id && GA_ID_RE.test(id),
  );
}

export function hasValidGoogleTag(): boolean {
  return googleTagIds().length > 0;
}

/** The single loader script URL (first valid ID is the loader target). */
export function gtagScriptSrc(): string {
  return `https://www.googletagmanager.com/gtag/js?id=${googleTagIds()[0]}`;
}
