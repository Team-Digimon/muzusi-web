import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { ChartDataItem, ChartPeriod } from "@/types/stock";

interface GetStocksChartParams {
  stockCode: string;
  period: ChartPeriod;
}

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
