import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { CurrentAccountData } from "@/types/account";

const getCurrentAccount = async (): Promise<
  ApiEnvelope<CurrentAccountData>
> => {
  try {
    const response = await authApi.get<ApiEnvelope<CurrentAccountData>>(
      `accounts/current`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default getCurrentAccount;
