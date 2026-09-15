import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { VenuePoliciesAccordion } from "./VenuePoliciesAccordion";

describe("VenuePoliciesAccordion", () => {
  it("renders with default props and venue name", () => {
    const html = renderToString(
      <VenuePoliciesAccordion
        venueName="Sarjapur Super Turf"
        sports={["Football", "Cricket"]}
        pricePerHour={1200}
        defaultOpenSections={["policy-booking", "policy-hours", "policy-footwear", "policy-safety"]}
      />,
    );

    expect(html).toContain('id="venue-policies-section"');
    expect(html).toContain('id="venue-policies-heading"');
    expect(html).toContain("Venue Policies, Hours &amp; Rules");
    expect(html).toContain("Sarjapur Super Turf");
    expect(html).toContain('id="venue-policies-accordion"');

    // 4 Accordion Sections
    expect(html).toContain('id="venue-policy-item-booking"');
    expect(html).toContain('id="venue-policy-item-hours"');
    expect(html).toContain('id="venue-policy-item-restrictions"');
    expect(html).toContain('id="venue-policy-item-safety"');

    // Booking Policies
    expect(html).toContain("Booking &amp; Cancellation Policies");
    expect(html).toContain("100% Refund Window");
    expect(html).toContain("Advance Booking Window");
    expect(html).toContain("Rescheduling Allowance");
    expect(html).toContain("Inclement Weather Policy");

    // Hours
    expect(html).toContain("Operating Hours &amp; Lighting Schedule");
    expect(html).toContain("General Daily Timings");
    expect(html).toContain("Night Match Floodlights");

    // Footwear & Surface Restrictions
    expect(html).toContain("Footwear, Attire &amp; Equipment Rules");
    expect(html).toContain("Outdoor Turfs &amp; Grounds");
    expect(html).toContain("Multi-ground rubber studs");

    // Safety & Restrictions
    expect(html).toContain("Safety, Age Guidelines &amp; Prohibited Items");
    expect(html).toContain("Strictly Prohibited on Facility Premises");
  });

  it("renders custom database policies when provided", () => {
    const customHours = {
      regular_hours: "5:00 AM – Midnight (Daily)",
      weekend_hours: "5:00 AM – 1:00 AM (Weekends)",
      peak_hours: "5:00 PM – 11:00 PM",
      floodlight_hours: "6:00 PM – Midnight (High Lux LED)",
      maintenance_window: "1:00 AM – 4:30 AM",
      last_entry: "11:15 PM",
    };

    const customPolicies = {
      advance_booking: "Book up to 30 days in advance via KhelGrid VIP.",
      cancellation_full_refund: "100% refund up to 6 hours before slot start.",
      cancellation_partial_refund: "50% refund up to 3 hours before slot start.",
      cancellation_no_refund: "Non-refundable under 3 hours.",
      rescheduling: "2 free reschedules allowed.",
      slot_duration: "90 minutes per session.",
      weather_policy: "Automatic rain check guarantee credit.",
      id_verification: "Digital QR code verification.",
    };

    const customRestrictions = {
      footwear_indoor: "Gum-sole Yonex or Victor shoes only.",
      footwear_turf: "Astro-turf multi-studs only.",
      dress_code: "Official team dry-fit kit required.",
      prohibited_items: ["No metal studs", "No outside fast food", "No alcohol"],
      age_guidelines: "Ages 8 and above. Minors must have adult supervision.",
      spectators: "Gallery seats up to 50 visitors.",
      equipment: "Free Yonex racquets provided.",
    };

    const html = renderToString(
      <VenuePoliciesAccordion
        venueName="Custom Arena"
        operatingHours={customHours}
        bookingPolicies={customPolicies}
        rulesRestrictions={customRestrictions}
        defaultOpenSections={["policy-booking", "policy-hours", "policy-footwear", "policy-safety"]}
      />,
    );

    expect(html).toContain("5:00 AM – Midnight (Daily)");
    expect(html).toContain("Book up to 30 days in advance via KhelGrid VIP.");
    expect(html).toContain("100% refund up to 6 hours before slot start.");
    expect(html).toContain("2 free reschedules allowed.");
    expect(html).toContain("Gum-sole Yonex or Victor shoes only.");
    expect(html).toContain("Ages 8 and above. Minors must have adult supervision.");
    expect(html).toContain("Gallery seats up to 50 visitors.");
  });

  it("adapts footwear advice for indoor sports like badminton", () => {
    const html = renderToString(
      <VenuePoliciesAccordion
        venueName="Smash Badminton Hub"
        sports={["Badminton", "Table Tennis"]}
        defaultOpenSections={["policy-footwear"]}
      />,
    );

    expect(html).toContain("Non-marking gum sole shoes");
  });
});
