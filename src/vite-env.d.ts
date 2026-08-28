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

// vite-plugin-svgr: "?react" 쿼리로 가져온 SVG를 React 컴포넌트로 취급한다.
declare module "*.svg?react" {
  import type { FunctionComponent, SVGProps } from "react";
  const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
