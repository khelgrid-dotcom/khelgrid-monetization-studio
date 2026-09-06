import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/ArticlePage";
import { articleHead } from "@/lib/article-head";
import { verifyPage } from "@/content/feature-pages";

export const Route = createFileRoute("/verify")({
  head: () => articleHead(verifyPage),
  component: () => <ArticlePage page={verifyPage} />,
});
