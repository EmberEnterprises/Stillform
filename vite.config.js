import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
const buildTime = new Date().toISOString();

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
    __APP_PACKAGE_VERSION__: JSON.stringify(pkg.version)
  }
})
