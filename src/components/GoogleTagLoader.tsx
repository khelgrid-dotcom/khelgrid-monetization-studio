import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { analyticsConfig, googleTagIds, gtagScriptSrc, hasValidGoogleTag } from "@/config/analytics";

const SCRIPT_ID = "google-tag-loader";

/**
 * Injects gtag.js and configures every KhelGrid Google tag ID, then sends a
 * page_view on each client-side route change (gtag only auto-tracks the first
 * load in a SPA).
 */
export function GoogleTagLoader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.searchStr });

  useEffect(() => {
    if (!hasValidGoogleTag()) return;
    if (document.getElementById(SCRIPT_ID)) return;

    window.dataLayer = window.dataLayer ?? [];
    const gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args as unknown as Record<string, unknown>);
    };
    window.gtag = window.gtag ?? gtag;

    gtag("js", new Date());
    for (const id of googleTagIds()) {
      gtag("config", id, { send_page_view: analyticsConfig.enabled });
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = gtagScriptSrc();
    document.head.appendChild(script);
  }, []);

  // SPA page views
  useEffect(() => {
    if (!hasValidGoogleTag() || !analyticsConfig.enabled) return;
    window.gtag?.("event", "page_view", {
      page_path: `${pathname}${search ?? ""}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
}
