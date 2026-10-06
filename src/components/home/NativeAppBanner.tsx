import { Smartphone, Download, Apple, ShieldCheck, Zap, Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/use-pwa-install";

export function NativeAppBanner() {
  const { isInstallable, isIOS, install } = usePWAInstall();

  return (
    <section aria-label="KhelGrid Mobile Application" className="py-2">
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-[#121622] via-[#0d1017] to-[#151a28] p-6 sm:p-8 text-white shadow-lg">
        {/* Subtle Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
        />

        <div className="relative z-10 grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
              <Smartphone className="h-3.5 w-3.5" />
              <span>PWA · Android · Apple iOS Ready</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Take KhelGrid onto the field with our mobile app
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Install KhelGrid directly to your phone&apos;s home screen. Enjoy real-time live score
              notifications, instant court bookings, and trial updates without heavy app store
              downloads.
            </p>

            <div className="flex items-stretch gap-2.5 pt-2 text-xs text-slate-200 overflow-x-auto no-scrollbar scroll-smooth pb-1 overscroll-x-contain touch-pan-x snap-x snap-mandatory sm:grid sm:grid-cols-3">
              <div className="snap-start shrink-0 min-w-[200px] sm:min-w-0 flex items-center gap-2 rounded-xl bg-white/5 p-2">
                <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="whitespace-nowrap sm:whitespace-normal">
                  Instant Offline Launch
                </span>
              </div>
              <div className="snap-start shrink-0 min-w-[200px] sm:min-w-0 flex items-center gap-2 rounded-xl bg-white/5 p-2">
                <Bell className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="whitespace-nowrap sm:whitespace-normal">
                  Live Trial Notifications
                </span>
              </div>
              <div className="snap-start shrink-0 min-w-[200px] sm:min-w-0 flex items-center gap-2 rounded-xl bg-white/5 p-2">
                <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="whitespace-nowrap sm:whitespace-normal">
                  Battery & Data Optimized
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-2.5">
            {isInstallable && (
              <Button
                onClick={install}
                className="h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md cursor-pointer"
              >
                <Download className="h-4 w-4 mr-2" />
                <span>Install Mobile App</span>
              </Button>
            )}

            <div className="flex items-center justify-center gap-3 py-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>Android WebAPK</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>iOS WebClip</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>PWA</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
