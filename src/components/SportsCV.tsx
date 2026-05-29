import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, ShieldCheck, Share2, Download, QrCode, Sparkles, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

function FakeQR({ size = 96 }: { size?: number }) {
  return (
    <div className="rounded-md bg-white p-2" style={{ width: size, height: size }}>
      <div className="grid h-full w-full grid-cols-10 grid-rows-10 gap-[1px]">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className={(i * 11 + (i % 4)) % 3 === 0 ? "bg-black" : "bg-white"} />
        ))}
      </div>
    </div>
  );
}

export function SportsCV() {
  const { sportsCVUnlocked, unlockSportsCV, wallet, name, plan } = useAuth();
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<"wallet" | "upi">("wallet");

  const handleUnlock = () => {
    if (method === "wallet") {
      const ok = unlockSportsCV("wallet");
      if (!ok) { toast.error("Insufficient wallet balance."); return; }
    } else {
      unlockSportsCV("upi");
    }
    toast.success("Verified Sports CV unlocked ✨");
    setOpen(false);
  };

  if (sportsCVUnlocked || plan === "pro") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-card p-6 animate-pulse-glow">
        <div className="flex items-start justify-between">
          <div>
            <Badge className="mb-2 border-0 bg-primary/20 text-primary">
              <ShieldCheck className="mr-1 h-3 w-3" /> Verified Sports CV
            </Badge>
            <h3 className="text-2xl font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground">Athlete · Cricket · U-19 · Delhi</p>
          </div>
          <FakeQR size={88} />
        </div>

        <div className="mt-5 grid grid-cols-4 gap-3 text-center">
          {[
            { v: "92", l: "Fitness" },
            { v: "87", l: "Skill" },
            { v: "14", l: "Trials" },
            { v: "4.8", l: "Scout ★" },
          ].map(s => (
            <div key={s.l} className="rounded-xl border border-border bg-background/40 py-3">
              <div className="text-xl font-bold text-gradient">{s.v}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2 text-xs text-muted-foreground">
          <span className="truncate">khelgrid.in/cv/<span className="text-foreground font-medium">arjun-mehta-2k7</span></span>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="h-7 w-7"><Share2 className="h-3.5 w-3.5" /></Button>
            <Button size="icon" variant="ghost" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-6">
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
        <div className="relative">
          <Badge variant="secondary" className="mb-3">Premium</Badge>
          <h3 className="text-xl font-bold">Verified Sports CV</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            A scout-ready digital profile with verified stats, a shareable link and a tamper-proof QR.
          </p>

          <ul className="mt-4 space-y-2 text-sm">
            {["KYC-verified athlete badge", "Auto-pulled trial stats", "QR for in-person tryouts", "Shareable to academies"].map(f => (
              <li key={f} className="flex items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" /> {f}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center gap-3">
            <Button onClick={() => setOpen(true)} className="bg-gradient-gold text-primary-foreground hover:opacity-90">
              <Lock className="mr-2 h-4 w-4" /> Unlock for ₹199
            </Button>
            <span className="text-xs text-muted-foreground">or free with Pro</span>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border-border bg-gradient-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Unlock Verified Sports CV</DialogTitle>
            <DialogDescription>One-time purchase · valid for the entire season.</DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-border bg-background/40 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-2xl font-bold">₹199</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMethod("wallet")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm ${method === "wallet" ? "border-primary bg-primary/10" : "border-border"}`}
            >
              <Wallet className="h-4 w-4" /> Wallet · ₹{wallet.toLocaleString("en-IN")}
            </button>
            <button
              onClick={() => setMethod("upi")}
              className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm ${method === "upi" ? "border-primary bg-primary/10" : "border-border"}`}
            >
              <QrCode className="h-4 w-4" /> UPI
            </button>
          </div>

          <Button onClick={handleUnlock} className="w-full" size="lg" disabled={method === "wallet" && wallet < 199}>
            {method === "wallet" && wallet < 199 ? "Insufficient balance" : "Pay ₹199 & generate CV"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
