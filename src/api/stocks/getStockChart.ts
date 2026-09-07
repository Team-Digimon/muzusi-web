import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { ChartDataItem, ChartPeriod } from "@/types/stock";

interface GetStocksChartParams {
  stockCode: string;
  period: ChartPeriod;
}

/**
 * 종목의 기간별(분/일/주/월/년) 캔들 차트 데이터를 조회한다.
 * `Stocks` 페이지가 어제 종가 조회와 차트 렌더링 양쪽에 이 함수를 쓴다.
 */
const getStocksChart = async ({
  stockCode,
  period,
}: GetStocksChartParams): Promise<ApiEnvelope<ChartDataItem[]>> => {
  try {
    const response = await authApi.get<ApiEnvelope<ChartDataItem[]>>(
      `stocks/${stockCode}?period=${period}`
    );

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default getStocksChart;
