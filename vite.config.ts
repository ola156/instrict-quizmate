import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "vercel",  // 👈 pass preset directly to nitro config
  },
  tanstackStart: {
    server: { 
      entry: "server",
    },
    serverFns: {
      disableCsrfMiddlewareWarning: true,
    },
  },
});