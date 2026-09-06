import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/components/ArticlePage";
import { articleHead } from "@/lib/article-head";
import { talentScannerPage } from "@/content/feature-pages";

export const Route = createFileRoute("/talent-scanner")({
  head: () => articleHead(talentScannerPage),
  component: () => <ArticlePage page={talentScannerPage} />,
});
