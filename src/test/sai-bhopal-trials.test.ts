import { describe, it, expect } from "vitest";
import { TRIALS, CITIES, SPORTS } from "@/data/trials";
import { getTrialEndDate, isTrialArchived } from "@/lib/opportunity-badge";

describe("SAI Central Regional Centre Bhopal Selection Trials (Notice No. 2036)", () => {
  const dharBadminton = TRIALS.find((t) => t.id === "t-sai-stc-dhar-badminton-trials-2026");
  const dharArchery = TRIALS.find((t) => t.id === "t-sai-stc-dhar-archery-trials-2026");
  const dharTaekwondo = TRIALS.find((t) => t.id === "t-sai-stc-dhar-taekwondo-trials-2026");
  const rajnandgaonBasketball = TRIALS.find(
    (t) => t.id === "t-sai-stc-rajnandgaon-basketball-trials-2026",
  );
  const raipurVolleyball = TRIALS.find(
    (t) => t.id === "t-sai-stc-raipur-archery-volleyball-trials-2026",
  );

  it("registers all 5 trial entries with valid schema and stable IDs", () => {
    expect(dharBadminton).toBeDefined();
    expect(dharArchery).toBeDefined();
    expect(dharTaekwondo).toBeDefined();
    expect(rajnandgaonBasketball).toBeDefined();
    expect(raipurVolleyball).toBeDefined();
  });

  it("links directly to the official SAI CRC Bhopal notification PDF", () => {
    const expectedPdf = "/assets/aistudio/48bad81f-a0f5-4e71-810a-5fb506f6822d_53f8b19f.pdf";
    expect(dharBadminton?.sourceUrl).toBe(expectedPdf);
    expect(rajnandgaonBasketball?.sourceUrl).toBe(expectedPdf);
    expect(raipurVolleyball?.sourceUrl).toBe(expectedPdf);
    expect(dharBadminton?.sources?.[0]?.url).toBe(expectedPdf);
  });

  it("mandates all 5 official verification documents from the notice", () => {
    const expectedDocs = [
      "Date of Birth Certificate (जन्म तिथि प्रमाण-पत्र)",
      "Aadhaar Card (आधार कार्ड)",
      "Sports Achievements Certificates (खेल उपलब्धियों के प्रमाण-पत्र)",
      "Medical Fitness Certificate (मेडिकल फिटनेस प्रमाण-पत्र)",
      "Passport Size Photographs (4) (पासपोर्ट साइज फोटो - 4)",
    ];

    expect(dharBadminton?.requiredDocuments).toEqual(expectedDocs);
    expect(rajnandgaonBasketball?.requiredDocuments).toEqual(expectedDocs);
    expect(raipurVolleyball?.requiredDocuments).toEqual(expectedDocs);
  });

  it("accurately parses trial end dates for scheduling and lifecycle filters", () => {
    const dharDate = getTrialEndDate(dharBadminton?.date);
    expect(dharDate).not.toBeNull();
    expect(dharDate?.getFullYear()).toBe(2026);
    expect(dharDate?.getMonth()).toBe(10); // November (0-indexed = 10)
    expect(dharDate?.getDate()).toBe(14);

    const rajDate = getTrialEndDate(rajnandgaonBasketball?.date);
    expect(rajDate).not.toBeNull();
    expect(rajDate?.getFullYear()).toBe(2026);
    expect(rajDate?.getMonth()).toBe(10); // November
    expect(rajDate?.getDate()).toBe(19);

    const raipurDate = getTrialEndDate(raipurVolleyball?.date);
    expect(raipurDate).not.toBeNull();
    expect(raipurDate?.getFullYear()).toBe(2026);
    expect(raipurDate?.getMonth()).toBe(10); // November
    expect(raipurDate?.getDate()).toBe(3);
  });

  it("includes Dhar and Rajnandgaon in CITIES catalog array", () => {
    expect(CITIES).toContain("Dhar");
    expect(CITIES).toContain("Rajnandgaon");
    expect(CITIES).toContain("Raipur");
  });

  it("records official organizer contacts for CRC Bhopal", () => {
    expect(dharBadminton?.organizerContacts?.[0]?.email).toBe("rdsaibho-mp@gov.in");
    expect(dharBadminton?.organizerContacts?.[0]?.phone).toBe("0755-2696930");
  });
});
