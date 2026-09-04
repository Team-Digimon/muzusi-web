import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Client } from "@stomp/stompjs";
import type { StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { webSocketUrl } from "@/config/Env";
import isTradingTime from "@/utils/isTradingTime";
import type { LiveStockMessage } from "@/types/stock";

// 실시간 시세 테이블에 쌓아둘 체결 메시지 최대 개수. 상한이 없으면 장시간
// 접속 시 배열이 끝없이 늘어나 메모리/렌더 비용이 계속 커진다.
const MAX_LIVE_MESSAGES = 50;

interface UseStockSocketResult {
  messages: LiveStockMessage[];
  currentPrice: number;
  // 차트 데이터가 먼저 도착했을 때 그 종가로 초기값을 세팅하는 건 이
  // 훅의 관심사가 아니라 Stocks.tsx 쪽 로직이라, setter를 그대로
  // 내보내 호출부가 필요할 때 직접 갱신하게 한다.
  setCurrentPrice: Dispatch<SetStateAction<number>>;
}

// Stocks.tsx에 있던 웹소켓 연결·구독·해제 로직을 그대로 옮긴 커스텀 훅.
// 컴포넌트에서 분리해두면 renderHook으로 컴포넌트 렌더링 없이 이 로직만
// 단독으로 테스트할 수 있다.
const useStockSocket = (
  stockCode: string | undefined
): UseStockSocketResult => {
  const [messages, setMessages] = useState<LiveStockMessage[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!stockCode || !isTradingTime()) return;

    const socket = new SockJS(webSocketUrl.replace(/^ws/, "http"));
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }

        subscriptionRef.current = client.subscribe(
          `/sub/${stockCode}`,
          (message) => {
            const parsedMessage: LiveStockMessage = JSON.parse(message.body);
            setMessages((prev) =>
              [parsedMessage, ...prev].slice(0, MAX_LIVE_MESSAGES)
            );
            setCurrentPrice(parsedMessage.price);
          },
          {
            stockCode,
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
          stockCode,
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
  }, [stockCode]);

  return { messages, currentPrice, setCurrentPrice };
};

export default useStockSocket;
