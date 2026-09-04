import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { LiveStockMessage } from "@/types/stock";

// vi.mock은 파일 최상단으로 끌어올려지므로(hoisting), 팩토리 함수 안에서
// 참조할 mock 함수들은 vi.hoisted로 미리 선언해야 "초기화 전 접근" 에러가
// 안 난다.
const {
  ClientMock,
  activateMock,
  deactivateMock,
  clientUnsubscribeMock,
  subscribeMock,
} = vi.hoisted(() => ({
  ClientMock: vi.fn(),
  activateMock: vi.fn(),
  deactivateMock: vi.fn(),
  clientUnsubscribeMock: vi.fn(),
  subscribeMock: vi.fn(),
}));

// 실제 웹소켓 연결을 시도하지 않도록 sockjs-client/stompjs를 통째로 대체.
vi.mock("sockjs-client", () => ({
  default: vi.fn().mockImplementation(() => ({})),
}));

vi.mock("@stomp/stompjs", () => ({
  Client: ClientMock,
}));

// isTradingTime이 실제 "지금" 시각을 봐서, 테스트를 언제 돌리느냐에 따라
// 훅이 아예 연결을 시도 안 할 수도 있다. 항상 true로 고정.
vi.mock("@/utils/isTradingTime", () => ({
  default: () => true,
}));

// 위 vi.mock들이 적용된 뒤에 import해야 훅 내부에서 mock된 모듈을 쓴다.
import useStockSocket from "@/hooks/useStockSocket";

const STOCK_CODE = "005930";

const mockClientInstance = {
  activate: activateMock,
  deactivate: deactivateMock,
  unsubscribe: clientUnsubscribeMock,
  subscribe: subscribeMock,
  connected: true,
};

describe("useStockSocket", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("stockCode가 없으면 STOMP 클라이언트를 생성하지 않는다", () => {
    renderHook(() => useStockSocket(undefined));

    expect(ClientMock).not.toHaveBeenCalled();
  });

  it("연결에 성공하면 해당 종목을 구독하고, 메시지가 오면 messages/currentPrice를 갱신한다", () => {
    ClientMock.mockImplementation(() => mockClientInstance);
    subscribeMock.mockReturnValue({ id: "sub-0", unsubscribe: vi.fn() });

    const { result, unmount } = renderHook(() => useStockSocket(STOCK_CODE));

    expect(activateMock).toHaveBeenCalledTimes(1);

    // 실제로는 STOMP 서버 연결이 성공하면 stompjs가 이 콜백을 호출해준다.
    // Client 자체를 mock했기 때문에, new Client({...})에 넘긴 설정 객체를
    // 꺼내 테스트에서 직접 호출해 "연결 성공"을 흉내낸다.
    const config = ClientMock.mock.calls[0][0];
    act(() => {
      config.onConnect();
    });

    expect(subscribeMock).toHaveBeenCalledWith(
      `/sub/${STOCK_CODE}`,
      expect.any(Function),
      { stockCode: STOCK_CODE }
    );

    // subscribe()의 두 번째 인자(메시지 핸들러)를 꺼내, 서버가 실제로
    // 메시지를 보낸 것처럼 흉내낸다.
    const messageHandler = subscribeMock.mock.calls[0][1];
    const fakeMessage: LiveStockMessage = {
      price: 71_000,
      stockCount: 10,
      volume: 123_456,
      tradeType: "BUY",
      changeRate: 1.5,
      time: "2026-09-03T10:00:00",
    };
    act(() => {
      messageHandler({ body: JSON.stringify(fakeMessage) });
    });

    expect(result.current.messages).toEqual([fakeMessage]);
    expect(result.current.currentPrice).toBe(71_000);

    // renderHook을 언마운트하지 않고 테스트를 끝내면, 다음 테스트의
    // afterEach 시점에 전역 cleanup()이 뒤늦게 이 훅을 정리하면서
    // deactivate 같은 mock 호출 횟수가 다음 테스트로 새어 들어간다.
    unmount();
  });

  it("언마운트되면 구독을 해제하고 연결을 종료한다", () => {
    ClientMock.mockImplementation(() => mockClientInstance);
    subscribeMock.mockReturnValue({ id: "sub-0", unsubscribe: vi.fn() });

    const { unmount } = renderHook(() => useStockSocket(STOCK_CODE));
    const config = ClientMock.mock.calls[0][0];
    act(() => {
      config.onConnect();
    });

    unmount();

    expect(clientUnsubscribeMock).toHaveBeenCalledWith("sub-0", {
      stockCode: STOCK_CODE,
    });
    expect(deactivateMock).toHaveBeenCalledTimes(1);
  });
});
