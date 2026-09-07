import authApi from "@/api/authApi";
import { handleApiError } from "@/api/handleApiError";
import type { ApiEnvelope } from "@/types/api";
import type { CurrentAccountData } from "@/types/account";

/**
 * 현재 활성 계좌의 잔고·평가금액·수익률 등 요약 정보를 조회한다.
 * `CurrentAccount`, `AccountTransactions`, `StockTrade` 등 여러 화면이
 * `useCurrentAccount` 훅을 통해 이 응답을 공유해서 쓴다.
 */
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
