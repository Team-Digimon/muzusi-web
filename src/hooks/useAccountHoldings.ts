import { useQuery } from "@tanstack/react-query";
import getAccountHoldings from "@/api/account/getAccountHoldings";
import { accountQueryKeys } from "@/hooks/queryKeys";

// Holdings(사이드 패널), StockTrade(주문 패널) 두 곳이 각자 따로
// getAccountHoldings()를 부르던 걸 하나로 합친다.
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
