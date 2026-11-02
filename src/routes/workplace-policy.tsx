import { createFileRoute } from "@tanstack/react-router";
import { buildSeoHead } from "@/lib/seo";
import { WorkplacePolicy } from "@/components/WorkplacePolicy";

export const Route = createFileRoute("/workplace-policy")({
  head: () =>
    buildSeoHead({
      title: "Workplace Policy & Code of Conduct · KhelGrid",
      description:
        "Official workplace policy of KhelGrid: Equal opportunity & inclusion, respectful workplace, flexible remote work, professional ethics, data privacy, health & safety, and POSH compliance.",
      canonicalPath: "/workplace-policy",
      keywords:
        "KhelGrid workplace policy, sports tech careers India, equal opportunity employer, POSH compliance India, remote sports startup, code of conduct, sports ecosystem workplace, Indian sports technology culture",
      type: "website",
      customSchema: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Workplace Policy · KhelGrid",
        url: "https://www.khelgrid.com/workplace-policy",
        description:
          "Professional workplace policy and code of conduct governing KhelGrid team members, interns, contractors, and collaborators building India's sports opportunity network.",
        publisher: {
          "@type": "Organization",
          name: "KhelGrid",
          url: "https://www.khelgrid.com",
          logo: "https://www.khelgrid.com/favicon-96x96.png",
          email: "khelgrid@gmail.com",
        },
        mainEntity: {
          "@type": "Organization",
          name: "KhelGrid",
          knowsAbout: [
            "Equal Opportunity and Inclusion",
            "Prevention of Sexual Harassment (POSH)",
            "Remote & Flexible Working",
            "Professional Ethics",
            "Data Privacy and Confidentiality",
            "Sports Technology Innovation",
          ],
        },
      },
    }),
  component: WorkplacePolicyPage,
});

export function WorkplacePolicyPage() {
  return <WorkplacePolicy />;
}

export default WorkplacePolicyPage;
