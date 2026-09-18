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
import { BlogProvider } from "@/context/BlogContext";
import { FollowedAcademyProvider } from "@/context/FollowedAcademyContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { SavedOpportunityProvider } from "@/context/SavedOpportunityContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BottomTabBar } from "@/components/BottomTabBar";
import { Toaster } from "@/components/ui/sonner";
import {
  AdConsentProvider,
  AdConsentBanner,
  AdSenseLoader,
  StickyMobileAdSlot,
} from "@/components/ads";
import { adsConfig, hasValidPublisherId } from "@/config/ads";
import { GoogleTagLoader } from "@/components/GoogleTagLoader";
import { SEOHead } from "@/components/SEOHead";
import { SiteFooter } from "@/components/SiteFooter";
import { HydrationDiagnostics } from "@/components/HydrationDiagnostics";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This trial doesn't exist on the grid.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
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
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
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
      { title: "KhelGrid · India's Sports Opportunity Network" },
      {
        name: "description",
        content:
          "India's premier sports platform for discovery and development. Find trials, tournaments, verified academies, sports turf venues, and amateur pickup games across 16+ sports.",
      },
      { name: "author", content: "KhelGrid" },
      { property: "og:site_name", content: "KhelGrid" },
      { property: "og:title", content: "KhelGrid · India's Sports Opportunity Network" },
      {
        property: "og:description",
        content:
          "India's premier sports platform for discovery and development. Find trials, tournaments, verified academies, sports turf venues, and amateur pickup games across 16+ sports.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://khelgrid.com/og-image.svg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@khelgrid" },
      { name: "twitter:image", content: "https://khelgrid.com/og-image.svg" },
      // AdSense site ownership verification
      ...(hasValidPublisherId()
        ? ([{ name: "google-adsense-account", content: adsConfig.publisherId }] as const)
        : []),
    ],
    links: [
      // Brand Favicons & Icons for browser tabs and mobile home screens
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },

      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://www.googletagmanager.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap",
      },

      { rel: "stylesheet", href: appCss },
      // Ads: warm up Google's ad hosts so the first unit paints faster.
      ...(hasValidPublisherId()
        ? ([
            {
              rel: "preconnect",
              href: "https://pagead2.googlesyndication.com",
              crossOrigin: "anonymous",
            },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('khelgrid-theme')||localStorage.getItem('theme')||'dark';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}}catch(e){}})()`,
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <HeadContent />
      </head>
      <body className="overflow-x-hidden">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ThemedToaster() {
  const { resolvedTheme, mounted } = useTheme();
  return <Toaster theme={mounted ? resolvedTheme : "dark"} position="top-right" />;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BlogProvider>
            <SavedOpportunityProvider>
              <FollowedAcademyProvider>
                <NotificationProvider>
                  <AdConsentProvider requireConsent>
                    <GoogleTagLoader />
                    <SEOHead />
                    <AdSenseLoader />

                    <Navbar />
                    <Breadcrumbs />
                    <div className="pb-20 xl:pb-0">
                      <Outlet />
                      <SiteFooter />
                    </div>
                    <BottomTabBar />

                    <StickyMobileAdSlot />
                    <AdConsentBanner />
                    <ThemedToaster />
                    <HydrationDiagnostics />
                  </AdConsentProvider>
                </NotificationProvider>
              </FollowedAcademyProvider>
            </SavedOpportunityProvider>
          </BlogProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
