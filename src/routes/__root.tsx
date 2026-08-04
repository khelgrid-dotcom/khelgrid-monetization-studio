import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BottomTabBar } from "@/components/BottomTabBar";
import { Toaster } from "@/components/ui/sonner";
import { AdConsentProvider, AdConsentBanner, AdSenseLoader, StickyMobileAdSlot } from "@/components/ads";
import { adsConfig, hasValidPublisherId } from "@/config/ads";
import { GoogleTagLoader } from "@/components/GoogleTagLoader";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This trial doesn't exist on the grid.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0a0a0a" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { title: "KhelGrid · India's sports trials, scouted & monetized" },
      { name: "description", content: "Apply to elite sports trials, get a Verified Sports CV, and let academies boost their listings — all on KhelGrid." },
      { name: "author", content: "KhelGrid" },
      { property: "og:title", content: "KhelGrid" },
      { property: "og:description", content: "India's premium grid for sports trials." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      // AdSense site ownership verification
      ...(hasValidPublisherId()
        ? ([{ name: "google-adsense-account", content: adsConfig.publisherId }] as const)
        : []),
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://www.googletagmanager.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" },

      { rel: "stylesheet", href: appCss },
      // Ads: warm up Google's ad hosts so the first unit paints faster.
      ...(hasValidPublisherId()
        ? ([
            { rel: "preconnect", href: "https://pagead2.googlesyndication.com", crossOrigin: "anonymous" },
            { rel: "dns-prefetch", href: "https://googleads.g.doubleclick.net" },
            { rel: "dns-prefetch", href: "https://tpc.googlesyndication.com" },
          ] as const)
        : []),
    ],
    // NOTE: the AdSense loader script is intentionally NOT emitted here.
    // <AdSenseLoader /> injects it client-side only after the visitor answers
    // the cookie banner, so no ad request happens without consent.
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdConsentProvider requireConsent>
          <GoogleTagLoader />
          <AdSenseLoader />

          <Navbar />
          <Breadcrumbs />
          <div className="pb-20 md:pb-0">
            <Outlet />
          </div>
          <BottomTabBar />
          <StickyMobileAdSlot />
          <AdConsentBanner />
          <Toaster theme="dark" position="top-right" />
        </AdConsentProvider>
      </AuthProvider>
    </QueryClientProvider>

  );
}
