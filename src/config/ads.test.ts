import { describe, it, expect } from "vitest";
import { adsConfig, hasValidPublisherId, adsenseScriptSrc, resolveAdSlot, AD_SLOTS } from "./ads";
import fs from "node:fs";
import path from "node:path";

describe("Google AdSense Configuration & ads.txt Verification", () => {
  it("has a valid publisher ID matching ca-pub-16digits", () => {
    expect(hasValidPublisherId()).toBe(true);
    expect(adsConfig.publisherId).toMatch(/^ca-pub-\d{16}$/);
    expect(adsConfig.publisherId).toBe("ca-pub-8352691151177209");
  });

  it("generates correct Google AdSense script URL", () => {
    const src = adsenseScriptSrc();
    expect(src).toBe(
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8352691151177209",
    );
  });

  it("resolves ad slots correctly from registry or fallback", () => {
    expect(resolveAdSlot("homeBelowHero")).toBe(AD_SLOTS.homeBelowHero);
    expect(resolveAdSlot("custom_slot_999")).toBe("custom_slot_999");
  });

  it("validates canonical public/ads.txt content format", () => {
    const adsTxtPath = path.resolve(process.cwd(), "public/ads.txt");
    expect(fs.existsSync(adsTxtPath)).toBe(true);

    const content = fs.readFileSync(adsTxtPath, "utf-8").trim();
    const lines = content
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    expect(lines.length).toBeGreaterThan(0);
    const googleLine = lines.find((l) => l.startsWith("google.com"));
    expect(googleLine).toBeDefined();

    // Standard IAB format: domain, publisher_id, type, cert_authority_id
    const parts = googleLine!.split(",").map((s) => s.trim());
    expect(parts[0]).toBe("google.com");
    expect(parts[1]).toBe("pub-8352691151177209");
    expect(parts[2]).toBe("DIRECT");
    expect(parts[3]).toBe("f08c47fec0942fa0");
  });
});

describe("Monetag Advertising & Verification Configuration", () => {
  it("contains the official Monetag site verification token", async () => {
    const { monetagConfig, getMonetagScriptUrl } = await import("./ads");
    expect(monetagConfig.verificationToken).toBe("6849cf6d9be2966239a31c15fef2755c");
    expect(monetagConfig.domain).toBe("3nbf4.com");
    expect(monetagConfig.zoneId).toBe("12165692");
    expect(getMonetagScriptUrl()).toContain("tag.min.js?z=12165692");
  });

  it("safely handles zone configuration and default flags", async () => {
    const { monetagConfig, hasMonetagZone, isMonetagActive } = await import("./ads");
    expect(typeof monetagConfig.zoneId).toBe("string");
    expect(typeof monetagConfig.enabled).toBe("boolean");
    expect(hasMonetagZone()).toBe(true);
    expect(isMonetagActive()).toBe(true);
  });

  it("verifies Monetag verification files and service worker exist in public directory", () => {
    const pubFile1 = path.resolve(process.cwd(), "public/6c71a3962bfa4c5ea1f5927c81d83ee6.txt");
    const pubFile2 = path.resolve(process.cwd(), "public/cb4187fd3a8148d4b13e5346b017aade.txt");
    const swFile = path.resolve(process.cwd(), "public/sw.js");
    const rootSwFile = path.resolve(process.cwd(), "sw.js");

    expect(fs.existsSync(pubFile1)).toBe(true);
    expect(fs.existsSync(pubFile2)).toBe(true);
    expect(fs.existsSync(swFile)).toBe(true);
    expect(fs.existsSync(rootSwFile)).toBe(true);

    const swContent = fs.readFileSync(swFile, "utf-8");
    expect(swContent).toContain("3nbf4.com");
    expect(swContent).toContain("12165692");
  });
});
