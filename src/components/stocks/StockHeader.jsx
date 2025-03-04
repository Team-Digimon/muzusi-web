import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styled from "styled-components";

const StockHeader = ({ stock, currentPrice, yesterdayData }) => {
  const [change, setChange] = useState(0);
  const [changeRate, setChangeRate] = useState(0);
  const [yesterdayPrice, setYesterdayPrice] = useState(0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());

    return `${month}월 ${day}일`;
  };

  useEffect(() => {
    setYesterdayPrice(yesterdayData.close);
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
        <PriceText>{formatDate(yesterdayData.date)}보다</PriceText>
        <PriceChange $change={change}>
          {change > 0 ? `+${change.toLocaleString()}` : change.toLocaleString()}
          원 ({changeRate.toFixed(2)}%)
        </PriceChange>
      </StockPrice>
    </StockHeaderContainer>
  );
};

StockHeader.propTypes = {
  stock: PropTypes.shape({
    stockName: PropTypes.string.isRequired,
    stockCode: PropTypes.string.isRequired,
  }),
  currentPrice: PropTypes.number.isRequired,
  yesterdayData: PropTypes.object.isRequired,
  messages: PropTypes.array.isRequired,
};

export default StockHeader;

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

const PriceText = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: ${({ $change }) =>
    $change > 0 ? "#f04452" : $change < 0 ? "#3182f6" : "#4e5968"};
  margin-right: 6px;
`;

const PriceChange = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: ${({ $change }) =>
    $change > 0 ? "#f04452" : $change < 0 ? "#3182f6" : "#4e5968"};
`;
