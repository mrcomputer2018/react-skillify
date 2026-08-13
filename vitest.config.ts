import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config.ts";

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: "jsdom",
            setupFiles: ["./src/test/setup.ts"],
            css: true,
            exclude: ["**/node_modules/**", "**/dist/**", "src/test/e2e/**"],
            coverage: {
                provider: "v8",
                reporter: ["text", "html"],
                include: ["src/**/*.{ts,tsx}"],
                exclude: [
                    "src/test/**",
                    "src/components/ui/**",
                    "src/main.tsx",
                    "src/vite-env.d.ts",
                ],
            },
        },
    }),
);
