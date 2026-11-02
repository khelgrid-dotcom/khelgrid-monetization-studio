import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  HeartHandshake,
  Laptop,
  Scale,
  Lock,
  GraduationCap,
  ShieldCheck,
  Heart,
  Cpu,
  Trophy,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Building,
  FileCheck2,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { buildSeoHead } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

const POLICY_SECTIONS = [
  {
    id: "equal-opportunity",
    number: "01",
    title: "Equal Opportunity and Inclusion",
    icon: Users,
    highlight: "Merit, diversity & equal opportunity for all",
    paragraphs: [
      "KhelGrid supports equal employment opportunities regardless of gender, age, disability, background, caste, religion, or personal identity. We believe that Indian sports is strengthened by diversity, and we actively cultivate an inclusive environment where individuals from all walks of life can bring their authentic selves to work.",
      "All employment decisions—including hiring, evaluation, promotion, compensation, and project allocation—are based solely on qualifications, demonstrated merit, role requirements, and performance.",
    ],
  },
  {
    id: "respectful-workplace",
    number: "02",
    title: "Respectful Workplace",
    icon: HeartHandshake,
    highlight: "Zero-tolerance for harassment, discrimination, or bullying",
    paragraphs: [
      "We maintain an uncompromising zero-tolerance approach towards harassment, discrimination, bullying, intimidation, and inappropriate workplace behaviour in any form—whether in person, on video calls, in team chats, or via email.",
      "Every team member, intern, contractor, and external collaborator is expected to treat colleagues, athletes, partners, and community members with dignity, kindness, and mutual respect at all times.",
    ],
  },
  {
    id: "flexible-remote-work",
    number: "03",
    title: "Flexible and Remote Working",
    icon: Laptop,
    highlight: "Empowering talent across cities & sports hubs",
    paragraphs: [
      "KhelGrid supports flexible working arrangements where operational requirements permit. Because our grassroots sporting mission extends across every district, state, and stadium in India, remote and hybrid collaboration is utilized to empower talent regardless of geographic location.",
      "Team members working remotely are trusted with autonomy while being held to clear standards of responsiveness, transparency, delivery ownership, and team communication.",
    ],
  },
  {
    id: "professional-ethics",
    number: "04",
    title: "Professional Ethics",
    icon: Scale,
    highlight: "Honesty, accountability & institutional integrity",
    paragraphs: [
      "All team members are expected to demonstrate honesty, accountability, transparency, and the highest standards of professionalism in their work, communications, and business interactions.",
      "We strictly prohibit conflicts of interest, bribery, unauthorized favors, misrepresentation of platform data, and any actions that could undermine the integrity of KhelGrid or compromise trust with athletes, academies, and sports bodies.",
    ],
  },
  {
    id: "data-privacy-confidentiality",
    number: "05",
    title: "Data Privacy and Confidentiality",
    icon: Lock,
    highlight: "Safeguarding athlete records, proprietary algorithms & user trust",
    paragraphs: [
      "We expect everyone working with KhelGrid to exercise utmost care in safeguarding confidential business information, personal athlete records, intellectual property, proprietary software, and platform security systems.",
      "Athlete data—including date of birth, contact details, medical history, performance metrics, and scouting reports—must be handled in strict accordance with KhelGrid's Privacy Policy, IT Act 2000 provisions, and applicable Indian data protection standards.",
    ],
  },
  {
    id: "learning-development",
    number: "06",
    title: "Learning and Development",
    icon: GraduationCap,
    highlight: "Continuous improvement & individual professional growth",
    paragraphs: [
      "We encourage continuous learning, skill development, creative experimentation, and cross-functional knowledge sharing. Building digital infrastructure for grassroots sports demands fresh thinking and technical excellence.",
      "We aim to create meaningful opportunities for individuals to expand their capabilities, take on new responsibilities, and advance their professional careers.",
    ],
  },
  {
    id: "health-safety",
    number: "07",
    title: "Health and Safety",
    icon: Heart,
    highlight: "Promoting physical wellness, mental health & sustainable balance",
    paragraphs: [
      "As a sports network, we recognize that wellness is foundational. KhelGrid is committed to maintaining a safe, healthy working environment and actively promoting both physical and mental well-being.",
      "We encourage healthy work-life boundaries, manageable workloads, and open dialogue around mental health, ensuring team members have the support they need to thrive sustainably.",
    ],
  },
  {
    id: "posh-compliance",
    number: "08",
    title: "Prevention of Sexual Harassment (POSH)",
    icon: ShieldCheck,
    highlight: "Statutory compliance under the POSH Act 2013",
    paragraphs: [
      "KhelGrid is deeply committed to preventing sexual harassment and upholding a safe, secure, and supportive workplace for everyone. Applicable Indian workplace laws and POSH requirements (under the Sexual Harassment of Women at Workplace Act, 2013) are strictly followed.",
      "Any individual facing misconduct has access to a secure, fair, and confidential grievance mechanism through our dedicated Internal Complaints Committee (ICC). For full statutory procedures, please review our comprehensive POSH & Safe Sports Policy.",
    ],
    actionLink: {
      text: "Read Dedicated POSH Policy",
      href: "/posh-policy",
    },
  },
  {
    id: "responsible-technology",
    number: "09",
    title: "Responsible Use of Technology",
    icon: Cpu,
    highlight: "Ethical AI, digital asset protection & cybersecurity",
    paragraphs: [
      "Team members must use company systems, digital tools, communication channels, generative AI technologies, and business resources responsibly, ethically, and securely.",
      "The deployment of AI tools must comply with intellectual property standards, data confidentiality rules, and ethical fairness—ensuring that automated tools support, rather than compromise, authentic athlete representation and verification integrity.",
    ],
  },
  {
    id: "our-commitment",
    number: "10",
    title: "Our Commitment",
    icon: Trophy,
    highlight: "Building a better sports ecosystem starts with building a better workplace",
    paragraphs: [
      "KhelGrid aims to build an enduring workplace where people are respected, ideas are valued, accountability is celebrated, and everyone has a genuine opportunity to contribute to India's sporting ecosystem.",
      "By holding ourselves to these principles daily, we ensure that the team building opportunities for India's athletes operates with the exact same dedication, fairness, and sportsmanship we champion across the country.",
    ],
  },
];

