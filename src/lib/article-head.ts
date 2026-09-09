import type { ContentPage } from "@/content/types";

/** Shared head() payload for long-form editorial pages. */
export function articleHead(page: ContentPage) {
  return {
    meta: [
      { title: `${page.title} · KhelGrid` },
      { name: "description", content: page.description },
      { property: "og:title", content: page.title },
      { property: "og:description", content: page.description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: page.path },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: page.path }],
  };
}
