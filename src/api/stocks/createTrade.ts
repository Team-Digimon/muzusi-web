import authApi from "@/api/authApi";
import { handleApiErrorWithPayload } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { CreateTradeData } from "@/types/stock";

const createTrade = async ({
  data,
}: {
  data: CreateTradeData;
}): Promise<ApiEnvelope<null>> => {
  try {
    const response = await authApi.post<ApiEnvelope<null>>(`stocks`, data);
    return response.data;
  } catch (error) {
    return handleApiErrorWithPayload(error);
  }
};

export default createTrade;
