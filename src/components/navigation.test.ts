import { describe, it, expect } from "vitest";
import { FEATURES } from "./FeaturesSidebar";
import { PRIMARY } from "./NavDrawer";

describe("navigation /play entry", () => {
  it("desktop FeaturesSidebar and mobile NavDrawer both include /play with the same label", () => {
    const desktop = FEATURES.find((f) => f.to === "/play");
    const mobile = PRIMARY.find((p) => p.to === "/play");

    expect(desktop).toBeDefined();
    expect(mobile).toBeDefined();
    expect(desktop?.label).toBe("Play · Find games");
    expect(mobile?.label).toBe("Play · Find games");
    expect(desktop?.label).toBe(mobile?.label);
  });
});
