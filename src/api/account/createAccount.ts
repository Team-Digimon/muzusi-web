import authApi from "@/api/authApi";
import { handleApiErrorWithPayload } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { CurrentAccountData } from "@/types/account";

/**
 * 새 모의 투자 계좌를 생성한다. 계좌가 없는 사용자가 서비스를 처음
 * 이용할 때, 또는 기존 계좌를 초기화(재생성)하고 싶을 때 호출한다.
 */
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
