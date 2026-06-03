import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",
  },
  tanstackStart: {
    server: {
      entry: "server", // keep as-is, nitro wraps it
    },
    serverFns: {
      disableCsrfMiddlewareWarning: true,
    },
  },
});