import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths work for both the GitHub Pages project URL and a root custom domain.
  base: "./",
  plugins: [react()]
});
