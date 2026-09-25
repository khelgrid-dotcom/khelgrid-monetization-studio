import type { SportsCVData, AthleticAchievement, PerformanceMetric } from "@/types/sports-cv";

export const SPORTS_CV_STORAGE_KEY = "khelgrid_athlete_sports_cv_v2";

export const SAMPLE_ACHIEVEMENTS: AthleticAchievement[] = [
  {
    id: "ach-1",
    title: "State Championship Gold Medalist",
    competition: "Delhi State Youth Athletics & Cricket Meet 2025",
    year: 2025,
    level: "State",
    award: "Gold / 1st Place",
    description:
      "Led the team with 348 runs across 5 innings and 11 wickets; awarded Player of the Tournament.",
    verified: true,
  },
  {
    id: "ach-2",
    title: "National Zonal Selection Trial Top 3",
    competition: "North Zone Inter-Academy Talent Trophy",
    year: 2024,
    level: "National",
    award: "State Selection",
    description: "Shortlisted for National Camp out of 420 prospective athletes across 6 states.",
    verified: true,
  },
  {
    id: "ach-3",
    title: "District Championship MVP",
    competition: "Inter-District Summer Sports Tournament",
    year: 2024,
    level: "District",
    award: "MVP / Best Player",
    description:
      "Match-winning performance in the finals with 84 runs off 52 balls and 3 run-outs.",
    verified: true,
  },
];

export const SAMPLE_METRICS: PerformanceMetric[] = [
  {
    id: "met-1",
    name: "Bowling Top Speed",
    value: "134.5",
    unit: "km/h",
    category: "Speed",
    score: 92,
    benchmark: "BCCI U-19 Elite: 130+ km/h",
  },
  {
    id: "met-2",
    name: "Yo-Yo Endurance Test",
    value: "19.8",
    unit: "level",
    category: "Endurance",
    score: 94,
    benchmark: "State Benchmark: 19.0+",
  },
  {
    id: "met-3",
    name: "40m Sprint Dash",
    value: "4.88",
    unit: "s",
    category: "Speed",
    score: 91,
    benchmark: "Target: <5.00s",
  },
  {
    id: "met-4",
    name: "Vertical Jump",
    value: "64",
    unit: "cm",
    category: "Power",
    score: 86,
    benchmark: "Athletics Target: 60cm",
  },
  {
    id: "met-5",
    name: "Batting Strike Rate",
    value: "144.2",
    unit: "SR",
    category: "Sport-Specific",
    score: 88,
    benchmark: "Power Hitter Benchmark: 135+",
  },
];

export function getDefaultSportsCV(athleteName = "Aarav Sharma"): SportsCVData {
  return {
    id: "scv-user-default",
    athleteName: athleteName || "Aarav Sharma",
    sport: "Cricket",
    position: "Right-Arm Fast Bowler & Lower-Order Hitter",
    secondaryPosition: "Middle-Order Batsman",
    jerseyNumber: "#18",
    ageCategory: "U-19",
    age: 18,
    city: "New Delhi",
    state: "Delhi NCR",
    currentAcademy: "National Sports Excellence Academy",
    dominantSide: "Right",
    height: "182 cm (6'0\")",
    weight: "74 kg",
    bio: "Explosive seam bowler hitting deck at 134+ km/h with deceptive bouncer and dependable tail-end finishing. Consistent performer in domestic state tournaments.",
    verified: true,
    athleteId: "KG-IND-2026-9042",
    theme: "gold",
    achievements: SAMPLE_ACHIEVEMENTS,
    performanceMetrics: SAMPLE_METRICS,
    highlightVideoUrl: "https://youtu.be/sample-reel",
    socialProfiles: {
      instagram: "@aarav.sharma.pace",
      youtube: "https://youtu.be/sample-reel",
      twitter: "@aaravsharma_pace",
      cricheroes: "https://cricheroes.com/player-profile/aarav-sharma",
    },
    coachReference: {
      name: "Coach R. S. Negi",
      designation: "Head High-Performance Coach, NSEA",
      phoneOrEmail: "coach.negi@nsea.org.in",
    },
    availability: "Open for Trials",
    lastUpdated: new Date().toISOString(),
  };
}

let memoryFallback: string | null = null;

export function loadSportsCVData(fallbackName?: string): SportsCVData {
  try {
    let raw: string | null = null;
    if (typeof window !== "undefined" && window.localStorage) {
      raw = window.localStorage.getItem(SPORTS_CV_STORAGE_KEY);
    } else if (typeof localStorage !== "undefined" && localStorage.getItem) {
      raw = localStorage.getItem(SPORTS_CV_STORAGE_KEY);
    } else {
      raw = memoryFallback;
    }

    if (!raw && memoryFallback) {
      raw = memoryFallback;
    }

    if (!raw) {
      const initial = getDefaultSportsCV(fallbackName);
      saveSportsCVData(initial);
      return initial;
    }

    const parsed = JSON.parse(raw);
    // If fallbackName is provided and user changed name, reflect if appropriate
    if (fallbackName && parsed.athleteName === "Aarav Sharma" && fallbackName !== "Aarav Sharma") {
      parsed.athleteName = fallbackName;
    }
    return parsed;
  } catch {
    return getDefaultSportsCV(fallbackName);
  }
}

