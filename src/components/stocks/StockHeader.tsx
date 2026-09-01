import { memo, useEffect, useState } from "react";
import styled from "styled-components";
import type { ChartDataItem, Stock } from "@/types/stock";

interface StockHeaderProps {
  stock: Stock;
  currentPrice: number;
  // 어제 시세가 아직 없을 때(초기값)는 빈 객체로 내려오므로 전부 옵셔널로 둔다.
  yesterdayData: Partial<ChartDataItem>;
}

const StockHeader = ({ stock, currentPrice, yesterdayData }: StockHeaderProps) => {
  const [change, setChange] = useState(0);
  const [changeRate, setChangeRate] = useState(0);
  const [yesterdayPrice, setYesterdayPrice] = useState(0);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());

    return `${month}월 ${day}일`;
  };

  useEffect(() => {
    setYesterdayPrice(yesterdayData.close ?? 0);
  }, [yesterdayData.close]);

  useEffect(() => {
    setChange(currentPrice - yesterdayPrice);
    setChangeRate(((currentPrice - yesterdayPrice) / yesterdayPrice) * 100);
  }, [currentPrice, yesterdayPrice]);

  return (
    <StockHeaderContainer>
      <StockInfo>
        <StockName>{stock.stockName}</StockName>
        <StockCode>{stock.stockCode}</StockCode>
      </StockInfo>
      <StockPrice>
        <CurrentPrice>{currentPrice.toLocaleString()}원</CurrentPrice>
        {Object.keys(yesterdayData).length > 0 && (
          <>
            <PriceText $change={change}>
              {formatDate(yesterdayData.date ?? "")}보다
            </PriceText>
            <PriceChange $change={change}>
              {change > 0
                ? `+${change.toLocaleString()}`
                : change.toLocaleString()}
              원 ({changeRate.toFixed(2)}%)
            </PriceChange>
          </>
        )}
      </StockPrice>
    </StockHeaderContainer>
  );
};

// Stocks.tsx가 웹소켓 메시지 수신마다 리렌더되는데, StockHeader의 props
// (stock, yesterdayData)는 그때 안 바뀌는 경우가 많다. currentPrice만
// 실제로 자주 바뀌므로 memo의 효과는 "가격이 그대로인 틱"에서 발휘된다.
export default memo(StockHeader);

const StockHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StockInfo = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 20px;
  line-height: 1.5;
`;

const StockName = styled.span`
  font-weight: 500;
  color: #333d4b;
`;

const StockCode = styled.span`
  font-weight: 400;
  color: #8b95a1;
`;

const StockPrice = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.45;
`;

const CurrentPrice = styled.span`
  font-weight: 600;
  font-size: 25px;
  color: #333d4b;
  margin-right: 10px;
`;

const PriceText = styled.span<{ $change: number }>`
  font-weight: 500;
  font-size: 14px;
  color: ${({ $change }) =>
    $change > 0 ? "#f04452" : $change < 0 ? "#3182f6" : "#4e5968"};
  margin-right: 6px;
`;

const PriceChange = styled.span<{ $change: number }>`
  font-weight: 500;
  font-size: 14px;
  color: ${({ $change }) =>
    $change > 0 ? "#f04452" : $change < 0 ? "#3182f6" : "#4e5968"};
`;
