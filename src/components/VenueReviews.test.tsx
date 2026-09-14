import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { VenueReviews, generateDefaultReviews } from "./VenueReviews";

describe("VenueReviews Component", () => {
  it("generates tailored default customer feedback testimonials for given sports", () => {
    const reviews = generateDefaultReviews("Turf Nation Arena", ["Football", "Cricket"]);
    expect(reviews.length).toBeGreaterThanOrEqual(4);
    expect(reviews[0].headline).toBeDefined();
    expect(reviews[0].comment).toContain("Turf Nation Arena");
    expect(reviews[0].verifiedBooking).toBe(true);
    expect(reviews.some((r) => r.rating === 5)).toBe(true);
  });

  it("renders user reviews section with star rating system and customer testimonials", () => {
    const html = renderToString(
      <VenueReviews
        venueId="v-1"
        venueName="Velocity Smash Club"
        sports={["Badminton", "Squash"]}
        initialRating={4.8}
        initialReviewsCount={52}
      />,
    );

    // Heading & Section
    expect(html).toContain('id="venue-user-reviews-section"');
    expect(html).toContain('id="venue-reviews-heading"');
    expect(html).toContain("User Reviews &amp; Testimonials");

    // Star rating system
    expect(html).toContain('id="venue-star-rating-summary-card"');
    expect(html).toContain('id="venue-average-rating-score"');
    expect(html).toContain('id="venue-stars-display"');
    expect(html).toContain("Star Rating Breakdown");
    expect(html).toContain("100% Verified Player Reviews");

    // Testimonial cards & customer feedback
    expect(html).toContain('id="venue-customer-testimonials-container"');
    expect(html).toContain("Arjun Mehta");
    expect(html).toContain("Sneha Rao");
    expect(html).toContain("Verified Player");
    expect(html).toContain("Helpful (");

    // Interactive controls
    expect(html).toContain('id="venue-write-review-btn"');
    expect(html).toContain('id="venue-filter-all-reviews-btn"');
  });

  it("renders facility highlights criteria", () => {
    const html = renderToString(
      <VenueReviews venueName="Apex Sports Complex" sports={["Tennis"]} />,
    );

    expect(html).toContain("Turf &amp; Playing Surface");
    expect(html).toContain("Lighting &amp; Night Play");
    expect(html).toContain("Changing Rooms &amp; Showers");
    expect(html).toContain("Staff &amp; Punctuality");
  });
});
