import { Copy, Gift, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const INVITES_PER_REWARD = 3;
const REWARD_AMOUNT = 150;

interface Props {
  code: string;
  invitesSent: number;
  onInviteSent: () => boolean;
}

export function DashboardReferral({ code, invitesSent, onInviteSent }: Props) {
  const referralPath = `/login?ref=${encodeURIComponent(code)}`;
  const getReferralUrl = () =>
    typeof window === "undefined"
      ? referralPath
      : new URL(referralPath, window.location.origin).toString();
  const invitesToNextReward = INVITES_PER_REWARD - (invitesSent % INVITES_PER_REWARD);
  const progress = ((invitesSent % INVITES_PER_REWARD) / INVITES_PER_REWARD) * 100;

  const shareInvite = async () => {
    const shareText = `Join me on KhelGrid and find your next sports opportunity. Use my referral code ${code}.`;
    const referralUrl = getReferralUrl();

    try {
      if (navigator.share) {
        await navigator.share({ title: "Join me on KhelGrid", text: shareText, url: referralUrl });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${referralUrl}`);
        toast.success("Referral invite copied. Share it with a teammate.");
      }

      const rewardUnlocked = onInviteSent();
      if (rewardUnlocked) toast.success(`Invite shared · ₹${REWARD_AMOUNT} wallet credit unlocked`);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("Invite sharing is unavailable. Try copying your referral link instead.");
    }
  };

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(getReferralUrl());
      const rewardUnlocked = onInviteSent();
      toast.success(
        rewardUnlocked
          ? `Referral link copied · ₹${REWARD_AMOUNT} wallet credit unlocked`
          : "Referral link copied. Share it with a teammate.",
      );
    } catch {
      toast.error("Could not copy the referral link.");
    }
  };

  return (
    <section
      className="mt-8 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-card"
      aria-labelledby="referral-heading"
    >
      <div className="flex flex-col gap-4 border-b border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            <Users className="mr-1.5 h-3.5 w-3.5" /> Community rewards
          </Badge>
          <h2 id="referral-heading" className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
            Grow your KhelGrid circle
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Invite teammates to discover trials and coaching. Unlock ₹{REWARD_AMOUNT} in wallet
            credit every {INVITES_PER_REWARD} invites.
          </p>
        </div>
        <div className="shrink-0 rounded-xl border border-primary/20 bg-background/40 px-4 py-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Your code
          </p>
          <p className="mt-1 font-display text-lg font-bold tracking-widest text-primary">{code}</p>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{invitesSent} invites shared</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {invitesToNextReward === INVITES_PER_REWARD
                  ? "Share 3 invites to unlock your next reward."
                  : `${invitesToNextReward} more invite${invitesToNextReward === 1 ? "" : "s"} to unlock ₹${REWARD_AMOUNT}.`}
              </p>
            </div>
            <Gift className="h-5 w-5 text-primary" />
          </div>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"
            aria-label={`${Math.round(progress)}% toward next referral reward`}
          >
            <div
              className="h-full rounded-full bg-gradient-hero transition-all"
              style={{ width: `${progress || 0}%` }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button type="button" variant="outline" onClick={copyInvite} className="rounded-full">
            <Copy className="h-4 w-4" /> Copy link
          </Button>
          <Button type="button" onClick={shareInvite} className="rounded-full">
            <Share2 className="h-4 w-4" /> Invite a teammate
          </Button>
        </div>
      </div>
    </section>
  );
}
