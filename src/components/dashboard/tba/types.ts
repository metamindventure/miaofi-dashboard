export type Severity = "high" | "medium" | "low";

export interface TradeEvidence {
  asset: string;
  action: "buy" | "sell";
  date: string;
  price: string;
  amount: string;
  priceAtDetection: string;
  pnl: string;
  pnlPercent: number;
}

export interface BehaviorPattern {
  id: string;
  label: string;
  severity: Severity;
  confidence: number;
  summary: string;
  dollarImpact: number;
  tradeCount: number;
  recommendation: string;
  evidence: TradeEvidence[];
  actions: { label: string; description: string }[];
}

export interface WorstTrade {
  id: string;
  asset: string;
  buyDate: string;
  buyPrice: string;
  amount: string;
  sellDate?: string;
  sellPrice?: string;
  status: "sold" | "holding";
  lossAmount: number;
  lossPercent: number;
  linkedPatternId?: string;
  linkedPatternLabel?: string;
  comment: string;
}

export interface BenchmarkPoint {
  day: number;
  user: number;
  btc: number;
}

export interface BenchmarkData {
  userReturn: number;
  btcReturn: number;
  gap: number;
  attribution: string;
  chart: Record<"30D" | "60D" | "90D", BenchmarkPoint[]>;
}
