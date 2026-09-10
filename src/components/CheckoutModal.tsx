import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Wallet, QrCode, Crown, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  trialId: string;
  trialTitle: string;
  onPaid: () => void;
}

export function CheckoutModal({ open, onOpenChange, trialId, trialTitle, onPaid }: Props) {
  const { wallet, payForApplication, upgradeToPro, plan } = useAuth();
  const [tab, setTab] = useState<"pay" | "upi" | "pro">("pay");
  const [processing, setProcessing] = useState(false);

  const handleWallet = () => {
    const ok = payForApplication(trialId, "wallet");
    if (!ok) { toast.error("Insufficient wallet balance. Try UPI instead."); return; }
    toast.success("₹49 paid · Application unlocked");
    onPaid();
    onOpenChange(false);
  };

  const handleUPI = () => {
    setProcessing(true);
    setTimeout(() => {
      payForApplication(trialId, "upi");
      setProcessing(false);
      toast.success("UPI payment received · ₹49");
      onPaid();
      onOpenChange(false);
    }, 1600);
  };

  const handlePro = () => {
    upgradeToPro();
    toast.success("Welcome to KhelGrid Pro 🎉");
    onPaid();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-gradient-card">
        <DialogHeader>
          <DialogTitle className="text-xl">You've hit your free limit</DialogTitle>
          <DialogDescription>
            Unlock <span className="text-foreground font-medium">{trialTitle}</span> with a one-time payment, or go unlimited with Pro.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-background/40 p-1 text-xs">
          {[
            { id: "pay", label: "Wallet" },
            { id: "upi", label: "UPI" },
            { id: "pro", label: "Pro" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`rounded-md px-3 py-2 font-medium transition ${tab === t.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >{t.label}</button>
          ))}
        </div>

        {tab === "pay" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="h-4 w-4 text-primary" /> Wallet balance
                </div>
                <div className="font-semibold">₹{wallet.toLocaleString("en-IN")}</div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm">Single application unlock</span>
                <span className="text-xl font-bold">₹49</span>
              </div>
            </div>
            <Button onClick={handleWallet} className="w-full" size="lg" disabled={wallet < 49}>
              {wallet < 49 ? "Insufficient balance" : "Pay ₹49 from wallet"}
            </Button>
          </div>
        )}

        {tab === "upi" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto grid h-48 w-48 place-items-center rounded-2xl border border-border bg-white p-3">
              <div className="grid h-full w-full grid-cols-12 grid-rows-12 gap-[2px]">
                {Array.from({ length: 144 }).map((_, i) => (
                  <div key={i} className={`${(i * 7 + (i % 5) + (i % 3)) % 3 === 0 ? "bg-black" : "bg-white"}`} />
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <QrCode className="mr-1 inline h-4 w-4" />
              Scan with any UPI app · <span className="text-foreground font-medium">khelgrid@upi</span>
            </div>
            <div className="text-3xl font-bold">₹49</div>
            <Button onClick={handleUPI} className="w-full" size="lg" disabled={processing}>
              {processing ? "Awaiting confirmation…" : "I've paid · Verify"}
            </Button>
          </div>
        )}

        {tab === "pro" && (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-primary/40 bg-gradient-hero p-5 text-primary-foreground">
              <Badge className="bg-black/30 text-white border-0 mb-2"><Crown className="mr-1 h-3 w-3" /> Most popular</Badge>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold">₹499</span>
                <span className="mb-1 text-sm opacity-80">/month</span>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {["Unlimited trial applications", "Priority placement to scouts", "Verified Sports CV included", "Early access to elite camps"].map(f => (
                  <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4" /> {f}</li>
                ))}
              </ul>
            </div>
            <Button onClick={handlePro} className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90" size="lg" disabled={plan === "pro"}>
              <Sparkles className="mr-2 h-4 w-4" /> Upgrade to Pro
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
