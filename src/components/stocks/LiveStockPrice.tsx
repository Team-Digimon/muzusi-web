import styled from "styled-components";
import MuLogo from "@/assets/logo/MuLogo.webp";
import isTradingTime from "@/utils/isTradingTime";
import type { LiveStockMessage, TradeType } from "@/types/stock";

interface LiveStockPriceProps {
  messages: LiveStockMessage[];
}

const LiveStockPrice = ({ messages }: LiveStockPriceProps) => {
  return (
    <LivePriceContainer>
      <LiveTitle>실시간 시세</LiveTitle>
      <LiveTable>
        <LiveThead>
          <LiveTheadTr>
            <LiveTheadTh style={{ width: "8%", justifyContent: "start" }}>
              체결가
            </LiveTheadTh>
            <LiveTheadTh>체결량(주)</LiveTheadTh>
            <LiveTheadTh>등락률</LiveTheadTh>
            <LiveTheadTh>거래량(주)</LiveTheadTh>
            <LiveTheadTh style={{ paddingRight: "20px" }}>시간</LiveTheadTh>
          </LiveTheadTr>
        </LiveThead>
        {messages.length > 0 ? (
          <LiveTableContent>
            {messages.map((el, index) => {
              const formattedPrice = el.price.toLocaleString();
              const formattedStockCount = el.stockCount.toLocaleString();
              const formattedVolume = el.volume.toLocaleString();
              return (
                <LiveElement key={index}>
                  <LivePrice>{formattedPrice}</LivePrice>
                  <LiveChange $tradeType={el.tradeType}>
                    {formattedStockCount}
                  </LiveChange>
                  <LiveChange $tradeType={el.tradeType}>
                    {el.changeRate}%
                  </LiveChange>
                  <LiveEnd>{formattedVolume}</LiveEnd>
                  <LiveEnd style={{ paddingRight: "5px" }}>{el.time}</LiveEnd>
                </LiveElement>
              );
            })}
          </LiveTableContent>
        ) : null}
      </LiveTable>
      {!isTradingTime() ? (
        <Notice>
          <Logo src={MuLogo} alt="MuLogo" />
          현재 장 시간이 아닙니다.
          <br />
          (9:00 ~ 15:30)
        </Notice>
      ) : messages.length > 0 ? null : (
        <Notice>실시간 정보를 불러오는 중입니다.</Notice>
      )}
    </LivePriceContainer>
  );
};

export default LiveStockPrice;

const LivePriceContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LiveTitle = styled.div`
  font-weight: bold;
  color: #333d4b;
  font-size: 14px;
  margin-top: 20px;
`;

const LiveTable = styled.table`
  display: table;
  border-collapse: separate;
  width: 100%;
`;

const LiveThead = styled.thead`
  width: 100%;
`;

const LiveTheadTr = styled.tr`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #dddddd;
`;

const LiveTheadTh = styled.th`
  color: #6b7684;
  display: flex;
  justify-content: end;
  align-items: center;
  font-weight: 500;
  min-height: 30px;
  line-height: 1.5;
  font-size: 12px;
  width: 23%;
`;

const LiveTableContent = styled.tbody`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-top: 5px;
  width: 100%;
  max-height: 100px;
  overflow-y: auto;
`;

const LiveElement = styled.tr`
  display: flex;
  width: 100%;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #f6f7f9;
  }
`;

const LivePrice = styled.th`
  display: flex;
  width: 8%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  font-weight: 400;
  font-size: 12px;
  color: #4e5968;
`;

const LiveChange = styled.th<{ $tradeType: TradeType }>`
  display: flex;
  justify-content: end;
  width: 23%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  font-weight: 400;
  font-size: 12px;
  color: ${({ $tradeType }) => ($tradeType === "BUY" ? "#f04452" : "#3182f6")};
`;

const LiveEnd = styled.th`
  display: flex;
  justify-content: end;
  width: 23%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  font-weight: 400;
  font-size: 12px;
  color: #4e5968;
`;

const Notice = styled.div`
  width: 100%;
  min-height: 100px;
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: end;
  font-size: 15px;
  font-weight: 600;
`;

const Logo = styled.img`
  width: 50px;
  height: auto;
`;
