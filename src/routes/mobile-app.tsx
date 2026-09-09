import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/ArticlePage";
import { articleHead } from "@/lib/article-head";
import { mobileAppPage } from "@/content/platform-pages";

export const Route = createFileRoute("/mobile-app")({
  head: () => articleHead(mobileAppPage),
  component: () => <ArticlePage page={mobileAppPage} />,
});
