// Vitest가 각 테스트 파일을 실행하기 전에 한 번씩 불러오는 전역 셋업.
// jest-dom의 커스텀 matcher(toBeInTheDocument 등)를 expect에 등록한다.
import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "@/mocks/server";

// @testing-library/react는 전역 afterEach가 있으면 자동으로 매 테스트 후
// cleanup(렌더된 컴포넌트 언마운트)을 등록하는데, vite.config.js에서
// test.globals를 켜지 않아 afterEach가 전역으로 노출되지 않는다. 그래서
// 여기서 명시적으로 호출해줘야 한다 — 안 하면 이전 테스트에서 렌더된
// DOM이 다음 테스트까지 남아 있어 검증이 꼬인다.
//
// MSW 서버 생명주기도 테스트 러너 생명주기에 맞춘다.
// - beforeAll: 전체 테스트 시작 전 딱 한 번 요청 가로채기 시작
// - afterEach: 각 테스트가 끝날 때마다 그 테스트에서 server.use()로
//   덮어쓴 핸들러를 원래 handlers.ts 상태로 되돌림(테스트 간 격리)
// - afterAll: 전체 테스트 종료 후 정리
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
