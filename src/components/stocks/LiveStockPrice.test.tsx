import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { LiveStockMessage } from "@/types/stock";
import LiveStockPrice from "@/components/stocks/LiveStockPrice";

// isTradingTime이 실제 "지금" 시각을 보므로, 테스트마다 원하는 분기를
// 강제하기 위해 모듈 자체를 mock한다.
const { isTradingTimeMock } = vi.hoisted(() => ({
  isTradingTimeMock: vi.fn(),
}));

vi.mock("@/utils/isTradingTime", () => ({
  default: isTradingTimeMock,
}));

const buildMessage = (
  overrides: Partial<LiveStockMessage> = {}
): LiveStockMessage => ({
  price: 71_000,
  stockCount: 10,
  volume: 123_456,
  tradeType: "BUY",
  changeRate: 1.5,
  time: "10:00:00",
  ...overrides,
});

describe("LiveStockPrice", () => {
  it("장중이 아니면 메시지 유무와 무관하게 장 시간 안내를 렌더링한다", () => {
    isTradingTimeMock.mockReturnValue(false);

    render(<LiveStockPrice messages={[buildMessage()]} />);

    // 안내 문구가 <br/>로 나뉘어 textContent가 이어붙으므로 정규식으로 매칭.
    expect(screen.getByText(/현재 장 시간이 아닙니다/)).toBeInTheDocument();
  });

  it("장중이고 메시지가 없으면 로딩 안내를 렌더링한다", () => {
    isTradingTimeMock.mockReturnValue(true);

    render(<LiveStockPrice messages={[]} />);

    expect(
      screen.getByText("실시간 정보를 불러오는 중입니다.")
    ).toBeInTheDocument();
  });

  it("장중이고 메시지가 있으면 체결 내역 테이블을 렌더링한다", () => {
    isTradingTimeMock.mockReturnValue(true);

    render(
      <LiveStockPrice
        messages={[buildMessage({ price: 71_000 }), buildMessage({ price: 70_500, tradeType: "SELL" })]}
      />
    );

    // 체결가는 toLocaleString()으로 콤마가 붙어 렌더링된다.
    expect(screen.getByText("71,000")).toBeInTheDocument();
    expect(screen.getByText("70,500")).toBeInTheDocument();
    expect(
      screen.queryByText("실시간 정보를 불러오는 중입니다.")
    ).not.toBeInTheDocument();
  });
});
