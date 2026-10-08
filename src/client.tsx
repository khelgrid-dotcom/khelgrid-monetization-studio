import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

// Ensure process and process.env exist on window for client libraries
if (typeof window !== "undefined") {
  if (!window.process) {
    (window as unknown as { process: { env: Record<string, string> } }).process = {
      env: { NODE_ENV: "development" },
    };
  }
}

startTransition(() => {
  try {
    hydrateRoot(
      document,
      <StrictMode>
        <StartClient />
      </StrictMode>,
    );
  } catch (error) {
    console.error("[KhelGrid] Client hydration failed:", error);
  }
});

