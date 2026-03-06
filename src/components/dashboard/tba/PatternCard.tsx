import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, TrendingDown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { BehaviorPattern, Severity } from "./types";
import SeverityBadge from "./SeverityBadge";

const borderColor: Record<Severity, string> = {
  high: "border-l-loss",
  medium: "border-l-warning",
  low: "border-l-profit",
};

const PatternCard = ({ pattern, index }: { pattern: BehaviorPattern; index: number }) => {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActionsOpen(false);
      }
    };
    if (actionsOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [actionsOpen]);

  return (
    <div
      className={`glass-card border-l-[3px] ${borderColor[pattern.severity]} p-0 overflow-hidden ${actionsOpen ? "z-50 relative" : ""}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <SeverityBadge severity={pattern.severity} />
            <h4 className="font-display font-semibold text-[15px] text-foreground">{pattern.label}</h4>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
              {pattern.confidence}%
            </span>
            <div className="w-14 h-1 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  pattern.severity === "high" ? "bg-loss" : pattern.severity === "medium" ? "bg-warning" : "bg-profit"
                }`}
                style={{ width: `${pattern.confidence}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-sm text-secondary-foreground leading-relaxed">{pattern.summary}</p>

        {/* Impact + Trades row */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-loss" />
            <span className="text-sm font-bold text-loss tabular-nums font-mono">
              {pattern.dollarImpact < 0 ? "-" : "+"}${Math.abs(pattern.dollarImpact).toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground">impact</span>
          </div>
          <div className="h-3 w-px bg-border" />
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {pattern.tradeCount} trade{pattern.tradeCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mx-5 mb-3 p-3 rounded-lg bg-secondary/50 border border-border">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
          <p className="text-xs text-secondary-foreground leading-relaxed">{pattern.recommendation}</p>
        </div>
      </div>

      {/* Action dropdown button */}
      <div className="px-5 pb-3 relative" ref={dropdownRef}>
        <button
          onClick={() => setActionsOpen(!actionsOpen)}
          className="glass-button-primary text-primary-foreground text-xs font-semibold rounded-lg px-3.5 py-2 flex items-center gap-1.5 transition-all"
        >
          {pattern.actions[0]?.label}
          {actionsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {actionsOpen && (
          <div className="absolute left-5 top-full mt-1 w-[320px] rounded-xl border border-border bg-[#1a1a2e] shadow-xl shadow-black/40 z-50 overflow-hidden">
            {pattern.actions.map((action, i) => (
              <button
                key={i}
                onClick={() => {
                  toast(`Action: ${action.label}`);
                  setActionsOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  {i === 0 && <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />}
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 ml-[22px]">{action.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Evidence toggle */}
      <button
        onClick={() => setEvidenceOpen(!evidenceOpen)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors border-t border-border bg-secondary/20"
      >
        View Evidence ({pattern.evidence.length} trades)
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${evidenceOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Evidence table */}
      {evidenceOpen && (
        <div className="border-t border-border">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-2 text-muted-foreground font-medium">Asset</th>
                  <th className="text-left px-3 py-2 text-muted-foreground font-medium">Action</th>
                  <th className="text-left px-3 py-2 text-muted-foreground font-medium">Date</th>
                  <th className="text-right px-3 py-2 text-muted-foreground font-medium">Price</th>
                  <th className="text-right px-3 py-2 text-muted-foreground font-medium">Amount</th>
                  <th className="text-right px-5 py-2 text-muted-foreground font-medium">P&L</th>
                </tr>
              </thead>
              <tbody>
                {pattern.evidence.map((e, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-2.5 font-medium text-foreground font-mono">{e.asset}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        e.action === "buy" ? "text-profit bg-profit/10" : "text-loss bg-loss/10"
                      }`}>
                        {e.action}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{e.date}</td>
                    <td className="px-3 py-2.5 text-right font-mono text-foreground">{e.price}</td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground">{e.amount}</td>
                    <td className={`px-5 py-2.5 text-right font-mono font-medium ${
                      e.pnlPercent < 0 ? "text-loss" : "text-profit"
                    }`}>
                      {e.pnl} ({e.pnlPercent > 0 ? "+" : ""}{e.pnlPercent}%)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="md:hidden px-4 py-3 space-y-2.5">
            {pattern.evidence.map((e, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-border">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-sm text-foreground">{e.asset}</span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      e.action === "buy" ? "text-profit bg-profit/10" : "text-loss bg-loss/10"
                    }`}>
                      {e.action}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{e.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{e.amount} @ {e.price}</span>
                  <span className={`text-xs font-mono font-medium ${e.pnlPercent < 0 ? "text-loss" : "text-profit"}`}>
                    {e.pnl} ({e.pnlPercent > 0 ? "+" : ""}{e.pnlPercent}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatternCard;
