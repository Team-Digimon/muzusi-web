import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 이 설정으로 로컬 네트워크의 IP 주소를 바인딩
    port: 5173, // 사용할 포트 (기본값: 5173)
  },
});
