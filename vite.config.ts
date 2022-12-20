import reactRefresh from "@vitejs/plugin-react-refresh";
import * as path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRefresh()],
  css: {
    modules: {
      generateScopedName: '[local]-[hash:base64:5]',
    },
  },
  resolve: {
    alias: {
      "@@": path.resolve(__dirname),
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    cors: true,
    port: process.env.VITE_PORT as unknown as number,
  },
  build: {
    target: 'esnext',
  },
});
