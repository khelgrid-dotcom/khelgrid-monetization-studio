import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Users,
  HeartHandshake,
  Laptop,
  Scale,
  Lock,
  GraduationCap,
  Heart,
  ShieldCheck,
  Cpu,
  Trophy,
  Mail,
  Copy,
  Check,
  Building,
  FileCheck2,
  ExternalLink,
  Briefcase,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  WORKPLACE_POLICY_SECTIONS,
  WORKPLACE_POLICY_URL,
  WORKPLACE_CONTACT_EMAIL,
  WORKPLACE_PRINCIPLE,
} from "@/config/workplace-policy";

export interface WorkplacePolicyProps {
  /** Optional container class name */
  className?: string;
  /** Whether to show the breadcrumb trail (default: true) */
  showBreadcrumbs?: boolean;
  /** Whether to show the copy link / LinkedIn share card (default: true) */
  showShareCard?: boolean;
  /** Whether to show the related policy navigation links (default: true) */
  showRelatedLinks?: boolean;
}

/**
 * Accessible, beautifully styled React component rendering KhelGrid's Workplace Policy.
 * Used on the dedicated /workplace-policy route, LinkedIn Company Page integration,
 * and anywhere employer compliance or workplace culture is highlighted.
 */
export function WorkplacePolicy({
  className = "",
  showBreadcrumbs = true,
  showShareCard = true,
  showRelatedLinks = true,
}: WorkplacePolicyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(WORKPLACE_POLICY_URL)
      .then(() => {
        setCopied(true);
        toast.success("Policy link copied to clipboard!", {
          description: "Use this URL on your LinkedIn Company Page.",
        });
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  return (
    <article
      className={`min-h-screen bg-background ${className}`}
      aria-labelledby="workplace-policy-heading"
    >
      {/* Header & Hero Section */}
      <header className="border-b border-border bg-gradient-to-b from-card/80 to-background py-10 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          {showBreadcrumbs && (
            <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2">
              <Link
                to="/"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition"
              >
                Home
              </Link>
              <span className="text-xs text-muted-foreground" aria-hidden="true">
                /
              </span>
              <span className="text-xs font-semibold text-primary">Company Policies</span>
              <span className="text-xs text-muted-foreground" aria-hidden="true">
                /
              </span>
              <span className="text-xs text-foreground" aria-current="page">
                Workplace Policy
              </span>
            </nav>
          )}

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/25 font-bold px-3 py-1 text-xs"
                >
                  <Briefcase className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  Official Workplace Policy
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-muted text-muted-foreground border-border font-medium px-2.5 py-0.5 text-xs"
                >
                  Published &amp; Active
                </Badge>
              </div>

              <h1
                id="workplace-policy-heading"
                className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl"
              >
                KhelGrid – Workplace Policy
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed pt-1">
                At KhelGrid, we believe that innovation, integrity, inclusion and collaboration are
                essential to building a better sports ecosystem in India.
              </p>

              <p className="text-sm md:text-base text-foreground font-medium leading-relaxed">
                We are committed to creating a professional, respectful and inclusive working
                environment where employees, interns, contractors and collaborators can contribute,
                learn and grow.
              </p>
            </div>

            {/* Quick Share / LinkedIn Utility Card */}
            {showShareCard && (
              <aside
                aria-label="LinkedIn policy link card"
                className="shrink-0 w-full md:w-72 rounded-2xl border border-border bg-card/70 p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <FileCheck2 className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>LinkedIn Company Page Link</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Official canonical URL for employer verification and LinkedIn company policy
                  documentation.
                </p>
                <div className="rounded-lg bg-muted/60 p-2 font-mono text-[11px] text-foreground truncate select-all">
                  {WORKPLACE_POLICY_URL}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  aria-live="polite"
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy Policy Link</span>
                    </>
                  )}
                </Button>
              </aside>
            )}
          </div>
        </div>
      </header>

      {/* Main Policy Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        {/* Core Principle Quote Banner */}
        <section
          aria-label="Core Guiding Principle"
          className="mb-12 rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Our Guiding Principle
          </p>
          <blockquote className="font-heading text-lg md:text-2xl font-extrabold text-foreground tracking-tight">
            &ldquo;{WORKPLACE_PRINCIPLE}&rdquo;
          </blockquote>
          <p className="mt-2 text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto">
            Integrity on the field begins with integrity within our organization. We set the
            standard for respect, merit, and transparency.
          </p>
        </section>

        {/* Policy Sections Grid */}
        <section aria-label="Policy Clauses" className="space-y-6">
          {WORKPLACE_POLICY_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <section
                key={sec.id}
                id={sec.id}
                aria-labelledby={`sec-heading-${sec.id}`}
                className="rounded-2xl border border-border bg-card p-6 md:p-7 shadow-xs transition hover:border-border/80"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                        Section {sec.number}
                      </span>
                      <h2
                        id={`sec-heading-${sec.id}`}
                        className="font-heading text-lg md:text-xl font-bold text-foreground"
                      >
                        {sec.title}
                      </h2>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-secondary/60 px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground self-start">
                    {sec.highlight}
                  </span>
                </div>

                <div className="space-y-3 pt-2 text-sm text-muted-foreground leading-relaxed sm:pl-13">
                  {sec.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}

                  {sec.actionLink && (
                    <div className="pt-2">
                      <Link
                        to={sec.actionLink.href}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                      >
                        <span>{sec.actionLink.text}</span>
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </section>

        {/* Governance & Contact Card */}
        <section
          aria-label="Workplace Governance and Contact"
          className="mt-12 rounded-2xl border border-border bg-muted/20 p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="font-heading text-base font-bold text-foreground">
                  Governance &amp; Workplace Inquiries
                </h3>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground max-w-xl leading-relaxed">
                This workplace policy serves as the official standard for KhelGrid team members,
                prospective candidates, and public stakeholders. For employment verification, HR
                queries, or grievance redressal, contact our team.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-foreground">
                <a
                  href={`mailto:${WORKPLACE_CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {WORKPLACE_CONTACT_EMAIL}
                </a>
                <span className="text-muted-foreground" aria-hidden="true">
                  ·
                </span>
                <span className="text-muted-foreground">Website:</span>
                <a
                  href="https://khelgrid.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-primary hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                  https://khelgrid.com
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link
                to="/careers"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90"
              >
                Join KhelGrid Team
              </Link>
              <Link
                to="/posh-policy"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition hover:border-primary/50"
              >
                View POSH Policy
              </Link>
            </div>
          </div>
        </section>

        {/* Related Policies Navigation Bar */}
        {showRelatedLinks && (
          <nav
            aria-label="Related Compliance Policies"
            className="mt-10 border-t border-border pt-6"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Related KhelGrid Compliance &amp; Legal Policies
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Link
                to="/posh-policy"
                className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
              >
                POSH Policy
              </Link>
              <Link
                to="/privacy"
                className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
              >
                Terms of Service
              </Link>
              <Link
                to="/ipr-policy"
                className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
              >
                IPR &amp; Copyright Policy
              </Link>
              <Link
                to="/editorial-policy"
                className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
              >
                Editorial Policy
              </Link>
              <Link
                to="/verification-policy"
                className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
              >
                Verification Policy
              </Link>
            </div>
          </nav>
        )}
      </main>
    </article>
  );
}

export default WorkplacePolicy;
