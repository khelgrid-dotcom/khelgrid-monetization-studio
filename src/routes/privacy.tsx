import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { CookieSettingsButton } from "@/components/ads";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · KhelGrid" },
      {
        name: "description",
        content:
          "How KhelGrid collects, uses and protects athlete data, including cookies, Google Analytics and Google AdSense advertising.",
      },
      { property: "og:title", content: "Privacy Policy · KhelGrid" },
      {
        property: "og:description",
        content:
          "Our full privacy policy: data we collect, cookies, third-party advertising partners and your choices.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/privacy" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

const SECTIONS: Array<{ heading: string; body: string[] }> = [
  {
    heading: "1. Who we are",
    body: [
      'KhelGrid ("we", "us") operates khelgrid.com, an India-focused platform for discovering sports opportunities, venues, coaching resources and athlete guidance. KhelGrid is currently delivered as a beta product, so some features use browser storage or demonstration data rather than a live account database. For privacy questions, contact privacy@khelgrid.com.',
    ],
  },
  {
    heading: "2. Information we collect",
    body: [
      "Account details you give us: name, email, phone, city, sport, age group and the contents of your Sports CV.",
      "Usage data collected automatically: pages viewed, search terms, device and browser type, approximate location derived from your IP address, and referring website.",
      "Browser-only beta data: saved opportunities, participation check-ins, community beta posts, settings and advertising choices may be stored in local storage on your device. Clearing browser data removes this local copy.",
      "Payment data for Pro subscriptions, trial unlocks and academy boosts is processed by our payment partners. We do not intentionally store your full card number.",
    ],
  },
  {
    heading: "3. How we use it",
    body: [
      "To show you relevant trials, venues and coaching near you; to verify academies and listings; to operate your account and process payments; to send service updates you asked for; to detect fraud and abuse; and to measure and improve the product.",
    ],
  },
  {
    heading: "4. Cookies and similar technologies",
    body: [
      "We use strictly necessary cookies to keep you signed in and remember your preferences, analytics cookies to understand how the site is used, and advertising cookies to fund free access to KhelGrid.",
      "You can change or withdraw your advertising choice at any time using the Cookie settings control on this page or in the footer.",
    ],
  },
  {
    heading: "5. Advertising and Google AdSense",
    body: [
      "Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites.",
      "Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.",
      "You may opt out of personalised advertising by visiting Google Ads Settings, or opt out of a third-party vendor's use of cookies for personalised advertising at aboutads.info.",
      "If you decline personalised ads on KhelGrid, we instruct Google to serve non-personalised ads only.",
    ],
  },
  {
    heading: "6. Analytics",
    body: [
      "We use Google Analytics 4 to understand traffic and feature usage. Depending on your consent and Google's configuration, analytics may use pseudonymous identifiers and device information. You can decline analytics or withdraw advertising consent through Cookie Settings; essential site functions may still use local storage.",
    ],
  },
  {
    heading: "7. Sharing your data",
    body: [
      "We share the parts of your profile you choose to publish with academies and scouts you apply to. We also share data with service providers (hosting, analytics, advertising, payments) under contract, and where required by law.",
      "We never sell your personal data.",
    ],
  },
  {
    heading: "8. Data retention and security",
    body: [
      "We keep account data while your account is active and for as long as needed to meet legal obligations. Data is encrypted in transit, and access is limited to staff who need it.",
    ],
  },
  {
    heading: "9. Retention and security",
    body: [
      "We keep account and support data only for as long as it is needed to provide the service, resolve disputes, prevent abuse, or meet legal obligations. Browser-only beta data remains on your device until you remove it or clear site data.",
      "We use reasonable administrative and technical safeguards, including encrypted connections in transit and access controls. No online service can promise absolute security, so do not send passwords, payment card numbers, or unnecessary identity documents by email.",
    ],
  },
  {
    heading: "10. Your rights and choices",
    body: [
      "Depending on where you live and applicable law, you may request access to, correction of, deletion of, or information about the personal data we hold about you. You may also withdraw consent for advertising or marketing. Email privacy@khelgrid.com from the address connected to your request; we may ask for reasonable verification and aim to respond within 30 days.",
      "You can manage personalised advertising through Cookie Settings on this site and Google's Ads Settings. Declining optional cookies does not remove advertisements entirely; it changes how they are selected.",
    ],
  },
  {
    heading: "11. Children and young athletes",
    body: [
      "KhelGrid is intended to be used with appropriate adult support. A parent or guardian should create and manage an account for anyone under 18, supervise travel and payments, and review organizer communications. Tell us if you believe a child has provided personal information without appropriate consent.",
    ],
  },
  {
    heading: "12. International services and providers",
    body: [
      "KhelGrid may use hosting, analytics, advertising, payment, email, and security providers that process information in India or other countries where those providers operate. We expect providers to protect information under their contracts and applicable law.",
    ],
  },
  {
    heading: "13. Changes to this policy",
    body: [
      "We may update this policy as the product evolves, including when new account, payment, community, or notification features launch. Material changes will be announced on this page with a new effective date.",
    ],
  },
];

function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Legal
        </p>
      </div>
      <h1 className="mt-3 font-heading text-3xl font-extrabold md:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: 5 August 2026</p>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        This policy explains what data KhelGrid collects, why we collect it, and the control you
        have over it — including the cookies used by our advertising and analytics partners.
      </p>

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

      <div className="mt-10 rounded-2xl border border-border bg-card/50 p-5">
        <h2 className="font-heading text-base font-semibold">Manage your ad choices</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Change between personalised and non-personalised advertising at any time.
        </p>
        <div className="mt-3">
          <CookieSettingsButton className="text-sm" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Questions? Email{" "}
          <a className="underline hover:text-foreground" href="mailto:privacy@khelgrid.com">
            privacy@khelgrid.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
