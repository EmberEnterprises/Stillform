import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
const buildTime = new Date().toISOString();

// __APP_VERSION__ — accounts arc A4: keys the version-gated auto-backup.
// Commit-pinned so it changes on real code changes, not on rebuilds of the
// same commit. Netlify exposes COMMIT_REF; local builds fall back to git,
// then to the package version alone (dev).
let commitRef = process.env.COMMIT_REF || "";
if (!commitRef) {
  try {
    const { execSync } = await import("node:child_process");
    commitRef = execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch { commitRef = ""; }
}
const appVersion = commitRef ? `${pkg.version}+${commitRef.slice(0, 7)}` : `${pkg.version}+dev`;

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-dom") || id.includes("react/") || id.includes("scheduler")) return "react-vendor";
          if (id.includes("@capacitor") || id.includes("@aparajita/capacitor-biometric-auth")) return "capacitor-vendor";
          return "vendor";
        }
      }
    }
  },
  define: {
    __APP_BUILD_TIME__: JSON.stringify(buildTime),
    __APP_PACKAGE_VERSION__: JSON.stringify(pkg.version),
    __APP_VERSION__: JSON.stringify(appVersion)
  }
})
