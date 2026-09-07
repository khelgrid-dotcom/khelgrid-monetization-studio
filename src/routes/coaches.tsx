import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/ArticlePage";
import { articleHead } from "@/lib/article-head";
import { coachesPage } from "@/content/platform-pages";

export const Route = createFileRoute("/coaches")({
  head: () => articleHead(coachesPage),
  component: () => <ArticlePage page={coachesPage} />,
});
