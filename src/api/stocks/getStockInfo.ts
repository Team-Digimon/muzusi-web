import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { StockInfo } from "@/types/stock";

interface GetStocksInfoParams {
  stockCode: string;
}

/** 종목 코드로 종목코드/종목명/시장구분 등 기본 정보를 조회한다. */
const getStockInfo = async ({
  stockCode,
}: GetStocksInfoParams): Promise<ApiEnvelope<StockInfo>> => {
  try {
    const response = await authApi.get<ApiEnvelope<StockInfo>>(
      `stocks/${stockCode}`
    );

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default getStockInfo;
