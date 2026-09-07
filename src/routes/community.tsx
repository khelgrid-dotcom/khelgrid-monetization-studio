import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/ArticlePage";
import { articleHead } from "@/lib/article-head";
import { communityPage } from "@/content/platform-pages";

export const Route = createFileRoute("/community")({
  head: () => articleHead(communityPage),
  component: () => <ArticlePage page={communityPage} />,
});
