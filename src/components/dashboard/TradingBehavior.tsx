import { useState } from "react";
import { Activity, ChevronRight } from "lucide-react";

type Period = "30D" | "90D" | "ALL";

const periodData: Record<Period, {
  persona: { emoji: string; name: string; description: string };
  behaviors: { label: string; labelCn: string; score: number; good: boolean }[];
  aiSummary: string;
}> = {
  "30D": {
    persona: {
      emoji: "💎",
      name: "Diamond Hands",
      description: "Average hold time: 47 days. You don't flinch when charts dip — your portfolio thanks you for your nerves of steel.",
    },
    behaviors: [
      { label: "Chasing Pumps", labelCn: "追涨", score: 22, good: false },
      { label: "Panic Selling", labelCn: "杀跌", score: 8, good: false },
      { label: "Taking Profits", labelCn: "及时止盈", score: 65, good: true },
      { label: "Cutting Losses", labelCn: "及时止损", score: 71, good: true },
      { label: "Buy & Hold", labelCn: "长期持有", score: 88, good: true },
    ],
    aiSummary:
      "Over the past 30 days you've been impressively calm — only 2 trades triggered by FOMO. You took profits on 4/6 winning positions before reversals. Keep it up and you might actually retire early. 🏖️",
  },
  "90D": {
    persona: {
      emoji: "🎯",
      name: "Profit Sniper",
      description: "You sold 5 of 7 winners within 10% of their local tops. Either you're lucky or you've got a sixth sense.",
    },
    behaviors: [
      { label: "Chasing Pumps", labelCn: "追涨", score: 35, good: false },
      { label: "Panic Selling", labelCn: "杀跌", score: 18, good: false },
      { label: "Taking Profits", labelCn: "及时止盈", score: 78, good: true },
      { label: "Cutting Losses", labelCn: "及时止损", score: 55, good: true },
      { label: "Buy & Hold", labelCn: "长期持有", score: 62, good: true },
    ],
    aiSummary:
      "90-day view shows solid profit-taking instincts but a slight FOMO streak mid-February. You chased 3 pumps — 2 of them cost you ~$340. The good news? Your winners more than covered it. Net trading IQ: above average. 🧠",
  },
  ALL: {
    persona: {
      emoji: "🐵",
      name: "FOMO Fred",
      description: "You bought 73% of assets within 24h of their local peak. Classic. At least you're self-aware now.",
    },
    behaviors: [
      { label: "Chasing Pumps", labelCn: "追涨", score: 68, good: false },
      { label: "Panic Selling", labelCn: "杀跌", score: 42, good: false },
      { label: "Taking Profits", labelCn: "及时止盈", score: 38, good: true },
      { label: "Cutting Losses", labelCn: "及时止损", score: 45, good: true },
      { label: "Buy & Hold", labelCn: "长期持有", score: 55, good: true },
    ],
    aiSummary:
      "All-time data paints a classic retail arc: early FOMO buys, mid-cycle panic sells, and a recent glow-up in discipline. Your last 30 days are your best yet — proof that you CAN learn. Don't go back to your old ways. 📈",
  },
};

const collapsedSummary = "💎 Diamond Hands · You don't flinch when charts dip";

const TradingBehavior = () => {
  const [expanded, setExpanded] = useState(false);
  const [period, setPeriod] = useState<Period>("30D");

  const data = periodData[period];

  return (
    <div className="glass-card overflow-hidden">
      {/* Collapsed header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-5 hover:bg-secondary/30 transition-colors text-left"
      >
        <Activity className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="font-display font-semibold text-foreground shrink-0">Trading Behavior</span>
        <span className="text-xs text-muted-foreground truncate hidden sm:inline">
          {collapsedSummary}
        </span>
        <ChevronRight
          className={`w-4 h-4 text-muted-foreground ml-auto shrink-0 transition-transform duration-200 ${
            expanded ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Expanded content */}
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: expanded ? "1200px" : "0", opacity: expanded ? 1 : 0 }}
      >
        <div className="px-5 pb-5 space-y-5 border-t border-border">
          {/* Time period tabs */}
          <div className="flex gap-2 pt-4">
            {(["30D", "90D", "ALL"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: period === p ? "hsl(var(--primary) / 0.15)" : "hsl(var(--secondary))",
                  color: period === p ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                }}
              >
                {p === "ALL" ? "All Time" : p}
              </button>
            ))}
          </div>

          {/* Persona card */}
          <div
            className="rounded-lg p-4"
            style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.15)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{data.persona.emoji}</span>
              <span className="font-display font-bold text-foreground">{data.persona.name}</span>
            </div>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              {data.persona.description}
            </p>
          </div>

          {/* Behavior breakdown */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              Behavior Breakdown
            </h4>
            {data.behaviors.map((b) => (
              <div key={b.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-secondary-foreground">
                    {b.label}{" "}
                    <span className="text-muted-foreground">({b.labelCn})</span>
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">{b.score}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${b.score}%`,
                      background: b.good
                        ? "hsl(var(--profit))"
                        : b.score > 50
                          ? "hsl(var(--loss))"
                          : "hsl(var(--warning))",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Summary */}
          <div className="space-y-2">
            <h4 className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              AI Summary
            </h4>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              {data.aiSummary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingBehavior;
