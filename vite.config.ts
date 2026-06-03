import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { 
      entry: "server",
      preset: "vercel", // Add this line to target Vercel
    },
    serverFns: {
      disableCsrfMiddlewareWarning: true,
    },
  },
});