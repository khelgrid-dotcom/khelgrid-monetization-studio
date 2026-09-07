import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/ArticlePage";
import { articleHead } from "@/lib/article-head";
import { editorialPolicyPage } from "@/content/site-pages";

export const Route = createFileRoute("/editorial-policy")({
  head: () => articleHead(editorialPolicyPage),
  component: () => <ArticlePage page={editorialPolicyPage} />,
});
