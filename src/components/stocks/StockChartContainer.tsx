import StockChart from "./StockChart";
import styled from "styled-components";
import type { ChartPeriod, StockChartPoint } from "@/types/stock";

interface PeriodOption {
  value: ChartPeriod;
  korean: string;
}

interface StockChartContainerProps {
  period: ChartPeriod;
  periods: PeriodOption[];
  handlePeriod: (period: ChartPeriod) => () => void;
  chartData: StockChartPoint[];
}

const StockChartContainer = ({
  period,
  periods,
  handlePeriod,
  chartData,
}: StockChartContainerProps) => {
  return (
    <StockContainer>
      <ChartContainer>
        <ChartHeader>
          <ChartPeriods>
            {periods.map((el, index) => {
              return (
                <ChartPeriodBtn
                  key={index}
                  onClick={handlePeriod(el.value)}
                  $isActive={period === el.value}
                >
                  {el.korean}
                </ChartPeriodBtn>
              );
            })}
          </ChartPeriods>
        </ChartHeader>
        <StockChart chartData={chartData} period={period} />
      </ChartContainer>
    </StockContainer>
  );
};

export default StockChartContainer;

const StockContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: end;
  font-size: 14px;
  align-items: center;
  margin-bottom: 16px;
  margin-right: 22px;
`;

const ChartPeriods = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const ChartPeriodBtn = styled.div<{ $isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  color: #031228b2;
  min-height: 32px;
  min-width: 16px;
  padding: 4px 12px;
  border-radius: 8px;
  background: ${({ $isActive }) => ($isActive ? "#0220470d" : " #fff")};
  cursor: pointer;
  &:hover {
    background: #0220470d;
  }
`;
