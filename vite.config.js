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
    // 실제 VITE_SERVER_BASE_URL/VITE_WEB_SOCKET_URL은 .env.*에만 있고
    // .gitignore 대상이라 CI에는 없다. 테스트에서 axios/SockJS가 만드는
    // 요청 URL을 예측 가능하게 고정하기 위해, 진짜 서버가 아님이 URL만
    // 봐도 명확한 .test 도메인으로 테스트 전용 값을 지정한다.
    env: {
      VITE_SERVER_BASE_URL: "http://mock-api.test/",
      VITE_WEB_SOCKET_URL: "ws://mock-ws.test/stomp",
    },
    coverage: {
      provider: "v8",
      // text: 터미널에 바로 요약 출력. html: coverage/index.html로 파일별
      // 실행/미실행 줄까지 색깔로 보여주는 상세 리포트(브라우저로 열어봄).
      reporter: ["text", "html"],
      // src/mocks, src/test는 테스트를 돕기 위한 인프라 코드지, 검증
      // 대상인 애플리케이션 로직이 아니다. dist는 npm run build로 나온
      // 컴파일된 산출물이라 로컬에 남아있으면 소스 취급돼 분모를
      // 왜곡시킨다. *.config.js와 *.d.ts는 실행 코드가 없는 설정/타입
      // 선언 파일이라 마찬가지로 제외. 전부 빼야 실제 애플리케이션
      // 로직 기준의 수치가 나온다.
      exclude: [
        "src/mocks/**",
        "src/test/**",
        "dist/**",
        "*.config.js",
        "**/*.d.ts",
      ],
    },
  },
});
