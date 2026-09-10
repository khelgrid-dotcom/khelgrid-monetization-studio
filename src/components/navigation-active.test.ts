import { describe, it, expect } from "vitest";
import { FEATURES } from "./FeaturesSidebar";
import { PRIMARY } from "./NavDrawer";
import { isActivePath } from "@/config/nav";

describe("/play active highlighting", () => {
  it("is registered in both the desktop FeaturesSidebar and mobile NavDrawer", () => {
    expect(FEATURES.find((f) => f.to === "/play")).toBeDefined();
    expect(PRIMARY.find((p) => p.to === "/play")).toBeDefined();
  });

  it("highlights /play on the exact route", () => {
    expect(isActivePath("/play", "/play")).toBe(true);
  });

  it("highlights /play on nested routes (e.g. /play/host)", () => {
    expect(isActivePath("/play/host", "/play")).toBe(true);
    expect(isActivePath("/play/123/join", "/play")).toBe(true);
  });

  it("does not highlight /play on unrelated or lookalike routes", () => {
    expect(isActivePath("/", "/play")).toBe(false);
    expect(isActivePath("/playground", "/play")).toBe(false);
    expect(isActivePath("/dashboard", "/play")).toBe(false);
  });

  it("only highlights Home on the exact root path", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/play", "/")).toBe(false);
  });
});
