import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  inspectRouterStores,
  isHydrationErrorMessage,
  toDiagnostic,
  type Diagnostic,
} from "@/lib/hydration-diagnostics";

/**
 * Dev-only overlay. Surfaces router/store mismatches and React hydration
 * errors in the console and on screen so a blank page is never silent.
 * Renders nothing in production builds.
 */
export function HydrationDiagnostics() {
  const router = useRouter();
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [dismissed, setDismissed] = useState(false);

  // 1. Router / store shape check, once hydrated.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const found = inspectRouterStores(router as never);
    if (found.length === 0) return;
    for (const d of found) {
      console.error(`[hydration-diagnostics] ${d.title}: ${d.detail}`);
    }
    setDiagnostics((prev) => [...prev, ...found]);
  }, [router]);

  // 2. Intercept console.error to catch React hydration mismatches.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const original = console.error;
    let seq = 0;
    console.error = (...args: unknown[]) => {
      original(...args);
      const text = args
        .map((a) => (a instanceof Error ? `${a.message}` : typeof a === "string" ? a : ""))
        .join(" ");
      if (text && !text.includes("[hydration-diagnostics]") && isHydrationErrorMessage(text)) {
        const diag = toDiagnostic(text, seq++);
        setDiagnostics((prev) =>
          prev.some((p) => p.detail === diag.detail) ? prev : [...prev, diag],
        );
      }
    };
    return () => {
      console.error = original;
    };
  }, []);

  if (!import.meta.env.DEV || dismissed || diagnostics.length === 0) return null;

  return (
    <div className="fixed bottom-24 left-3 right-3 z-[100] max-w-md rounded-xl border border-destructive/50 bg-card/95 p-3 text-left shadow-lg backdrop-blur md:bottom-4 md:left-4 md:right-auto">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-semibold text-destructive">
          Hydration diagnostics ({diagnostics.length})
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-xs text-muted-foreground hover:text-foreground"
          aria-label="Dismiss hydration diagnostics"
        >
          Dismiss
        </button>
      </div>
      <ul className="mt-2 space-y-2">
        {diagnostics.slice(0, 5).map((d) => (
          <li key={d.id} className="text-[11px] leading-snug">
            <span className="font-medium text-foreground">{d.title}</span>
            <p className="mt-0.5 text-muted-foreground">{d.detail}</p>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] text-muted-foreground">
        Dev only — check the console for full stacks.
      </p>
    </div>
  );
}
