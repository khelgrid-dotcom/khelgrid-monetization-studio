import { describe, it, expect, vi, afterEach } from "vitest";
import { buildPlayNavClickEvent, trackPlayNavClick, resetPlayNavClickDedupe, PLAY_NAV_DEDUPE_MS } from "./analytics";

afterEach(() => {
  resetPlayNavClickDedupe();
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

  it("sends only one event for rapid repeat clicks, then allows a later click", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });
    vi.spyOn(console, "debug").mockImplementation(() => {});
    expect(trackPlayNavClick("sidebar_desktop", 10_000)).toBe(true);
    expect(trackPlayNavClick("sidebar_desktop", 10_100)).toBe(false);
    expect(trackPlayNavClick("sidebar_mobile", 10_200)).toBe(false);
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(trackPlayNavClick("sidebar_desktop", 10_000 + PLAY_NAV_DEDUPE_MS)).toBe(true);
    expect(gtag).toHaveBeenCalledTimes(2);
  });
});
