import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { StockChartPoint } from "@/types/stock";
import StockChart from "@/components/stocks/StockChart";

// jsdom엔 canvas 렌더링 엔진이 없어 lightweight-charts를 실제로 실행할
// 수 없다. "차트가 예쁘게 그려지는가"가 아니라 "우리 코드가 라이브러리를
// 올바른 인자로 호출하는가", 특히 Phase 03에서 고친 "destroy 대신
// update" 최적화가 다시 깨지지 않는가를 검증하는 게 목적.
const {
  createChartMock,
  addSeriesMock,
  candleSetDataMock,
  volumeSetDataMock,
  priceScaleApplyOptionsMock,
  timeScaleApplyOptionsMock,
  fitContentMock,
  setVisibleRangeMock,
  chartRemoveMock,
} = vi.hoisted(() => ({
  createChartMock: vi.fn(),
  addSeriesMock: vi.fn(),
  candleSetDataMock: vi.fn(),
  volumeSetDataMock: vi.fn(),
  priceScaleApplyOptionsMock: vi.fn(),
  timeScaleApplyOptionsMock: vi.fn(),
  fitContentMock: vi.fn(),
  setVisibleRangeMock: vi.fn(),
  chartRemoveMock: vi.fn(),
}));

vi.mock("lightweight-charts", () => ({
  createChart: createChartMock,
  // addSeries에 "이 종류의 시리즈를 만들어라"고 알려주는 식별자일 뿐이라,
  // 실제 컴포넌트 코드가 어떤 식별자를 넘기는지 구분하는 용도로만 쓴다.
  CandlestickSeries: "CandlestickSeries",
  HistogramSeries: "HistogramSeries",
  ColorType: { Solid: "solid" },
}));

const candleSeries = { setData: candleSetDataMock };
const volumeSeries = { setData: volumeSetDataMock };

const buildMockChart = () => ({
  addSeries: addSeriesMock,
  priceScale: () => ({ applyOptions: priceScaleApplyOptionsMock }),
  timeScale: () => ({
    subscribeVisibleLogicalRangeChange: vi.fn(),
    applyOptions: timeScaleApplyOptionsMock,
    fitContent: fitContentMock,
    setVisibleRange: setVisibleRangeMock,
    getVisibleLogicalRange: vi.fn().mockReturnValue(null),
    setVisibleLogicalRange: vi.fn(),
  }),
  subscribeCrosshairMove: vi.fn(),
  resize: vi.fn(),
  remove: chartRemoveMock,
});

const toUnixSeconds = (dateString: string) =>
  Math.floor(new Date(dateString).getTime() / 1000);

const chartData: StockChartPoint[] = [
  {
    time: "2026-09-01T09:00:00",
    open: 100,
    high: 110,
    low: 90,
    close: 105,
    value: 1_000,
  },
  {
    time: "2026-09-01T09:01:00",
    open: 105,
    high: 115,
    low: 95,
    close: 102,
    value: 1_200,
  },
];

describe("StockChart", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("데이터가 비어있으면 안내 문구를 렌더링한다", () => {
    createChartMock.mockReturnValue(buildMockChart());
    addSeriesMock.mockImplementation((seriesType: string) =>
      seriesType === "CandlestickSeries" ? candleSeries : volumeSeries
    );

    const { unmount } = render(<StockChart chartData={[]} period="MINUTES" />);

    expect(screen.getByText("지원하지 않는 차트입니다.")).toBeInTheDocument();

    unmount();
  });

  it("마운트 시 v5 배경색 형식으로 차트를 한 번 생성하고, 캔들/거래량 데이터를 반영한다", () => {
    createChartMock.mockReturnValue(buildMockChart());
    addSeriesMock.mockImplementation((seriesType: string) =>
      seriesType === "CandlestickSeries" ? candleSeries : volumeSeries
    );

    const { unmount } = render(
      <StockChart chartData={chartData} period="MINUTES" />
    );

    expect(createChartMock).toHaveBeenCalledTimes(1);
    const [, options] = createChartMock.mock.calls[0];
    // v5부터 배경색이 background:{type,color} 객체로 바뀐 형식(4-4차 TS
    // 전환 때 고친 버그)이 유지되는지 확인해 회귀를 방지한다.
    expect(options.layout.background).toEqual({
      type: "solid",
      color: "#ffffff",
    });

    expect(addSeriesMock).toHaveBeenCalledWith(
      "CandlestickSeries",
      expect.objectContaining({ upColor: "#f04452" })
    );
    expect(addSeriesMock).toHaveBeenCalledWith(
      "HistogramSeries",
      expect.objectContaining({ color: "#26a69a" })
    );

    expect(candleSetDataMock).toHaveBeenCalledWith([
      {
        time: toUnixSeconds(chartData[0].time),
        open: 100,
        high: 110,
        low: 90,
        close: 105,
      },
      {
        time: toUnixSeconds(chartData[1].time),
        open: 105,
        high: 115,
        low: 95,
        close: 102,
      },
    ]);

    // open < close면 상승(빨강), 아니면 하락(파랑) 색으로 거래량 막대를 칠한다.
    expect(volumeSetDataMock).toHaveBeenCalledWith([
      {
        time: toUnixSeconds(chartData[0].time),
        value: 1_000,
        color: "#f04452", // 100 < 105, 상승
      },
      {
        time: toUnixSeconds(chartData[1].time),
        value: 1_200,
        color: "#3182f6", // 105 < 102 아님(하락)
      },
    ]);

    unmount();
  });

  it("chartData/period가 바뀌어도 차트를 재생성하지 않고 데이터만 갱신한다", () => {
    createChartMock.mockReturnValue(buildMockChart());
    addSeriesMock.mockImplementation((seriesType: string) =>
      seriesType === "CandlestickSeries" ? candleSeries : volumeSeries
    );

    const { rerender, unmount } = render(
      <StockChart chartData={chartData} period="MINUTES" />
    );
    expect(createChartMock).toHaveBeenCalledTimes(1);
    expect(candleSetDataMock).toHaveBeenCalledTimes(1);

    const nextChartData: StockChartPoint[] = [
      ...chartData,
      {
        time: "2026-09-01T09:02:00",
        open: 102,
        high: 108,
        low: 100,
        close: 106,
        value: 900,
      },
    ];
    rerender(<StockChart chartData={nextChartData} period="DAILY" />);

    // 이번 최적화의 핵심: 데이터/기간이 바뀌어도 createChart는 마운트
    // 시점 그 한 번뿐이어야 한다(destroy 후 재생성이 아니라 update).
    expect(createChartMock).toHaveBeenCalledTimes(1);
    // 대신 setData는 새 데이터로 다시 호출돼야 한다.
    expect(candleSetDataMock).toHaveBeenCalledTimes(2);
    expect(timeScaleApplyOptionsMock).toHaveBeenLastCalledWith({
      timeVisible: false, // period가 DAILY로 바뀌었으므로
    });

    unmount();
  });

  it("언마운트되면 차트를 정리한다", () => {
    createChartMock.mockReturnValue(buildMockChart());
    addSeriesMock.mockImplementation((seriesType: string) =>
      seriesType === "CandlestickSeries" ? candleSeries : volumeSeries
    );

    const { unmount } = render(
      <StockChart chartData={chartData} period="MINUTES" />
    );

    unmount();

    expect(chartRemoveMock).toHaveBeenCalledTimes(1);
  });
});
