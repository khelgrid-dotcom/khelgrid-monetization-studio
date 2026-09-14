import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { VenueFAQ, generateVenueFAQs } from "./VenueFAQ";

describe("VenueFAQ Component", () => {
  it("generates comprehensive FAQs addressing cancellation, booking hours, and age restrictions", () => {
    const faqs = generateVenueFAQs("Smash Point Arena", ["Badminton", "Football"], 750);
    expect(faqs.length).toBeGreaterThanOrEqual(5);

    const questions = faqs.map((f) => f.question.toLowerCase()).join(" ");
    expect(questions).toContain("cancellation");
    expect(questions).toContain("booking hours");
    expect(questions).toContain("age restrictions");

    const answers = faqs.map((f) => f.answer.toLowerCase()).join(" ");
    expect(answers).toContain("cancellation");
    expect(answers).toContain("6:00 am to 11:00 pm");
    expect(answers).toContain("accompanied by an adult");
  });

  it("renders accordion-style FAQ section with semantic IDs and tags", () => {
    const html = renderToString(
      <VenueFAQ
        venueName="Apex Sports Complex"
        sports={["Football", "Cricket"]}
        pricePerHour={1200}
      />,
    );

    // Main section and heading
    expect(html).toContain('id="venue-faq-section"');
    expect(html).toContain('id="venue-faq-heading"');
    expect(html).toContain("Frequently Asked Questions");

    // Inquiries coverage
    expect(html).toContain("Cancellation Policy");
    expect(html).toContain("Booking Hours");
    expect(html).toContain("Age Restrictions");
    expect(html).toContain("Footwear &amp; Gear");
    expect(html).toContain("Weather &amp; Rescheduling");

    // Radix accordion structure & item IDs
    expect(html).toContain('id="venue-faq-accordion"');
    expect(html).toContain('id="venue-faq-item-faq-cancellation"');
    expect(html).toContain('id="venue-faq-trigger-faq-cancellation"');
    expect(html).toContain('id="venue-faq-content-faq-cancellation"');

    // Support assistance footer
    expect(html).toContain('id="venue-faq-support-banner"');
    expect(html).toContain("support@khelgrid.com");
  });
});
