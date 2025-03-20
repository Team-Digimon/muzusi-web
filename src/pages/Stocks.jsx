import getStocksChart from "@/api/stocks/getStockChart";
import Error from "@/components/common/Error";
import Loading from "@/components/common/Loading";
import LiveStockPrice from "@/components/stocks/LiveStockPrice";
import StockChartContainer from "@/components/stocks/StockChartContainer";
import StockHeader from "@/components/stocks/StockHeader";
import StockTrade from "@/components/stocks/StockTrade";
import { webSocketUrl } from "@/config/Env";
import isTradingTime from "@/utils/isTradingTime";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import styled from "styled-components";

const Stocks = () => {
  const location = useLocation();
  const stock = location.state?.stock;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState("MINUTES");
  const [messages, setMessages] = useState([]);
  const subscriptionRef = useRef(null);
  const clientRef = useRef(null);
  const isFirstSet = useRef(true);
  const [yesterdayData, setYesterdayData] = useState({});
  const [currentPrice, setCurrentPrice] = useState(0);

  const periods = [
    { value: "MINUTES", korean: "10분" },
    { value: "DAILY", korean: "일" },
    { value: "WEEKLY", korean: "주" },
    { value: "MONTHLY", korean: "월" },
    { value: "YEARLY", korean: "년" },
  ];

  useEffect(() => {
    const fetchYesterdayData = async () => {
      try {
        const response = await getStocksChart({
          stockCode: stock.stockCode,
          period: "DAILY",
        });
        if (response.data.length >= 2) {
          setYesterdayData(response.data[response.data.length - 2]);
        }
      } catch (error) {
        console.error("주식 차트 데이터 가져오기 실패:", error.message);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchYesterdayData();
  }, [stock.stockCode]);

  useEffect(() => {
    if (isFirstSet.current && chartData.length > 0) {
      isFirstSet.current = false;
      setCurrentPrice(chartData[chartData.length - 1].close);
    }
  }, [chartData]);

  useEffect(() => {
    if (!isTradingTime()) return;

    const socket = new SockJS(webSocketUrl.replace(/^ws/, "http"));
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }

        subscriptionRef.current = client.subscribe(
          `/sub/${stock.stockCode}`,
          (message) => {
            const parsedMessage = JSON.parse(message.body);
            setMessages((prev) => [parsedMessage, ...prev]);
            setCurrentPrice(parsedMessage.price);
          },
          {
            stockCode: stock.stockCode,
          }
        );
      },
      onStompError: (frame) => {
        console.error("STOMP Error 발생:", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    const unsubscribeAndDisconnect = () => {
      if (subscriptionRef.current) {
        clientRef.current.unsubscribe(subscriptionRef.current.id, {
          stockCode: stock.stockCode,
        });
        subscriptionRef.current = null;
      }

      if (clientRef.current.connected) {
        clientRef.current.deactivate();
      }
    };

    const handleBeforeUnload = () => {
      unsubscribeAndDisconnect();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (subscriptionRef.current) {
        client.unsubscribe(subscriptionRef.current.id, {
          stockCode: stock.stockCode,
        });

        subscriptionRef.current = null;
      }

      window.removeEventListener("beforeunload", handleBeforeUnload);

      unsubscribeAndDisconnect();

      if (client.connected) {
        client.deactivate();
      }
    };
  }, [stock?.stockCode]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        if (period === "MINUTES") {
          const requests = [
            getStocksChart({
              stockCode: stock.stockCode,
              period: "MINUTES_WEEK",
            }),
          ];

          if (isTradingTime()) {
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
      <StockHeader
        stock={stock}
        currentPrice={currentPrice}
        yesterdayData={yesterdayData}
      />
      <StockContainer>
        <StockChartContainer
          period={period}
          periods={periods}
          handlePeriod={handlePeriod}
          chartData={chartData}
        />
        <StockTrade
          stock={stock}
          currentPrice={currentPrice}
          chartData={chartData}
        />
      </StockContainer>
      <LiveStockPrice messages={messages} />
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
