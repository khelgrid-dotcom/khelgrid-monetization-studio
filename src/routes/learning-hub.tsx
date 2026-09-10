import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/ArticlePage";
import { articleHead } from "@/lib/article-head";
import { learningHubPage } from "@/content/platform-pages";

export const Route = createFileRoute("/learning-hub")({
  head: () => articleHead(learningHubPage),
  component: () => <ArticlePage page={learningHubPage} />,
});
