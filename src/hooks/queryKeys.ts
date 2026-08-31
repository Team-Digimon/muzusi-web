// 여러 컴포넌트가 같은 queryKey를 써야 캐시를 공유하므로, 문자열을
// 직접 여기저기 흩어놓는 대신 한 곳에 모아 오타로 인한 캐시 불일치를 막는다.
export const accountQueryKeys = {
  current: ["currentAccount"] as const,
  holdings: ["accountHoldings"] as const,
  transactions: (accountId: string | undefined) =>
    ["accountTransactions", accountId] as const,
};
