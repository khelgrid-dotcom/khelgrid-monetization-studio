import { describe, it, expect } from "vitest";
import { TRIALS, SPORTS, CITIES } from "@/data/trials";
import { SPORTS_CATALOG } from "@/data/catalog";
import { buildSeoHead } from "@/lib/seo";

describe("All India Inter-University Wushu Championship 2026–27 Selection Trials", () => {
  it("should have the Wushu trial in TRIALS with exact correct details", () => {
    const trial = TRIALS.find((t) => t.id === "t-aiu-wushu-inter-university-trials-2026");
    expect(trial).toBeDefined();
    if (!trial) return;

    expect(trial.title).toContain("All India Inter-University Wushu Championship");
    expect(trial.sport).toBe("Wushu");
    expect(trial.city).toBe("Gandhinagar");
    expect(trial.fee).toBe(0);
    expect(trial.badge).toBe("New");
    expect(trial.academy).toContain("Rashtriya Raksha University");

    // Timelines
    expect(trial.timelines).toBeDefined();
    expect(
      trial.timelines?.some(
        (t) => t.label.includes("General Entry") && t.date.includes("20th November 2026"),
      ),
    ).toBe(true);
    expect(
      trial.timelines?.some(
        (t) => t.label.includes("Detailed Entry") && t.date.includes("5th December 2026"),
      ),
    ).toBe(true);
    expect(
      trial.timelines?.some(
        (t) =>
          t.label.includes("Main Championship") && t.date.includes("25th – 30th December 2026"),
      ),
    ).toBe(true);

    // Disciplines
    expect(trial.gender).toContain("Sanda");
    expect(trial.gender).toContain("Taolu");

    // Mandatory documentation
    expect(
      trial.requiredDocuments?.some((doc) => doc.includes("AIU ID") && doc.includes("aiu.ac.in")),
    ).toBe(true);
    expect(
      trial.requiredDocuments?.some(
        (doc) => doc.includes("college/university identity card") || doc.includes("fee receipts"),
      ),
    ).toBe(true);
    expect(
      trial.requiredDocuments?.some((doc) => doc.includes("10th and 12th passing certificates")),
    ).toBe(true);

    // National Organizing Secretariat
    expect(trial.organizerContacts).toBeDefined();
    const raghvendra = trial.organizerContacts?.find((c) => c.name.includes("Raghvendra Singh"));
    expect(raghvendra).toBeDefined();
    expect(raghvendra?.email).toBe("raghvendra.singh@rru.ac.in");
    expect(raghvendra?.phone).toContain("8384849529");

    const kalpesh = trial.organizerContacts?.find((c) => c.name.includes("Kalpesh Sharma"));
    expect(kalpesh).toBeDefined();
    expect(kalpesh?.phone).toContain("9898230979");

    // Verified Source URLs [1], [2], [3]
    expect(trial.sources).toBeDefined();
    expect(
      trial.sources?.some((s) =>
        s.url.includes("scribd.com/document/1042960239/AIIU-Wushu-Selection-Trials"),
      ),
    ).toBe(true);
    expect(trial.sources?.some((s) => s.url.includes("instagram.com/p/DeOpkCNPoaz/"))).toBe(true);
    expect(
      trial.sources?.some((s) =>
        s.url.includes(
          "aiu.ac.in/wp-content/uploads/docs/2026/09/AIU-Sports-Calendar-2026-27-Final_compressed.pdf",
        ),
      ),
    ).toBe(true);
  });

  it("should have Wushu in SPORTS and Gandhinagar in CITIES", () => {
    expect((SPORTS as readonly string[]).includes("Wushu")).toBe(true);
    expect((CITIES as readonly string[]).includes("Gandhinagar")).toBe(true);
  });

  it("should have Wushu catalog entry in SPORTS_CATALOG", () => {
    const catalogEntry = SPORTS_CATALOG.find((s) => s.slug === "wushu");
    expect(catalogEntry).toBeDefined();
    expect(catalogEntry?.name).toBe("Wushu");
    expect(catalogEntry?.emoji).toBe("🥋");
  });

  it("builds valid SEO head tags and canonical path for Wushu trial", () => {
    const trial = TRIALS.find((t) => t.id === "t-aiu-wushu-inter-university-trials-2026")!;
    const head = buildSeoHead({
      title: `${trial.title} · ${trial.sport} Trial in ${trial.city}`,
      description: `${trial.title} hosted by ${trial.academy}.`,
      canonicalPath: `/trial/${trial.id}`,
    });

    const ogUrl = head.meta?.find((m) => "property" in m && m.property === "og:url");
    const canonicalLink = head.links?.find((l) => l.rel === "canonical");

    expect(ogUrl?.content).toContain("/trial/t-aiu-wushu-inter-university-trials-2026");
    expect(canonicalLink?.href).toContain("/trial/t-aiu-wushu-inter-university-trials-2026");
  });
});
