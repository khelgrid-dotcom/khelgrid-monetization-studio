import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [{ title: "Verify · KhelGrid" }, { name: "description", content: "Learn how KhelGrid plans to verify athlete identity and performance records." }, { name: "robots", content: "noindex,follow" }] }),
  component: () => (
    <ComingSoon
      icon={ShieldCheck}
      eyebrow="Trust layer"
      title="Get Verified"
      description="A planned verification layer for athlete identity, academy-attested results, and a shareable Sports CV record. Availability and verification requirements will be shown before you submit documents."
      bullets={[
        "Clear identity and document requirements",
        "Academy attestation for trial results",
        "A shareable record with verification context",
        "A clear verification record for academies and scouts",
      ]}
      cta={{ to: "/dashboard", label: "Unlock Sports CV" }}
    />
  ),
});
