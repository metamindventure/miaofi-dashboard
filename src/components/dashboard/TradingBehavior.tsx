import { useState } from "react";
import { Activity, TrendingDown, TrendingUp, Shield, Clock, ChevronDown, Share2 } from "lucide-react";
import ShareCardModal from "./ShareCardModal";

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
  const [sectionOpen, setSectionOpen] = useState(false);
  const [patternsOpen, setPatternsOpen] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const data = periodData[period];

  return (
    <div className="glass-card p-5 space-y-3">
      {/* Header — always visible, clickable to toggle */}
      <button
        onClick={() => setSectionOpen(!sectionOpen)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <Activity className="w-[18px] h-[18px] text-primary" />
          <h3 className="font-display font-semibold text-[15px] text-foreground">Trading Behavior</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setShareOpen(true); }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            title="Share your trading behavior"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${sectionOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Summary — always visible */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{data.mainEmoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-foreground">{data.mainBehavior}</span>
            <div className="flex items-center gap-1 rounded-lg p-0.5 ml-auto" style={{ background: "hsl(0 0% 100% / 0.04)" }}>
              {(["1D", "7D", "30D"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={(e) => { e.stopPropagation(); setPeriod(p); }}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md transition-all ${
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
          <p className="text-xs text-secondary-foreground mt-0.5">{data.summary}</p>
        </div>
      </div>

      {/* Expanded content */}
      {sectionOpen && (
        <div className="space-y-4 pt-1">
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
            onClick={() => setPatternsOpen(!patternsOpen)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Detected Patterns ({data.patterns.length})
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${patternsOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Pattern cards */}
          {patternsOpen && (
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
      )}
      <ShareCardModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        context="trading-behavior"
        data={{
          title: `Trading Behavior · ${period}`,
          subtitle: data.summary,
          highlight: `${data.mainEmoji} ${data.mainBehavior}`,
          highlightColor: "primary",
          details: [
            `${data.stats.trades} trades`,
            `${data.stats.winRate}% win rate`,
            `Avg hold: ${data.stats.avgHold}`,
          ],
        }}
      />
    </div>
  );
};

export default TradingBehavior;
