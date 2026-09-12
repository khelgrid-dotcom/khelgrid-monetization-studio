import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { VenueDetails, normalizeVenueData } from "./VenueDetails";

describe("VenueDetails", () => {
  const mockVenue = {
    id: "ven-12345",
    name: "KhelGrid Olympic Sports Arena",
    slug: "khelgrid-olympic-arena",
    area: "Indiranagar",
    city: "Bengaluru",
    address: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru",
    sports: ["Badminton", "Pickleball", "Tennis"],
    amenities: ["Parking", "Floodlights", "Changing Rooms", "Drinking Water"],
    price_per_hour: 1200,
    rating: 4.8,
    reviews_count: 56,
    featured: true,
    bookable: true,
    contact_phone: "+91 98765 12345",
    contact_email: "arena@khelgrid.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image_url: "https://example.com/venue.jpg",
    latitude: 12.9716,
    longitude: 77.5946,
  };

  it("renders venue name and full address correctly", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain("KhelGrid Olympic Sports Arena");
    expect(html).toContain("100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru");
  });

  it("renders contact details with clickable links and copy buttons", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain("tel:+91 98765 12345");
    expect(html).toContain("mailto:arena@khelgrid.com");
    expect(html).toContain('id="venue-copy-phone-btn"');
    expect(html).toContain('id="venue-copy-email-btn"');
  });

  it("renders supported sports and amenities", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain("Badminton");
    expect(html).toContain("Pickleball");
    expect(html).toContain("Tennis");
    expect(html).toContain("Parking");
    expect(html).toContain("Floodlights");
  });

  it("renders the primary booking button and price", () => {
    const html = renderToString(<VenueDetails venue={mockVenue} />);
    expect(html).toContain('id="venue-primary-book-btn"');
    expect(html).toContain("Book Court / Turf Now");
    expect(html).toContain("1,200");
  });

  it("normalizes Playo venue formats cleanly", () => {
    const playoFormat = {
      id: "v-playo-9",
      name: "Playo Central Turf",
      area: "Koramangala",
      city: "Bengaluru",
      distanceKm: 3.2,
      rating: 4.5,
      reviews: 20,
      sports: ["Football", "Box Cricket"],
      pricePerHour: 1500,
      featured: false,
      bookable: true,
      image: "https://example.com/playo.jpg",
    };

    const normalized = normalizeVenueData(playoFormat);
    expect(normalized.name).toBe("Playo Central Turf");
    expect(normalized.price_per_hour).toBe(1500);
    expect(normalized.sports).toContain("Football");
  });
});
