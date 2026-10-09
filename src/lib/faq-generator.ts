// Deterministic FAQ generator for category landing pages.
// Builds a large bank of question/answer templates from category metadata,
// then slices a non-overlapping window per page so paginated URLs never
// repeat the same FAQ — improving long-tail SEO and avoiding duplicate
// content penalties.
//
// Generated FAQ sets are cached by context hash so JSON-LD and accordion
// markup re-render instantly on repeat visits without recomputing the bank.

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
      a: `"${featured}" is one of the ${totalCount} ${c} ${nounPlural} currently listed on ${brand}. Use the details, sources and your own situation to decide whether it is a good fit; KhelGrid does not guarantee that one item is best for every athlete.`,
    },
    {
      q: `How many ${c} ${nounPlural} does ${brand} publish?`,
      a: `${brand} maintains ${totalCount} live ${c} ${nounPlural}, each tagged by sport, city and athlete level so you can filter to exactly what matches your trial timeline.`,
    },
    {
      q: `Are the ${c} ${nounPlural} free to use?`,
      a: `The guide or listing can be read without paying. Any separate application, venue, organizer, subscription, or other fee should be shown clearly before a user commits, and should be confirmed with the relevant provider.`,
    },
    {
      q: `Who creates the ${c} ${nounPlural} on ${brand}?`,
      a: `${brand} publishes these pages as practical editorial guidance and opportunity context. We identify the source used when one is available, distinguish organizer information from our own explanation, and welcome corrections when details change.`,
    },
    {
      q: `How often is each ${c} ${noun} updated?`,
      a: `Dates, fees, eligibility and event rules can change. Check the page's source status and confirm time-sensitive details with the organizer or official body before acting.`,
    },
    {
      q: `Can I use these ${c} ${nounPlural} on a mobile phone or 2G network?`,
      a: `The pages are designed to be readable on mobile. Availability depends on your connection and browser; do not assume that a page is available offline or that an app feature is live.`,
    },
    {
      q: `Which Indian sports do the ${c} ${nounPlural} cover?`,
      a: `${cN} ${nounPlural} on ${brand} span cricket, football, badminton, athletics, hockey, kabaddi, wrestling, boxing and 8+ more disciplines — wherever Indian athletes have an active trial pathway.`,
    },
    {
      q: `Is "${featured}" suitable for first-time trialists?`,
      a: `It may be useful for a first-time athlete, but eligibility and preparation needs vary. Read the requirements, ask a qualified coach where appropriate, and use "${secondary}" as additional background rather than a promise of readiness.`,
    },
    {
      q: `How is the ${c} ${noun} ranking decided?`,
      a: `${brand} does not present these pages as a universal ranking. Compare relevance, source status, date, eligibility and practical fit instead of treating placement on a page as an endorsement.`,
    },
    {
      q: `Can parents and coaches use these ${c} ${nounPlural} with their athletes?`,
      a: `Yes. Parents and coaches can use the plain-language explanations as a starting point, but they should adapt advice to the athlete and confirm specialist, medical or federation requirements independently.`,
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
      a: `The current page is written in English. If you need help understanding an eligibility or safety detail, ask the organizer or a trusted adult or coach rather than relying on an automated translation for an important decision.`,
    },
    {
      q: `What if I cannot find the ${c} ${noun} I need?`,
      a: `Use the contact page to suggest a topic or report a missing detail. We prioritize requests that can be supported by reliable sources and that help athletes make a practical decision.`,
    },
    {
      q: `How do ${c} ${nounPlural} on ${brand} compare to YouTube tutorials?`,
      a: `These pages provide written context and checklists that can complement coaching, official notices and demonstrations. They are not a substitute for qualified instruction or the organizer's rules.`,
    },
    {
      q: `Can I save and revisit a ${c} ${noun} later?`,
      a: `Some KhelGrid experiences let you save an opportunity in the browser during beta. Check the page or your account for the available save and reminder controls; do not rely on them as the only reminder for a deadline.`,
    },
  ];
}

const faqCache = new Map<string, Faq[]>();
const MAX_FAQ_CACHE = 500;

function faqCacheKey(ctx: FaqContext, perPage: number): string {
  return JSON.stringify({
    c: ctx.category,
    s: ctx.slug,
    n: ctx.noun,
    np: ctx.nounPlural,
    tc: ctx.totalCount,
    p: ctx.page,
    tp: ctx.totalPages,
    b: ctx.brand,
    f: ctx.pageItemTitles[0],
    sc: ctx.pageItemTitles[1],
    pp: perPage,
  });
}

/**
 * Generate a stable, page-unique slice of FAQs so no two paginated URLs
 * share the same questions. Wraps around the bank only when total pages
 * exceed available unique windows.
 * FAQ sets are memoised by context hash for fast re-renders.
 */
export function generateFaqs(ctx: FaqContext, perPage = 5): Faq[] {
  const key = faqCacheKey(ctx, perPage);
  const hit = faqCache.get(key);
  if (hit) return hit;

  const bank = buildFaqBank(ctx);
  if (bank.length === 0) return [];
  const start = ((ctx.page - 1) * perPage) % bank.length;
  const out: Faq[] = [];
  for (let i = 0; i < perPage && i < bank.length; i++) {
    out.push(bank[(start + i) % bank.length]);
  }

  if (faqCache.size >= MAX_FAQ_CACHE) {
    const first = faqCache.keys().next().value;
    if (first !== undefined) faqCache.delete(first);
  }
  faqCache.set(key, out);
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
