import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";
import styled from "styled-components";

const StockChart = ({ chartData }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [tooltipData, setTooltipData] = useState(null);
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

  useEffect(() => {
    if (!chartContainerRef.current || !chartData || chartData.length === 0)
      return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        backgroundColor: "#ffffff",
        textColor: "#000000",
      },
      grid: {
        vertLines: { color: "#e1e1e1" },
        horzLines: { color: "#e1e1e1" },
      },
      timeScale: {
        visible: true,
        borderVisible: false,
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
        formatter: (price) => price.toLocaleString("en-US"),
      },
      priceScaleId: "right",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#26a69a",
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    candleSeries.setData(
      chartData.map((el) => ({
        time: Math.floor(new Date(el.time).getTime() / 1000),
        open: el.open,
        high: el.high,
        low: el.low,
        close: el.close,
      }))
    );
    volumeSeries.setData(
      chartData.map((el) => ({
        time: Math.floor(new Date(el.time).getTime() / 1000),
        value: el.value,
        color: el.open < el.close ? "#f04452" : "#3182f6",
      }))
    );

    chart.priceScale("right").applyOptions({
      scaleMargins: { top: 0.1, bottom: 0.3 },
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    const handleResize = () => {
      chart.resize(
        chartContainerRef.current.clientWidth,
        chartContainerRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    const totalDataPoints = chartData.length;
    if (totalDataPoints > 75) {
      chart.timeScale().setVisibleRange({
        from: Math.floor(
          new Date(chartData[totalDataPoints - 75].time).getTime() / 1000
        ),
        to: Math.floor(
          new Date(chartData[totalDataPoints - 1].time).getTime() / 1000
        ),
      });
    }

    const minLogicalIndex = 0;
    const maxLogicalIndex = chartData.length - 1;

    const restrictNavigation = () => {
      const timeScale = chart.timeScale();
      const logicalRange = timeScale.getVisibleLogicalRange();

      if (logicalRange) {
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
      }
    };

    chart.timeScale().subscribeVisibleLogicalRangeChange(restrictNavigation);

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.seriesData) {
        setTooltipData(null);
        return;
      }

      const candleData = param.seriesData.get(candleSeries);
      const volumeData = param.seriesData.get(volumeSeries);
      if (!candleData || !volumeData) {
        setTooltipData(null);
        return;
      }
      const { open, high, low, close } = candleData;
      const volume = volumeData.value;

      const currentIndex = chartData.findIndex((el) => el.time === param.time);
      const prevData = currentIndex > 0 ? chartData[currentIndex - 1] : null;

      const calculateChange = (current, previous) => {
        return previous !== null
          ? (((current - previous) / previous) * 100).toFixed(2)
          : null;
      };

      const formatTimestampToDateTime = (timestamp) => {
        return new Intl.DateTimeFormat("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date(timestamp * 1000));
      };

      setTooltipData({
        time: formatTimestampToDateTime(param.time),
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
    };
  }, [chartData]);

  if (chartData.length === 0) {
    return <LoadingChart>지원하지 않는 차트입니다.</LoadingChart>;
  }

  return (
    <ChartContainer>
      <Chart ref={chartContainerRef} />
      {tooltipData && (
        <TooltipContainer>
          <TooltipPrice>
            <strong>{tooltipData.time}</strong>
          </TooltipPrice>
          {tooltipCategory.map((el, index) => {
            return (
              <TooltipInfo key={index}>
                <TooltipTitle>{el.title}:</TooltipTitle>
                <TooltipPrice>{el.price.toLocaleString()}</TooltipPrice>
                <TooltipChange $change={el.change}>
                  {el.change !== null
                    ? `(${el.change > 0 ? "+" : ""}${el.change}%)`
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

StockChart.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      open: PropTypes.number.isRequired,
      high: PropTypes.number.isRequired,
      low: PropTypes.number.isRequired,
      close: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default StockChart;

const ChartContainer = styled.div`
  position: relative;
  height: 500px;
`;

const Chart = styled.div`
  height: 500px;
  width: 100%;
`;

const TooltipContainer = styled.div`
  position: absolute;
  top: -30px;
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

const TooltipChange = styled.span`
  color: ${({ $change }) =>
    $change > 0 ? "#f04452" : $change < 0 ? "#3182f6" : "#4e5968"};
`;

const LoadingChart = styled.div`
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #333d4b;
`;
