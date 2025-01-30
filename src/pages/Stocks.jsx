import { useLocation } from "react-router-dom";

const Stocks = () => {
  const location = useLocation();
  const stock = location.state?.stock;
  return <div>{stock.stockName}종목 화면입니다.</div>;
};

export default Stocks;
