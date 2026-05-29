import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/verify")({
  head: () => ({ meta: [{ title: "Verify · KhelGrid" }, { name: "description", content: "Get your KhelGrid Verified badge with Aadhaar and academy-attested stats." }] }),
  component: () => (
    <ComingSoon
      icon={ShieldCheck}
      eyebrow="Trust layer"
      title="Get Verified"
      description="The blue tick for athletes. Aadhaar-verified identity, academy-attested stats, and a tamper-proof QR on your Sports CV."
      bullets={[
        "Aadhaar e-KYC in under 2 minutes",
        "Academy attestation for trial results",
        "Anti-fraud QR on every CV download",
        "Scouts trust verified profiles 6× more",
      ]}
      cta={{ to: "/dashboard", label: "Unlock Sports CV" }}
    />
  ),
});
