import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/ArticlePage";
import { articleHead } from "@/lib/article-head";
import { aboutPage } from "@/content/platform-pages";

export const Route = createFileRoute("/about")({
  head: () => articleHead(aboutPage),
  component: () => <ArticlePage page={aboutPage} />,
});
