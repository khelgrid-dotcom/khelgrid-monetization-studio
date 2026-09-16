/**
 * Comprehensive SEO & Metadata Helpers for KhelGrid
 *
 * Implements full OpenGraph, Twitter Card, Canonical URL, and Robots meta tags
 * adhering to Google Search Console and AdSense quality standards (E-E-A-T).
 */

export const SITE_URL = "https://khelgrid.com";
export const DEFAULT_OG_IMAGE = "https://khelgrid.com/og-image.png";
export const DEFAULT_SITE_NAME = "KhelGrid";
export const TWITTER_HANDLE = "@KhelGrid";

export interface SeoOptions {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string;
  type?: "website" | "article" | "profile";
  image?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

/**
 * Builds a standardized, type-safe meta & links structure for TanStack Router's `head()` hook.
 */
export function buildSeoHead(options: SeoOptions) {
  const formattedTitle = options.title.includes("KhelGrid")
    ? options.title
    : `${options.title} · KhelGrid`;

  const cleanPath = options.canonicalPath.startsWith("http")
    ? options.canonicalPath
    : `${SITE_URL}${options.canonicalPath.startsWith("/") ? options.canonicalPath : `/${options.canonicalPath}`}`;

  const imageUrl = options.image
    ? options.image.startsWith("http")
      ? options.image
      : `${SITE_URL}${options.image.startsWith("/") ? options.image : `/${options.image}`}`
    : DEFAULT_OG_IMAGE;

  const ogType = options.type || "website";

  const meta: Array<Record<string, string>> = [
    { title: formattedTitle },
    { name: "description", content: options.description },
    ...(options.keywords ? [{ name: "keywords", content: options.keywords }] : []),
    {
      name: "robots",
      content: options.noindex
        ? "noindex, follow"
        : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    // OpenGraph
    { property: "og:site_name", content: DEFAULT_SITE_NAME },
    { property: "og:title", content: formattedTitle },
    { property: "og:description", content: options.description },
    { property: "og:url", content: cleanPath },
    { property: "og:type", content: ogType },
    { property: "og:image", content: imageUrl },
    { property: "og:image:alt", content: formattedTitle },
    { property: "og:locale", content: "en_IN" },
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: TWITTER_HANDLE },
    { name: "twitter:creator", content: TWITTER_HANDLE },
    { name: "twitter:title", content: formattedTitle },
    { name: "twitter:description", content: options.description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: formattedTitle },
  ];

  if (ogType === "article") {
    if (options.publishedTime) {
      meta.push({ property: "article:published_time", content: options.publishedTime });
    }
    if (options.modifiedTime) {
      meta.push({ property: "article:modified_time", content: options.modifiedTime });
    }
    if (options.author) {
      meta.push({ property: "article:author", content: options.author });
    }
    if (options.section) {
      meta.push({ property: "article:section", content: options.section });
    }
  }

  const links = [{ rel: "canonical", href: cleanPath }];

  return { meta, links };
}

/**
 * Quick helper for unindexed, shallow, or authenticated/private pages.
 */
export function noindexMeta() {
  return { name: "robots", content: "noindex, follow" } as const;
}
