import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

// 실제 앱의 queryClient(src/api/queryClient.ts)는 staleTime 5초 +
// retry 1회가 설정돼 있어, 그대로 테스트에 쓰면 에러 케이스에서 매번
// 재시도를 기다려야 해 느리고 비결정적이다. 테스트에서는 항상 새
// QueryClient를 만들고 retry를 꺼서 빠르고 예측 가능하게 만든다.
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

// 컴포넌트 테스트에서 반복될 "TanStack Query + React Router로 감싸기"를
// 한 곳에 모아둔 헬퍼. useNavigate/useQuery를 쓰는 컴포넌트는 이 함수로
// 렌더링해야 한다.
export const renderWithProviders = (ui: ReactElement) => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};
