import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Note: Keep config portable without relying on Node type declarations

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Vite resolves from project root, so '/src' is safe and cross-platform
      "@": "/src",
    },
  },
});
