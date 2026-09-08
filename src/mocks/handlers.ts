import { http, HttpResponse } from 'msw'
import { baseUrl } from '@/config/Env'
import type { ApiEnvelope } from '@/types/api'
import type { CurrentAccountData, Transaction } from '@/types/account'
import type { ChartDataItem, Holding, Stock } from '@/types/stock'

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

const mockStock: Stock = {
  stockCode: '005930',
  stockName: '무주시전자',
}

const mockChartData: ChartDataItem[] = [
  {
    dateTime: '2026-09-01T09:00:00',
    open: 70_000,
    high: 71_000,
    low: 69_500,
    close: 70_500,
    volume: 12_345,
  },
  {
    dateTime: '2026-09-02T09:00:00',
    open: 70_500,
    high: 72_000,
    low: 70_000,
    close: 71_500,
    volume: 23_456,
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

  // Stocks.tsx가 location.state 없이(새로고침·URL 직접 접속) stockcode
  // 파라미터로 종목을 다시 조회할 때 부르는 API. 실제 검색어 매칭 로직은
  // 검증 대상이 아니라, 키워드와 무관하게 mockStock 하나만 돌려준다.
  http.get(url('stocks'), () => {
    return HttpResponse.json<ApiEnvelope<Stock[]>>({
      code: 200,
      message: 'OK',
      data: [mockStock],
    })
  }),

  // 어제 시세(DAILY)/차트(MINUTES 등) 조회에 공통으로 쓰인다.
  // period별로 다른 데이터를 구분할 필요가 없어 하나의 핸들러로 커버.
  http.get(url('stocks/:stockCode'), () => {
    return HttpResponse.json<ApiEnvelope<ChartDataItem[]>>({
      code: 200,
      message: 'OK',
      data: mockChartData,
    })
  }),
]
