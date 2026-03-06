import { useState } from "react";
import { Activity, TrendingDown, ChevronDown } from "lucide-react";
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

const TradingBehaviorAnalysis = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="w-full space-y-0">
      {/* Collapsible header card */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full glass-card p-5 text-left transition-all hover:bg-white/[0.02]"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
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

        {/* Summary visible when collapsed */}
        {!expanded && (
          <div className="flex items-center gap-3 flex-wrap mt-3">
            <span className="text-sm text-secondary-foreground">
              {filteredPatterns.length} patterns detected across {totalTrades} trades
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
            <span className="text-xs text-muted-foreground">— click to expand</span>
          </div>
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="space-y-6 pt-4">
          {/* Pattern summary */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-secondary-foreground">
              {filteredPatterns.length} patterns detected across {totalTrades} trades
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
          </div>

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
