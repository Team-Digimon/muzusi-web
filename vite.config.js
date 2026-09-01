// vite가 아니라 vitest/config에서 defineConfig를 가져오면, 아래 test
// 필드까지 포함한 타입을 지원한다(vite의 defineConfig는 test 필드를 모름).
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  define: {
    global: "window",
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
