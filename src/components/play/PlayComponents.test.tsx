import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import { PlayFAQ } from "./PlayFAQ";
import { PlayEditorialGuide } from "./PlayEditorialGuide";

describe("Play Component Suite", () => {
  it("renders the Fair Play Code and Skill Level Matrix in editorial guide", () => {
    const html = renderToString(<PlayEditorialGuide />);
    expect(html).toContain("The KhelGrid Fair Play &amp; Player Safety Code");
    expect(html).toContain("Skill Level Self-Assessment Matrix");
    expect(html).toContain("Turf and Court Footwear Safety Standards");
    expect(html).toContain("How Pickup Sports Cost Sharing Works on KhelGrid");
    expect(html).toContain("Urban Pickup Sports Culture Across Indian Metros");
  });

  it("renders the FAQ section with key match etiquette questions and schema", () => {
    const html = renderToString(<PlayFAQ />);
    expect(html).toContain("Frequently Asked Questions");
    expect(html).toContain("How do I find and join an amateur pickup sports game on KhelGrid?");
    expect(html).toContain("What is the cancellation and no-show policy for pickup games?");
    expect(html).toContain("FAQPage");
  });
});
