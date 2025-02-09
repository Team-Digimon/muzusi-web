import PropTypes from "prop-types";
import styled from "styled-components";

const StockHeader = ({ stock }) => {
  return (
    <StockHeaderContainer>
      <StockInfo>
        <StockName>{stock.stockName}</StockName>
        <StockCode>{stock.stockCode}</StockCode>
      </StockInfo>
      <StockPrice>
        <CurrentPrice>000원</CurrentPrice>
        <PriceText>어제보다</PriceText>
        <PriceChange>0원 (0.0)%</PriceChange>
      </StockPrice>
    </StockHeaderContainer>
  );
};

StockHeader.propTypes = {
  stock: PropTypes.shape({
    stockName: PropTypes.string.isRequired,
    stockCode: PropTypes.string.isRequired,
  }),
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
  font-weight: 600;
  color: #333d4b;
`;

const StockCode = styled.span`
  font-weight: 500;
  color: #8b95a1;
`;

const StockPrice = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.45;
`;

const CurrentPrice = styled.span`
  font-weight: bold;
  font-size: 25px;
  color: #333d4b;
  margin-right: 10px;
`;

const PriceText = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #4e5968;
  margin-right: 6px;
`;

const PriceChange = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #4e5968;
`;
