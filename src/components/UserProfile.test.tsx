import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderToString } from "react-dom/server";
import { UserProfile } from "./UserProfile";
import {
  DEFAULT_USER_PROFILE,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_ENROLLED_PROGRAMS,
  DEFAULT_MEMBERSHIP,
  getUserProfile,
  getSportsAchievements,
  getEnrolledPrograms,
  getUserMembership,
  addSportsAchievement,
  toggleMembershipAutoRenew,
} from "@/lib/user-profile-service";

describe("UserProfile Component and Supabase Service", () => {
  it("exports default data fixtures for athlete profile, achievements, programs and membership", () => {
    expect(DEFAULT_USER_PROFILE.fullName).toBe("Arjun Mehta");
    expect(DEFAULT_USER_PROFILE.primarySport).toBe("Cricket");
    expect(DEFAULT_ACHIEVEMENTS.length).toBeGreaterThan(0);
    expect(DEFAULT_ACHIEVEMENTS[0].sport).toBe("Cricket");
    expect(DEFAULT_ENROLLED_PROGRAMS.length).toBeGreaterThan(0);
    expect(DEFAULT_MEMBERSHIP.status).toBe("active");
  });

  it("fetches default profile when database table is fresh", async () => {
    const { profile } = await getUserProfile();
    expect(profile.fullName).toBe("Arjun Mehta");
    expect(profile.city).toBe("Bengaluru");
  });

  it("fetches sports achievements with category, organization, and verification status", async () => {
    const { achievements } = await getSportsAchievements();
    expect(achievements.length).toBeGreaterThan(0);
    const verified = achievements.filter((a) => a.verified);
    expect(verified.length).toBeGreaterThan(0);
    expect(achievements[0].title).toBeDefined();
  });

  it("fetches enrolled coaching programs with coach, fee, and timing details", async () => {
    const { programs } = await getEnrolledPrograms();
    expect(programs.length).toBeGreaterThan(0);
    expect(programs[0].programTitle).toBeDefined();
    expect(programs[0].coachName).toBeDefined();
    expect(programs[0].pricePerMonth).toBeGreaterThan(0);
  });

  it("fetches user membership with active status, remaining hours, and perks", async () => {
    const { membership } = await getUserMembership();
    expect(membership.tier).toBe("pro");
    expect(membership.status).toBe("active");
    expect(membership.allocatedHoursPerMonth).toBe(12);
    expect(membership.perks.length).toBeGreaterThan(0);
  });

  it("adds a new sports achievement with proper fields", async () => {
    const res = await addSportsAchievement({
      title: "State Level Inter-School Badminton Championship",
      sport: "Badminton",
      category: "tournament",
      level: "State",
      organization: "Karnataka School Games Federation",
      year: 2025,
      positionRank: "Gold Medal",
      description: "Won singles tournament without dropping a single set.",
      verified: true,
      verificationBadge: "School Federation Verified",
    });

    expect(res.achievement.id).toBeDefined();
    expect(res.achievement.title).toContain("Badminton");
    expect(res.achievement.year).toBe(2025);
  });

  it("toggles auto renewal flag for membership status", async () => {
    const toggled = await toggleMembershipAutoRenew("mem-arjun-pro", false);
    // Returns boolean status
    expect(typeof toggled).toBe("boolean");
  });

  it("renders UserProfile component in achievements tab with all key id attributes", () => {
    const html = renderToString(<UserProfile initialTab="achievements" />);
    expect(html).toContain('id="user-profile-root"');
    expect(html).toContain('id="user-profile-header-card"');
    expect(html).toContain('id="user-profile-name"');
    expect(html).toContain('id="supabase-status-pill"');
    expect(html).toContain('id="tab-sports-achievements"');
    expect(html).toContain('id="tab-enrolled-programs"');
    expect(html).toContain('id="tab-membership-status"');
    expect(html).toContain('id="section-sports-achievements"');
    expect(html).toContain("Sports Achievements");
  });

  it("renders UserProfile component with enrolled programs initial tab", () => {
    const html = renderToString(<UserProfile initialTab="programs" />);
    expect(html).toContain('id="user-profile-root"');
    expect(html).toContain('id="section-enrolled-programs"');
    expect(html).toContain("Active Academy Programs");
  });

  it("renders UserProfile component with membership initial tab", () => {
    const html = renderToString(<UserProfile initialTab="membership" />);
    expect(html).toContain('id="user-profile-root"');
    expect(html).toContain('id="section-membership-status"');
    expect(html).toContain("TIER");
  });
});
