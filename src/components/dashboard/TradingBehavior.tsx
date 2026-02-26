import { useState } from "react";
import { Activity, TrendingDown, TrendingUp, Shield, Clock, ChevronDown } from "lucide-react";

type Period = "30D" | "7D" | "1D";

interface BehaviorPattern {
  label: string;
  emoji: string;
  description: string;
  severity: "danger" | "warning" | "good";
  confidence: number;
}

interface PeriodData {
  summary: string;
  mainBehavior: string;
  mainEmoji: string;
  patterns: BehaviorPattern[];
  stats: { trades: number; winRate: number; avgHold: string };
}

const periodData: Record<Period, PeriodData> = {
  "30D": {
    summary: "You tend to chase pumps and panic sell on dips — classic momentum chasing.",
    mainBehavior: "Momentum Chaser",
    mainEmoji: "🎢",
    patterns: [
      { label: "Chasing Pumps", emoji: "📈", description: "4 of 6 buys happened after 15%+ price surges", severity: "danger", confidence: 87 },
      { label: "Panic Selling", emoji: "😰", description: "Sold RCH and SOL within hours of 10%+ dips", severity: "danger", confidence: 74 },
      { label: "Overtrading", emoji: "⚡", description: "18 trades in 30 days — 3x the avg for your portfolio size", severity: "warning", confidence: 68 },
    ],
    stats: { trades: 18, winRate: 38, avgHold: "2.1 days" },
  },
  "7D": {
    summary: "Mostly holding this week with one impulsive buy after a Twitter hype cycle.",
    mainBehavior: "Impulsive Buyer",
    mainEmoji: "🎯",
    patterns: [
      { label: "FOMO Buy", emoji: "🔥", description: "Bought TSLAx after 22% surge — bought near local top", severity: "danger", confidence: 91 },
      { label: "Diamond Hands", emoji: "💎", description: "Held SOL through 8% dip without selling", severity: "good", confidence: 82 },
    ],
    stats: { trades: 3, winRate: 33, avgHold: "4.5 days" },
  },
  "1D": {
    summary: "No trades today — sometimes the best trade is no trade.",
    mainBehavior: "Sitting Tight",
    mainEmoji: "🧘",
    patterns: [
      { label: "No Activity", emoji: "✅", description: "Zero trades today — patience is a strategy", severity: "good", confidence: 100 },
    ],
    stats: { trades: 0, winRate: 0, avgHold: "—" },
  },
};

const severityStyles = {
  danger: { bg: "hsla(350, 100%, 65%, 0.12)", text: "text-loss", border: "border-loss/20" },
  warning: { bg: "hsla(30, 100%, 64%, 0.12)", text: "text-warning", border: "border-warning/20" },
  good: { bg: "hsla(160, 100%, 45%, 0.12)", text: "text-profit", border: "border-profit/20" },
};

const TradingBehavior = () => {
  const [period, setPeriod] = useState<Period>("30D");
  const [expanded, setExpanded] = useState(true);
  const data = periodData[period];

  return (
    <div className="glass-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Activity className="w-[18px] h-[18px] text-primary" />
          <h3 className="font-display font-semibold text-[15px] text-foreground">Trading Behavior</h3>
        </div>
        <div className="flex items-center gap-1 rounded-lg p-0.5" style={{ background: "hsl(0 0% 100% / 0.04)" }}>
          {(["1D", "7D", "30D"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-xs font-medium px-2.5 py-1 rounded-md transition-all ${
                period === p
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main behavior badge */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{data.mainEmoji}</span>
        <div>
          <span className="text-base font-semibold text-foreground">{data.mainBehavior}</span>
          <p className="text-xs text-secondary-foreground mt-0.5">{data.summary}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-4">
        {[
          { label: "Trades", value: data.stats.trades.toString() },
          { label: "Win Rate", value: data.stats.winRate ? `${data.stats.winRate}%` : "—", color: data.stats.winRate >= 50 ? "text-profit" : data.stats.winRate > 0 ? "text-loss" : "text-muted-foreground" },
          { label: "Avg Hold", value: data.stats.avgHold },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</span>
            <span className={`text-sm font-semibold ${stat.color || "text-foreground"}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Patterns toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Detected Patterns ({data.patterns.length})
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* Pattern cards */}
      {expanded && (
        <div className="space-y-2">
          {data.patterns.map((pattern, i) => {
            const style = severityStyles[pattern.severity];
            return (
              <div
                key={i}
                className={`rounded-lg px-3.5 py-2.5 border ${style.border}`}
                style={{ background: style.bg }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">{pattern.emoji}</span>
                    <span className={`text-sm font-medium ${style.text}`}>{pattern.label}</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">{pattern.confidence}% confidence</span>
                </div>
                <p className="text-xs text-secondary-foreground">{pattern.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TradingBehavior;
