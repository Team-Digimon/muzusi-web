import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { StocksRankData } from "@/types/stock";

type RankType = "VOLUME" | "RISING" | "FALLING";

const getStocksRank = async ({
  type,
}: {
  type: RankType;
}): Promise<ApiEnvelope<StocksRankData>> => {
  try {
    const response = await authApi.get<ApiEnvelope<StocksRankData>>(
      `stocks/rank?type=${type}`
    );

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default getStocksRank;
