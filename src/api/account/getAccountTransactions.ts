import authApi from "@/api/authApi";
import { handleApiErrorWithPayload } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { Transaction } from "@/types/account";

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
