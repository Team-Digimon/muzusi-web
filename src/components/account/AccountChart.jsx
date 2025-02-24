import { createChart, LineSeries } from "lightweight-charts";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import styled from "styled-components";

const AccountChart = ({ chartData }) => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef || !chartData.length) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWdith,
      height: 300,
      layout: {
        backgroundColor: "#ffffff",
        textColor: "#000000",
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

    return () => {
      chart.remove();
    };
  }, [chartData]);

  return <AccountChartContainer ref={chartContainerRef} />;
};

AccountChart.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      totalBalance: PropTypes.number.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ),
};

export default AccountChart;

const AccountChartContainer = styled.div`
  display: flex;
  height: 300px;
  width: 100%;
  justify-content: center;
`;
