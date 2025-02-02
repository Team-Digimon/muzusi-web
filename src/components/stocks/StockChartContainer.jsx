import { useState, useEffect } from "react";
import StockChart from "./StockChart";
import getStocksChart from "@/api/stocks/getStockChart";
import PropTypes from "prop-types";
import styled from "styled-components";

const StockChartContainer = ({ stock }) => {
  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState("DAILY");

  const periods = [
    { value: "DAILY", korean: "일" },
    { value: "WEEKLY", korean: "주" },
    { value: "MONTHLY", korean: "월" },
    { value: "YEARLY", korean: "년" },
  ];

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await getStocksChart({
          stockCode: stock.stockCode,
          period: period,
        });
        const transformedChartData = response.data.map((el) => ({
          time: el.date,
          open: el.open,
          high: el.high,
          low: el.low,
          close: el.close,
          value: el.volume,
        }));
        setChartData(transformedChartData);
      } catch (error) {
        console.error("주식 차트 데이터 가져오기 실패:", error.message);
      }
    };

    fetchChartData();
  }, [stock.stockCode, period]);

  const handlePeriod = (period) => () => {
    setPeriod(period);
  };

  return (
    <StockContainer>
      <StockName>{stock.stockName}</StockName>
      <ChartContainer>
        <ChartHeader>
          <ChartTitle>차트</ChartTitle>
          <ChartPeriods>
            {periods.map((el, index) => {
              return (
                <ChartPeriod
                  key={index}
                  onClick={handlePeriod(el.value)}
                  $isActive={period === el.value}
                >
                  {el.korean}
                </ChartPeriod>
              );
            })}
          </ChartPeriods>
        </ChartHeader>
        <StockChart chartData={chartData} />
      </ChartContainer>
    </StockContainer>
  );
};

StockChartContainer.propTypes = {
  stock: PropTypes.shape({
    stockName: PropTypes.string.isRequired,
    stockCode: PropTypes.string.isRequired,
  }),
};

export default StockChartContainer;

const StockContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StockName = styled.div`
  font-size: 25px;
  font-weight: bold;
  color: #333d4b;
  line-height: 1.3;
  padding: 8px;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
  border-radius: 16px;
  background: #fff;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  align-items: center;
  padding: 8px 0px;
  margin-bottom: 16px;
  margin-right: 22px;
`;

const ChartTitle = styled.div`
  font-weight: bold;
  color: #333d4b;
  line-height: 1.45;
`;

const ChartPeriods = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const ChartPeriod = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  color: #031228b2;
  min-height: 32px;
  min-width: 16px;
  padding: 4px 12px;
  border-radius: 8px;
  background: ${({ $isActive }) => ($isActive ? "#0220470d" : " #fff")};
  cursor: pointer;
  &:hover {
    background: #0220470d;
  }
`;
