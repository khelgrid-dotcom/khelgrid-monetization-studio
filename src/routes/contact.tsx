import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/ArticlePage";
import { articleHead } from "@/lib/article-head";
import { contactPage } from "@/content/site-pages";

export const Route = createFileRoute("/contact")({
  head: () => articleHead(contactPage),
  component: () => <ArticlePage page={contactPage} />,
});
