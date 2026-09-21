import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { FeedbackSupportDialog } from "./FeedbackSupportDialog";

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "athlete@khelgrid.com", name: "Rohan Kumar" },
    isAuthenticated: true,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("FeedbackSupportDialog", () => {
  it("renders the feedback dialog with all key fields when open is true", () => {
    const html = renderToString(
      <FeedbackSupportDialog open={true} inline={true} onOpenChange={() => {}} defaultType="bug" />,
    );

    // Header & title
    expect(html).toContain("Support &amp; Feedback");
    expect(html).toContain("Help us improve KhelGrid");

    // Option buttons
    expect(html).toContain("Report Bug");
    expect(html).toContain("Feature Idea");
    expect(html).toContain("Inquiry");

    // Form inputs
    expect(html).toContain('id="feedback-title"');
    expect(html).toContain('id="feedback-description"');
    expect(html).toContain('id="feedback-category"');
    expect(html).toContain('id="feedback-email"');
    expect(html).toContain('id="include-diagnostics"');

    // Action buttons
    expect(html).toContain("Cancel");
    expect(html).toContain("Submit");
  });

  it("renders feature suggestion mode with feature-oriented labels", () => {
    const html = renderToString(
      <FeedbackSupportDialog
        open={true}
        inline={true}
        onOpenChange={() => {}}
        defaultType="feature"
      />,
    );

    expect(html).toContain("Feature Title *");
    expect(html).toContain("Feature Idea");
  });

  it("renders trigger button when provided", () => {
    const html = renderToString(
      <FeedbackSupportDialog
        open={false}
        trigger={<button id="test-feedback-trigger">Open Feedback</button>}
      />,
    );

    expect(html).toContain('id="test-feedback-trigger"');
    expect(html).toContain("Open Feedback");
  });
});