function WorkplacePolicyPage() {
  const [copied, setCopied] = useState(false);
  const canonicalUrl = "https://khelgrid.com/workplace-policy";

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(canonicalUrl)
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
    <div className="min-h-screen bg-background">
      {/* Top Banner / Hero */}
      <section className="border-b border-border bg-gradient-to-b from-card/80 to-background py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Link
              to="/"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition"
            >
              Home
            </Link>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs font-semibold text-primary">Company Policies</span>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs text-foreground">Workplace Policy</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/25 font-bold px-3 py-1 text-xs"
                >
                  <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                  Official Workplace Policy
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-muted text-muted-foreground border-border font-medium px-2.5 py-0.5 text-xs"
                >
                  Published &amp; Active
                </Badge>
              </div>

              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                KhelGrid – Workplace Policy
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed pt-1">
                At KhelGrid, we believe that innovation, integrity, inclusion, and collaboration are
                essential to building a better sports ecosystem in India.
              </p>

              <p className="text-sm md:text-base text-foreground font-medium leading-relaxed">
                We are committed to creating a professional, respectful, and inclusive working
                environment where employees, interns, contractors, and collaborators can contribute,
                learn, and grow.
              </p>
            </div>

            {/* Quick Share / LinkedIn Utility Card */}
            <div className="shrink-0 w-full md:w-72 rounded-2xl border border-border bg-card/60 p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <FileCheck2 className="h-4 w-4 text-primary" />
                <span>LinkedIn Company Page Link</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Official canonical link for employer verification and LinkedIn company policy
                documentation.
              </p>
              <div className="rounded-lg bg-muted/60 p-2 font-mono text-[11px] text-foreground truncate select-all">
                {canonicalUrl}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Policy Link</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Policy Content */}
      <main className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        {/* Core Principle Quote Card */}
        <div className="mb-12 rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Our Guiding Principle
          </p>
          <blockquote className="font-heading text-lg md:text-2xl font-extrabold text-foreground tracking-tight">
            &ldquo;Building a better sports ecosystem starts with building a better
            workplace.&rdquo;
          </blockquote>
          <p className="mt-2 text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto">
            Integrity on the field begins with integrity within our organization. We set the
            standard for respect, merit, and transparency.
          </p>
        </div>

        {/* Policy Sections Grid */}
        <div className="space-y-6">
          {POLICY_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <article
                key={sec.id}
                id={sec.id}
                className="rounded-2xl border border-border bg-card p-6 md:p-7 shadow-xs transition hover:border-border/80"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                        Section {sec.number}
                      </span>
                      <h2 className="font-heading text-lg md:text-xl font-bold text-foreground">
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
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Official Governance & Contact Box */}
        <div className="mt-12 rounded-2xl border border-border bg-muted/20 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-base font-bold text-foreground">
                  Governance &amp; Workplace Inquiries
                </h3>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground max-w-xl leading-relaxed">
                This workplace policy serves as the official standard for KhelGrid team members,
                prospective candidates, and public stakeholders. For employment verification, HR
                queries, or grievance redressal, reach out directly.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-foreground">
                <a
                  href="mailto:khelgrid@gmail.com"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                >
                  <Mail className="h-4 w-4" />
                  khelgrid@gmail.com
                </a>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">Website:</span>
                <a href="https://khelgrid.com" className="hover:text-primary hover:underline">
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
        </div>

        {/* Related Policies Navigation Bar */}
        <div className="mt-10 border-t border-border pt-6">
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
        </div>
      </main>
    </div>
  );
}
export default WorkplacePolicyPage;
