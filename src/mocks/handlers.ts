import { http, HttpResponse } from 'msw'
import { baseUrl } from '@/config/Env'
import type { ApiEnvelope } from '@/types/api'
import type { CurrentAccountData, Transaction } from '@/types/account'
import type { Holding } from '@/types/stock'

// MSW는 요청 URL을 절대 경로로 매칭한다. axios가 baseUrl(테스트 환경에선
// vite.config.js의 test.env로 고정한 값) + 상대 경로를 합쳐서 요청을
// 보내므로, 핸들러도 같은 방식으로 절대 URL을 만들어 등록해야 매칭된다.
const url = (path: string) => new URL(path, baseUrl).toString()

const mockCurrentAccount: CurrentAccountData = {
  id: 'mock-account-1',
  balance: 5_000_000,
  totalEvaluatedAmount: 5_200_000,
  totalProfitAmount: 200_000,
  totalRateOfReturn: 4,
  accountProfits: [
    { createdAt: '2026-09-01T09:00:00', totalBalance: 5_000_000 },
    { createdAt: '2026-09-02T09:00:00', totalBalance: 5_200_000 },
  ],
}

const mockHoldings: Holding[] = [
  {
    id: 'mock-holding-1',
    stockName: '무주시전자',
    stockCode: '000001',
    stockCount: 10,
    averagePrice: 70_000,
    rateOfReturn: 5,
    totalProfitAmount: 35_000,
  },
]

const mockTransactions: Transaction[] = [
  {
    id: 'mock-transaction-1',
    tradeAt: '2026-09-01T10:00:00',
    stockName: '무주시전자',
    tradeType: 'BUY',
    stockCount: 10,
    stockPrice: 70_000,
  },
]

export const handlers = [
  http.get(url('accounts/current'), () => {
    return HttpResponse.json<ApiEnvelope<CurrentAccountData>>({
      code: 200,
      message: 'OK',
      data: mockCurrentAccount,
    })
  }),

  http.get(url('accounts/holdings'), () => {
    return HttpResponse.json<ApiEnvelope<Holding[]>>({
      code: 200,
      message: 'OK',
      data: mockHoldings,
    })
  }),

  http.get(url('accounts/:accountId'), () => {
    return HttpResponse.json<ApiEnvelope<Transaction[]>>({
      code: 200,
      message: 'OK',
      data: mockTransactions,
    })
  }),
]
