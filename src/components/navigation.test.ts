import { describe, it, expect } from "vitest";
import { FEATURES, getItemCategory } from "./FeaturesSidebar";
import { PRIMARY, DRAWER_ITEMS } from "./NavDrawer";

describe("navigation entries", () => {
  it("desktop FeaturesSidebar and mobile NavDrawer both include /play with the same label", () => {
    const desktop = FEATURES.find((f) => f.to === "/play");
    const mobile = PRIMARY.find((p) => p.to === "/play");

    expect(desktop).toBeDefined();
    expect(mobile).toBeDefined();
    expect(desktop?.label).toBe("Play · Find games");
    expect(mobile?.label).toBe("Play · Find games");
    expect(desktop?.label).toBe(mobile?.label);
  });

  it("merges Sports and Learning Hub into single Sports & Learning Hub feature under Knowledge & Community", () => {
    const learningHubItem = FEATURES.find((f) => f.to === "/learning-hub");
    expect(learningHubItem).toBeDefined();
    expect(learningHubItem?.label).toBe("Sports & Learning Hub");

    // Must belong to community category (Knowledge & Community)
    expect(getItemCategory("/learning-hub")).toBe("community");

    // The separate /sports item should NOT appear as a duplicate item in FEATURES
    const separateSportsItem = FEATURES.find((f) => f.to === "/sports");
    expect(separateSportsItem).toBeUndefined();

    // Mobile drawer also includes Sports & Learning Hub
    const drawerItem = DRAWER_ITEMS.find((d) => d.to === "/learning-hub");
    expect(drawerItem).toBeDefined();
    expect(drawerItem?.label).toBe("Sports & Learning Hub");
  });
});
