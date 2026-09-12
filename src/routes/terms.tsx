import { createFileRoute } from "@tanstack/react-router";
import { Scale } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service · KhelGrid" },
      {
        name: "description",
        content:
          "The rules for using KhelGrid: accounts, trial applications, academy listings, payments, refunds and acceptable use.",
      },
      { property: "og:title", content: "Terms of Service · KhelGrid" },
      {
        property: "og:description",
        content:
          "Accounts, applications, academy listings, payments, refunds and acceptable use on KhelGrid.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/terms" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

const SECTIONS: Array<{ heading: string; body: string[] }> = [
  {
    heading: "1. Accepting these terms",
    body: [
      "By using khelgrid.com, creating an account, or submitting content, you agree to these terms. If you are under 18, a parent or guardian must accept them on your behalf, supervise your use, and manage your account. If you do not agree, do not use the service.",
    ],
  },
  {
    heading: "2. Beta service and availability",
    body: [
      "KhelGrid is an evolving beta service. Some listings, availability results, recommendations, notifications, social features and payment flows may be demonstrations, locally stored beta data, or dependent on third-party information. We may change, pause, or remove features without guaranteeing uninterrupted access.",
    ],
  },
  {
    heading: "3. Your account",
    body: [
      "Keep your login details private and your profile information accurate. You are responsible for activity on your account. We may suspend accounts that submit false performance data, impersonate others, or abuse the platform.",
    ],
  },
  {
    heading: "4. Trials, opportunities and listings",
    body: [
      "KhelGrid lists trials, venues, coaching and events from third parties. We may review an organizer, source, or listing, but a verification label describes the checks completed by KhelGrid and is not a guarantee that an event will happen or that a participant will be selected. We are not the organiser and do not guarantee selection, attendance, scheduling or outcomes.",
      "Never pay a selector, scout or coach in cash for guaranteed selection. Report any such request to khelgrid@gmail.com and we will remove the listing.",
    ],
  },
  {
    heading: "5. Payments, Pro and boosts",
    body: [
      "Paid features include per-trial unlocks, the Verified Sports CV, Pro subscriptions and academy listing boosts. Prices are shown in INR and include applicable taxes.",
      "Subscriptions renew until cancelled; cancel any time and access runs to the end of the paid period.",
    ],
  },
  {
    heading: "6. Refunds",
    body: [
      "Digital unlocks and boosts are non-refundable once delivered, except where a listing turns out to be fraudulent or is removed by us — in that case we refund in full. Email support@khelgrid.com within 14 days.",
    ],
  },
  {
    heading: "7. Acceptable use",
    body: [
      "Do not scrape the platform, resell listings, upload unlawful or abusive content, or attempt to bypass paywalls, verification or security controls.",
    ],
  },
  {
    heading: "8. Your content",
    body: [
      "You keep ownership of everything you upload. You grant us a limited, non-exclusive licence to host, display, and process it so we can run the service and show your profile to academies or communities you choose. Do not upload another person's private information, copyrighted material you cannot share, or claims you cannot support. We may remove content that violates these terms or our safety rules.",
    ],
  },
  {
    heading: "9. Advertising",
    body: [
      "KhelGrid is funded partly by advertising. Ads are labelled and separated from editorial and listing content. See our Privacy Policy for how advertising cookies work and how to change your choice.",
    ],
  },
  {
    heading: "10. Liability",
    body: [
      'The service is provided on an "as is" and "as available" basis. To the extent permitted by law, we are not liable for indirect losses, injury, travel costs, payment disputes, data loss, or missed opportunities arising from third-party trials, venues, organizers, coaches, community users, or unavailable features.',
    ],
  },
  {
    heading: "11. Changes and contact",
    body: [
      "We may update these terms; material changes will be posted here. Questions go to support@khelgrid.com. These terms are governed by the laws of India, subject to any mandatory consumer protections that apply to you.",
    ],
  },
];

function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <div className="flex items-center gap-3">
        <Scale className="h-6 w-6 text-primary" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Legal
        </p>
      </div>
      <h1 className="mt-3 font-heading text-3xl font-extrabold md:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: 5 August 2026</p>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.heading}>
            <h2 className="font-heading text-lg font-semibold">{s.heading}</h2>
            {s.body.map((p) => (
              <p key={p} className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Contact us at{" "}
        <a className="underline hover:text-foreground" href="mailto:support@khelgrid.com">
          support@khelgrid.com
        </a>
        .
      </p>
    </main>
  );
}
