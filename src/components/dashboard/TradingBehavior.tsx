import { useState } from "react";
import { ChevronDown, Activity, TrendingUp, TrendingDown, Zap, Clock, Target, Shield } from "lucide-react";

type Period = "1D" | "7D" | "30D";

interface BehaviorPattern {
  emoji: string;
  label: string;
  labelZh: string;
  confidence: number;
  description: string;
  sentiment: "positive" | "negative" | "neutral";
}

interface PeriodData {
  summary: string;
  dominantBehavior: string;
  dominantEmoji: string;
  winRate: number;
  totalTrades: number;
  avgHoldTime: string;
  profitFactor: number;
  patterns: BehaviorPattern[];
}

const periodData: Record<Period, PeriodData> = {
  "1D": {
    summary: "Today you're calm — only 2 trades, both calculated entries. Keep this energy 🧘",
    dominantBehavior: "Disciplined Sniper",
    dominantEmoji: "🎯",
    winRate: 100,
    totalTrades: 2,
    avgHoldTime: "4.2h",
    profitFactor: 2.8,
    patterns: [
      {
        emoji: "🎯",
        label: "Precision Entry",
        labelZh: "精准入场",
        confidence: 92,
        description: "Both trades entered at key support levels with tight stop-losses",
        sentiment: "positive",
      },
      {
        emoji: "🧘",
        label: "Patient Holder",
        labelZh: "耐心持有",
        confidence: 85,
        description: "Held positions through minor dips without panic selling",
        sentiment: "positive",
      },
    ],
  },
  "7D": {
    summary: "This week you FOMO'd into 3 pumps and panic-sold 2 dips. Classic retail behavior — your wallet is crying 😭",
    dominantBehavior: "FOMO Chaser",
    dominantEmoji: "🦧",
    winRate: 37,
    totalTrades: 19,
    avgHoldTime: "6.1h",
    profitFactor: 0.7,
    patterns: [
      {
        emoji: "🦧",
        label: "FOMO Buying",
        labelZh: "追涨买入",
        confidence: 89,
        description: "3 buys within 5 min of >15% pumps — bought the top each time",
        sentiment: "negative",
      },
      {
        emoji: "😱",
        label: "Panic Selling",
        labelZh: "恐慌抛售",
        confidence: 82,
        description: "Sold RCH and GOOGLx during -8% dips that recovered within hours",
        sentiment: "negative",
      },
      {
        emoji: "🎰",
        label: "Overtrading",
        labelZh: "频繁交易",
        confidence: 76,
        description: "19 trades in 7 days — fees alone cost you $47. Chill.",
        sentiment: "negative",
      },
      {
        emoji: "💎",
        label: "Diamond Hands (SOL)",
        labelZh: "钻石手",
        confidence: 71,
        description: "Held SOL through 12% drawdown — good conviction on core position",
        sentiment: "positive",
      },
    ],
  },
  "30D": {
    summary: "Past month: you chase pumps, panic sell dips, and overtrade. But you diamond-hand SOL like a chad. Mixed signals 📊",
    dominantBehavior: "Emotional Trader",
    dominantEmoji: "🎢",
    winRate: 42,
    totalTrades: 67,
    avgHoldTime: "14.3h",
    profitFactor: 0.85,
    patterns: [
      {
        emoji: "📉",
        label: "Buy High Sell Low",
        labelZh: "追涨杀跌",
        confidence: 88,
        description: "12 trades followed the classic pattern: bought after >10% pump, sold after >5% dip",
        sentiment: "negative",
      },
      {
        emoji: "⏰",
        label: "Late Entry",
        labelZh: "入场过晚",
        confidence: 79,
        description: "Average entry was 73% into the move — catching the tail end",
        sentiment: "negative",
      },
      {
        emoji: "✂️",
        label: "Good Stop-Loss",
        labelZh: "及时止损",
        confidence: 74,
        description: "8 trades had proper stop-losses that saved ~$1,200 in potential losses",
        sentiment: "positive",
      },
      {
        emoji: "💎",
        label: "Diamond Hands",
        labelZh: "钻石手",
        confidence: 82,
        description: "Core SOL & TSLAx positions held through multiple corrections — strong conviction",
        sentiment: "positive",
      },
      {
        emoji: "🌙",
        label: "Late Night Trading",
        labelZh: "深夜交易",
        confidence: 68,
        description: "41% of trades placed between 11PM-3AM — sleep-deprived decisions lose 2.3x more",
        sentiment: "negative",
      },
    ],
  },
};

