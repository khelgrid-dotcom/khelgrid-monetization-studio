import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import {
  VenueAmenitiesList,
  resolveAmenityDetails,
  DEFAULT_VENUE_AMENITIES,
} from "./VenueAmenitiesList";

describe("VenueAmenitiesList Component", () => {
  it("resolves amenity details with proper icons, categories, and descriptions", () => {
    const parking = resolveAmenityDetails("Ample Parking Available");
    expect(parking.category).toBe("convenience");
    expect(parking.colorClass).toContain("blue");
    expect(parking.description).toContain("parking");

    const changing = resolveAmenityDetails("Changing Rooms & Showers");
    expect(changing.category).toBe("facility");
    expect(changing.colorClass).toContain("indigo");
    expect(changing.description).toContain("changing");

    const floodlights = resolveAmenityDetails("High-Intensity Floodlights");
    expect(floodlights.category).toBe("facility");
    expect(floodlights.colorClass).toContain("amber");
    expect(floodlights.description).toContain("floodlight");

    const water = resolveAmenityDetails("Drinking Water RO");
    expect(water.category).toBe("comfort");
    expect(water.colorClass).toContain("cyan");
  });

  it("renders carousel-bar variant under the image carousel with icons and pills", () => {
    const html = renderToString(
      <VenueAmenitiesList
        amenities={["Parking Available", "Changing Rooms", "Floodlights", "Drinking Water"]}
        variant="carousel-bar"
      />,
    );

    expect(html).toContain('id="venue-carousel-amenities-bar"');
    expect(html).toContain('id="venue-carousel-amenities-label"');
    expect(html).toContain("Available Amenities &amp; Facilities");
    expect(html).toContain('id="venue-amenities-pills-list"');
    expect(html).toContain("Parking Available");
    expect(html).toContain("Changing Rooms");
    expect(html).toContain("Floodlights");
    expect(html).toContain("Drinking Water");
  });

  it("renders grid variant with full amenity cards and descriptions", () => {
    const html = renderToString(
      <VenueAmenitiesList
        amenities={DEFAULT_VENUE_AMENITIES}
        venueName="Velocity Turf"
        variant="grid"
      />,
    );

    expect(html).toContain('id="venue-amenities-grid-container"');
    expect(html).toContain('id="venue-amenities-full-grid"');
    expect(html).toContain("Amenities &amp; Facility Highlights");
    expect(html).toContain("First Aid On-site");
  });
});
