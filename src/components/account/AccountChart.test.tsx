import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AccountProfit } from "@/types/account";
import AccountChart from "@/components/account/AccountChart";

// jsdom엔 canvas 렌더링 엔진이 없어 lightweight-charts를 실제로 실행할
// 수 없다. "차트가 예쁘게 그려지는가"가 아니라 "우리 코드가 라이브러리를
// 올바른 인자로 호출하는가"만 검증하면 되므로 라이브러리 자체를 mock.
const { createChartMock, addSeriesMock, setDataMock, fitContentMock, removeMock } =
  vi.hoisted(() => ({
    createChartMock: vi.fn(),
    addSeriesMock: vi.fn(),
    setDataMock: vi.fn(),
    fitContentMock: vi.fn(),
    removeMock: vi.fn(),
  }));

vi.mock("lightweight-charts", () => ({
  createChart: createChartMock,
  // 실제 라이브러리에서 LineSeries는 addSeries에 "이 종류의 시리즈를
  // 만들어라"고 알려주는 식별자일 뿐, 우리 코드는 그 값을 그대로
  // addSeries에 전달하기만 한다. 어떤 값이든 상관없어 문자열로 대체.
  LineSeries: "LineSeries",
  ColorType: { Solid: "solid" },
}));

describe("AccountChart", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("chartData가 비어있으면 차트를 생성하지 않는다", () => {
    render(<AccountChart chartData={[]} />);

    expect(createChartMock).not.toHaveBeenCalled();
  });

  it("chartData가 있으면 v5 배경색 형식으로 차트를 생성하고, 데이터를 시간순으로 뒤집어 시리즈에 반영한다", () => {
    const mockSeries = { setData: setDataMock };
    const mockChart = {
      addSeries: addSeriesMock.mockReturnValue(mockSeries),
      timeScale: () => ({ fitContent: fitContentMock }),
      remove: removeMock,
    };
    createChartMock.mockReturnValue(mockChart);

    // API가 최신순으로 내려주는 걸 그대로 흉내: createdAt이 뒤로 갈수록 최신.
    const chartData: AccountProfit[] = [
      { createdAt: "2026-09-02", totalBalance: 5_200_000 },
      { createdAt: "2026-09-01", totalBalance: 5_000_000 },
    ];

    const { unmount } = render(<AccountChart chartData={chartData} />);

    expect(createChartMock).toHaveBeenCalledTimes(1);
    const [, options] = createChartMock.mock.calls[0];
    // lightweight-charts v5부터 배경색이 background:{type,color} 객체로
    // 바뀌었다(4-2차 TS 전환 때 고친 버그) — 그 형태 그대로인지 확인해
    // 회귀를 방지한다.
    expect(options.layout.background).toEqual({
      type: "solid",
      color: "#ffffff",
    });

    expect(addSeriesMock).toHaveBeenCalledWith(
      "LineSeries",
      expect.objectContaining({ color: "#E75151" })
    );

    // 컴포넌트가 chartData.reverse()로 뒤집은 뒤 time/value로 매핑하므로,
    // 가장 오래된 데이터가 먼저 오는 순서로 setData에 전달돼야 한다.
    expect(setDataMock).toHaveBeenCalledWith([
      { time: "2026-09-01", value: 5_000_000 },
      { time: "2026-09-02", value: 5_200_000 },
    ]);

    expect(fitContentMock).toHaveBeenCalledTimes(1);

    // 언마운트하지 않고 끝내면, 다음 테스트의 afterEach 시점에 전역
    // cleanup()이 뒤늦게 이 컴포넌트를 정리하며 removeMock 호출이 다음
    // 테스트로 샌다(useStockSocket.test.ts에서 겪었던 것과 동일한 패턴).
    unmount();
  });

  it("언마운트되면 차트를 정리한다", () => {
    const mockChart = {
      addSeries: vi.fn().mockReturnValue({ setData: vi.fn() }),
      timeScale: () => ({ fitContent: vi.fn() }),
      remove: removeMock,
    };
    createChartMock.mockReturnValue(mockChart);

    const chartData: AccountProfit[] = [
      { createdAt: "2026-09-01", totalBalance: 5_000_000 },
    ];
    const { unmount } = render(<AccountChart chartData={chartData} />);

    unmount();

    expect(removeMock).toHaveBeenCalledTimes(1);
  });
});
