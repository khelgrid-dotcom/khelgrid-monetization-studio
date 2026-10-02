/// <reference types="vite/client" />
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

// Browser safety polyfill for TanStack Start SSR client hydration
if (typeof window !== "undefined") {
  const win = window as unknown as { process?: { env: Record<string, string> } };
  win.process = win.process || {
    env: {
      NODE_ENV: import.meta.env?.MODE || "development",
      TSS_ROUTER_BASEPATH: "",
    },
  };
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>,
  );
});
