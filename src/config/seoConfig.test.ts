import { describe, expect, it } from "vitest";
import { getSeoMetadata, seoConfig } from "./seoConfig.js";

describe("getSeoMetadata", () => {
  it("returns metadata for an exact route", () => {
    expect(getSeoMetadata("/play")).toEqual(seoConfig["/play"]);
  });

  it("leaves parameterized routes to their route-level metadata", () => {
    expect(getSeoMetadata("/blog/athlete-training")).toBeUndefined();
  });

  it("normalizes trailing slashes", () => {
    expect(getSeoMetadata("/events/")).toEqual(seoConfig["/events"]);
  });

  it("leaves unknown routes to their route-level metadata", () => {
    expect(getSeoMetadata("/not-a-route")).toBeUndefined();
  });
});
