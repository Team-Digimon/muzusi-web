import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { NewsListData } from "@/types/news";

interface GetNewsParams {
  page: number;
  size: number;
  sort: string;
}

const getNews = async ({
  page,
  size,
  sort,
}: GetNewsParams): Promise<ApiEnvelope<NewsListData>> => {
  try {
    const response = await authApi.get<ApiEnvelope<NewsListData>>(
      `news?page=${page}&size=${size}&sort=${sort}`
    );

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default getNews;
