import type { ContentPage } from "@/content/types";
import { buildSeoHead } from "@/lib/seo";

/** Shared head() payload for long-form editorial pages. */
export function articleHead(page: ContentPage) {
  return buildSeoHead({
    title: page.title,
    description: page.description,
    canonicalPath: page.path,
    type: "article",
    author: "KhelGrid Editorial Team",
    keywords: `${page.title}, sports in India, athletic training, athlete guidelines, sports career`,
  });
}
