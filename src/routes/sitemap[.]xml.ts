import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/start-client-core";
import { SPORTS_CATALOG, CITIES_CATALOG, GUIDES_CATALOG } from "@/data/catalog";
import { hasGuideBody } from "@/content/guide-bodies";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

/**
 * The sitemap deliberately lists only pages that carry real, written content.
 *
 * Programmatically-generated permutations (`/sport-in-city/*`, paginated
 * `/top-guides/*` and `/best-tools/*` category pages, and the single-purpose
 * `/tools/*` widgets) are still reachable in the app but are marked
 * `noindex, follow` and excluded here, so search engines and ad reviewers only
 * ever assess KhelGrid on substantive pages.
 */
const STATIC_PATHS = [
  "/",
  // Product surfaces
  "/search", "/trials", "/opportunities", "/play", "/book", "/train",
  "/events", "/memberships", "/coaches", "/academy", "/pricing",
  // Editorial
  "/guides", "/learning-hub", "/start-from-zero", "/resources",
  "/talent-scanner", "/verify", "/ai-guide", "/community",
  "/sports", "/cities", "/tools", "/mobile-app",
  // Trust pages
  "/about", "/contact", "/editorial-policy", "/privacy", "/terms",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          ...STATIC_PATHS,
          ...SPORTS_CATALOG.map((s) => `/sport/${s.slug}`),
          ...CITIES_CATALOG.map((c) => `/city/${c.slug}`),
          ...GUIDES_CATALOG.filter((g) => hasGuideBody(g.slug)).map((g) => `/guide/${g.slug}`),
        ];
        const urls = paths.map(
          (p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`,
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
