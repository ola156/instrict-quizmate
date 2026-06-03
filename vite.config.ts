import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    nitro: true, // 👈 add this
    server: { 
      entry: "server",
      preset: "vercel",
    },
    serverFns: {
      disableCsrfMiddlewareWarning: true,
    },
  },
});