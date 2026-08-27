/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_REST_API_KEY: string;
  readonly VITE_KAKAO_REDIRECT_URI: string;
  readonly VITE_NAVER_REST_API_KEY: string;
  readonly VITE_NAVER_REDIRECT_URI: string;
  readonly VITE_SERVER_BASE_URL: string;
  readonly VITE_WEB_SOCKET_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
