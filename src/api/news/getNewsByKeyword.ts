import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { NewsListData } from "@/types/news";

interface GetNewsByKeywordParams {
  page: number;
  size: number;
  sort: string;
  keyword: string;
}

const getNewsByKeyword = async ({
  page,
  size,
  sort,
  keyword,
}: GetNewsByKeywordParams): Promise<ApiEnvelope<NewsListData>> => {
  try {
    const response = await authApi.get<ApiEnvelope<NewsListData>>(
      `news/search?page=${page}&size=${size}&sort=${sort}&keyword=${keyword}`
    );

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default getNewsByKeyword;
