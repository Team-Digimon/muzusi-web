import { useQuery } from "@tanstack/react-query";
import getAccountHoldings from "@/api/account/getAccountHoldings";
import { accountQueryKeys } from "@/hooks/queryKeys";

/**
 * 계좌 보유 종목 목록을 조회하는 훅. `Holdings`(사이드 패널),
 * `StockTrade`(주문 패널) 두 곳이 각자 따로 `getAccountHoldings()`를
 * 부르던 걸 하나로 합친 것으로, 같은 queryKey를 공유하므로 한쪽에서
 * `invalidateQueries`하면 둘 다 자동 갱신된다.
 * @param options.enabled - `false`면 쿼리를 실행하지 않는다(예: 로그인
 *   전에는 계좌 조회 자체가 무의미하므로 비활성화).
 */
const useAccountHoldings = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: accountQueryKeys.holdings,
    queryFn: async () => {
      const response = await getAccountHoldings();
      return response.data;
    },
    enabled: options?.enabled,
  });
};

export default useAccountHoldings;