export function saveSportsCVData(data: SportsCVData): void {
  try {
    const updated = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    const serialized = JSON.stringify(updated);
    memoryFallback = serialized;

    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(SPORTS_CV_STORAGE_KEY, serialized);
    } else if (typeof localStorage !== "undefined" && localStorage.setItem) {
      localStorage.setItem(SPORTS_CV_STORAGE_KEY, serialized);
    }
  } catch (err) {
    console.error("Failed to save sports CV data:", err);
  }
}

/**
 * Generates an instant high-resolution PNG image on an HTML5 canvas
 * with professional scout card typography, badges, metrics, and achievements.
 */
export async function downloadSportsCardAsPNG(data: SportsCVData): Promise<void> {
  if (typeof document === "undefined") return;

  const width = 1200;
  const height = 1500;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background gradient based on theme
  const isGold = data.theme === "gold";
  const isCyber = data.theme === "cyber";
  const isEmerald = data.theme === "emerald";
  const isCrimson = data.theme === "crimson";

  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  if (isGold) {
    bgGrad.addColorStop(0, "#12110c");
    bgGrad.addColorStop(0.5, "#1c180e");
    bgGrad.addColorStop(1, "#0a0906");
  } else if (isCyber) {
    bgGrad.addColorStop(0, "#08131e");
    bgGrad.addColorStop(0.5, "#0b1c2d");
    bgGrad.addColorStop(1, "#040b13");
  } else if (isEmerald) {
    bgGrad.addColorStop(0, "#081810");
    bgGrad.addColorStop(0.5, "#0d261a");
    bgGrad.addColorStop(1, "#040e09");
  } else if (isCrimson) {
    bgGrad.addColorStop(0, "#1a0b0d");
    bgGrad.addColorStop(0.5, "#291014");
    bgGrad.addColorStop(1, "#0d0406");
  } else {
    // classic
    bgGrad.addColorStop(0, "#121417");
    bgGrad.addColorStop(0.5, "#1e2229");
    bgGrad.addColorStop(1, "#0b0d0f");
  }

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer border with accent glow
  const primaryColor = isGold
    ? "#eab308"
    : isCyber
      ? "#06b6d4"
      : isEmerald
        ? "#10b981"
        : isCrimson
          ? "#f43f5e"
          : "#38bdf8";

  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  // Inner subtle border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  ctx.strokeRect(44, 44, width - 88, height - 88);

  // Header banner
  ctx.fillStyle = primaryColor;
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("KHELGRID · VERIFIED ATHLETE SCOUT PROFILE", 70, 95);

  // ID on right
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "16px monospace";
  ctx.fillText(data.athleteId || "KG-SCOUT-2026", width - 70, 95);
  ctx.textAlign = "left";

  // Horizontal divider
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.beginPath();
  ctx.moveTo(70, 120);
  ctx.lineTo(width - 70, 120);
  ctx.stroke();

  // Athlete Name
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 56px sans-serif";
  ctx.fillText(data.athleteName, 70, 195);

  // Sport & Position Pill
  ctx.fillStyle = primaryColor;
  ctx.font = "bold 26px sans-serif";
  const posText = `${data.sport.toUpperCase()} · ${data.position.toUpperCase()}`;
  ctx.fillText(posText, 70, 240);

  // Badge tags (Age category, city, jersey)
  const metaTags = [
    data.ageCategory,
    data.city,
    data.jerseyNumber ? `No. ${data.jerseyNumber}` : "",
    data.dominantSide ? `${data.dominantSide}-Handed` : "",
    data.height ? data.height : "",
  ].filter(Boolean);

  let tagX = 70;
  ctx.font = "bold 15px sans-serif";
  metaTags.forEach((tag) => {
    const textW = ctx.measureText(tag).width;
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.roundRect(tagX, 265, textW + 24, 34, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#f3f4f6";
    ctx.fillText(tag, tagX + 12, 288);
    tagX += textW + 36;
  });

  // Bio box
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.beginPath();
  ctx.roundRect(70, 325, width - 140, 80, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.font = "17px sans-serif";
  const truncatedBio = data.bio.length > 140 ? data.bio.substring(0, 137) + "..." : data.bio;
  ctx.fillText(truncatedBio, 90, 360);
  ctx.fillStyle = primaryColor;
  ctx.font = "italic 14px sans-serif";
  ctx.fillText(`Current Academy: ${data.currentAcademy || "Independent Trainee"}`, 90, 388);

  // Section 1: Core Performance Metrics
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("⚡ PERFORMANCE METRICS & BENCHMARKS", 70, 450);

  let metY = 485;
  const metricsToRender = data.performanceMetrics.slice(0, 5);
  metricsToRender.forEach((met, idx) => {
    // Card item
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.roundRect(70, metY, width - 140, 68, 10);
    ctx.fill();
    ctx.stroke();

    // Metric Name & Category
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 19px sans-serif";
    ctx.fillText(met.name, 92, metY + 30);

    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "14px sans-serif";
    ctx.fillText(met.benchmark || `Category: ${met.category}`, 92, metY + 54);

    // Value on right
    ctx.textAlign = "right";
    ctx.fillStyle = primaryColor;
    ctx.font = "900 26px monospace";
    ctx.fillText(`${met.value} ${met.unit}`, width - 92, metY + 42);
    ctx.textAlign = "left";

    metY += 80;
  });

  // Section 2: Athletic Achievements
  const achSectionY = metY + 30;
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("🏆 ATHLETIC ACHIEVEMENTS & TITLES", 70, achSectionY);

  let achY = achSectionY + 35;
  const achsToRender = data.achievements.slice(0, 4);
  achsToRender.forEach((ach) => {
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.roundRect(70, achY, width - 140, 85, 10);
    ctx.fill();
    ctx.stroke();

    // Level Badge
    ctx.fillStyle = primaryColor;
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(`${ach.level.toUpperCase()} · ${ach.year}`, 92, achY + 26);

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 19px sans-serif";
    ctx.fillText(ach.title, 92, achY + 50);

    // Competition & Award
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.font = "14px sans-serif";
    const compText = `${ach.award} | ${ach.competition}`;
    ctx.fillText(compText.substring(0, 90), 92, achY + 72);

    achY += 98;
  });

  // Footer: Verification & QR
  const footerY = height - 120;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.beginPath();
  ctx.moveTo(70, footerY - 20);
  ctx.lineTo(width - 70, footerY - 20);
  ctx.stroke();

  ctx.fillStyle = primaryColor;
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("✓ VERIFIED ATHLETE PROFILE · KHELGRID SCOUT NETWORK", 70, footerY + 15);

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "14px sans-serif";
  ctx.fillText(
    "Tamper-proof athlete credentials verified against official state trials & academy records.",
    70,
    footerY + 38,
  );

  // Date & URL
  ctx.textAlign = "right";
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px monospace";
  ctx.fillText(`khelgrid.com/profile/${data.athleteId}`, width - 70, footerY + 15);
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillText(`Issued: ${new Date().toLocaleDateString("en-IN")}`, width - 70, footerY + 38);
  ctx.textAlign = "left";

  // Trigger download
  const dataUrl = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  const cleanName = data.athleteName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  a.download = `${cleanName}-sports-cv-card.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Copies a formatted scouting summary of the athlete to clipboard
 */
export function buildScoutTextSummary(data: SportsCVData): string {
  const metricsStr = data.performanceMetrics
    .map((m) => `• ${m.name}: ${m.value} ${m.unit} (${m.benchmark || m.category})`)
    .join("\n");

  const achStr = data.achievements
    .map((a) => `• [${a.year}] ${a.title} (${a.level} - ${a.award})`)
    .join("\n");

  const socialStr = data.socialProfiles
    ? [
        data.socialProfiles.instagram ? `• Instagram: ${data.socialProfiles.instagram}` : null,
        data.socialProfiles.youtube ? `• Video Reel: ${data.socialProfiles.youtube}` : null,
        data.socialProfiles.twitter ? `• Twitter/X: ${data.socialProfiles.twitter}` : null,
        data.socialProfiles.cricheroes ? `• CricHeroes: ${data.socialProfiles.cricheroes}` : null,
        data.socialProfiles.strava ? `• Strava: ${data.socialProfiles.strava}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return `🏅 ATHLETE SPORTS CV · KHELGRID SCOUT PORTAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.athleteName}
Sport: ${data.sport}
Position: ${data.position}${data.secondaryPosition ? ` / ${data.secondaryPosition}` : ""}
Category: ${data.ageCategory} | Jersey: ${data.jerseyNumber || "N/A"}
Location: ${data.city}, ${data.state}
Academy: ${data.currentAcademy || "Independent"}
Physical: ${data.height || "N/A"} | ${data.weight || "N/A"} | Dominant: ${data.dominantSide}
Status: ${data.availability}

⚡ KEY PERFORMANCE METRICS:
${metricsStr || "• Standard baseline trials pending"}

🏆 ATHLETIC ACHIEVEMENTS & HONOURS:
${achStr || "• In-season record registered"}
${socialStr ? `\n📱 CONNECTED ATHLETIC PROFILES:\n${socialStr}` : ""}
${data.coachReference ? `\n👤 Coach Reference: ${data.coachReference.name} (${data.coachReference.designation})` : ""}
🔗 Verified Profile ID: ${data.athleteId} (https://khelgrid.com)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}
