export type TradeType = "BUY" | "SELL";

export type ChartPeriod =
  | "MINUTES"
  | "MINUTES_WEEK"
  | "MINUTES_TODAY"
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "YEARLY";

// 검색 결과·순위·보유 목록 등에서 종목 상세로 이동할 때 쓰이는 최소 정보
export interface Stock {
  stockCode: string;
  stockName: string;
}

export interface StockRankItem {
  rank: number;
  name: string;
  code: string;
  price: number;
  prdyVrss: number;
  prdyCtrt: number;
  avrgVol: number;
}

export interface StocksRankData {
  rank: StockRankItem[];
  time: string;
}

export interface ChartDataItem {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Holding {
  id: string;
  stockName: string;
  stockCode: string;
  stockCount: number;
  averagePrice: number;
  rateOfReturn: number;
  totalProfitAmount: number;
}

export interface Reservation {
  id: string;
  createdAt: string;
  tradeType: TradeType;
  stockName: string;
  stockCode: string;
  inputPrice: number;
  stockCount: number;
}

export interface CreateTradeData {
  stockPrice: number;
  inputPrice: number;
  stockCount: number;
  stockName: string;
  stockCode: string;
  tradeType: TradeType;
}
