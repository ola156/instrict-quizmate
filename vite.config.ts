import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: true,  // 👈 top level, not inside tanstackStart
  tanstackStart: {
    server: { 
      entry: "server",
      preset: "vercel",
    },
    serverFns: {
      disableCsrfMiddlewareWarning: true,
    },
  },
});