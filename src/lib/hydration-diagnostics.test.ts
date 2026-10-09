import { describe, it, expect } from "vitest";
import { inspectRouterStores, isHydrationErrorMessage } from "./hydration-diagnostics";

describe("inspectRouterStores", () => {
  it("flags a missing router", () => {
    expect(inspectRouterStores(null)[0].id).toBe("router-missing");
  });

  it("flags missing stores object", () => {
    expect(inspectRouterStores({})[0].id).toBe("router-stores-missing");
  });

  it("flags an incomplete store shape", () => {
    const found = inspectRouterStores({ stores: { location: {} } });
    expect(found[0].id).toBe("router-stores-incomplete");
    expect(found[0].detail).toContain("matchesId");
  });

  it("passes a healthy router", () => {
    expect(inspectRouterStores({ stores: { matchesId: {}, location: {} } })).toEqual([]);
  });
});

describe("isHydrationErrorMessage", () => {
  it("detects react hydration codes and text", () => {
    expect(isHydrationErrorMessage("https://react.dev/errors/418")).toBe(true);
    expect(isHydrationErrorMessage("Hydration failed because...")).toBe(true);
    expect(isHydrationErrorMessage("Text content does not match server HTML")).toBe(true);
  });

  it("ignores unrelated errors", () => {
    expect(isHydrationErrorMessage("Failed to fetch /api/foo")).toBe(false);
  });
});
