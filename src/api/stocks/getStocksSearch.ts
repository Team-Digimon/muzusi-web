import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { Stock } from "@/types/stock";

/** 키워드(종목명)로 종목을 검색한다. 헤더 검색창 자동완성용. */
const getStocksSearch = async ({
  keyword,
}: {
  keyword: string;
}): Promise<ApiEnvelope<Stock[]>> => {
  try {
    const response = await authApi.get<ApiEnvelope<Stock[]>>(
      `stocks/search?keyword=${keyword}`
    );

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default getStocksSearch;
