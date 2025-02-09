import StockChartContainer from "@/components/stocks/StockChartContainer";
import StockHeader from "@/components/stocks/StockHeader";
import StockTrade from "@/components/stocks/StockTrade";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const Stocks = () => {
  const location = useLocation();
  const stock = location.state?.stock;
  return (
    <Container>
      <StockHeader stock={stock} />
      <StockContainer>
        <StockChartContainer stock={stock} />
        <StockTrade />
      </StockContainer>
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
