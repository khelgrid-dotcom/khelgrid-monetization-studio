import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import {
  BookingConfirmationModal,
  BookingConfirmationContent,
  formatDateDisplay,
} from "./BookingConfirmationModal";

describe("BookingConfirmationModal", () => {
  it("formats date strings accurately into Indian English format", () => {
    const formatted = formatDateDisplay("2026-09-14");
    expect(formatted).toContain("2026");
    expect(formatted).toContain("Sep");
    expect(formatted).toContain("14");
  });

  it("renders modal content when open is true, summarizing venue name, selected date, and total price", () => {
    const html = renderToString(
      <BookingConfirmationModal
        open={true}
        inline={true}
        onOpenChange={() => {}}
        venueName="Apex Sports Arena"
        venueArea="Indiranagar"
        venueCity="Bengaluru"
        selectedDate="2026-09-14"
        selectedTime="7:00 PM"
        durationHours={1}
        pricePerHour={1200}
        totalPrice={1200}
        sports={["Badminton"]}
        onConfirm={() => {}}
      />,
    );

    // Title and Dialog elements
    expect(html).toContain('id="booking-confirmation-title"');
    expect(html).toContain("Confirm Your Booking");
    expect(html).toContain(
      "Review your slot summary before finalizing to avoid accidental bookings.",
    );

    // Summary Card
    expect(html).toContain('id="booking-confirmation-summary-card"');
    expect(html).toContain('id="booking-confirmation-venue-name"');
    expect(html).toContain("Apex Sports Arena");
    expect(html).toContain("Indiranagar, Bengaluru");

    // Selected Date
    expect(html).toContain('id="booking-confirmation-selected-date"');
    expect(html).toContain("2026-09-14");

    // Time Slot
    expect(html).toContain('id="booking-confirmation-selected-time"');
    expect(html).toContain("7:00 PM");

    // Total Price
    expect(html).toContain('id="booking-confirmation-total-price-box"');
    expect(html).toContain('id="booking-confirmation-total-amount"');
    expect(html).toContain("1,200");

    // Policy Note & Actions
    expect(html).toContain('id="booking-confirmation-policy-note"');
    expect(html).toContain("Cancellation Policy");
    expect(html).toContain('id="booking-confirmation-cancel-btn"');
    expect(html).toContain("Go Back &amp; Edit");
    expect(html).toContain('id="booking-confirmation-finalize-btn"');
    expect(html).toContain("Confirm &amp; Finalize Booking");
  });

  it("does not render modal content when open is false in inline mode", () => {
    const html = renderToString(
      <BookingConfirmationModal
        open={false}
        inline={true}
        onOpenChange={() => {}}
        venueName="Apex Sports Arena"
        selectedDate="2026-09-14"
        pricePerHour={1200}
        onConfirm={() => {}}
      />,
    );
    expect(html).toBe("");
  });

  it("renders confirming state text when isConfirming is true", () => {
    const html = renderToString(
      <BookingConfirmationModal
        open={true}
        inline={true}
        onOpenChange={() => {}}
        venueName="Velocity Turf"
        venueArea="Koramangala"
        venueCity="Bengaluru"
        selectedDate="2026-09-15"
        selectedTime="6:00 AM"
        pricePerHour={1500}
        onConfirm={() => {}}
        isConfirming={true}
      />,
    );

    expect(html).toContain("Confirming Reservation...");
  });

  it("renders BookingConfirmationContent directly with all booking details", () => {
    const html = renderToString(
      <BookingConfirmationContent
        venueName="Smash Badminton Club"
        venueArea="HSR Layout"
        venueCity="Bengaluru"
        selectedDate="2026-09-20"
        selectedTime="8:00 PM"
        durationHours={2}
        pricePerHour={800}
        totalPrice={1600}
        sports={["Badminton", "Table Tennis"]}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(html).toContain("Smash Badminton Club");
    expect(html).toContain("HSR Layout, Bengaluru");
    expect(html).toContain("1,600");
    expect(html).toContain("8:00 PM");
    expect(html).toContain("120");
    expect(html).toContain("mins");
    expect(html).toContain("Cancellation Policy");
  });
});
