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
    // 실제 VITE_SERVER_BASE_URL은 .env.*에만 있고 .gitignore 대상이라
    // CI에는 없다. 테스트에서 axios가 만드는 요청 URL을 예측 가능하게
    // 고정하기 위해, 진짜 서버가 아님이 URL만 봐도 명확한 .test 도메인으로
    // 테스트 전용 값을 지정한다.
    env: {
      VITE_SERVER_BASE_URL: "http://mock-api.test/",
    },
  },
});
