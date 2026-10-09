/**
 * Small SEO helpers.
 *
 * `noindexMeta()` marks programmatically-generated, low-substance pages so
 * search engines (and AdSense's content review) only ever judge KhelGrid on
 * pages that carry real, written-by-a-human content. The pages stay usable for
 * visitors — they are simply excluded from the index and the sitemap.
 */
export function noindexMeta() {
  return { name: "robots", content: "noindex, follow" } as const;
}
