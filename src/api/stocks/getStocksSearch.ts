import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { Stock } from "@/types/stock";

/**
 * 키워드로 종목을 검색한다. 종목 검색 화면뿐 아니라, `Stocks` 페이지가
 * `location.state` 없이(새로고침·URL 직접 접속) 진입했을 때 URL의
 * 종목 코드로 종목 정보를 다시 조회하는 용도로도 쓰인다.
 */
const getStocksSearch = async ({
  keyword,
}: {
  keyword: string;
}): Promise<ApiEnvelope<Stock[]>> => {
  try {
    const response = await authApi.get<ApiEnvelope<Stock[]>>(
      `stocks?keyword=${keyword}`
    );

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default getStocksSearch;
