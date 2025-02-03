import StockChartContainer from "@/components/stocks/StockChartContainer";
import { useLocation } from "react-router-dom";

const Stocks = () => {
  const location = useLocation();
  const stock = location.state?.stock;
  return <StockChartContainer stock={stock} />;
};

export default Stocks;
