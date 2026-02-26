import { useState } from "react";
import { Activity, ChevronDown, TrendingUp, TrendingDown, AlertTriangle, Zap, Target } from "lucide-react";

type Period = "1D" | "7D" | "30D";

interface BehaviorPattern {
  label: string;
  description: string;
  confidence: number;
  type: "negative" | "neutral" | "positive";
  icon: typeof TrendingUp;
}

const periodData: Record<Period, {
  summary: string;
  winRate: number;
  totalTrades: number;
  avgHoldTime: string;
  patterns: BehaviorPattern[];
}> = {
  "1D": {
    summary: "Today you made 3 trades with a reactive pattern — 2 buys triggered within minutes of price spikes, suggesting FOMO-driven entries.",
    winRate: 33,
    totalTrades: 3,
    avgHoldTime: "2.4 hrs",
    patterns: [
      {
        label: "FOMO Buying",
        description: "Bought TSLAx 4 min after a 6.2% spike. Entry price was near local top.",
        confidence: 89,
        type: "negative",
        icon: TrendingUp,
      },
      {
        label: "Panic Sell",
        description: "Sold RCH after a -8% dip, which recovered +5% within 2 hours.",
        confidence: 76,
        type: "negative",
        icon: TrendingDown,
      },
    ],
  },
  "7D": {
    summary: "Over the past week, your trading shows a chasing momentum pattern. 5 of 8 buys were within 10 min of sharp price moves, and 3 sells were near local bottoms.",
    winRate: 38,
    totalTrades: 8,
    avgHoldTime: "1.2 days",
    patterns: [
      {
        label: "Chasing Pumps",
        description: "Consistently buying after 5%+ moves. 4 out of 5 such entries resulted in short-term losses.",
        confidence: 92,
        type: "negative",
        icon: TrendingUp,
      },
      {
        label: "Selling at Bottoms",
        description: "3 sells executed within 5% of local lows. Average post-sell recovery was +12%.",
        confidence: 84,
        type: "negative",
        icon: TrendingDown,
      },
      {
        label: "Overtrading",
        description: "8 trades in 7 days with average hold time of 1.2 days. Frequent trading increases fee drag.",
        confidence: 71,
        type: "negative",
        icon: Zap,
      },
    ],
  },
  "30D": {
    summary: "Monthly analysis reveals a buy-high-sell-low cycle. Your average buy is 8.3% above 30-day moving average, while sells average 4.1% below. Positive note: your SOL DCA strategy is disciplined.",
    winRate: 42,
    totalTrades: 19,
    avgHoldTime: "3.8 days",
    patterns: [
      {
        label: "Buy High, Sell Low",
        description: "Average entry is 8.3% above 30D MA, average exit is 4.1% below. Net drag: ~12.4% per round-trip.",
        confidence: 95,
        type: "negative",
        icon: AlertTriangle,
      },
      {
        label: "Disciplined DCA",
        description: "SOL purchases show consistent timing and sizing. This strategy is outperforming your discretionary trades by 23%.",
        confidence: 88,
        type: "positive",
        icon: Target,
      },
      {
        label: "Concentration Bias",
        description: "71% of trade volume is in TSLAx. Limited diversification in trading activity.",
        confidence: 81,
        type: "negative",
        icon: Zap,
      },
      {
        label: "Weekend Overtrading",
        description: "60% of losing trades happen on weekends when liquidity is lower and spreads are wider.",
        confidence: 74,
        type: "negative",
        icon: Activity,
      },
    ],
  },
};

const TradingBehavior = () => {
  const [expanded, setExpanded] = useState(false);
  const [period, setPeriod] = useState<Period>("7D");

  const data = periodData[period];
  const periods: Period[] = ["1D", "7D", "30D"];

  const winRateColor = data.winRate >= 50 ? "text-profit" : "text-loss";

  return (
    <section className="w-full space-y-3">
      {/* Header row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="section-header text-foreground">Trading Behavior</h2>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Summary banner (always visible) */}
      <div
        className="glass-card rounded-lg p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        style={{
          borderLeft: `3px solid hsl(var(--warning))`,
        }}
      >
        <p className="text-sm">
          <span className="text-warning font-bold">Reactive Trader</span>
          <span className="text-secondary-foreground">
            {" "}— {data.winRate}% win rate across {data.totalTrades} trades, avg hold {data.avgHoldTime}
          </span>
        </p>
      </div>

      {/* Expandable content */}
      {expanded && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Period switcher */}
          <div className="flex items-center gap-1 p-1 rounded-lg w-fit" style={{ background: "hsl(var(--glass-bg))" }}>
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  period === p
                    ? "glass-button-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* AI Summary */}
          <div className="glass-card p-4">
            <p className="text-sm text-secondary-foreground leading-relaxed">
              {data.summary}
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card p-3 text-center">
              <p className="text-[10px] uppercase text-muted-foreground tracking-wider mb-1">Win Rate</p>
              <p className={`text-lg font-bold ${winRateColor}`}>{data.winRate}%</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-[10px] uppercase text-muted-foreground tracking-wider mb-1">Trades</p>
              <p className="text-lg font-bold text-foreground">{data.totalTrades}</p>
            </div>
            <div className="glass-card p-3 text-center">
              <p className="text-[10px] uppercase text-muted-foreground tracking-wider mb-1">Avg Hold</p>
              <p className="text-lg font-bold text-foreground">{data.avgHoldTime}</p>
            </div>
          </div>

          {/* Detected patterns */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase text-muted-foreground tracking-wider font-semibold">
              Detected Patterns
            </h3>
            {data.patterns.map((pattern, i) => {
              const Icon = pattern.icon;
              const typeColor =
                pattern.type === "negative"
                  ? "text-loss"
                  : pattern.type === "positive"
                  ? "text-profit"
                  : "text-muted-foreground";
              const typeBg =
                pattern.type === "negative"
                  ? "hsla(350, 100%, 65%, 0.12)"
                  : pattern.type === "positive"
                  ? "hsla(160, 100%, 45%, 0.12)"
                  : "hsla(0, 0%, 100%, 0.06)";

              return (
                <div
                  key={i}
                  className="glass-card p-4 flex items-start gap-3"
                  style={{ borderLeft: `3px solid ${pattern.type === "negative" ? "hsl(var(--loss))" : pattern.type === "positive" ? "hsl(var(--profit))" : "hsl(var(--glass-border))"}` }}
                >
                  <div
                    className="p-1.5 rounded-md shrink-0 mt-0.5"
                    style={{ background: typeBg }}
                  >
                    <Icon className={`w-3.5 h-3.5 ${typeColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-sm font-semibold ${typeColor}`}>
                        {pattern.label}
                      </span>
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0"
                        style={{ background: typeBg, color: pattern.type === "negative" ? "hsl(var(--loss))" : pattern.type === "positive" ? "hsl(var(--profit))" : "hsl(var(--muted-foreground))" }}
                      >
                        {pattern.confidence}% conf
                      </span>
                    </div>
                    <p className="text-xs text-secondary-foreground leading-relaxed">
                      {pattern.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default TradingBehavior;
