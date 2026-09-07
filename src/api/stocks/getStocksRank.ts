import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { RankType, StocksRankData } from "@/types/stock";

/** 거래량/상승률/하락률 등 기준(`type`)별 종목 랭킹을 조회한다. */
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
