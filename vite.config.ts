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
  tanstackStart: {
    // Explicit project client & server entries
    client: { entry: "client" },
    server: { entry: "server" },
  },
  vite: {
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
