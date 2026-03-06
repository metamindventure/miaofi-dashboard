import { useState } from "react";
import { Activity, Zap, TrendingDown, ChevronDown } from "lucide-react";
import PatternCard from "./PatternCard";
import WorstTrades from "./WorstTrades";
import BenchmarkComparison from "./BenchmarkComparison";
import { mockPatterns, mockWorstTrades, mockBenchmark } from "./mockData";

// Filter: top 3 patterns with >50% confidence, sorted by confidence desc
const filteredPatterns = mockPatterns
  .filter((p) => p.confidence > 50)
  .sort((a, b) => b.confidence - a.confidence)
  .slice(0, 3);

const totalImpact = filteredPatterns.reduce((sum, p) => sum + p.dollarImpact, 0);
const totalTrades = filteredPatterns.reduce((s, p) => s + p.tradeCount, 0);

// Derive trader type from dominant pattern
const dominantPattern = filteredPatterns[0];
const traderTypeMap: Record<string, { label: string; description: string }> = {
  "fomo-buying": { label: "Impulse Chaser", description: "You tend to buy into hype — entries near local tops are eroding your returns." },
  "panic-selling": { label: "Panic Seller", description: "Emotional exits during dips are locking in losses that often recover." },
  "overtrading": { label: "Overtrader", description: "You trade too frequently — fees and slippage are silently eating your gains." },
  "concentration-risk": { label: "Concentrated Bettor", description: "Your portfolio is heavily skewed — a single correction could wipe significant value." },
  "early-profit-taking": { label: "Early Exiter", description: "You take profits too soon — leaving significant upside on the table." },
};
const traderType = dominantPattern ? traderTypeMap[dominantPattern.id] || { label: "Active Trader", description: "Multiple behavioral patterns detected in your trading history." } : { label: "Disciplined Trader", description: "No significant behavioral patterns detected." };

// Mock overview stats
const overviewStats = {
  totalTrades: 92,
  winRate: 16,
  avgHoldDays: 12.1,
};

const TradingBehaviorAnalysis = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="w-full space-y-0">
      {/* Collapsible header card */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full glass-card p-5 text-left transition-all hover:bg-white/[0.02]"
      >
        {/* Top row: title + cost badge */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="section-header text-foreground">Trading Behavior Analysis</h2>
            <span className="text-xs text-muted-foreground">Last 30 days</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-loss/8 border border-loss/20">
              <TrendingDown className="w-3.5 h-3.5 text-loss" />
              <span className="text-xs font-medium text-loss font-mono tabular-nums">
                {totalImpact < 0 ? "-" : "+"}${Math.abs(totalImpact).toLocaleString()} total behavior cost
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
          </div>
        </div>

        {/* Trader type + overview stats (always visible) */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-warning/15 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-base text-foreground">{traderType.label}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{traderType.description}</p>
          </div>
        </div>

        {/* Overview stats */}
        <div className="flex items-center gap-6 mb-3">
          <div>
            <span className="text-[11px] text-muted-foreground block">Trades</span>
            <span className="text-lg font-bold font-mono text-foreground tabular-nums">{overviewStats.totalTrades}</span>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Win Rate</span>
            <span className={`text-lg font-bold font-mono tabular-nums ${overviewStats.winRate < 50 ? "text-loss" : "text-profit"}`}>
              {overviewStats.winRate}%
            </span>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Avg Hold</span>
            <span className="text-lg font-bold font-mono text-foreground tabular-nums">{overviewStats.avgHoldDays} days</span>
          </div>
        </div>

        {/* Collapsed: pattern count + expand hint */}
        {!expanded && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm">
              Patterns detected ({filteredPatterns.length})
            </span>
            <div className="flex items-center gap-1.5">
              {filteredPatterns.map((p) => (
                <span
                  key={p.id}
                  className={`w-2 h-2 rounded-full ${
                    p.severity === "high" ? "bg-loss" : p.severity === "medium" ? "bg-warning" : "bg-profit"
                  }`}
                  title={`${p.label} (${p.severity})`}
                />
              ))}
            </div>
            <ChevronDown className="w-3.5 h-3.5 ml-auto" />
          </div>
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="space-y-6 pt-4">
          {/* Pattern cards */}
          <div className="grid gap-4">
            {filteredPatterns.map((pattern, i) => (
              <PatternCard key={pattern.id} pattern={pattern} index={i} />
            ))}
          </div>

          {/* Worst Trades */}
          <WorstTrades trades={mockWorstTrades} />

          {/* Benchmark */}
          <BenchmarkComparison data={mockBenchmark} />
        </div>
      )}
    </section>
  );
};

export default TradingBehaviorAnalysis;
