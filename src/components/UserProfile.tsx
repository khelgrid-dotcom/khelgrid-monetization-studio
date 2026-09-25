import { useEffect, useState, useMemo } from "react";
import {
  Trophy,
  Award,
  Medal,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Plus,
  Edit3,
  RefreshCw,
  Database,
  Crown,
  Zap,
  Users,
  AlertCircle,
  Filter,
  Layers,
  ChevronRight,
  Wand2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  getUserProfile,
  getSportsAchievements,
  getEnrolledPrograms,
  getUserMembership,
  addSportsAchievement,
  toggleMembershipAutoRenew,
  updateUserProfile,
  DEFAULT_USER_PROFILE,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_ENROLLED_PROGRAMS,
  DEFAULT_MEMBERSHIP,
  type UserProfileData,
  type SportsAchievement,
  type EnrolledProgram,
  type UserMembershipStatus,
} from "@/lib/user-profile-service";
import { SportsCV } from "@/components/SportsCV";

interface UserProfileProps {
  initialTab?: "achievements" | "programs" | "membership" | "sports-cv";
  showEditControls?: boolean;
  className?: string;
}

export function UserProfile({
  initialTab = "achievements",
  showEditControls = true,
  className = "",
}: UserProfileProps) {
  // State initialized with valid default athlete data
  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_USER_PROFILE);
  const [achievements, setAchievements] = useState<SportsAchievement[]>(DEFAULT_ACHIEVEMENTS);
  const [programs, setPrograms] = useState<EnrolledProgram[]>(DEFAULT_ENROLLED_PROGRAMS);
  const [membership, setMembership] = useState<UserMembershipStatus>(DEFAULT_MEMBERSHIP);

  const [loading, setLoading] = useState(false);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "achievements" | "programs" | "membership" | "sports-cv"
  >(initialTab);

  // Filters for achievements
  const [selectedSport, setSelectedSport] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");

  // Modals state
  const [isAddAchievementOpen, setIsAddAchievementOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for Add Achievement
  const [achForm, setAchForm] = useState({
    title: "",
    sport: "Cricket",
    category: "tournament" as SportsAchievement["category"],
    level: "State" as SportsAchievement["level"],
    organization: "",
    year: new Date().getFullYear(),
    positionRank: "",
    description: "",
    verified: true,
    verificationBadge: "Official Association Verified",
  });

  // Form states for Edit Profile
  const [profileForm, setProfileForm] = useState({
    fullName: DEFAULT_USER_PROFILE.fullName,
    primarySport: DEFAULT_USER_PROFILE.primarySport,
    city: DEFAULT_USER_PROFILE.city,
    playingPosition: DEFAULT_USER_PROFILE.playingPosition,
    skillLevel: DEFAULT_USER_PROFILE.skillLevel,
    bio: DEFAULT_USER_PROFILE.bio,
  });

  // Load all user data from Supabase / local service
  const loadData = async () => {
    setLoading(true);
    try {
      const [profRes, achRes, progRes, memRes] = await Promise.all([
        getUserProfile(),
        getSportsAchievements(),
        getEnrolledPrograms(),
        getUserMembership(),
      ]);

      setProfile(profRes.profile);
      setAchievements(achRes.achievements);
      setPrograms(progRes.programs);
      setMembership(memRes.membership);
      setIsSupabaseLive(profRes.isSupabaseLive || achRes.isSupabaseLive || progRes.isSupabaseLive);

      setProfileForm({
        fullName: profRes.profile.fullName,
        primarySport: profRes.profile.primarySport,
        city: profRes.profile.city,
        playingPosition: profRes.profile.playingPosition,
        skillLevel: profRes.profile.skillLevel,
        bio: profRes.profile.bio,
      });
    } catch (err) {
      console.error("Error loading user profile data:", err);
      toast.error("Could not sync with Supabase. Loaded offline cache.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleAchievementAdded = () => {
      getSportsAchievements().then((res) => setAchievements(res.achievements));
    };
    window.addEventListener("khelgrid_achievement_added", handleAchievementAdded);
    return () => window.removeEventListener("khelgrid_achievement_added", handleAchievementAdded);
  }, []);

  // Filtered achievements
  const filteredAchievements = useMemo(() => {
    return achievements.filter((ach) => {
      const sportMatch =
        selectedSport === "All" || ach.sport.toLowerCase() === selectedSport.toLowerCase();
      const levelMatch =
        selectedLevel === "All" || ach.level.toLowerCase() === selectedLevel.toLowerCase();
      return sportMatch && levelMatch;
    });
  }, [achievements, selectedSport, selectedLevel]);

  // Unique sports and levels in achievements
  const availableSports = useMemo(() => {
    const set = new Set(achievements.map((a) => a.sport));
    return ["All", ...Array.from(set)];
  }, [achievements]);

  // Handle Add Achievement Submit
  const handleAddAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achForm.title.trim() || !achForm.organization.trim()) {
      toast.error("Please fill in the title and organization.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addSportsAchievement({
        title: achForm.title.trim(),
        sport: achForm.sport,
        category: achForm.category,
        level: achForm.level,
        organization: achForm.organization.trim(),
        year: Number(achForm.year),
        positionRank: achForm.positionRank.trim() || undefined,
        description: achForm.description.trim() || undefined,
        verified: achForm.verified,
        verificationBadge: achForm.verified ? achForm.verificationBadge : undefined,
      });

      setAchievements((prev) => [res.achievement, ...prev]);
      setIsAddAchievementOpen(false);
      setAchForm({
        title: "",
        sport: "Cricket",
        category: "tournament",
        level: "State",
        organization: "",
        year: new Date().getFullYear(),
        positionRank: "",
        description: "",
        verified: true,
        verificationBadge: "Official Association Verified",
      });

      if (res.syncedToDb) {
        toast.success("Achievement saved and synced to Supabase!");
      } else {
        toast.success("Achievement saved locally (ready for next Supabase sync).");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add achievement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Profile Update Submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await updateUserProfile({
        fullName: profileForm.fullName.trim(),
        primarySport: profileForm.primarySport.trim(),
        city: profileForm.city.trim(),
        playingPosition: profileForm.playingPosition.trim(),
        skillLevel: profileForm.skillLevel.trim(),
        bio: profileForm.bio.trim(),
      });

      setProfile(res.profile);
      setIsEditProfileOpen(false);
      toast.success(
        res.syncedToDb
          ? "Profile updated and synchronized to Supabase!"
          : "Profile changes saved locally.",
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Auto-Renew Toggle
  const handleAutoRenewToggle = async (checked: boolean) => {
    if (!membership) return;
    setMembership((prev) => (prev ? { ...prev, autoRenew: checked } : prev));
    try {
      const synced = await toggleMembershipAutoRenew(membership.id, checked);
      toast.success(
        checked
          ? "Auto-renewal enabled for next billing cycle."
          : "Auto-renewal turned off. Your pass remains active until expiry.",
      );
      if (synced) setIsSupabaseLive(true);
    } catch (err) {
      console.error("Auto renew toggle failed", err);
    }
  };

  if (!profile) return null;

  return (
    <div id="user-profile-root" className={`w-full space-y-6 ${className}`}>
      {/* Top Banner Card: Athlete Identification & Live Supabase Status */}
      <div
        id="user-profile-header-card"
        className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all sm:p-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Left Column: Avatar & Core Information */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center md:items-start">
            <div className="relative shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="h-24 w-24 rounded-2xl border-2 border-primary/40 object-cover shadow-sm sm:h-28 sm:w-28"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                <ShieldCheck className="h-4 w-4" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  id="user-profile-name"
                  className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
                >
                  {profile.fullName}
                </h1>
                <Badge
                  id="user-profile-skill-badge"
                  variant="secondary"
                  className="bg-primary/10 text-primary font-medium text-xs hover:bg-primary/20"
                >
                  <Trophy className="mr-1 h-3 w-3" />
                  {profile.skillLevel}
                </Badge>
                <Badge
                  id="user-profile-age-badge"
                  variant="outline"
                  className="border-border text-xs text-muted-foreground"
                >
                  {profile.ageCategory}
                </Badge>
              </div>

              <p className="text-sm font-medium text-foreground/90">
                {profile.primarySport} · {profile.playingPosition}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  {profile.city}, India
                </span>
                <span>•</span>
                <span>{profile.email}</span>
              </div>

              {profile.bio && (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Connection Status & Controls */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center md:flex-col md:items-end">
            <div
              id="supabase-status-pill"
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border ${
                isSupabaseLive
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isSupabaseLive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              <Database className="h-3.5 w-3.5" />
              <span>{isSupabaseLive ? "Supabase Live Connected" : "Local Cached State"}</span>
            </div>

            {showEditControls && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="h-9 gap-1.5 border border-border font-semibold text-xs"
                >
                  <a href="/onboarding">
                    <Wand2 className="h-3.5 w-3.5 text-primary" />
                    <span>CV Wizard</span>
                  </a>
                </Button>
                <Button
                  id="btn-edit-user-profile"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditProfileOpen(true)}
                  className="h-9 gap-1.5 border-border hover:bg-secondary"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Profile
                </Button>
                <Button
                  id="btn-add-achievement-trigger"
                  size="sm"
                  onClick={() => setIsAddAchievementOpen(true)}
                  className="h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Achievement
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Athlete Overview Stats Grid */}
        <div
          id="user-profile-stats-grid"
          className="mt-6 grid grid-cols-2 gap-3 border-t border-border/60 pt-6 sm:grid-cols-4"
        >
          <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span>Achievements</span>
              <Trophy className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {achievements.length}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {achievements.filter((a) => a.verified).length} verified credentials
            </span>
          </div>

          <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span>Enrolled Programs</span>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {programs.length}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {programs.filter((p) => p.status === "active").length} active batches
            </span>
          </div>

          <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span>Membership</span>
              <Crown className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-1 truncate text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {membership?.tier ? membership.tier.toUpperCase() : "PRO"} PASS
            </div>
            <span className="text-[11px] text-muted-foreground">
              {membership?.daysRemaining ?? 0} days remaining
            </span>
          </div>

          <div className="rounded-xl border border-border/60 bg-secondary/30 p-3.5">
            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span>Court Allowance</span>
              <Zap className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {membership?.remainingHours ?? 0}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                / {membership?.allocatedHoursPerMonth ?? 12} hrs
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">Free monthly hours</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div
        id="user-profile-tabs-bar"
        className="flex items-center justify-between border-b border-border/80 pb-3"
      >
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            id="tab-sports-achievements"
            onClick={() => setActiveTab("achievements")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "achievements"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Sports Achievements</span>
            <span
              className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                activeTab === "achievements"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {achievements.length}
            </span>
          </button>

          <button
            id="tab-enrolled-programs"
            onClick={() => setActiveTab("programs")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "programs"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Enrolled Programs</span>
            <span
              className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                activeTab === "programs"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {programs.length}
            </span>
          </button>

          <button
            id="tab-membership-status"
            onClick={() => setActiveTab("membership")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "membership"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Crown className="h-4 w-4" />
            <span>Membership Status</span>
            <span
              className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                activeTab === "membership"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              Active
            </span>
          </button>

          <button
            id="tab-sports-cv-card"
            onClick={() => setActiveTab("sports-cv")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "sports-cv"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Sports CV Card</span>
            <span
              className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                activeTab === "sports-cv"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
              }`}
            >
              Live
            </span>
          </button>
        </div>

        <Button
          id="btn-refresh-profile"
          variant="ghost"
          size="sm"
          onClick={loadData}
          title="Reload from Supabase"
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Sync DB</span>
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: SPORTS ACHIEVEMENTS */}
      {/* ========================================================================= */}
      {activeTab === "achievements" && (
        <div id="section-sports-achievements" className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-3.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter by:</span>
              </div>

              {/* Sport filter */}
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger
                  id="filter-sport-trigger"
                  className="h-8 w-[140px] text-xs bg-secondary/40 border-border"
                >
                  <SelectValue placeholder="Sport" />
                </SelectTrigger>
                <SelectContent>
                  {availableSports.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Level filter */}
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger
                  id="filter-level-trigger"
                  className="h-8 w-[140px] text-xs bg-secondary/40 border-border"
                >
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {["All", "National", "Zonal", "State", "District", "Club"].map((l) => (
                    <SelectItem key={l} value={l} className="text-xs">
                      {l} Level
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Showing {filteredAchievements.length} of {achievements.length} records
              </span>
              <Button
                id="btn-add-achievement-inline"
                size="sm"
                variant="outline"
                onClick={() => setIsAddAchievementOpen(true)}
                className="h-8 text-xs border-primary/40 text-primary hover:bg-primary/10"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add New
              </Button>
            </div>
          </div>

          {/* Achievements List */}
          {filteredAchievements.length === 0 ? (
            <div
              id="achievements-empty-state"
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center"
            >
              <Trophy className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h3 className="text-base font-semibold text-foreground">No achievements found</h3>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                No achievements match your selected sport or competition level filters. You can add
                your verified records.
              </p>
              <Button
                id="btn-add-first-achievement"
                size="sm"
                onClick={() => setIsAddAchievementOpen(true)}
                className="mt-4 bg-primary text-primary-foreground text-xs"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Sports Achievement
              </Button>
            </div>
          ) : (
            <div id="achievements-cards-grid" className="grid gap-4 sm:grid-cols-2">
              {filteredAchievements.map((ach) => (
                <div
                  key={ach.id}
                  id={`achievement-card-${ach.id}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-secondary text-[11px] font-medium text-foreground"
                        >
                          {ach.sport}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-border text-[11px] text-muted-foreground"
                        >
                          {ach.level} Level
                        </Badge>
                        <span className="text-xs font-semibold text-muted-foreground">
                          {ach.year}
                        </span>
                      </div>

                      {ach.verified ? (
                        <Badge
                          id={`badge-verified-${ach.id}`}
                          variant="secondary"
                          className="shrink-0 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] gap-1"
                        >
                          <ShieldCheck className="h-3 w-3" />
                          {ach.verificationBadge || "Verified"}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="shrink-0 border-border text-[10px] text-muted-foreground"
                        >
                          Self-Logged
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {ach.title}
                      </h3>
                      <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                        {ach.organization}
                      </p>
                    </div>

                    {ach.positionRank && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        <Medal className="h-4 w-4 shrink-0" />
                        <span>{ach.positionRank}</span>
                      </div>
                    )}

                    {ach.description && (
                      <p className="text-xs leading-relaxed text-muted-foreground/90">
                        {ach.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Database className="h-3 w-3 text-primary/60" />
                      {ach.syncedToDb ? "Supabase Synchronized" : "Local Stored"}
                    </span>

                    {ach.certificateUrl && (
                      <a
                        href={ach.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 font-medium text-primary hover:underline"
                      >
                        View Certificate <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: ENROLLED PROGRAMS */}
      {/* ========================================================================= */}
      {activeTab === "programs" && (
        <div id="section-enrolled-programs" className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Active Academy Programs</h3>
                <p className="text-xs text-muted-foreground">
                  Synchronized with Supabase{" "}
                  <code className="text-primary font-mono">coaching_enrollments</code> &amp;{" "}
                  <code className="text-primary font-mono">coaching_programs</code>.
                </p>
              </div>
              <Badge variant="outline" className="w-fit border-border text-xs">
                {programs.length} Programs Registered
              </Badge>
            </div>
          </div>

          {programs.length === 0 ? (
            <div
              id="programs-empty-state"
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center"
            >
              <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h3 className="text-base font-semibold text-foreground">No enrolled programs yet</h3>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                You have not registered for any coaching academy batches yet. Explore training hubs
                to find certified coaches.
              </p>
            </div>
          ) : (
            <div id="programs-cards-grid" className="grid gap-4 sm:grid-cols-2">
              {programs.map((prog) => (
                <div
                  key={prog.id}
                  id={`program-card-${prog.id}`}
                  className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all hover:border-primary/50"
                >
                  {prog.imageUrl && (
                    <div className="relative h-36 w-full overflow-hidden bg-muted sm:h-40">
                      <img
                        src={prog.imageUrl}
                        alt={prog.programTitle}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-background/90 text-foreground backdrop-blur border-0 text-xs font-semibold">
                          {prog.sport}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge
                          id={`program-status-${prog.id}`}
                          variant="secondary"
                          className="bg-emerald-500 text-white font-medium text-[11px] capitalize"
                        >
                          {prog.status} Batch
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    <div>
                      <h4 className="text-base font-bold text-foreground line-clamp-1">
                        {prog.programTitle}
                      </h4>
                      <p className="mt-1 text-xs font-medium text-primary">{prog.coachName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">
                          {prog.area}, {prog.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{prog.level}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5 rounded-lg border border-border/50 bg-secondary/30 p-2.5 text-xs text-muted-foreground">
                      <Clock className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="leading-snug">{prog.schedule}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">Fees: </span>
                        <span className="text-sm font-bold text-foreground">
                          ₹{prog.pricePerMonth.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-muted-foreground"> / month</span>
                      </div>
                      <Button
                        id={`btn-view-program-schedule-${prog.id}`}
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toast.info(`Viewing session timetable for ${prog.programTitle}`)
                        }
                        className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10"
                      >
                        Timetable <ChevronRight className="h-3 w-3 ml-0.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: MEMBERSHIP STATUS */}
      {/* ========================================================================= */}
      {activeTab === "membership" && membership && (
        <div id="section-membership-status" className="space-y-6">
          <div
            id="membership-active-card"
            className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-sm sm:p-8"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/15 text-primary border-primary/30 font-semibold text-xs gap-1">
                    <Crown className="h-3.5 w-3.5" />
                    {membership.tier.toUpperCase()} TIER
                  </Badge>
                  <Badge
                    id="membership-validity-badge"
                    variant="secondary"
                    className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-medium text-xs"
                  >
                    Active · {membership.daysRemaining} Days Left
                  </Badge>
                </div>

                <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {membership.planName}
                </h3>

                <p className="text-sm text-muted-foreground">
                  Valid at partner turfs, swimming academies, badminton indoor hubs, and official
                  athletic grounds across {profile.city}.
                </p>
              </div>

              {/* Court Hours Meter Card */}
              <div className="shrink-0 rounded-xl border border-border/80 bg-background/80 p-4 shadow-sm backdrop-blur lg:w-72">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Monthly Court Hours</span>
                  <span className="font-semibold text-foreground">
                    {membership.usedHoursThisMonth} / {membership.allocatedHoursPerMonth} hrs
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (membership.usedHoursThisMonth / membership.allocatedHoursPerMonth) * 100,
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {membership.remainingHours} free hours left
                  </span>
                  <span className="text-muted-foreground text-[10px]">Resets 1st of month</span>
                </div>
              </div>
            </div>

            {/* Membership Perks List */}
            <div className="mt-6 border-t border-border/60 pt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Included Member Privileges &amp; Perks
              </h4>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {membership.perks.map((perk, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls Bar: Auto Renew Switch & Action */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
              <div className="flex items-center gap-3">
                <Switch
                  id="switch-membership-autorenew"
                  checked={membership.autoRenew}
                  onCheckedChange={handleAutoRenewToggle}
                />
                <Label
                  htmlFor="switch-membership-autorenew"
                  className="text-xs font-medium cursor-pointer"
                >
                  Auto-renew membership annually (Billed at ₹
                  {membership.pricePaid.toLocaleString("en-IN")})
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  id="btn-upgrade-membership"
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Opening membership tier upgrades...")}
                  className="h-8 text-xs border-border"
                >
                  Change Tier
                </Button>
                <Button
                  id="btn-renew-membership-now"
                  size="sm"
                  onClick={() => toast.success("Pass renewal request initiated!")}
                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Renew Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: SPORTS CV VISUAL CARD & METRICS */}
      {/* ========================================================================= */}
      {activeTab === "sports-cv" && (
        <div id="section-sports-cv" className="space-y-4">
          <SportsCV initialViewMode="split" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD SPORTS ACHIEVEMENT */}
      {/* ========================================================================= */}
      <Dialog open={isAddAchievementOpen} onOpenChange={setIsAddAchievementOpen}>
        <DialogContent id="modal-add-achievement" className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-primary" />
              Add Sports Achievement
            </DialogTitle>
            <DialogDescription className="text-xs">
              Record a verified sports milestone, selection, or tournament medal into Supabase.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddAchievementSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="ach-title" className="text-xs font-medium">
                Achievement Title *
              </Label>
              <Input
                id="ach-title"
                required
                placeholder="e.g. Gold Medal · State Inter-District Championship"
                value={achForm.title}
                onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
                className="h-9 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ach-sport" className="text-xs font-medium">
                  Sport
                </Label>
                <Select
                  value={achForm.sport}
                  onValueChange={(val) => setAchForm({ ...achForm, sport: val })}
                >
                  <SelectTrigger id="ach-sport" className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Cricket",
                      "Badminton",
                      "Football",
                      "Tennis",
                      "Athletics",
                      "Swimming",
                      "Basketball",
                    ].map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ach-level" className="text-xs font-medium">
                  Competition Level
                </Label>
                <Select
                  value={achForm.level}
                  onValueChange={(val: SportsAchievement["level"]) =>
                    setAchForm({ ...achForm, level: val })
                  }
                >
                  <SelectTrigger id="ach-level" className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["National", "Zonal", "State", "District", "Club"].map((lvl) => (
                      <SelectItem key={lvl} value={lvl} className="text-xs">
                        {lvl} Level
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ach-org" className="text-xs font-medium">
                  Organizing Body / Association *
                </Label>
                <Input
                  id="ach-org"
                  required
                  placeholder="e.g. KSCA, BAI, AIFF, District Sports Authority"
                  value={achForm.organization}
                  onChange={(e) => setAchForm({ ...achForm, organization: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ach-year" className="text-xs font-medium">
                  Year
                </Label>
                <Input
                  id="ach-year"
                  type="number"
                  min="2010"
                  max="2030"
                  value={achForm.year}
                  onChange={(e) => setAchForm({ ...achForm, year: Number(e.target.value) })}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ach-rank" className="text-xs font-medium">
                Position, Rank, or Metric (Optional)
              </Label>
              <Input
                id="ach-rank"
                placeholder="e.g. Champions 1st Place, Best Batsman, Finalist"
                value={achForm.positionRank}
                onChange={(e) => setAchForm({ ...achForm, positionRank: e.target.value })}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ach-desc" className="text-xs font-medium">
                Performance Details &amp; Summary
              </Label>
              <Textarea
                id="ach-desc"
                placeholder="Brief summary of scores, match outcomes, or selection milestones..."
                rows={3}
                value={achForm.description}
                onChange={(e) => setAchForm({ ...achForm, description: e.target.value })}
                className="text-sm resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddAchievementOpen(false)}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                id="btn-submit-new-achievement"
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-9 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Achievement"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL: EDIT USER PROFILE */}
      {/* ========================================================================= */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent id="modal-edit-profile" className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Edit3 className="h-5 w-5 text-primary" />
              Edit Athlete Profile
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update athlete identity, primary sports disciplines, and competitive background.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProfileSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="prof-name" className="text-xs font-medium">
                Full Name *
              </Label>
              <Input
                id="prof-name"
                required
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                className="h-9 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prof-sport" className="text-xs font-medium">
                  Primary Sport
                </Label>
                <Input
                  id="prof-sport"
                  value={profileForm.primarySport}
                  onChange={(e) => setProfileForm({ ...profileForm, primarySport: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-city" className="text-xs font-medium">
                  City
                </Label>
                <Input
                  id="prof-city"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prof-position" className="text-xs font-medium">
                  Playing Position / Specialization
                </Label>
                <Input
                  id="prof-position"
                  value={profileForm.playingPosition}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, playingPosition: e.target.value })
                  }
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-skill" className="text-xs font-medium">
                  Competitive Skill Level
                </Label>
                <Select
                  value={profileForm.skillLevel}
                  onValueChange={(val) => setProfileForm({ ...profileForm, skillLevel: val })}
                >
                  <SelectTrigger id="prof-skill" className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Beginner",
                      "Club Player",
                      "Intermediate",
                      "District Level",
                      "State Level",
                      "National Level",
                    ].map((lvl) => (
                      <SelectItem key={lvl} value={lvl} className="text-xs">
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-bio" className="text-xs font-medium">
                Athlete Bio
              </Label>
              <Textarea
                id="prof-bio"
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="text-sm resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditProfileOpen(false)}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                id="btn-save-profile"
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-9 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserProfile;
