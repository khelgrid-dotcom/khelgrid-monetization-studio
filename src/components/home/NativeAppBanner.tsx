import { Smartphone, Download, Apple, ShieldCheck, Zap, Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import { toast } from "sonner";

export function NativeAppBanner() {
  const { isInstallable, isIOS, install } = usePWAInstall();

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else {
      toast.info(
        isIOS
          ? "Tap the Share button in Safari, then select 'Add to Home Screen'"
          : "Tap browser menu (⋮) and select 'Install app' or 'Add to Home screen'",
      );
    }
  };

  return (
    <section aria-label="KhelGrid Mobile Application" className="w-full min-w-0 max-w-full py-2">
      <div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-[#121622] via-[#0d1017] to-[#151a28] p-4 sm:p-6 lg:p-8 text-white shadow-lg">
        {/* Subtle Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
        />

        <div className="relative z-10 grid lg:grid-cols-12 gap-5 sm:gap-6 items-center w-full min-w-0">
          <div className="lg:col-span-8 min-w-0 w-full space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-emerald-300 backdrop-blur-md">
              <Smartphone className="h-3.5 w-3.5" />
              <span>PWA · Android · Apple iOS Ready</span>
            </div>

            <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Take KhelGrid onto the field with our mobile app
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Install KhelGrid directly to your phone&apos;s home screen. Enjoy real-time live score
              notifications, instant court bookings, and trial updates without heavy app store
              downloads.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-slate-200 w-full min-w-0 max-w-full">
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-2 sm:p-2.5">
                <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">Instant Offline Launch</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-2 sm:p-2.5">
                <Bell className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">Live Trial Notifications</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-2 sm:p-2.5">
                <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">Battery & Data Optimized</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 min-w-0 flex flex-col gap-2.5 w-full">
            <Button
              onClick={handleInstallClick}
              className="h-11 sm:h-12 w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md cursor-pointer text-xs sm:text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              <span>{isInstallable ? "Install Mobile App" : "Add to Home Screen"}</span>
            </Button>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-0.5 text-[10px] sm:text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>Android WebAPK</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>iOS WebClip</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>PWA Fast</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
