import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { VenueImageCarousel, resolveFacilityPhotos } from "./VenueImageCarousel";

describe("VenueImageCarousel", () => {
  it("resolves sports facility photos intelligently based on sports list", () => {
    const photos = resolveFacilityPhotos("https://example.com/court1.jpg", "KhelGrid Sports Hub", [
      "Football",
      "Badminton",
    ]);

    expect(photos.length).toBeGreaterThanOrEqual(4);
    expect(photos[0].url).toBe("https://example.com/court1.jpg");
    // Should have sport-specific items like FIFA turf, BWF courts or lockers
    expect(
      photos.some(
        (p) => p.tag.toLowerCase().includes("turf") || p.caption.toLowerCase().includes("turf"),
      ),
    ).toBe(true);
    expect(
      photos.some(
        (p) => p.tag.toLowerCase().includes("court") || p.caption.toLowerCase().includes("court"),
      ),
    ).toBe(true);
  });

  it("renders horizontally scrollable carousel stage with controls and thumbnails", () => {
    const html = renderToString(
      <VenueImageCarousel
        venueName="Velocity Turf"
        sports={["Cricket", "Football"]}
        featured={true}
        bookable={true}
        rating={4.7}
        reviewsCount={42}
      />,
    );

    expect(html).toContain('id="venue-facility-carousel-container"');
    expect(html).toContain('id="venue-photos-horizontal-track"');
    expect(html).toContain('id="venue-carousel-prev-btn"');
    expect(html).toContain('id="venue-carousel-next-btn"');
    expect(html).toContain('id="venue-carousel-counter"');
    expect(html).toContain('id="venue-carousel-thumbnails-strip"');
    expect(html).toContain("Featured Facility");
    expect(html).toContain("Instant Booking");
    expect(html).toContain("4.7");
    expect(html).toContain("42");
  });

  it("renders custom photos provided via props", () => {
    const customPhotos = [
      {
        url: "https://example.com/custom1.jpg",
        caption: "Centre Court Grass Surface",
        tag: "Centre Court",
      },
      {
        url: "https://example.com/custom2.jpg",
        caption: "Players Pavilion & Bar",
        tag: "Pavilion",
      },
    ];

    const html = renderToString(
      <VenueImageCarousel venueName="Grand Slam Arena" images={customPhotos} sports={["Tennis"]} />,
    );

    expect(html).toContain("https://example.com/custom1.jpg");
    expect(html).toContain("Centre Court Grass Surface");
    expect(html).toContain("https://example.com/custom2.jpg");
    expect(html).toContain("Players Pavilion &amp; Bar");
  });
});
