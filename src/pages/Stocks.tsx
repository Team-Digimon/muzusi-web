import getStocksChart from "@/api/stocks/getStockChart";
import getStocksSearch from "@/api/stocks/getStocksSearch";
import Error from "@/components/common/Error";
import Loading from "@/components/common/Loading";
import LiveStockPrice from "@/components/stocks/LiveStockPrice";
import StockChartContainer from "@/components/stocks/StockChartContainer";
import StockHeader from "@/components/stocks/StockHeader";
import StockTrade from "@/components/stocks/StockTrade";
import { webSocketUrl } from "@/config/Env";
import isTradingTime from "@/utils/isTradingTime";
import { Client } from "@stomp/stompjs";
import type { StompSubscription } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import styled from "styled-components";
import type {
  ChartDataItem,
  ChartPeriod,
  LiveStockMessage,
  Stock as StockType,
  StockChartPoint,
} from "@/types/stock";

// 실시간 시세 테이블에 쌓아둘 체결 메시지 최대 개수. 상한이 없으면 장시간
// 접속 시 배열이 끝없이 늘어나 메모리/렌더 비용이 계속 커진다.
const MAX_LIVE_MESSAGES = 50;

const Stocks = () => {
  const { stockcode } = useParams<{ stockcode: string }>();
  const location = useLocation();
  // location.state는 react-router 타입상 unknown이라, 이 페이지로 넘어올 때
  // 실제로 실어 보내는 형태({ stock })로 단언해서 사용한다.
  const locationState = location.state as { stock?: StockType } | null;
  // 종목 목록/검색에서 넘어온 경우 location.state로 바로 렌더할 수 있지만,
  // 새로고침이나 URL 직접 접속처럼 state가 없는 경우 아래 effect에서 API로 다시 조회한다.
  const [stock, setStock] = useState<StockType | null>(
    locationState?.stock ?? null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [chartData, setChartData] = useState<StockChartPoint[]>([]);
  const [period, setPeriod] = useState<ChartPeriod>("MINUTES");
  const [messages, setMessages] = useState<LiveStockMessage[]>([]);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const clientRef = useRef<Client | null>(null);
  const isFirstSet = useRef(true);
  const [yesterdayData, setYesterdayData] = useState<Partial<ChartDataItem>>(
    {}
  );
  const [currentPrice, setCurrentPrice] = useState(0);

  const periods: { value: ChartPeriod; korean: string }[] = [
    { value: "MINUTES", korean: "10분" },
    { value: "DAILY", korean: "일" },
    { value: "WEEKLY", korean: "주" },
    { value: "MONTHLY", korean: "월" },
    { value: "YEARLY", korean: "년" },
  ];

  // location.state로 종목 정보가 없을 때(새로고침, URL 직접 접속, 외부 링크)
  // stockcode 파라미터로 종목 정보를 다시 조회한다.
  useEffect(() => {
    if (stock) return;

    let cancelled = false;

    const resolveStock = async () => {
      try {
        const response = await getStocksSearch({ keyword: stockcode ?? "" });
        const matched = response.data?.find(
          (el) => el.stockCode === stockcode
        );
        if (cancelled) return;

        if (matched) {
          setStock(matched);
        } else {
          // 이 파일에서 Error는 위에서 import한 공용 에러 컴포넌트를 가리켜
          // 전역 Error 생성자를 가린다. 화살표 함수 컴포넌트라 new로 호출하면
          // TypeError가 나고(바로 아래 catch로 떨어져 결과적으로 에러 화면은
          // 뜨긴 했지만, 콘솔에는 의도한 메시지 대신 "is not a constructor"가
          // 찍히고 있었다), globalThis.Error로 명시해서 고친다.
          setError(new globalThis.Error("존재하지 않는 종목입니다."));
          setIsLoading(false);
        }
      } catch (error) {
        if (cancelled) return;
        console.error(
          "종목 정보 조회 실패:",
          error instanceof globalThis.Error ? error.message : error
        );
        setError(error);
        setIsLoading(false);
      }
    };

    resolveStock();

    return () => {
      cancelled = true;
    };
  }, [stock, stockcode]);

  useEffect(() => {
    if (!stock) return;

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
        console.error(
          "주식 차트 데이터 가져오기 실패:",
          error instanceof globalThis.Error ? error.message : error
        );
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchYesterdayData();
  }, [stock]);

  useEffect(() => {
    if (isFirstSet.current && chartData.length > 0) {
      isFirstSet.current = false;
      setCurrentPrice(chartData[chartData.length - 1].close);
    }
  }, [chartData]);

  useEffect(() => {
    if (!stock || !isTradingTime()) return;

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
            const parsedMessage: LiveStockMessage = JSON.parse(message.body);
            setMessages((prev) =>
              [parsedMessage, ...prev].slice(0, MAX_LIVE_MESSAGES)
            );
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
      if (subscriptionRef.current && clientRef.current) {
        clientRef.current.unsubscribe(subscriptionRef.current.id, {
          stockCode: stock.stockCode,
        });
        subscriptionRef.current = null;
      }

      if (clientRef.current?.connected) {
        clientRef.current.deactivate();
      }
    };

    const handleBeforeUnload = () => {
      unsubscribeAndDisconnect();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      unsubscribeAndDisconnect();
    };
  }, [stock]);

  useEffect(() => {
    if (!stock) return;

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

          const transformData = (data: ChartDataItem[]): StockChartPoint[] =>
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
          // el.time은 날짜 문자열이라 그대로 빼면(NaN - NaN) 정렬이 사실상
          // 동작하지 않는다. Date로 변환해 실제 시간순으로 비교하도록 수정.
          combinedData.sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
          );

          setChartData(combinedData);
        } else {
          const response = await getStocksChart({
            stockCode: stock.stockCode,
            period,
          });
          const transformedData: StockChartPoint[] =
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
        console.error(
          "주식 차트 데이터 가져오기 실패:",
          error instanceof globalThis.Error ? error.message : error
        );
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [stock, period]);

  const handlePeriod = (period: ChartPeriod) => () => {
    setPeriod(period);
  };

  if (error) return <Error />;
  if (isLoading || !stock) return <Loading />;

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
