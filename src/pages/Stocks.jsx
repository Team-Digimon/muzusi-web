import getStocksChart from "@/api/stocks/getStockChart";
import Error from "@/components/common/Error";
import Loading from "@/components/common/Loading";
import StockChartContainer from "@/components/stocks/StockChartContainer";
import StockHeader from "@/components/stocks/StockHeader";
import StockTrade from "@/components/stocks/StockTrade";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Stocks = () => {
  const location = useLocation();
  const stock = location.state?.stock;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState("DAILY");

  const periods = [
    { value: "MINUTES", korean: "10분" },
    { value: "DAILY", korean: "일" },
    { value: "WEEKLY", korean: "주" },
    { value: "MONTHLY", korean: "월" },
    { value: "YEARLY", korean: "년" },
  ];

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        if (period === "MINUTES") {
          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const isTradingTime =
            (hours === 9 && minutes >= 10) || (hours > 9 && hours < 16);

          const requests = [
            getStocksChart({
              stockCode: stock.stockCode,
              period: "MINUTES_WEEK",
            }),
          ];

          if (isTradingTime) {
            requests.push(
              getStocksChart({
                stockCode: stock.stockCode,
                period: "MINUTES_TODAY",
              })
            );
          }

          const responses = await Promise.all(requests);

          const transformData = (data) =>
            data?.map((el) => ({
              time: el.date,
              open: el.open,
              high: el.high,
              low: el.low,
              close: el.close,
              value: el.volume,
            })) || [];

          const combinedData = responses.flatMap((response) =>
            transformData(response.data)
          );
          combinedData.sort((a, b) => a.time - b.time);

          setChartData(combinedData);
        } else {
          const response = await getStocksChart({
            stockCode: stock.stockCode,
            period,
          });
          const transformedData =
            response?.data.map((el) => ({
              time: el.date,
              open: el.open,
              high: el.high,
              low: el.low,
              close: el.close,
              value: el.volume,
            })) || [];
          setChartData(transformedData);
        }
      } catch (error) {
        console.error("주식 차트 데이터 가져오기 실패:", error.message);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [stock.stockCode, period]);

  const handlePeriod = (period) => () => {
    setPeriod(period);
  };

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <Container>
      <StockHeader stock={stock} />
      <StockContainer>
        <StockChartContainer
          period={period}
          periods={periods}
          handlePeriod={handlePeriod}
          chartData={chartData}
        />
        <StockTrade />
      </StockContainer>
    </Container>
  );
};

export default Stocks;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 30px;
`;

const StockContainer = styled.div`
  display: flex;
`;
