import { BehaviorPattern, WorstTrade, BenchmarkData, BenchmarkPoint } from "./types";

export const mockPatterns: BehaviorPattern[] = [
  {
    id: "fomo-buying",
    label: "FOMO Buying",
    severity: "high",
    confidence: 91,
    summary: "4 of 6 buys happened within 2 hours of 15%+ price surges — you consistently bought near local tops.",
    dollarImpact: -2847,
    tradeCount: 4,
    recommendation: "Set limit orders at your target price before hype cycles. Wait 4+ hours after a surge before evaluating entry.",
    evidence: [
      { asset: "TSLAx", action: "buy", date: "Feb 12", price: "$412.80", amount: "12.5 TSLAx", priceAtDetection: "$381.20", pnl: "-$395", pnlPercent: -7.6 },
      { asset: "WIF", action: "buy", date: "Feb 8", price: "$2.41", amount: "850 WIF", priceAtDetection: "$1.92", pnl: "-$416", pnlPercent: -20.3 },
      { asset: "BONK", action: "buy", date: "Jan 29", price: "$0.0000182", amount: "45M BONK", priceAtDetection: "$0.0000134", pnl: "-$216", pnlPercent: -26.4 },
      { asset: "GOOGLx", action: "buy", date: "Jan 22", price: "$178.90", amount: "8.2 GOOGLx", priceAtDetection: "$155.30", pnl: "-$193", pnlPercent: -13.2 },
    ],
    actions: [
      { label: "Enable Cool-Down Timer", description: "Block buy orders for 4h after 15%+ surges" },
      { label: "Set Price Alerts Instead", description: "Get notified at your target price, not at the top" },
      { label: "Review Surge History", description: "See how past surges played out before buying" },
    ],
  },
  {
    id: "panic-selling",
    label: "Panic Selling",
    severity: "high",
    confidence: 84,
    summary: "Sold SOL and RCH within 3 hours of 10%+ dips — both recovered within 48 hours.",
    dollarImpact: -1623,
    tradeCount: 3,
    recommendation: "Set stop-losses at planned levels instead of reacting emotionally. Historical data shows 72% of 10% dips recover within a week.",
    evidence: [
      { asset: "SOL", action: "sell", date: "Feb 14", price: "$168.20", amount: "8.5 SOL", priceAtDetection: "$189.40", pnl: "-$180", pnlPercent: -11.2 },
      { asset: "RCH", action: "sell", date: "Feb 3", price: "$0.42", amount: "3200 RCH", priceAtDetection: "$0.61", pnl: "-$608", pnlPercent: -31.1 },
      { asset: "SOL", action: "sell", date: "Jan 18", price: "$172.50", amount: "5.1 SOL", priceAtDetection: "$198.80", pnl: "-$134", pnlPercent: -13.2 },
    ],
    actions: [
      { label: "Auto Stop-Loss at -15%", description: "Sell automatically at a planned level, not in panic" },
      { label: "Enable Diamond Hands Mode", description: "Require 24h wait before panic sells" },
      { label: "Set Dip Buy Alerts", description: "Get notified when dips hit recovery zones" },
    ],
  },
  {
    id: "overtrading",
    label: "Overtrading",
    severity: "medium",
    confidence: 76,
    summary: "23 trades in 30 days — 3.8× the average for your portfolio size. Each trade costs gas + slippage.",
    dollarImpact: -412,
    tradeCount: 23,
    recommendation: "Consolidate to 5-8 trades per month. Each unnecessary trade erodes returns through fees and poor timing.",
    evidence: [
      { asset: "SOL/USDT", action: "buy", date: "Feb 15", price: "$191.20", amount: "2.1 SOL", priceAtDetection: "$189.80", pnl: "-$3", pnlPercent: -0.7 },
      { asset: "SOL/USDT", action: "sell", date: "Feb 15", price: "$189.80", amount: "2.1 SOL", priceAtDetection: "$191.20", pnl: "-$3", pnlPercent: -0.7 },
    ],
    actions: [
      { label: "Set Weekly Trade Limit", description: "Cap at 2 trades per week to reduce noise" },
      { label: "Review Trading Journal", description: "Track win rate per trade to see diminishing returns" },
      { label: "Enable Trade Cooldown", description: "Add a 6h buffer between consecutive trades" },
    ],
  },
  {
    id: "concentration-risk",
    label: "Concentration Risk",
    severity: "medium",
    confidence: 88,
    summary: "69% of portfolio in tokenized stocks (TSLAx + GOOGLx). A 30% correction wipes ~$6,700.",
    dollarImpact: -6698,
    tradeCount: 2,
    recommendation: "Reduce single-category exposure below 40%. Diversify across asset types: L1s, stables, DeFi tokens.",
    evidence: [
      { asset: "TSLAx", action: "buy", date: "Jan 15", price: "$398.50", amount: "54.75 TSLAx", priceAtDetection: "$407.60", pnl: "+$499", pnlPercent: 2.3 },
      { asset: "GOOGLx", action: "buy", date: "Jan 20", price: "$165.20", amount: "17.2 GOOGLx", priceAtDetection: "$165.00", pnl: "-$3", pnlPercent: -0.1 },
    ],
    actions: [
      { label: "Rebalance Portfolio", description: "Auto-distribute across 4+ asset categories" },
      { label: "Swap 30% to SOL/ETH", description: "Move into large-cap L1 tokens" },
      { label: "Set Allocation Alerts", description: "Get warned when any category exceeds 40%" },
    ],
  },
  {
    id: "early-profit-taking",
    label: "Early Profit Taking",
    severity: "low",
    confidence: 67,
    summary: "Sold SOL at +12% — it went on to gain another 28%. You left $840 on the table.",
    dollarImpact: -840,
    tradeCount: 1,
    recommendation: "Use trailing stop-losses instead of fixed targets. Let winners run while protecting profits.",
    evidence: [
      { asset: "SOL", action: "sell", date: "Feb 1", price: "$185.40", amount: "6.2 SOL", priceAtDetection: "$237.30", pnl: "-$322 (opportunity)", pnlPercent: -28.0 },
    ],
    actions: [
      { label: "Enable Trailing Stop", description: "Lock in profits while letting winners run" },
      { label: "Set Partial Exit Rules", description: "Sell 50% at target, hold 50% with trailing stop" },
      { label: "Backtest Exit Strategy", description: "See how different exits would have performed" },
    ],
  },
];

