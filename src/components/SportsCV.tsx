import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import type { SportsCVData, CardTheme } from "@/types/sports-cv";
import {
  loadSportsCVData,
  saveSportsCVData,
  downloadSportsCardAsPNG,
  buildScoutTextSummary,
  getDefaultSportsCV,
} from "@/lib/sports-cv-storage";
import { SportsCVCard } from "@/components/SportsCVCard";
import { SportsCVEditor } from "@/components/SportsCVEditor";
import { AthleteProfileAgent } from "@/components/AthleteProfileAgent";
import { AthleteOnboardingWizard } from "@/components/AthleteOnboardingWizard";
import type { AthleteProfile } from "@/lib/athlete-profile-agent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Share2,
  Download,
  Copy,
  Edit3,
  Eye,
  Columns,
  Sparkles,
  Lock,
  Wallet,
  QrCode,
  RotateCcw,
  Palette,
  ExternalLink,
  Wand2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface SportsCVProps {
  initialViewMode?: "card" | "edit" | "split" | "wizard";
  className?: string;
}

export function SportsCV({ initialViewMode = "card", className = "" }: SportsCVProps) {
  const { sportsCVUnlocked, unlockSportsCV, wallet, name, plan } = useAuth();

  // Active CV state
  const [data, setData] = useState<SportsCVData>(() => loadSportsCVData(name));
  const [viewMode, setViewMode] = useState<"card" | "edit" | "split" | "wizard">(initialViewMode);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "upi">("wallet");
  const [isExporting, setIsExporting] = useState(false);

  // Sync athleteName from auth if user has logged in and not custom named
  useEffect(() => {
    if (!name || name === "Aarav Sharma") return;
    setData((prev) => {
      if (prev.athleteName === "Aarav Sharma") {
        const updated = { ...prev, athleteName: name };
        saveSportsCVData(updated);
        return updated;
      }
      return prev;
    });
  }, [name]);

  // Listen for custom event whenever wizard or another editor updates CV
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SportsCVData>;
      if (customEvent?.detail) {
        setData(customEvent.detail);
      } else {
        setData(loadSportsCVData(name));
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("khelgrid_sportscv_updated", handleUpdate);
      return () => window.removeEventListener("khelgrid_sportscv_updated", handleUpdate);
    }
  }, [name]);

  // Handle updates from editor
  const handleDataChange = (updated: SportsCVData) => {
    setData(updated);
    saveSportsCVData(updated);
  };

  // Switch Theme
  const handleThemeChange = (theme: CardTheme) => {
    const updated = { ...data, theme };
    setData(updated);
    saveSportsCVData(updated);
    toast.success(`Theme set to ${theme.toUpperCase()}`);
  };

  // Download high-res PNG image
  const handleDownloadCard = async () => {
    try {
      setIsExporting(true);
      await downloadSportsCardAsPNG(data);
      toast.success("Downloaded high-resolution Scout Card (PNG)!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate image download.");
    } finally {
      setIsExporting(false);
    }
  };

  // Share profile
  const handleShare = async () => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/profile?id=${data.athleteId}`
        : `https://khelgrid.com/profile/${data.athleteId}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${data.athleteName} · Sports CV (${data.sport})`,
          text: `Check out ${data.athleteName}'s verified ${data.sport} Sports CV and performance metrics on KhelGrid!`,
          url: shareUrl,
        });
        toast.success("Profile shared!");
        return;
      } catch (err) {
        // user cancelled or share failed, fallback to copy
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Profile link copied to clipboard!");
    }
  };

  // Copy Scout summary text
  const handleCopySummary = async () => {
    const summary = buildScoutTextSummary(data);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(summary);
      toast.success("Scout CV summary copied to clipboard! Ready to paste into WhatsApp or Email.");
    }
  };

  // Reset to default sample data
  const handleResetSample = () => {
    const sample = getDefaultSportsCV(name || "Aarav Sharma");
    setData(sample);
    saveSportsCVData(sample);
    toast.info("Reset Sports CV to verified sample records.");
  };

  // Handle Pro Unlock
  const handleUnlock = () => {
    if (paymentMethod === "wallet") {
      const ok = unlockSportsCV("wallet");
      if (!ok) {
        toast.error("Insufficient wallet balance.");
        return;
      }
    } else {
      unlockSportsCV("upi");
    }
    toast.success("Verified Sports CV unlocked ✨");
    setUnlockModalOpen(false);
  };

  const isVerifiedUnlocked = sportsCVUnlocked || plan === "pro";

  // Map to AthleteProfile for completeness agent
  const athleteProfileForAgent: AthleteProfile = {
    name: data.athleteName,
    sport: data.sport,
    ageBand: data.ageCategory,
    city: data.city,
    fitnessSummary:
      data.performanceMetrics.length > 0
        ? `${data.performanceMetrics.length} metrics recorded`
        : null,
    results: data.achievements.map((a) => `${a.year} - ${a.title}`),
    trials: [],
    videoUrl: data.highlightVideoUrl || null,
    coachReference: data.coachReference?.name || null,
    availability: data.availability,
  };

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Onboarding Wizard Invitation Banner */}
      {viewMode !== "wizard" && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Wand2 className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-foreground text-xs sm:text-sm">
                Interactive Sports CV & Social Profiles Setup Wizard
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Guided 6-step flow to calibrate performance metrics, honours, and connect your
                Instagram & YouTube highlight reels.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => setViewMode("wizard")}
              className="h-8 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground shadow-sm"
            >
              <Wand2 className="h-3.5 w-3.5" /> Start Wizard
            </Button>
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link to="/onboarding">Full Screen →</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* View mode buttons */}
          <div className="flex items-center rounded-xl border border-border bg-muted/30 p-1">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "card"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Profile Card
            </button>

            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "edit"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Stats
            </button>

            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`hidden lg:flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "split"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              Split View
            </button>

            <button
              type="button"
              onClick={() => setViewMode("wizard")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "wizard"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Wand2 className="h-3.5 w-3.5" />
              Setup Wizard
            </button>
          </div>

          {/* Theme chips */}
          <div className="flex items-center gap-1.5 pl-1 sm:pl-2">
            <span className="hidden sm:inline-flex items-center text-xs text-muted-foreground">
              <Palette className="mr-1 h-3.5 w-3.5" /> Theme:
            </span>
            {(["gold", "cyber", "emerald", "crimson", "classic"] as CardTheme[]).map((thm) => (
              <button
                key={thm}
                type="button"
                onClick={() => handleThemeChange(thm)}
                title={`Select ${thm} theme`}
                className={`h-6 w-6 rounded-full border-2 transition-transform ${
                  data.theme === thm
                    ? "scale-110 border-primary"
                    : "border-transparent opacity-70 hover:opacity-100"
                } ${
                  thm === "gold"
                    ? "bg-amber-400"
                    : thm === "cyber"
                      ? "bg-cyan-400"
                      : thm === "emerald"
                        ? "bg-emerald-500"
                        : thm === "crimson"
                          ? "bg-rose-500"
                          : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadCard}
            disabled={isExporting}
            className="text-xs h-8 gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            {isExporting ? "Generating..." : "Download Card (PNG)"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="text-xs h-8 gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopySummary}
            className="text-xs h-8 gap-1.5"
            title="Copy scout-ready text summary"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy Text
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleResetSample}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Reset to sample data"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Content Area based on viewMode */}
      {viewMode === "card" && (
        <div className="space-y-4">
          <SportsCVCard data={data} />
          <AthleteProfileAgent profile={athleteProfileForAgent} />
        </div>
      )}

      {viewMode === "edit" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div>
              <h4 className="font-semibold text-sm">Real-Time Athletic CV Editor</h4>
              <p className="text-xs text-muted-foreground">
                All changes save automatically and reflect live on your shareable visual profile
                card.
              </p>
            </div>
            <Button size="sm" onClick={() => setViewMode("card")} className="gap-1.5 text-xs">
              <Eye className="h-3.5 w-3.5" /> View Card
            </Button>
          </div>

          <SportsCVEditor data={data} onChange={handleDataChange} />
        </div>
      )}

      {viewMode === "split" && (
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7">
            <SportsCVEditor data={data} onChange={handleDataChange} />
          </div>
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
              <span>Live Visual Card Preview</span>
              <span className="text-primary font-mono">{data.theme.toUpperCase()} THEME</span>
            </div>
            <SportsCVCard data={data} />
            <AthleteProfileAgent profile={athleteProfileForAgent} />
          </div>
        </div>
      )}

      {viewMode === "wizard" && (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
          <AthleteOnboardingWizard
            onComplete={(updated) => {
              setData(updated);
              setViewMode("card");
            }}
            onCancel={() => setViewMode("card")}
          />
        </div>
      )}

      {/* Verified Status Banner if not unlocked */}
      {!isVerifiedUnlocked && (
        <div className="rounded-2xl border border-border bg-gradient-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Official Verification
                </Badge>
                <span className="text-xs font-medium text-muted-foreground">
                  Permanent Scout ID & Trial Stamp
                </span>
              </div>
              <h4 className="font-bold text-base">Get KhelGrid Verified Scout Badge</h4>
              <p className="text-xs text-muted-foreground max-w-xl">
                Upgrade to affix official verification seals, auto-sync trial performance results,
                and generate scannable tamper-proof QR codes for state recruiters.
              </p>
            </div>

            <Button
              onClick={() => setUnlockModalOpen(true)}
              className="bg-gradient-gold text-primary-foreground hover:opacity-90 shrink-0 gap-2"
            >
              <Lock className="h-4 w-4" /> Unlock Official Verification (₹199)
            </Button>
          </div>
        </div>
      )}

      {/* Verification Unlock Modal */}
      <Dialog open={unlockModalOpen} onOpenChange={setUnlockModalOpen}>
        <DialogContent className="max-w-md border-border bg-gradient-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Unlock Official Verified Sports CV
            </DialogTitle>
            <DialogDescription>
              One-time verification fee · valid for current sports season across all state trials.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Verification Package</span>
              <span className="text-2xl font-bold">₹199</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Includes tamper-proof QR verification and priority scout listing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPaymentMethod("wallet")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                paymentMethod === "wallet"
                  ? "border-primary bg-primary/10 font-semibold text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              <Wallet className="h-4 w-4" /> Wallet · ₹{wallet.toLocaleString("en-IN")}
            </button>
            <button
              onClick={() => setPaymentMethod("upi")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                paymentMethod === "upi"
                  ? "border-primary bg-primary/10 font-semibold text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              <QrCode className="h-4 w-4" /> UPI FastPay
            </button>
          </div>

          <Button
            onClick={handleUnlock}
            className="w-full"
            size="lg"
            disabled={paymentMethod === "wallet" && wallet < 199}
          >
            {paymentMethod === "wallet" && wallet < 199
              ? "Insufficient wallet balance"
              : "Confirm & Seal Verified Sports CV"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SportsCV;
