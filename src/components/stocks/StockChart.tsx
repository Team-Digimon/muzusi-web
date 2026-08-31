import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type HistogramData,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import styled from "styled-components";
import type { ChartPeriod, StockChartPoint } from "@/types/stock";

interface StockChartProps {
  chartData: StockChartPoint[];
  period: ChartPeriod;
}

// 크로스헤어가 가리키는 캔들의 시가/고가/저가/종가/거래량과, 그 전 캔들 대비
// 등락률(각 ...Change, 데이터가 없으면 null)을 담는 툴팁 표시용 상태
interface TooltipData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  openChange: string | null;
  highChange: string | null;
  lowChange: string | null;
  closeChange: string | null;
  volumeChange: string | null;
}

const StockChart = ({ chartData, period }: StockChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  // 아래 마운트 effect 안의 콜백(구독)은 딱 한 번만 만들어지고 다시
  // 안 만들어지므로, 그 안에서 최신 chartData/period를 읽으려면
  // 렌더마다 갱신되는 ref를 통해서 읽어야 한다(그렇지 않으면 콜백이
  // 마운트 시점 값에 영원히 고정되는 stale closure가 된다).
  const chartDataRef = useRef(chartData);
  const periodRef = useRef(period);
  chartDataRef.current = chartData;
  periodRef.current = period;
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const tooltipCategory = [
    {
      title: "시가",
      value: "open",
      price: tooltipData?.open,
      change: tooltipData?.openChange,
    },
    {
      title: "고가",
      value: "high",
      price: tooltipData?.high,
      change: tooltipData?.highChange,
    },
    {
      title: "저가",
      value: "low",
      price: tooltipData?.low,
      change: tooltipData?.lowChange,
    },
    {
      title: "종가",
      value: "close",
      price: tooltipData?.close,
      change: tooltipData?.closeChange,
    },
    {
      title: "거래량",
      value: "volume",
      price: tooltipData?.volume,
      change: tooltipData?.volumeChange,
    },
  ];

  // ① 마운트 시 딱 한 번: 차트 인스턴스와 시리즈를 만들고 이벤트를 구독한다.
  // chartData/period가 나중에 바뀌어도 이 effect는 다시 실행되지 않는다
  // (deps가 빈 배열) — 그래서 차트를 destroy·재생성하지 않는다.
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        // lightweight-charts v5부터 배경색 지정 방식이 background:{type,color}
        // 객체로 바뀌었다. 예전 backgroundColor 플랫 필드는 라이브러리가
        // 조용히 무시해서, 지금까지 이 옵션은 적용된 적이 없었다
        // (AccountChart.tsx 전환 때(4-2차) 발견한 것과 동일한 패턴).
        background: { type: ColorType.Solid, color: "#ffffff" },
        textColor: "#000000",
      },
      grid: {
        vertLines: { color: "#e1e1e1" },
        horzLines: { color: "#e1e1e1" },
      },
      timeScale: {
        visible: true,
        borderVisible: false,
        // 마운트 시점 period 기준. period가 바뀔 때의 갱신은 아래 ②
        // effect에서 chart.timeScale().applyOptions(...)로 반영한다.
        timeVisible: periodRef.current === "MINUTES",
      },
      rightPriceScale: {
        visible: true,
        borderVisible: false,
      },
    });

    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#f04452",
      downColor: "#3182f6",
      borderUpColor: "#f04452",
      borderDownColor: "#3182f6",
      wickUpColor: "#f04452",
      wickDownColor: "#3182f6",
      priceFormat: {
        type: "custom",
        minMove: 1,
        formatter: (price: number) => price.toLocaleString("en-US"),
      },
      priceScaleId: "right",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#26a69a",
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    chart.priceScale("right").applyOptions({
      scaleMargins: { top: 0.1, bottom: 0.3 },
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    const handleResize = () => {
      if (!chartContainerRef.current) return;
      chart.resize(
        chartContainerRef.current.clientWidth,
        chartContainerRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    const restrictNavigation = () => {
      const timeScale = chart.timeScale();
      const logicalRange = timeScale.getVisibleLogicalRange();
      if (!logicalRange) return;

      // chartDataRef로 읽어야 기간 전환으로 데이터 길이가 바뀐 뒤에도
      // 최신 범위를 기준으로 제한한다.
      const minLogicalIndex = 0;
      const maxLogicalIndex = chartDataRef.current.length - 1;
      const adjustedRange = {
        from: Math.max(logicalRange.from, minLogicalIndex),
        to: Math.min(logicalRange.to, maxLogicalIndex),
      };

      if (
        logicalRange.from < minLogicalIndex ||
        logicalRange.to > maxLogicalIndex
      ) {
        timeScale.setVisibleLogicalRange(adjustedRange);
      }
    };

    chart.timeScale().subscribeVisibleLogicalRangeChange(restrictNavigation);

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.seriesData) {
        setTooltipData(null);
        return;
      }

      // param.seriesData.get()은 시리즈 종류에 관계없이 공용 유니언 타입을
      // 반환하므로, 이 차트에서 실제로 넣은 형태(캔들/히스토그램)로 단언한다.
      const candleData = param.seriesData.get(candleSeries) as
        | CandlestickData<Time>
        | undefined;
      const volumeData = param.seriesData.get(volumeSeries) as
        | HistogramData<Time>
        | undefined;
      if (!candleData || !volumeData) {
        setTooltipData(null);
        return;
      }
      const { open, high, low, close } = candleData;
      const volume = volumeData.value;

      // 이 콜백은 마운트 시 한 번만 만들어지므로, chartData/period는
      // 클로저 변수가 아니라 ref로 읽어야 항상 최신값을 본다.
      const currentChartData = chartDataRef.current;
      const currentPeriod = periodRef.current;

      const hoveredTime = param.time as number;
      const currentIndex = currentChartData.findIndex(
        (el) => Math.floor(new Date(el.time).getTime() / 1000) === hoveredTime
      );
      const prevData =
        currentIndex > 0 ? currentChartData[currentIndex - 1] : null;

      const calculateChange = (
        current: number,
        previous: number | null
      ): string | null => {
        return previous !== null
          ? (((current - previous) / previous) * 100).toFixed(2)
          : null;
      };

      const formatTimestampToDateTime = (timestamp: number): string => {
        return new Intl.DateTimeFormat("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }).format(new Date(timestamp * 1000));
      };

      setTooltipData({
        time:
          currentPeriod === "MINUTES"
            ? formatTimestampToDateTime(hoveredTime)
            : formatTimestampToDateTime(hoveredTime).split(". 00")[0],
        open,
        high,
        low,
        close,
        volume,
        openChange: prevData ? calculateChange(open, prevData.open) : null,
        highChange: prevData ? calculateChange(high, prevData.high) : null,
        lowChange: prevData ? calculateChange(low, prevData.low) : null,
        closeChange: prevData ? calculateChange(close, prevData.close) : null,
        volumeChange: prevData ? calculateChange(volume, prevData.value) : null,
      });
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  // ② chartData/period가 바뀔 때마다: 차트는 그대로 두고 시리즈 데이터만
  // 갈아끼운다(destroy·재생성 없음 — 이번 최적화의 핵심).
  useEffect(() => {
    const chart = chartRef.current;
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    if (!chart || !candleSeries || !volumeSeries || chartData.length === 0)
      return;

    // 라이브러리가 요구하는 Time(UTCTimestamp) 타입으로 변환하는 헬퍼
    const toUnixSeconds = (dateString: string): UTCTimestamp =>
      Math.floor(new Date(dateString).getTime() / 1000) as UTCTimestamp;

    candleSeries.setData(
      chartData.map((el) => ({
        time: toUnixSeconds(el.time),
        open: el.open,
        high: el.high,
        low: el.low,
        close: el.close,
      }))
    );

    volumeSeries.setData(
      chartData.map((el) => ({
        time: toUnixSeconds(el.time),
        value: el.value,
        color: el.open < el.close ? "#f04452" : "#3182f6",
      }))
    );

    // 기간 탭(10분/일/주/월/년)을 바꿔도 반영되도록 매번 다시 적용
    chart.timeScale().applyOptions({ timeVisible: period === "MINUTES" });

    const totalDataPoints = chartData.length;
    if (totalDataPoints > 75) {
      chart.timeScale().setVisibleRange({
        from: toUnixSeconds(chartData[totalDataPoints - 75].time),
        to: toUnixSeconds(chartData[totalDataPoints - 1].time),
      });
    } else {
      // 데이터가 75개 이하일 때는 항상 전체 범위가 보이도록 맞춘다.
      // (예전엔 차트를 매번 새로 만들어서 자동으로 이렇게 됐지만,
      // 이제는 명시적으로 호출해줘야 기간 전환 시 이전 확대/이동 상태가
      // 남아있지 않는다.)
      chart.timeScale().fitContent();
    }
  }, [chartData, period]);

  return (
    <ChartContainer>
      <Chart ref={chartContainerRef} $hidden={chartData.length === 0} />
      {chartData.length === 0 && (
        <LoadingChart>지원하지 않는 차트입니다.</LoadingChart>
      )}
      {tooltipData && (
        <TooltipContainer>
          <TooltipPrice>
            <strong>{tooltipData.time}</strong>
          </TooltipPrice>
          {tooltipCategory.map((el, index) => {
            return (
              <TooltipInfo key={index}>
                <TooltipTitle>{el.title}:</TooltipTitle>
                <TooltipPrice>{(el.price ?? 0).toLocaleString()}</TooltipPrice>
                <TooltipChange
                  $change={el.change != null ? Number(el.change) : null}
                >
                  {el.change != null
                    ? `(${Number(el.change) > 0 ? "+" : ""}${el.change}%)`
                    : ""}
                </TooltipChange>
              </TooltipInfo>
            );
          })}
        </TooltipContainer>
      )}
    </ChartContainer>
  );
};

export default StockChart;

const ChartContainer = styled.div`
  position: relative;
  height: 500px;
`;

const Chart = styled.div<{ $hidden: boolean }>`
  height: 500px;
  width: 100%;
  /* 데이터가 없을 때도 컨테이너 자체는 계속 DOM에 남겨둬야
     마운트 시점에 chartContainerRef가 잡혀 차트를 만들 수 있다.
     그래서 unmount 대신 visibility로만 숨긴다. */
  visibility: ${({ $hidden }) => ($hidden ? "hidden" : "visible")};
`;

const TooltipContainer = styled.div`
  position: absolute;
  top: -10px;
  font-size: 12px;
  z-index: 1000;
  pointer-events: none;
  display: flex;
  gap: 6px;
`;

const TooltipInfo = styled.div`
  display: flex;
  gap: 2px;
`;

const TooltipTitle = styled.span`
  font-weight: 500;
  color: #000;
`;

const TooltipPrice = styled.span`
  color: #4e5968;
`;

const TooltipChange = styled.span<{ $change: number | null }>`
  color: ${({ $change }) =>
    $change !== null && $change > 0
      ? "#f04452"
      : $change !== null && $change < 0
      ? "#3182f6"
      : "#4e5968"};
`;

const LoadingChart = styled.div`
  position: absolute;
  inset: 0;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #333d4b;
`;
