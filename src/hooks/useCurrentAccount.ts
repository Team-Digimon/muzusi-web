import { useQuery } from "@tanstack/react-query";
import getCurrentAccount from "@/api/account/getCurrentAccount";
import { accountQueryKeys } from "@/hooks/queryKeys";

/**
 * 현재 활성 계좌 정보를 조회하는 훅. `CurrentAccount`,
 * `AccountTransactions`, `StockTrade` 세 곳이 각자 따로
 * `getCurrentAccount()`를 부르던 걸 하나로 합친 것으로, 같은
 * queryKey를 쓰는 동안에는 마운트된 순서와 무관하게 요청이 1번만 나간다.
 * @param options.enabled - `false`면 쿼리를 실행하지 않는다(예: 로그인
 *   전에는 계좌 조회 자체가 무의미하므로 비활성화).
 */
const useCurrentAccount = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: accountQueryKeys.current,
    queryFn: async () => {
      const response = await getCurrentAccount();
      return response.data;
    },
    enabled: options?.enabled,
  });
};

export default useCurrentAccount;
