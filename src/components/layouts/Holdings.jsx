import getAccountHoldings from "@/api/account/getAccountHoldings";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHoldings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAccountHoldings();
      sessionStorage.setItem("holdings", JSON.stringify(response.data));
      setHoldings(response.data);
    } catch (error) {
      console.error("보유 주식 가져오기 실패: ", error.message);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <HoldingsContainer>
      {holdings.map((stock) => {
        const totalPrice = stock.stockCount * stock.averagePrice;
        const adjustedRate =
          stock.rateOfReturn < 0
            ? Math.abs(stock.rateOfReturn)
            : stock.rateOfReturn;
        const formattedProfit = stock.totalProfitAmount.toLocaleString();

        return (
          <HoldingStock key={stock.id}>
            <StockInfo>
              <StockName>{stock.stockName}</StockName>
              <StockPrice>{totalPrice.toLocaleString()}</StockPrice>
            </StockInfo>
            <StockInfo>
              <StockCount>{stock.stockCount}주</StockCount>
              <RateOfReturn $profit={stock.totalProfitAmount}>
                {stock.totalProfitAmount > 0
                  ? `+${formattedProfit}`
                  : formattedProfit}
                ({adjustedRate}%)
              </RateOfReturn>
            </StockInfo>
          </HoldingStock>
        );
      })}
    </HoldingsContainer>
  );
};

export default Holdings;

const HoldingsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HoldingStock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border-radius: 10px;

  &:hover {
    background-color: #021f470d;
  }
`;

const StockInfo = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const StockName = styled.span`
  font-weight: 500;
  color: #4e5968;
  line-height: 1.45;
  font-size: 14px;
`;

const StockPrice = styled.span`
  font-weight: 600;
  color: #333d4b;
  line-height: 1.45;
  font-size: 14px;
`;

const StockCount = styled.span`
  font-weight: 500;
  color: #6b7684;
  line-height: 1.45;
  font-size: 12px;
`;

const RateOfReturn = styled.span`
  font-weight: 500;
  line-height: 1.45;
  font-size: 12px;
  color: ${({ $profit }) => ($profit > 0 ? "#f04452" : "#3182f6")};
`;
