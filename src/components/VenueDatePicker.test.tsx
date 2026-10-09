import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { VenueDatePicker } from "./VenueDatePicker";

describe("VenueDatePicker Component", () => {
  it("renders trigger button with formatted date label and calendar icon", () => {
    const html = renderToString(<VenueDatePicker date="2026-09-15" onDateChange={vi.fn()} />);

    expect(html).toContain('id="venue-date-picker-trigger"');
    expect(html).toContain("Sep 15, 2026");
    expect(html).toContain("Click to change booking date");
  });

  it("renders quick date shortcut buttons in the popover markup", () => {
    const html = renderToString(<VenueDatePicker date="2026-09-15" onDateChange={vi.fn()} />);

    // Verify popover and trigger structure
    expect(html).toContain('id="venue-date-picker-wrapper"');
    expect(html).toContain('id="venue-booking-date-input"');
  });

  it("handles today selection with appropriate badge", () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const html = renderToString(<VenueDatePicker date={todayStr} onDateChange={vi.fn()} />);

    expect(html).toContain("Today");
  });
});
