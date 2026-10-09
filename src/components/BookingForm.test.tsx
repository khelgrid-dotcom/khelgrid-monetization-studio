import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { BookingForm } from "./BookingForm";
import { resetLocalBookingsForTesting } from "@/lib/booking-service";

describe("BookingForm Component with useBookings Hook", () => {
  beforeEach(() => {
    resetLocalBookingsForTesting();
    vi.clearAllMocks();
  });

  it("renders form elements, venue selection, and contact inputs", () => {
    const html = renderToString(<BookingForm />);

    expect(html).toContain("Schedule Court Booking");
    expect(html).toContain("Select Sports Venue");
    expect(html).toContain("Sport / Court Type");
    expect(html).toContain("Booking Date");
    expect(html).toContain("Select Time Slot");
    expect(html).toContain("Player &amp; Contact Details");
    expect(html).toContain("Full Name");
    expect(html).toContain("Phone Number");
    expect(html).toContain("Email Address");
    expect(html).toContain("Grand Total");
    expect(html).toContain("Confirm &amp; Book");
  });

  it("pre-selects specific venue when venueId prop is supplied", () => {
    const html = renderToString(
      <BookingForm venueId="v-1" defaultSport="Football" defaultTime="07:00 PM" />,
    );

    expect(html).toContain("Schedule Court Booking");
    expect(html).toContain("07:00 PM");
  });

  it("renders duration options and calculated grand total", () => {
    const html = renderToString(<BookingForm venueId="v-1" />);

    expect(html).toContain("Duration");
    expect(html).toContain("Grand Total");
    expect(html).toContain("Confirm &amp; Book");
  });

  it("renders peak tags on evening slots", () => {
    const html = renderToString(<BookingForm />);

    expect(html).toContain("Peak");
    expect(html).toContain("06:00 PM");
    expect(html).toContain("07:00 PM");
  });
});
