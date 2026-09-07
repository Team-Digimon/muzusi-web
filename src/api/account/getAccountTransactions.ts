import authApi from "@/api/authApi";
import { handleApiErrorWithPayload } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { Transaction } from "@/types/account";

/** 지정한 계좌(`accountId`)의 매수/매도 거래 내역을 조회한다. */
const getAccountTransactions = async (
  accountId: string
): Promise<ApiEnvelope<Transaction[]>> => {
  try {
    const response = await authApi.get<ApiEnvelope<Transaction[]>>(
      `accounts/${accountId}`
    );
    return response.data;
  } catch (error) {
    return handleApiErrorWithPayload(error);
  }
};

export default getAccountTransactions;
