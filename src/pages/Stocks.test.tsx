import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { InitialEntry } from "react-router-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { Stock } from "@/types/stock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/contexts/AuthProvider";
import Stocks from "@/pages/Stocks";

// isTradingTime을 항상 장마감(false)으로 고정한다. 이렇게 하면
// useStockSocket 내부의 `if (!stockCode || !isTradingTime()) return;`
// 가드에서 바로 빠져나가, 실제 SockJS/STOMP 연결 시도 자체가 아예
// 일어나지 않는다 — 그래서 이 페이지 테스트에서는 @stomp/stompjs나
// sockjs-client를 따로 mock할 필요가 없다.
vi.mock("@/utils/isTradingTime", () => ({
  default: () => false,
}));

// jsdom엔 canvas 렌더링 엔진이 없어 StockChart 내부의 lightweight-charts
// 호출이 실제로 실행되면 에러가 난다. 이 테스트는 라이브러리 호출 인자를
// 검증하려는 게 아니라(그건 StockChart.test.tsx의 몫) 페이지 전체가
// 크래시 없이 렌더링되는지만 확인하면 되므로, 최소한의 무해한 mock만 둔다.
const { createChartMock } = vi.hoisted(() => ({
  createChartMock: vi.fn(),
}));

vi.mock("lightweight-charts", () => ({
  createChart: createChartMock,
  CandlestickSeries: "CandlestickSeries",
  HistogramSeries: "HistogramSeries",
  ColorType: { Solid: "solid" },
}));

const buildMockChart = () => ({
  addSeries: vi.fn().mockReturnValue({ setData: vi.fn() }),
  priceScale: () => ({ applyOptions: vi.fn() }),
  timeScale: () => ({
    subscribeVisibleLogicalRangeChange: vi.fn(),
    applyOptions: vi.fn(),
    fitContent: vi.fn(),
    setVisibleRange: vi.fn(),
    getVisibleLogicalRange: vi.fn().mockReturnValue(null),
    setVisibleLogicalRange: vi.fn(),
  }),
  subscribeCrosshairMove: vi.fn(),
  resize: vi.fn(),
  remove: vi.fn(),
});

// Holdings.test.tsx의 renderWithProviders와 달리, 이 페이지는 실제
// :stockcode 라우트 매칭이 필요하고(useParams로 읽음) StockTrade가
// useAuth()를 쓰므로 AuthProvider도 같이 감싸야 한다. 컴포넌트 테스트
// 전용 헬퍼를 그대로 재사용하지 않고 이 파일에서만 쓰는 별도 렌더 함수로
// 뺀 이유는, 다른 단순한 컴포넌트 테스트까지 이 무거운 조합을 강제하지
// 않기 위해서다.
const renderStocksPage = (initialEntry: InitialEntry) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/stocks/:stockcode" element={<Stocks />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe("Stocks 페이지 — 새로고침/URL 직접 접속 회귀 테스트", () => {
  it("location.state 없이 stockcode URL 파라미터만으로 접속해도 정상 렌더링된다 (Phase 01에서 고친 새로고침 크래시 회귀 테스트)", async () => {
    createChartMock.mockReturnValue(buildMockChart());

    // 종목 목록에서 클릭해 들어온 게 아니라, 새로고침하거나 이 URL을 직접
    // 입력해 들어온 상황을 그대로 재현 — location.state를 아예 안 준다.
    const { unmount } = renderStocksPage("/stocks/005930");

    // handlers.ts의 mockStock이 API로 조회돼 화면에 반영될 때까지 대기.
    await waitFor(() => {
      expect(screen.getByText("무주시전자")).toBeInTheDocument();
    });

    expect(screen.getByText("005930")).toBeInTheDocument();

    // Error.tsx가 렌더링되면 뜨는 문구가 없어야 한다 — 크래시나 "존재하지
    // 않는 종목입니다" 분기로 빠지지 않고 정상 렌더링됐다는 뜻이므로.
    expect(
      screen.queryByText(/정보를 불러오는데 실패했습니다/)
    ).not.toBeInTheDocument();

    unmount();
  });

  it("종목 목록에서 클릭해 들어온 정상 경로(location.state 있음)도 여전히 정상 렌더링된다", async () => {
    createChartMock.mockReturnValue(buildMockChart());

    // location.state로 종목 정보를 바로 넘겨받는, 원래 의도된 정상
    // 진입 경로 — API 재조회(getStocksSearch) 없이 바로 렌더링돼야 한다.
    const stateStock: Stock = { stockCode: "005930", stockName: "무주시전자" };
    const { unmount } = renderStocksPage({
      pathname: "/stocks/005930",
      state: { stock: stateStock },
    });

    await waitFor(() => {
      expect(screen.getByText("무주시전자")).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/정보를 불러오는데 실패했습니다/)
    ).not.toBeInTheDocument();

    unmount();
  });
});
