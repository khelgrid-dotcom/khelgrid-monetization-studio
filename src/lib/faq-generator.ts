// Deterministic FAQ generator for category landing pages.
// Builds a large bank of question/answer templates from category metadata,
// then slices a non-overlapping window per page so paginated URLs never
// repeat the same FAQ — improving long-tail SEO and avoiding duplicate
// content penalties.

export interface Faq {
  q: string;
  a: string;
}

export interface FaqContext {
  /** Display label, e.g. "Trial prep" or "Calculator". */
  category: string;
  /** URL slug, e.g. "trial-prep". */
  slug: string;
  /** Singular noun for items in this category, e.g. "guide", "tool". */
  noun: string;
  /** Plural noun, e.g. "guides", "tools". */
  nounPlural: string;
  /** Total items in the category across all pages. */
  totalCount: number;
  /** Items currently shown on this page (used to reference titles). */
  pageItemTitles: string[];
  /** Current page number (1-indexed). */
  page: number;
  /** Total pages available. */
  totalPages: number;
  /** Domain label, defaults to "KhelGrid". */
  brand?: string;
}

/** Full FAQ bank — keep large enough that pagination never wraps. */
function buildFaqBank(ctx: FaqContext): Faq[] {
  const {
    category,
    noun,
    nounPlural,
    totalCount,
    pageItemTitles,
    brand = "KhelGrid",
  } = ctx;
  const c = category.toLowerCase();
  const cN = category;
  const featured = pageItemTitles[0] ?? `${cN} ${noun}`;
  const secondary = pageItemTitles[1] ?? featured;

  return [
    {
      q: `What is the best ${c} ${noun} on ${brand} right now?`,
      a: `Our editors currently rank "${featured}" as the top ${c} ${noun} on ${brand}. It is reviewed against ${totalCount} other ${c} ${nounPlural} every month and updated whenever Indian trial cycles, federation rules or athlete feedback change.`,
    },
    {
      q: `How many ${c} ${nounPlural} does ${brand} publish?`,
      a: `${brand} maintains ${totalCount} live ${c} ${nounPlural}, each tagged by sport, city and athlete level so you can filter to exactly what matches your trial timeline.`,
    },
    {
      q: `Are the ${c} ${nounPlural} free to use?`,
      a: `Yes — every ${c} ${noun} listed here is free. You only pay if you choose to apply to a paid trial, unlock a premium ${noun}, or upgrade to ${brand} Pro for coach-shared dashboards.`,
    },
    {
      q: `Who creates the ${c} ${nounPlural} on ${brand}?`,
      a: `${cN} ${nounPlural} are produced by ex-athletes, certified coaches and selectors, then fact-checked by the ${brand} editorial team before publishing. Each ${noun} lists its author and last-reviewed date.`,
    },
    {
      q: `How often is each ${c} ${noun} updated?`,
      a: `Every ${c} ${noun} is reviewed at least once per quarter. High-traffic pieces like "${featured}" are revisited monthly to reflect new trial windows, scholarship deadlines and federation announcements.`,
    },
    {
      q: `Can I use these ${c} ${nounPlural} on a mobile phone or 2G network?`,
      a: `Yes. Every ${c} ${noun} on ${brand} is mobile-first, loads on slow networks and stays usable offline once opened in the ${brand} app — built for tier-2 and tier-3 India.`,
    },
    {
      q: `Which Indian sports do the ${c} ${nounPlural} cover?`,
      a: `${cN} ${nounPlural} on ${brand} span cricket, football, badminton, athletics, hockey, kabaddi, wrestling, boxing and 8+ more disciplines — wherever Indian athletes have an active trial pathway.`,
    },
    {
      q: `Is "${featured}" suitable for first-time trialists?`,
      a: `Yes — "${featured}" is written so a first-time trialist with no academy background can apply it in the same week. It pairs naturally with "${secondary}" if you want a deeper run-up.`,
    },
    {
      q: `How is the ${c} ${noun} ranking decided?`,
      a: `Ranking blends real athlete outcomes (selections, scholarships, callbacks), expert review scores from our coach panel, and freshness. Pay-to-rank is not allowed inside the ${c} ${noun} list.`,
    },
    {
      q: `Can parents and coaches use these ${c} ${nounPlural} with their athletes?`,
      a: `Yes. Parents get plain-language summaries and checklists; coaches on ${brand} Pro can share any ${c} ${noun} with their squad, track who completed it and export PDF reports for selectors.`,
    },
    {
      q: `Do ${c} ${nounPlural} include scholarship and funding information?`,
      a: `Where relevant, yes. Each ${c} ${noun} flags whether the underlying trial has a Khelo India, SAI, state-board or private scholarship attached, with eligibility rules summarised in plain English.`,
    },
    {
      q: `How do I pick the right ${c} ${noun} for my age group?`,
      a: `Every ${c} ${noun} is tagged with an age band (U-12 to Senior). Filter by your age first, then by sport, then by city — the top three results will be the closest fit for your current trial window.`,
    },
    {
      q: `Are ${c} ${nounPlural} available in Indian languages other than English?`,
      a: `Hindi versions are live for the most-read ${c} ${nounPlural}, with Tamil, Marathi and Bengali rolling out next. Toggle the language switcher on any ${noun} page to see what is available.`,
    },
    {
      q: `What if I cannot find the ${c} ${noun} I need?`,
      a: `Request it. ${brand}'s editorial desk publishes 20+ new ${nounPlural} every month based on athlete requests, and a missing-${noun} report is the single biggest input we use for what to build next.`,
    },
    {
      q: `How do ${c} ${nounPlural} on ${brand} compare to YouTube tutorials?`,
      a: `Where YouTube optimises for watch-time, ${brand} ${c} ${nounPlural} optimise for selection rate. Each ${noun} ends with a checklist or measurable benchmark, not just a video — so you know exactly what to do before your next trial.`,
    },
    {
      q: `Can I save and revisit a ${c} ${noun} later?`,
      a: `Yes — sign in once and any ${c} ${noun} you open is auto-saved to your profile, synced across devices, and resurfaced two days before the trial it relates to.`,
    },
  ];
}

/**
 * Generate a stable, page-unique slice of FAQs so no two paginated URLs
 * share the same questions. Wraps around the bank only when total pages
 * exceed available unique windows.
 */
export function generateFaqs(ctx: FaqContext, perPage = 5): Faq[] {
  const bank = buildFaqBank(ctx);
  if (bank.length === 0) return [];
  const start = ((ctx.page - 1) * perPage) % bank.length;
  const out: Faq[] = [];
  for (let i = 0; i < perPage && i < bank.length; i++) {
    out.push(bank[(start + i) % bank.length]);
  }
  return out;
}

export function faqsToJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
