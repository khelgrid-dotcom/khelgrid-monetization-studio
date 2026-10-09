import { describe, it, expect, vi, afterEach } from "vitest";
import { buildPlayNavClickEvent, trackPlayNavClick } from "./analytics";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("play nav click tracking", () => {
  it("builds identical fields for desktop and mobile except source", () => {
    const d = buildPlayNavClickEvent("sidebar_desktop");
    const m = buildPlayNavClickEvent("sidebar_mobile");
    expect({ ...d, source: "x" }).toEqual({ ...m, source: "x" });
    expect(d).toEqual({ event: "nav_click", label: "Play · Find games", destination: "/play", source: "sidebar_desktop" });
  });

  it("sends event_name, label, destination and source to gtag", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });
    vi.spyOn(console, "debug").mockImplementation(() => {});
    trackPlayNavClick("sidebar_mobile");
    expect(gtag).toHaveBeenCalledWith("event", "nav_click", {
      event_name: "nav_click",
      label: "Play · Find games",
      destination: "/play",
      source: "sidebar_mobile",
    });
  });
});
