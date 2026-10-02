/// <reference types="vite/client" />

// Ensure process and process.env exist in browser context before any TanStack modules evaluate
if (typeof window !== "undefined") {
  const win = window as unknown as { process?: { env: Record<string, string> } };
  win.process = win.process || {
    env: {
      NODE_ENV:
        typeof import.meta !== "undefined" && import.meta.env?.MODE
          ? import.meta.env.MODE
          : "development",
      TSS_ROUTER_BASEPATH: "",
    },
  };
}

export {};
