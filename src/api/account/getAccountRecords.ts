import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { AccountRecord } from "@/types/account";

/**
 * 이 사용자가 개설했던 계좌들의 기록(생성 시점 잔고·평가금액)을
 * 조회한다. `createAccount`로 계좌를 재생성할 때마다 새 기록이 쌓인다.
 */
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
