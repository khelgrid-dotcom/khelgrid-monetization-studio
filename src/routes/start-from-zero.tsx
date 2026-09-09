import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/ArticlePage";
import { articleHead } from "@/lib/article-head";
import { startFromZeroPage } from "@/content/feature-pages";

export const Route = createFileRoute("/start-from-zero")({
  head: () => articleHead(startFromZeroPage),
  component: () => <ArticlePage page={startFromZeroPage} />,
});
