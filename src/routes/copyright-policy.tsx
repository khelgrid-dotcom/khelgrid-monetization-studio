import { createFileRoute } from "@tanstack/react-router";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/copyright-policy")({
  head: () =>
    buildSeoHead({
      title: "Copyright & Intellectual Property Rights (IPR) Policy · KhelGrid",
      description:
        "Official Copyright and IPR statement for KhelGrid. Governed by the Indian Copyright Act 1957, DMCA provisions, and statutory notice-and-takedown procedures.",
      canonicalPath: "/ipr-policy",
      type: "website",
    }),
  beforeLoad: ({ location }) => {
    // If visited directly, redirect cleanly to canonical /ipr-policy
    if (location.pathname === "/copyright-policy") {
      throw {
        redirect: {
          to: "/ipr-policy",
          replace: true,
        },
      };
    }
  },
  component: () => null,
});
