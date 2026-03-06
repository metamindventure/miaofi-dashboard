import { Activity, TrendingDown } from "lucide-react";
import PatternCard from "./PatternCard";
import WorstTrades from "./WorstTrades";
import BenchmarkComparison from "./BenchmarkComparison";
import { mockPatterns, mockWorstTrades, mockBenchmark } from "./mockData";

const totalImpact = mockPatterns.reduce((sum, p) => sum + p.dollarImpact, 0);

const TradingBehaviorAnalysis = () => {
  return (
    <section className="w-full space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="section-header text-foreground">Trading Behavior Analysis</h2>
          <span className="text-xs text-muted-foreground">Last 30 days</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-loss/8 border border-loss/20">
          <TrendingDown className="w-3.5 h-3.5 text-loss" />
          <span className="text-xs font-medium text-loss font-mono tabular-nums">
            {totalImpact < 0 ? "-" : "+"}${Math.abs(totalImpact).toLocaleString()} total behavior cost
          </span>
        </div>
      </div>

      {/* Pattern summary */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-secondary-foreground">
          {mockPatterns.length} patterns detected across {mockPatterns.reduce((s, p) => s + p.tradeCount, 0)} trades
        </span>
        <div className="flex items-center gap-1.5">
          {mockPatterns.map((p) => (
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
        {mockPatterns
          .sort((a, b) => b.confidence - a.confidence)
          .map((pattern, i) => (
            <PatternCard key={pattern.id} pattern={pattern} index={i} />
          ))}
      </div>

      {/* Worst Trades */}
      <WorstTrades trades={mockWorstTrades} />

      {/* Benchmark */}
      <BenchmarkComparison data={mockBenchmark} />
    </section>
  );
};

export default TradingBehaviorAnalysis;
