import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/start-client-core";
import { SPORTS_CATALOG, CITIES_CATALOG, GUIDES_CATALOG } from "@/data/catalog";
import { BLOG_POSTS } from "@/data/blog";
import { TRIALS } from "@/data/trials";
import { hasGuideBody } from "@/content/guide-bodies";

const BASE_URL = "https://khelgrid.com";

const STATIC_PATHS = [
  "/",
  "/search",
  "/trials",
  "/opportunities",
  "/play",
  "/book",
  "/train",
  "/events",
  "/memberships",
  "/coaches",
  "/academy",
  "/pricing",
  "/guides",
  "/learning-hub",
  "/start-from-zero",
  "/resources",
  "/talent-scanner",
  "/verify",
  "/ai-guide",
  "/community",
  "/sports",
  "/cities",
  "/tools",
  "/mobile-app",
  "/about",
  "/contact",
  "/editorial-policy",
  "/privacy",
  "/terms",
  "/blog",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          ...STATIC_PATHS,
          ...SPORTS_CATALOG.map((sport) => `/sport/${sport.slug}`),
          ...CITIES_CATALOG.map((city) => `/city/${city.slug}`),
          ...GUIDES_CATALOG.filter((guide) => hasGuideBody(guide.slug)).map(
            (guide) => `/guide/${guide.slug}`,
          ),
          ...BLOG_POSTS.map((post) => `/blog/${post.slug}`),
          ...TRIALS.map((trial) => `/trial/${trial.id}`),
        ];
        const urls = [...new Set(paths)].map(
          (path) => `  <url><loc>${BASE_URL}${path}</loc><changefreq>weekly</changefreq></url>`,
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
