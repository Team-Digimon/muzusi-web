import authApi from "@/api/authApi";
import { handleApiErrorWithPayload } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { CurrentAccountData } from "@/types/account";

const createAccount = async (): Promise<ApiEnvelope<CurrentAccountData>> => {
  try {
    const response = await authApi.post<ApiEnvelope<CurrentAccountData>>(
      `accounts`
    );
    return response.data;
  } catch (error) {
    return handleApiErrorWithPayload(error);
  }
};

export default createAccount;
