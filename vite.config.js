import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base must match the repo name for GitHub Pages project sites.
// Served at https://drewpulse.github.io/pulse-roadmap/
export default defineConfig({
  plugins: [react()],
  base: "/pulse-roadmap/",
});
