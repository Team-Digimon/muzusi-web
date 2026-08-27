import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { Stock } from "@/types/stock";

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
