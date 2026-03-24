import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves project sites from /<repo>/ in production.
  base: command === "build" ? "/muba-site/" : "/",
  plugins: [react()]
}));
