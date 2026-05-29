import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Flame, TrendingUp, Eye, Wallet, QrCode } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  trialId: string;
  trialTitle: string;
}

export function BoostModal({ open, onOpenChange, trialId, trialTitle }: Props) {
  const { wallet, boostTrial } = useAuth();
  const [method, setMethod] = useState<"wallet" | "upi">("wallet");
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    if (method === "wallet") {
      const ok = boostTrial(trialId, "wallet");
      if (!ok) { toast.error("Insufficient wallet balance."); return; }
      toast.success("🔥 Listing boosted · pinned to top");
      onOpenChange(false);
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      boostTrial(trialId, "upi");
      setProcessing(false);
      toast.success("🔥 Boost activated");
      onOpenChange(false);
    }, 1400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-primary/40 bg-gradient-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Flame className="h-5 w-5 text-primary" /> Boost this listing
          </DialogTitle>
          <DialogDescription>
            Pin <span className="text-foreground font-medium">{trialTitle}</span> to the top of search results with a glowing Featured badge for 7 days.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Eye, label: "8.4× views" },
            { icon: TrendingUp, label: "3.2× applies" },
            { icon: Flame, label: "Featured row" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border bg-background/40 p-3 text-center">
              <s.icon className="mx-auto h-4 w-4 text-primary" />
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-background/40 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">7-day boost</span>
            <span className="text-2xl font-bold">₹1,500</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMethod("wallet")}
            className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition ${method === "wallet" ? "border-primary bg-primary/10" : "border-border"}`}
          >
            <Wallet className="h-4 w-4" /> Wallet · ₹{wallet.toLocaleString("en-IN")}
          </button>
          <button
            onClick={() => setMethod("upi")}
            className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition ${method === "upi" ? "border-primary bg-primary/10" : "border-border"}`}
          >
            <QrCode className="h-4 w-4" /> UPI
          </button>
        </div>

        <Button onClick={handlePay} className="w-full" size="lg" disabled={processing || (method === "wallet" && wallet < 1500)}>
          {processing ? "Confirming UPI…" : method === "wallet" && wallet < 1500 ? "Insufficient balance" : "Boost for ₹1,500"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
