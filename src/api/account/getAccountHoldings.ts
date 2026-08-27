import authApi from "@/api/authApi";
import { handleApiErrorWithPayload } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { Holding } from "@/types/stock";

const getAccountHoldings = async (): Promise<ApiEnvelope<Holding[]>> => {
  try {
    const response = await authApi.get<ApiEnvelope<Holding[]>>(
      `accounts/holdings`
    );
    return response.data;
  } catch (error) {
    return handleApiErrorWithPayload(error);
  }
};

export default getAccountHoldings;
