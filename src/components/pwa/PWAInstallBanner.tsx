import { useState } from "react";
import { Download, Share2, PlusSquare, X, CheckCircle2 } from "lucide-react";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import { Button } from "@/components/ui/button";

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  // Do not show if already in standalone app mode or dismissed
  if (isInstalled || dismissed) return null;
  // If neither Chromium installable nor iOS Safari, do not show
  if (!isInstallable && !isIOS) return null;

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-card p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          {/* App Icon + Pitch */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <span className="font-display font-black text-sm tracking-tight">KG</span>
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs sm:text-sm text-foreground truncate">
                  Get the KhelGrid App
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Instant
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                Faster court bookings, instant live scores & offline access
              </p>
            </div>
          </div>

          {/* Action Button & Dismiss */}
          <div className="flex items-center gap-2 shrink-0">
            {isInstallable && (
              <Button
                size="sm"
                onClick={install}
                className="h-8 gap-1.5 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Install</span>
              </Button>
            )}

            {isIOS && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowIOSModal(true)}
                className="h-8 gap-1.5 rounded-xl border-primary/40 px-3 text-xs font-semibold text-primary hover:bg-primary/10"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Add to Home</span>
              </Button>
            )}

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Dismiss app install banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                  KG
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">
                    Install on iPhone / iPad
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Add to Home Screen in 2 taps</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ol className="mt-4 space-y-3 text-xs text-muted-foreground">
              <li className="flex items-center gap-2.5 rounded-xl bg-secondary/50 p-2.5">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                  1
                </span>
                <span>
                  Tap the <strong className="text-foreground">Share</strong> icon{" "}
                  <Share2 className="inline h-3.5 w-3.5 mx-0.5 text-primary" /> in the Safari
                  toolbar.
                </span>
              </li>
              <li className="flex items-center gap-2.5 rounded-xl bg-secondary/50 p-2.5">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 font-bold text-primary text-xs">
                  2
                </span>
                <span>
                  Scroll down and tap{" "}
                  <strong className="text-foreground">Add to Home Screen</strong>{" "}
                  <PlusSquare className="inline h-3.5 w-3.5 mx-0.5 text-primary" />.
                </span>
              </li>
            </ol>

            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Full-screen app experience without App Store download.</span>
            </div>

            <Button className="mt-4 w-full rounded-xl" onClick={() => setShowIOSModal(false)}>
              Got it
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