const sentimentColor = {
  positive: "text-profit",
  negative: "text-loss",
  neutral: "text-warning",
};

const sentimentBg = {
  positive: "hsla(160, 100%, 45%, 0.12)",
  negative: "hsla(350, 100%, 65%, 0.12)",
  neutral: "hsla(30, 100%, 64%, 0.12)",
};

const TradingBehavior = () => {
  const [expanded, setExpanded] = useState(false);
  const [period, setPeriod] = useState<Period>("7D");
  const data = periodData[period];

  return (
    <div className="glass-card overflow-hidden">
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "hsla(252, 60%, 63%, 0.15)" }}>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-[15px] text-foreground flex items-center gap-2">
              Trading Behavior
              <span className="text-xl leading-none">{data.dominantEmoji}</span>
            </h3>
            <p className="text-xs text-muted-foreground truncate max-w-[280px] sm:max-w-none">
              {data.dominantBehavior} · {data.winRate}% Win Rate · {data.totalTrades} trades
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Period tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg w-fit" style={{ background: "hsl(var(--glass-bg))" }}>
            {(["1D", "7D", "30D"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                  period === p
                    ? "glass-button-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Summary */}
          <div
            className="rounded-lg p-3.5 border border-border"
            style={{ background: "hsl(var(--glass-bg))" }}
          >
            <p className="text-sm text-secondary-foreground leading-relaxed">
              {data.summary}
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Target, label: "Win Rate", value: `${data.winRate}%`, color: data.winRate >= 50 ? "text-profit" : "text-loss" },
              { icon: Zap, label: "Trades", value: `${data.totalTrades}`, color: "text-foreground" },
              { icon: Clock, label: "Avg Hold", value: data.avgHoldTime, color: "text-foreground" },
              { icon: data.profitFactor >= 1 ? TrendingUp : TrendingDown, label: "Profit Factor", value: `${data.profitFactor}x`, color: data.profitFactor >= 1 ? "text-profit" : "text-loss" },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-lg p-3 flex flex-col items-center text-center gap-1"
                style={{ background: "hsl(var(--glass-bg))", border: "1px solid hsl(var(--glass-border))" }}
              >
                <stat.icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className={`text-base font-bold font-mono ${stat.color}`}>{stat.value}</span>
                <span className="text-[10px] text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Detected patterns */}
          <div className="space-y-2">
            <h4 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Detected Patterns</h4>
            {data.patterns.map((pattern, i) => (
              <div
                key={i}
                className="rounded-lg p-3 flex items-start gap-3 transition-colors"
                style={{ background: "hsl(var(--glass-bg))", border: "1px solid hsl(var(--glass-border))" }}
              >
                <span className="text-2xl leading-none mt-0.5 shrink-0">{pattern.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${sentimentColor[pattern.sentiment]}`}>
                        {pattern.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{pattern.labelZh}</span>
                    </div>
                    <span
                      className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        background: sentimentBg[pattern.sentiment],
                        color: `hsl(var(--${pattern.sentiment === "positive" ? "profit" : pattern.sentiment === "negative" ? "loss" : "warning"}))`,
                      }}
                    >
                      {pattern.confidence}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{pattern.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fun disclaimer */}
          <p className="text-[11px] text-muted-foreground text-center italic pt-1">
            🐱 MiaoFi's behavioral analysis is based on on-chain data, not financial advice. Trade responsibly — your cat is watching.
          </p>
        </div>
      )}
    </div>
  );
};

export default TradingBehavior;
