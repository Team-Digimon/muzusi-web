import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { AccountRecord } from "@/types/account";

const getAccountRecords = async (): Promise<ApiEnvelope<AccountRecord[]>> => {
  try {
    const response = await authApi.get<ApiEnvelope<AccountRecord[]>>(
      `accounts`
    );

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default getAccountRecords;
