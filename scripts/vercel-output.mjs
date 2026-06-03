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
    // Serve static assets
    { src: "/assets/(.*)", dest: "/assets/$1" },
    // Serve root public files like logo.svg, favicon, etc.
    { handle: "filesystem" },
    // Everything else goes to the server
    { src: "/(.*)", dest: "/index" }
  ]
}, null, 2));

// Write function config
writeFileSync(".vercel/output/functions/index.func/.vc-config.json", JSON.stringify({
  runtime: "nodejs20.x",
  handler: "index.mjs",
  launcherType: "Nodejs",
  shouldAddHelpers: false
}));

console.log("✅ Vercel output structure created");