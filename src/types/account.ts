import type { TradeType } from "@/types/stock";

export interface AccountRecord {
  id: string;
  createdAt: string;
  balance: number;
  totalEvaluatedAmount: number;
}

export interface Transaction {
  id: string;
  tradeAt: string;
  stockName: string;
  tradeType: TradeType;
  stockCount: number;
  stockPrice: number;
}

export interface AccountProfit {
  createdAt: string;
  totalBalance: number;
}

export interface CurrentAccountData {
  id: string;
  balance: number;
  totalEvaluatedAmount: number;
  totalProfitAmount: number;
  totalRateOfReturn: number;
  accountProfits: AccountProfit[];
}
