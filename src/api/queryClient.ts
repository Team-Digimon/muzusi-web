import { QueryClient } from "@tanstack/react-query";

// 앱 전체가 공유하는 단 하나의 QueryClient 인스턴스. 컴포넌트 안에서
// new QueryClient()를 만들면 리렌더될 때마다 캐시가 초기화돼버리므로,
// 반드시 모듈 최상단에서 한 번만 생성해서 내보낸다.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 계좌/잔고는 예약 주문 체결처럼 이 탭이 모르는 사이에 서버에서
      // 바뀔 수 있는 데이터라, 너무 길게 잡으면 오래된 값을 계속 보여줄
      // 위험이 있다. 짧은 시간 내 화면 전환 시 중복 요청을 막는 효과는
      // 유지하면서, 5초 정도로 짧게 잡아 신선도를 우선한다. (내 거래로
      // 바뀌는 경우는 invalidateQueries로 staleTime과 무관하게 즉시
      // 갱신되므로, 이 값은 "남이 바꾼 걸 내가 놓치는 시간"의 상한이다.)
      staleTime: 5 * 1000,
      retry: 1,
    },
  },
});

export default queryClient;
