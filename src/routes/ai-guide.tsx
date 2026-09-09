import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/ArticlePage";
import { articleHead } from "@/lib/article-head";
import { aiGuidePage } from "@/content/feature-pages";

export const Route = createFileRoute("/ai-guide")({
  head: () => articleHead(aiGuidePage),
  component: () => <ArticlePage page={aiGuidePage} />,
});
