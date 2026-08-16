import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/start-client-core";
import { ALL_CATALOG_PATHS, SPORTS_CATALOG, CITIES_CATALOG } from "@/data/catalog";
import { TRIALS } from "@/data/trials";

const BASE_URL = "https://khelgrid.com";

const STATIC_PATHS = [
  "/", "/about", "/academy", "/book", "/coaches", "/community",
  "/events", "/memberships",
  "/play", "/pricing",
  "/train", "/trust-center", "/verification-policy", "/editorial-policy", "/correction-policy", "/contact", "/privacy", "/terms",
  "/sports", "/cities", "/guides", "/tools",
];

// Long-tail combo: every sport × every city
const SPORT_IN_CITY_PATHS = SPORTS_CATALOG.flatMap(s =>
  CITIES_CATALOG.map(c => `/sport-in-city/${s.slug}-in-${c.slug}`),
);
const TRIAL_PATHS = TRIALS.map((trial) => `/trial/${trial.id}`);

const GUIDE_CATEGORY_SLUGS = ["trial-prep", "sports-cv", "scholarships", "nutrition", "mindset", "parents", "recovery", "tech"];
const TOOL_CATEGORY_SLUGS = ["calculator", "checklist", "planner", "estimator"];
const TOP_GUIDE_PATHS = GUIDE_CATEGORY_SLUGS.map(slug => `/top-guides/${slug}`);

const BEST_TOOL_PATHS = TOOL_CATEGORY_SLUGS.map(slug => `/best-tools/${slug}`);

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          ...STATIC_PATHS,
          ...ALL_CATALOG_PATHS,
          ...SPORT_IN_CITY_PATHS,
          ...TRIAL_PATHS,
          ...TOP_GUIDE_PATHS,
          ...BEST_TOOL_PATHS,
        ];
        const urls = [...new Set(paths)].map(p => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`);
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
