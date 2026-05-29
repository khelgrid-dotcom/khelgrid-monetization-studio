import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";
import { Smartphone } from "lucide-react";

export const Route = createFileRoute("/mobile-app")({
  head: () => ({ meta: [{ title: "Mobile App · KhelGrid" }, { name: "description", content: "KhelGrid on iOS and Android — apply on the go." }] }),
  component: () => (
    <ComingSoon
      icon={Smartphone}
      eyebrow="iOS · Android"
      title="KhelGrid Mobile"
      description="The full KhelGrid experience in your pocket. One-tap apply, live trial reminders, Talent Scanner camera tests, and offline Sports CV."
      bullets={[
        "Push alerts for new trials in your city",
        "Talent Scanner camera tests",
        "Offline Sports CV download",
        "UPI quick-pay for applications",
      ]}
    />
  ),
});
