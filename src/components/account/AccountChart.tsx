import { createChart, LineSeries, ColorType } from "lightweight-charts";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { getChartThemeColors, subscribeToChartTheme } from "@/styles/chartTheme";
import type { AccountProfit } from "@/types/account";

interface AccountChartProps {
  chartData: AccountProfit[];
}

const AccountChart = ({ chartData }: AccountChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !chartData.length) return;

    const initialTheme = getChartThemeColors();

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        // lightweight-charts v5부터 배경색 지정 방식이 background:{type,color}
        // 객체로 바뀌었다. 예전 backgroundColor 플랫 필드는 라이브러리가
        // 조용히 무시해서, 지금까지 이 옵션은 적용된 적이 없었다.
        background: { type: ColorType.Solid, color: initialTheme.background },
        textColor: initialTheme.textColor,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      timeScale: {
        borderVisible: false,
      },
      rightPriceScale: {
        visible: false,
      },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: "#E75151",
      lineWidth: 2,
    });

    const formattedData = chartData.reverse().map((item) => ({
      time: item.createdAt,
      value: item.totalBalance,
    }));

    lineSeries.setData(formattedData);
    chart.timeScale().fitContent();

    const unsubscribeChartTheme = subscribeToChartTheme((colors) => {
      chart.applyOptions({
        layout: {
          background: { type: ColorType.Solid, color: colors.background },
          textColor: colors.textColor,
        },
      });
    });

    return () => {
      unsubscribeChartTheme();
      chart.remove();
    };
  }, [chartData]);

  return <AccountChartContainer ref={chartContainerRef} />;
};

export default AccountChart;

const AccountChartContainer = styled.div`
  display: flex;
  height: 300px;
  width: 100%;
  justify-content: center;
`;
