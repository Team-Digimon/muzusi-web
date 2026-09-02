import { setupServer } from "msw/node";
import { handlers } from "@/mocks/handlers";

// Node(Vitest) 환경에서 네트워크 요청을 가로채는 MSW 서버 인스턴스.
// 브라우저용 setupWorker와 달리 Service Worker가 아니라 Node의
// http/https 모듈 레벨에서 요청을 가로챈다.
export const server = setupServer(...handlers);
