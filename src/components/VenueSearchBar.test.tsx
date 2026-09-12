import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { VenueSearchBar } from "./VenueSearchBar";

describe("VenueSearchBar", () => {
  it("renders search input field with placeholder", () => {
    const html = renderToString(
      <VenueSearchBar
        value=""
        onChange={() => {}}
        placeholder="Filter venues by name or location..."
      />,
    );
    expect(html).toContain('id="venue-search-input-field"');
    expect(html).toContain('placeholder="Filter venues by name or location..."');
    expect(html).toContain("Name");
    expect(html).toContain("Location");
  });

  it("renders clear button and status message when search term is active", () => {
    const html = renderToString(
      <VenueSearchBar value="Indiranagar" onChange={() => {}} totalResults={4} />,
    );
    expect(html).toContain('id="venue-search-clear-btn"');
    expect(html).toContain("Indiranagar");
    expect(html).toContain("Filtering by");
    expect(html).toContain("across name and location");
    expect(html).toContain("4 venues found");
  });

  it("handles singular venue count correctly", () => {
    const html = renderToString(
      <VenueSearchBar value="Khel Turf" onChange={() => {}} totalResults={1} />,
    );
    expect(html).toContain("1 venue found");
  });
});
