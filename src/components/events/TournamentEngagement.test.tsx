import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { TournamentCountdown, calculateDeadlineRemaining } from "./TournamentCountdown";
import { SaveForLaterButton } from "./SaveForLaterButton";

describe("TournamentEngagement: Countdown & Save for Later", () => {
  describe("calculateDeadlineRemaining helper", () => {
    it("returns closed state when spotsLeft is 0", () => {
      const res = calculateDeadlineRemaining("e15", "Aug 28, 11:59 PM", 0);
      expect(res.isClosed).toBe(true);
      expect(res.formattedShort).toBe("Closed");
      expect(res.formattedDetailed).toBe("Registration Closed");
    });

    it("returns closed state when status is Sold Out", () => {
      const res = calculateDeadlineRemaining("e1", "Jun 12, 11:59 PM", 5, "Sold Out");
      expect(res.isClosed).toBe(true);
      expect(res.formattedShort).toBe("Closed");
    });

    it("calculates active countdown with days, hours, and minutes for upcoming tournaments", () => {
      const res = calculateDeadlineRemaining("e1", "Jun 12, 11:59 PM", 4);
      expect(res.isClosed).toBe(false);
      expect(res.totalSeconds).toBeGreaterThan(0);
      expect(res.days).toBeGreaterThanOrEqual(1);
      expect(res.formattedDetailed).toContain("d");
      expect(res.formattedDetailed).toContain("h");
    });

    it("flags urgent status when tournament closes soon (e3: 14h)", () => {
      const res = calculateDeadlineRemaining("e3", "Jun 11, 09:00 PM", 6);
      expect(res.isClosed).toBe(false);
      expect(res.isUrgent).toBe(true);
      expect(res.formattedShort).toContain("h");
    });
  });

  describe("TournamentCountdown Component", () => {
    it("renders badge variant with countdown text", () => {
      const html = renderToString(
        <TournamentCountdown
          eventId="e1"
          deadline="Jun 12, 11:59 PM"
          spotsLeft={4}
          variant="badge"
        />,
      );

      expect(html).toContain("Closes in");
    });

    it("renders strip variant with registration closes header and live timer", () => {
      const html = renderToString(
        <TournamentCountdown
          eventId="e1"
          deadline="Jun 12, 11:59 PM"
          spotsLeft={4}
          variant="strip"
        />,
      );

      expect(html).toContain("Registration Closes");
    });

    it("renders banner variant for rules & modal view", () => {
      const html = renderToString(
        <TournamentCountdown
          eventId="e1"
          deadline="Jun 12, 11:59 PM"
          spotsLeft={4}
          variant="banner"
        />,
      );

      expect(html).toContain("Registration Deadline Countdown");
      expect(html).toContain("Live countdown");
    });

    it("renders closed state when event is sold out", () => {
      const html = renderToString(
        <TournamentCountdown
          eventId="e15"
          deadline="Aug 28, 11:59 PM"
          spotsLeft={0}
          variant="strip"
        />,
      );

      expect(html).toContain("Sold Out");
    });
  });

  describe("SaveForLaterButton Component", () => {
    it("renders unsaved state with bookmark and 'Save' label in compact variant", () => {
      const html = renderToString(
        <SaveForLaterButton
          eventId="e1"
          eventTitle="Sunday Pickleball Open Cup"
          isSaved={false}
          onToggle={() => {}}
          variant="compact"
        />,
      );

      expect(html).toContain("Save");
      expect(html).not.toContain("Saved for Later");
    });

    it("renders saved state with 'Saved' label in compact variant", () => {
      const html = renderToString(
        <SaveForLaterButton
          eventId="e1"
          eventTitle="Sunday Pickleball Open Cup"
          isSaved={true}
          onToggle={() => {}}
          variant="compact"
        />,
      );

      expect(html).toContain("Saved");
    });

    it("renders icon-badge variant with accessible aria-label", () => {
      const html = renderToString(
        <SaveForLaterButton
          eventId="e1"
          eventTitle="Sunday Pickleball Open Cup"
          isSaved={false}
          onToggle={() => {}}
          variant="icon-badge"
        />,
      );

      expect(html).toContain('aria-label="Save &quot;Sunday Pickleball Open Cup&quot; for later"');
    });

    it("renders button variant with 'Save for Later' / 'Saved for Later'", () => {
      const unsavedHtml = renderToString(
        <SaveForLaterButton
          eventId="e1"
          eventTitle="Sunday Pickleball Open Cup"
          isSaved={false}
          onToggle={() => {}}
          variant="button"
        />,
      );
      expect(unsavedHtml).toContain("Save for Later");

      const savedHtml = renderToString(
        <SaveForLaterButton
          eventId="e1"
          eventTitle="Sunday Pickleball Open Cup"
          isSaved={true}
          onToggle={() => {}}
          variant="button"
        />,
      );
      expect(savedHtml).toContain("Saved for Later");
    });
  });
});
