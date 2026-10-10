// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { Plugin } from "vite";

interface RollupWarningLike {
  code?: string;
  message?: string;
  [key: string]: unknown;
}

interface EnvironmentConfigLike {
  build?: {
    rollupOptions?: {
      onwarn?: (warning: RollupWarningLike, warn: (warning: RollupWarningLike) => void) => void;
    };
  };
}

function suppressModuleDirectivePlugin(): Plugin {
  const onwarn = (warning: RollupWarningLike, warn: (warning: RollupWarningLike) => void) => {
    if (
      warning.code === "MODULE_LEVEL_DIRECTIVE" ||
      warning.message?.includes("Module level directives") ||
      warning.message?.includes('"use client"')
    ) {
      return;
    }
    warn(warning);
  };

  return {
    name: "suppress-module-level-directives",
    config(config) {
      config.build = config.build || {};
      config.build.rollupOptions = config.build.rollupOptions || {};
      const existingOnwarn = config.build.rollupOptions.onwarn;
      config.build.rollupOptions.onwarn = (warning, warn) => {
        const warningLike = warning as RollupWarningLike;
        if (
          warningLike.code === "MODULE_LEVEL_DIRECTIVE" ||
          warningLike.message?.includes("Module level directives") ||
          warningLike.message?.includes('"use client"')
        ) {
          return;
        }
        if (typeof existingOnwarn === "function") {
          existingOnwarn(warning, warn);
        } else {
          warn(warning);
        }
      };

      if (config.environments) {
        for (const env of Object.values(config.environments)) {
          if (env && typeof env === "object") {
            const envLike = env as EnvironmentConfigLike;
            const envBuild = (envLike.build = envLike.build || {});
            const envRollup = (envBuild.rollupOptions = envBuild.rollupOptions || {});
            envRollup.onwarn = onwarn;
          }
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [suppressModuleDirectivePlugin()],
  hmrGate: false,
  tanstackStart: {
    // Explicit project client & server entries
    client: { entry: "client" },
    server: { entry: "server" },
  },
  vite: {
    server: {
      host: "0.0.0.0",
      port: 3000,
      allowedHosts: true,
      cors: true,
      hmr: false,
      warmup: {
        clientFiles: ["./src/client.tsx", "./src/router.tsx", "./src/routes/__root.tsx"],
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    optimizeDeps: {
      exclude: [
        "@tanstack/react-start",
        "@tanstack/react-start/client",
        "@tanstack/start-client-core",
      ],
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/react-router",
        "@tanstack/zod-adapter",
        "lucide-react",
        "clsx",
        "tailwind-merge",
        "class-variance-authority",
        "date-fns",
        "sonner",
        "zod",
        "react-helmet-async",
        "recharts",
        "qrcode",
        "@radix-ui/react-accordion",
        "@radix-ui/react-alert-dialog",
        "@radix-ui/react-aspect-ratio",
        "@radix-ui/react-avatar",
        "@radix-ui/react-checkbox",
        "@radix-ui/react-collapsible",
        "@radix-ui/react-context-menu",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-hover-card",
        "@radix-ui/react-label",
        "@radix-ui/react-menubar",
        "@radix-ui/react-navigation-menu",
        "@radix-ui/react-popover",
        "@radix-ui/react-progress",
        "@radix-ui/react-radio-group",
        "@radix-ui/react-scroll-area",
        "@radix-ui/react-select",
        "@radix-ui/react-separator",
        "@radix-ui/react-slider",
        "@radix-ui/react-slot",
        "@radix-ui/react-switch",
        "@radix-ui/react-tabs",
        "@radix-ui/react-toggle",
        "@radix-ui/react-toggle-group",
        "@radix-ui/react-tooltip",
        "@supabase/supabase-js",
      ],
    },
    define: {
      "process.env.TSS_ROUTER_BASEPATH": JSON.stringify(""),
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" ||
            warning.message?.includes("Module level directives") ||
            warning.message?.includes('"use client"')
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});
