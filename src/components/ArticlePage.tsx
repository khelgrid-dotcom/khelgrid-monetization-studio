import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, CalendarDays, Clock, ListTree } from "lucide-react";
import type { Block, ContentPage } from "@/content/types";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="mt-4 text-[15px] leading-7 text-muted-foreground">{block.text}</p>;
    case "list":
      return (
        <ul className="mt-4 space-y-2">
          {block.items.map((i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-7 text-muted-foreground">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{i}</span>
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="mt-4 space-y-3">
          {block.items.map((i, idx) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card/50 p-4"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {idx + 1}
              </span>
              <span className="text-[15px] leading-7">{i}</span>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead className="bg-secondary/60">
              <tr>
                {block.head.map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-border">
                  {row.map((cell, i) => (
                    <td key={i} className="px-4 py-3 text-muted-foreground">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "note":
      return (
        <p className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm leading-6">
          {block.text}
        </p>
      );
  }
}

/**
 * Renders a long-form editorial page from structured content: headings,
 * paragraphs, tables, FAQ and Article + FAQPage structured data.
 */
export function ArticlePage({ page }: { page: ContentPage }) {
  const sections = page.sections.map((s) => ({ ...s, id: slugify(s.heading) }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: page.title,
        description: page.description,
        dateModified: page.updated,
        author: { "@type": "Organization", name: "KhelGrid" },
        publisher: { "@type": "Organization", name: "KhelGrid" },
      },
      ...(page.faqs.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: page.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">
        {page.eyebrow}
      </Badge>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{page.title}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" /> Updated{" "}
          {new Date(page.updated).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {page.readMins} min read
        </span>
        <span>By the KhelGrid editorial team</span>
      </div>

      {page.intro.map((p) => (
        <p key={p} className="mt-5 text-[15px] leading-7">
          {p}
        </p>
      ))}

      <nav
        aria-label="On this page"
        className="mt-8 rounded-2xl border border-border bg-card/50 p-5"
      >
        <p className="flex items-center gap-2 text-sm font-semibold">
          <ListTree className="h-4 w-4 text-primary" /> On this page
        </p>
        <ol className="mt-3 space-y-1.5">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-sm text-muted-foreground hover:text-foreground">
                {s.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {sections.map((s) => (
        <section key={s.id} id={s.id} className="mt-10 scroll-mt-24">
          <h2 className="font-heading text-xl font-semibold sm:text-2xl">{s.heading}</h2>
          {s.blocks.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </section>
      ))}

      {page.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading text-xl font-semibold sm:text-2xl">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="mt-3">
            {page.faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-95">
          <Link to={page.cta?.to ?? "/search"}>
            {page.cta?.label ?? "Find a trial near you"} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/guides">Read the guides</Link>
        </Button>
      </div>

      <p className="mt-8 text-xs leading-6 text-muted-foreground">
        Spotted something out of date, or a trial listing that looks wrong? Write to us at{" "}
        <a className="underline" href="mailto:khelgrid@gmail.com">
          khelgrid@gmail.com
        </a>{" "}
        and we will correct it. KhelGrid is an information and booking platform — it is not a
        selection authority, and no listing on this site guarantees selection.
      </p>
    </main>
  );
}