export const mockWorstTrades: WorstTrade[] = [
  {
    id: "wt-1",
    asset: "WIF",
    buyDate: "Feb 8, 2025",
    buyPrice: "$2.41",
    amount: "850 WIF",
    sellDate: "Feb 10, 2025",
    sellPrice: "$1.92",
    status: "sold",
    lossAmount: -416,
    lossPercent: -20.3,
    linkedPatternId: "fomo-buying",
    linkedPatternLabel: "FOMO Buying",
    comment: "Bought 2 hours after a 22% pump. Classic FOMO entry at the local top.",
  },
  {
    id: "wt-2",
    asset: "RCH",
    buyDate: "Jan 25, 2025",
    buyPrice: "$0.58",
    amount: "3,200 RCH",
    sellDate: "Feb 3, 2025",
    sellPrice: "$0.42",
    status: "sold",
    lossAmount: -512,
    lossPercent: -27.6,
    linkedPatternId: "panic-selling",
    linkedPatternLabel: "Panic Selling",
    comment: "Panic sold during a flash dip. RCH recovered to $0.61 two days later.",
  },
  {
    id: "wt-3",
    asset: "TSLAx",
    buyDate: "Feb 12, 2025",
    buyPrice: "$412.80",
    amount: "12.5 TSLAx",
    status: "holding",
    lossAmount: -395,
    lossPercent: -7.6,
    linkedPatternId: "fomo-buying",
    linkedPatternLabel: "FOMO Buying",
    comment: "Entered after earnings hype. Still holding at a loss — unrealized.",
  },
];

function generateChart(days: number, userEnd: number, btcEnd: number): BenchmarkPoint[] {
  const points: BenchmarkPoint[] = [];
  for (let d = 0; d <= days; d++) {
    const progress = d / days;
    const noise1 = Math.sin(d * 0.7) * 3 + Math.sin(d * 1.3) * 2;
    const noise2 = Math.sin(d * 0.5) * 2 + Math.sin(d * 0.9) * 1.5;
    points.push({
      day: d,
      user: +(progress * userEnd + noise1).toFixed(1),
      btc: +(progress * btcEnd + noise2).toFixed(1),
    });
  }
  return points;
}

export const mockBenchmark: BenchmarkData = {
  userReturn: -8.3,
  btcReturn: 14.7,
  gap: -23.0,
  attribution: "FOMO entries and panic sells account for 78% of underperformance vs BTC hold strategy.",
  chart: {
    "30D": generateChart(30, -8.3, 14.7),
    "60D": generateChart(60, -12.1, 22.4),
    "90D": generateChart(90, -5.8, 31.2),
  },
};
