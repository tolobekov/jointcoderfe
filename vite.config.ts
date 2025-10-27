import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ─── Development server proxy ───────────────────────────────────
  server: {
    proxy: {
      // 1️⃣ Proxy all /api/* calls to Spring Boot
      "/api": {
        target: "http://localhost:8090",
        changeOrigin: true,
        secure: false,
      },

      // 2️⃣ Proxy SockJS/WebSocket traffic under /ws
      "/ws": {
        target: "http://localhost:8090",
        ws: true,           // ← upgrade WebSocket connections
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
