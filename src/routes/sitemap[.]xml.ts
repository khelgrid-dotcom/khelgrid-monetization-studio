import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/start-client-core";
import { ALL_CATALOG_PATHS, SPORTS_CATALOG, CITIES_CATALOG, GUIDES_CATALOG, TOOLS_CATALOG } from "@/data/catalog";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

const STATIC_PATHS = [
  "/", "/about", "/academy", "/ai-guide", "/book", "/coaches", "/community",
  "/events", "/learning-hub", "/memberships",
  "/mobile-app", "/play", "/pricing", "/search", "/start-from-zero",
  "/talent-scanner", "/train", "/verify", "/privacy", "/terms",
  "/sports", "/cities", "/guides", "/tools",
];

// Long-tail combo: every sport × every city
const SPORT_IN_CITY_PATHS = SPORTS_CATALOG.flatMap(s =>
  CITIES_CATALOG.map(c => `/sport-in-city/${s.slug}-in-${c.slug}`),
);

const GUIDE_CATEGORY_SLUGS = ["trial-prep", "sports-cv", "scholarships", "nutrition", "mindset", "parents", "recovery", "tech"];
const TOOL_CATEGORY_SLUGS = ["calculator", "checklist", "planner", "estimator"];
const PAGE_SIZE_GUIDES = 6;
const PAGE_SIZE_TOOLS = 6;

const TOP_GUIDE_PATHS = GUIDE_CATEGORY_SLUGS.flatMap(slug => {
  const label = slug.replace("-", " ");
  const count = GUIDES_CATALOG.filter(g => g.category.toLowerCase() === label).length;
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE_GUIDES));
  return Array.from({ length: pages }, (_, i) =>
    i === 0 ? `/top-guides/${slug}` : `/top-guides/${slug}?page=${i + 1}`,
  );
});

const BEST_TOOL_PATHS = TOOL_CATEGORY_SLUGS.flatMap(slug => {
  const count = TOOLS_CATALOG.filter(t => t.category.toLowerCase() === slug).length;
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE_TOOLS));
  return Array.from({ length: pages }, (_, i) =>
    i === 0 ? `/best-tools/${slug}` : `/best-tools/${slug}?page=${i + 1}`,
  );
});

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          ...STATIC_PATHS,
          ...ALL_CATALOG_PATHS,
          ...SPORT_IN_CITY_PATHS,
          ...TOP_GUIDE_PATHS,
          ...BEST_TOOL_PATHS,
        ];
        const urls = paths.map(p => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`);
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
