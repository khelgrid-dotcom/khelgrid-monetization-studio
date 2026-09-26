import { Link } from "@tanstack/react-router";
import {
  Instagram,
  Youtube,
  Twitter,
  Mail,
  MapPin,
  ShieldCheck,
  Zap,
  Trophy,
  Search,
  Sparkles,
  Copyright,
  Scale,
  Clock,
} from "lucide-react";
import { CookieSettingsButton } from "@/components/ads";
import { NAV_ITEMS } from "@/config/nav";

/** Pain → cure strip. This is the "painkiller" positioning, not a nice-to-have. */
const PAIN_POINTS = [
  {
    icon: Search,
    pain: "Trials are hidden in WhatsApp groups",
    cure: "Every verified trial in one searchable grid",
  },
  {
    icon: ShieldCheck,
    pain: "Fake selectors & pay-to-play scams",
    cure: "Academy verification before a listing goes live",
  },
  {
    icon: Trophy,
    pain: "No proof of your performance",
    cure: "Verified Sports CV scouts actually trust",
  },
  {
    icon: Sparkles,
    pain: "Nobody tells you the next step",
    cure: "Start From Zero roadmaps + AI Guide, sport by sport",
  },
];

function pick(paths: string[]) {
  return paths
    .map((p) => NAV_ITEMS.find((i) => i.to === p))
    .filter((i): i is NonNullable<typeof i> => Boolean(i));
}

const COLUMNS: Array<{ title: string; items: ReturnType<typeof pick> }> = [
  {
    title: "Compete",
    items: pick([
      "/search",
      "/trials",
      "/opportunities",
      "/events",
      "/verify",
      "/talent-scanner",
      "/scout-portal",
    ]),
  },
  {
    title: "Play & train",
    items: pick(["/play", "/book", "/train", "/coaches", "/memberships", "/sports"]),
  },
  {
    title: "Learn",
    items: pick([
      "/start-from-zero",
      "/ai-guide",
      "/guides",
      "/blog",
      "/learning-hub",
      "/tools",
      "/resources",
    ]),
  },
  {
    title: "Grow",
    items: pick([
      "/academy",
      "/partner",
      "/careers",
      "/pricing",
      "/community",
      "/cities",
      "/mobile-app",
      "/dashboard",
    ]),
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/khelgrid?igsh=YmZmeHI1M2hyMHMw",
    icon: Instagram,
  },
  { label: "YouTube", href: "https://www.youtube.com/@khelgrid", icon: Youtube },
  { label: "X", href: "https://x.com/Khelgrid", icon: Twitter },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-card/40">
      {/* Painkiller strip */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <h2 className="font-heading text-lg font-semibold md:text-xl">
            Your talent isn&apos;t the problem. Access is.
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            KhelGrid kills the four things that quietly end Indian sporting careers — share it with
            the one player who deserves to be seen.
          </p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PAIN_POINTS.map(({ icon: Icon, pain, cure }) => (
              <li key={pain} className="rounded-2xl border border-border bg-background/60 p-4">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground line-through">
                  {pain}
                </p>
                <p className="mt-1 text-sm font-semibold">{cure}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Link columns */}
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            <Link to="/" className="font-heading text-xl font-extrabold text-gradient">
              KhelGrid
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              India&apos;s grid for sports trials, venues, coaching and verified athlete profiles.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" /> India · 16 cities in the current grid
            </p>
            <a
              href="mailto:khelgrid@gmail.com"
              className="mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Mail className="h-4 w-4 shrink-0" /> khelgrid@gmail.com
            </a>

            <Link
              to="/pricing"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Zap className="h-4 w-4" /> Go Pro — ₹499/mo
            </Link>

            <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-heading text-sm font-semibold">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* IPR & Copyright Compliance Footbar Section */}
      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="rounded-2xl border border-border/80 bg-background/80 p-5 md:p-6 shadow-xs backdrop-blur-xs">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Copyright className="h-4 w-4" />
                  </span>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    Intellectual Property Rights & Copyright Compliance
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Indian Copyright Act, 1957 · IT Rules 2021
                  </span>
                </div>
                <p className="max-w-4xl text-xs leading-relaxed text-muted-foreground">
                  All original platform software, design architecture, database compilations, and
                  the Verified Sports CV formats are proprietary intellectual property of KhelGrid.
                  Federation, league, and academy marks (e.g. AIFF, BCCI, SAI, BWF) are property of
                  their respective statutory owners and referenced strictly under nominative Fair
                  Dealing for athlete trial discovery and news reporting.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Link
                  to="/ipr-policy"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition hover:border-primary/50 hover:bg-accent"
                >
                  <Scale className="h-3.5 w-3.5 text-primary" />
                  Read Full IPR Policy
                </Link>
                <a
                  href="mailto:ipr@khelgrid.com?subject=Statutory%20IPR%20%2F%20Copyright%20Notice&body=Dear%20Nodal%20IPR%20Officer%2C%0A%0AI%20am%20reporting%20an%20alleged%20intellectual%20property%20matter%20under%20the%20Indian%20Copyright%20Act%201957.%0A%0AWork%2FTrademark%3A%0AURL(s)%3A%0ADetails%3A"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Report Infringement
                </a>
              </div>
            </div>

            <div className="mt-4 grid gap-3 border-t border-border/60 pt-3 text-[11px] text-muted-foreground sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Intermediary Safe Harbor under Section 79 IT Act</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>Expedited 36-hour statutory takedown response SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>
                  Nodal IPR Officer: <strong className="text-foreground">ipr@khelgrid.com</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {year} KhelGrid. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/about" className="hover:text-foreground">
              About
            </Link>
            <Link to="/contact" className="hover:text-foreground">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link to="/ipr-policy" className="font-semibold text-primary hover:underline">
              IPR & Copyright
            </Link>
            <Link to="/cancellation-policy" className="hover:text-foreground">
              Cancellation
            </Link>
            <Link to="/posh-policy" className="hover:text-foreground">
              POSH Policy
            </Link>
            <Link to="/editorial-policy" className="hover:text-foreground">
              Editorial
            </Link>
            <Link to="/verification-policy" className="hover:text-foreground">
              Verification
            </Link>
            <Link to="/correction-policy" className="hover:text-foreground">
              Corrections
            </Link>

            <a href="/sitemap.xml" className="hover:text-foreground">
              Sitemap
            </a>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
