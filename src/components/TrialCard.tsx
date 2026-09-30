import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Flame,
  Check,
  Zap,
  Bookmark,
  Bell,
  Share2,
  Copy,
  MessageCircle,
  Info,
} from "lucide-react";
import type { Trial } from "@/data/trials";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useSavedOpportunities } from "@/context/SavedOpportunityContext";
import { useFollowedAcademies } from "@/context/FollowedAcademyContext";
import { getRealtimeOpportunityBadge } from "@/lib/opportunity-badge";
import { TrialDetailsModal } from "@/components/TrialDetailsModal";
import { toast } from "sonner";

interface Props {
  trial: Trial;
  boosted?: boolean;
  onApply: () => void;
  onBoost?: () => void;
  showBoostAction?: boolean;
}

export function TrialCard({ trial, boosted, onApply, onBoost, showBoostAction }: Props) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { applications } = useAuth();
  const { isSaved, toggleSaved } = useSavedOpportunities();
  const { isFollowingAcademy, toggleFollowAcademy } = useFollowedAcademies();
  const applied = applications.includes(trial.id);
  const saved = isSaved(trial.id);
  const followingAcademy = isFollowingAcademy(trial.academy);
  const statusBadge = getRealtimeOpportunityBadge(trial);

  return (
    <>
      <div
        id={`trial-card-${trial.id}`}
        onClick={() => setIsDetailsOpen(true)}
        className={`relative overflow-hidden rounded-2xl border bg-gradient-card p-5 transition-all cursor-pointer ${
          boosted
            ? "border-primary/60 animate-pulse-glow"
            : "border-border hover:border-primary/50 hover:shadow-md hover:translate-y-[-2px]"
        } ${statusBadge?.isExpired ? "opacity-85 grayscale-[0.2]" : ""}`}
      >
        {boosted && (
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-gradient-hero px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
            <Flame className="h-3 w-3" /> Featured
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="border-border text-[10px]">
            {trial.sport}
          </Badge>
          <span className="text-foreground/60">·</span>
          <span>{trial.tag}</span>

          {statusBadge && (
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusBadge.style}`}
            >
              <span
                className={`h-1 w-1 rounded-full shrink-0 ${statusBadge.dotStyle}`}
                aria-hidden="true"
              />
              <statusBadge.icon className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
              <span>{statusBadge.label}</span>
            </span>
          )}
        </div>

        <h3 className="mt-3 text-lg font-semibold leading-snug">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailsOpen(true);
            }}
            className="text-left font-semibold hover:text-primary transition-colors cursor-pointer"
          >
            {trial.title}
          </button>
        </h3>
        <p className="text-sm text-muted-foreground">{trial.academy}</p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsDetailsOpen(true);
          }}
          className="mt-1 inline-flex text-xs font-medium text-primary hover:underline cursor-pointer"
        >
          View venue location &amp; organizer info →
        </button>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-3">
          <div className="flex min-w-0 items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{trial.city}</span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{trial.date}</span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{trial.spots} spots</span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              toggleSaved(trial.id);
            }}
            aria-label={
              saved ? `Remove ${trial.title} from saved opportunities` : `Save ${trial.title}`
            }
            title={saved ? "Saved opportunity" : "Save opportunity"}
            className={saved ? "border-primary bg-primary/10 text-primary" : ""}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              toggleFollowAcademy(trial.academy);
              toast.success(
                followingAcademy ? `Unfollowed ${trial.academy}` : `Following ${trial.academy}`,
              );
            }}
            aria-label={
              followingAcademy
                ? `Stop following ${trial.academy}`
                : `Follow ${trial.academy} for schedule updates`
            }
            title={followingAcademy ? "Following academy" : "Follow academy schedule"}
            className={followingAcademy ? "border-primary bg-primary/10 text-primary" : ""}
          >
            <Bell className={`h-4 w-4 ${followingAcademy ? "fill-current" : ""}`} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Share trial announcement"
                aria-label={`Share ${trial.title}`}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-emerald-600 focus:text-emerald-700 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  const origin =
                    typeof window !== "undefined" ? window.location.origin : "https://khelgrid.com";
                  const shareUrl = `${origin}/trial/${trial.id}`;
                  const text = encodeURIComponent(
                    `🏆 *${trial.title}* (${trial.sport})\n📍 ${trial.city} · 📅 ${trial.date}\n🔗 View on KhelGrid: ${shareUrl}`,
                  );
                  window.open(
                    `https://api.whatsapp.com/send?text=${text}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                <MessageCircle className="h-4 w-4 fill-emerald-500/20" />
                <span>Share on WhatsApp</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  const origin =
                    typeof window !== "undefined" ? window.location.origin : "https://khelgrid.com";
                  const shareUrl = `${origin}/trial/${trial.id}`;
                  const text = encodeURIComponent(
                    `Official ${trial.sport} selection trial: ${trial.title} in ${trial.city} on ${trial.date}. Verified on @KhelGrid:`,
                  );
                  window.open(
                    `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              >
                <span className="font-bold text-xs">𝕏</span>
                <span>Share on X</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={async (e) => {
                  e.stopPropagation();
                  const origin =
                    typeof window !== "undefined" ? window.location.origin : "https://khelgrid.com";
                  const shareUrl = `${origin}/trial/${trial.id}`;
                  try {
                    if (navigator.clipboard?.writeText) {
                      await navigator.clipboard.writeText(shareUrl);
                    }
                    toast.success("Link copied to clipboard!");
                  } catch {
                    toast.error("Could not copy link");
                  }
                }}
              >
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
            disabled={applied || statusBadge?.isExpired}
            className="flex-1"
            variant={applied || statusBadge?.isExpired ? "secondary" : "default"}
          >
            {applied ? (
              <>
                <Check className="mr-1 h-4 w-4" /> Applied
              </>
            ) : statusBadge?.isExpired ? (
              "Registration Closed"
            ) : (
              "Apply now"
            )}
          </Button>

          {showBoostAction && !boosted && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onBoost?.();
              }}
              variant="outline"
              size="icon"
              title="Boost listing"
            >
              <Zap className="h-4 w-4 text-primary" />
            </Button>
          )}
        </div>
      </div>

      {/* Interactive Expanded Modal for Venue, Organizer Contact & Direct Registration */}
      <TrialDetailsModal
        trial={trial}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        isRegistered={applied}
        onRegister={() => onApply()}
      />
    </>
  );
}
