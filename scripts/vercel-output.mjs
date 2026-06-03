import { cpSync, mkdirSync, writeFileSync, existsSync } from "fs";

// Create .vercel/output structure
mkdirSync(".vercel/output/functions/index.func", { recursive: true });
mkdirSync(".vercel/output/static", { recursive: true });

// Copy server output into Vercel function
cpSync("dist/server", ".vercel/output/functions/index.func", { recursive: true });

// Copy static client assets
cpSync("dist/client", ".vercel/output/static", { recursive: true });

// Write Vercel output config
writeFileSync(".vercel/output/config.json", JSON.stringify({
  version: 3,
  routes: [
    { src: "/assets/(.*)", dest: "/assets/$1" },
    { src: "/(.*)", dest: "/index" }
  ]
}));

// Write function config
writeFileSync(".vercel/output/functions/index.func/.vc-config.json", JSON.stringify({
  runtime: "nodejs20.x",
  handler: "index.mjs",
  launcherType: "Nodejs",
  shouldAddHelpers: false
}));

console.log("✅ Vercel output structure created");