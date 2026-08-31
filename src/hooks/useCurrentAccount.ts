import { useQuery } from "@tanstack/react-query";
import getCurrentAccount from "@/api/account/getCurrentAccount";
import { accountQueryKeys } from "@/hooks/queryKeys";

// CurrentAccount, AccountTransactions, StockTrade 세 곳이 각자 따로
// getCurrentAccount()를 부르던 걸 하나로 합친다. 같은 queryKey를 쓰는
// 동안에는 실제로 마운트된 순서와 무관하게 요청이 1번만 나간다.
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
