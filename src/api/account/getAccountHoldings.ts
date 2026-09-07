import authApi from "@/api/authApi";
import { handleApiErrorWithPayload } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { Holding } from "@/types/stock";

/** 현재 계좌가 보유 중인 종목 목록을 조회한다. */
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
