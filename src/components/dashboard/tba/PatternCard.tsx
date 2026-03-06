import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, TrendingDown, Sparkles, Check, ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { toast } from "sonner";
import { BehaviorPattern, Severity } from "./types";
import SeverityBadge from "./SeverityBadge";

const borderColors: Record<Severity, string> = {
  high: "hsl(var(--loss))",
  medium: "hsl(var(--warning))",
  low: "hsl(var(--profit))",
};

const PatternCard = ({ pattern, index }: { pattern: BehaviorPattern; index: number }) => {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(() => {
    try { return localStorage.getItem(`tba-feedback-${pattern.id}`); } catch { return null; }
  });
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

  const handleReview = () => {
    setReviewed(true);
    setTimeout(() => setCollapsed(true), 200);
  };

  const handleFeedback = (type: string) => {
    setFeedback(type);
    try { localStorage.setItem(`tba-feedback-${pattern.id}`, type); } catch {}
    toast("Thanks for your feedback!");
  };

  const impactText = `Impact: ${pattern.dollarImpact < 0 ? "-" : "+"}$${Math.abs(pattern.dollarImpact).toLocaleString()}`;

  return (
    <div
      className="glass-card p-5 relative transition-all duration-200 overflow-visible"
      style={{
        borderLeft: `3px solid ${borderColors[pattern.severity]}`,
        opacity: reviewed ? 0.5 : 1,
        zIndex: actionsOpen ? 50 : 1,
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Top row: severity badge + impact + share */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={pattern.severity} />
          {reviewed && (
            <span className="text-xs text-profit flex items-center gap-1">
              <Check className="w-3 h-3" /> Reviewed
            </span>
          )}
          <span className={`text-xs ${
            pattern.severity === "high" ? "text-loss" : pattern.severity === "medium" ? "text-warning" : "text-profit"
          }`}>
            {impactText}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
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
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${pattern.label}: ${pattern.summary}`);
              toast("Insight copied!");
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-[17px] text-foreground mb-2">
        {pattern.label}
      </h3>

      {/* Body + Buttons */}
      {!collapsed && (
        <div>
          <p className="text-sm text-secondary-foreground leading-relaxed mb-3">
            {pattern.summary}
          </p>

          {/* Impact + Trades row */}
          <div className="flex items-center gap-4 mb-4">
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

          {/* Recommendation */}
          <div className="mb-4 p-3 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
              <p className="text-xs text-secondary-foreground leading-relaxed">{pattern.recommendation}</p>
            </div>
          </div>

          {/* Action buttons row — matches AI diagnosis style */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Primary action dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setActionsOpen(!actionsOpen)}
                className="glass-button-primary text-primary-foreground text-sm font-semibold rounded-lg px-4 py-2 flex items-center gap-1.5"
              >
                {pattern.actions[0]?.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${actionsOpen ? "rotate-180" : ""}`} />
              </button>
              {actionsOpen && (
                <div className="absolute top-full left-0 mt-2 w-[300px] z-50 rounded-xl overflow-hidden bg-[#1a1a2e] border border-white/10 shadow-xl">
                  {pattern.actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        toast(`Action: ${action.label}`);
                        setActionsOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        {i === 0 && <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />}
                        <span className="text-sm font-medium text-foreground">{action.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 ml-[22px]">{action.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* See Detail Analysis */}
            <button
              onClick={() => setAnalysisOpen(!analysisOpen)}
              className="glass-button text-sm text-secondary-foreground rounded-lg px-4 py-2 flex items-center gap-1"
            >
              See Detail Analysis <ChevronDown className={`w-3.5 h-3.5 transition-transform ${analysisOpen ? "rotate-180" : ""}`} />
            </button>

            {/* I know / Reviewed */}
            <button
              onClick={handleReview}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              {reviewed ? (
                <>Reviewed <Check className="w-3.5 h-3.5" /></>
              ) : (
                <>I know <Check className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>

          {/* Detail Analysis expandable */}
          {analysisOpen && (
            <div className="mt-3 p-4 rounded-lg border border-white/10 bg-[#1a1a2e]">
              <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-line">
                {pattern.recommendation}
                {"\n\n"}
                Evidence shows {pattern.tradeCount} trade{pattern.tradeCount !== 1 ? "s" : ""} matching this pattern with a combined impact of {pattern.dollarImpact < 0 ? "-" : "+"}${Math.abs(pattern.dollarImpact).toLocaleString()}. Confidence level: {pattern.confidence}%.
              </p>

              {/* Feedback */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Was this helpful?</span>
                  <button
                    onClick={() => handleFeedback("up")}
                    className={`p-1.5 rounded-md transition-colors ${feedback === "up" ? "bg-profit/20 text-profit" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleFeedback("down")}
                    className={`p-1.5 rounded-md transition-colors ${feedback === "down" ? "bg-loss/20 text-loss" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Evidence toggle */}
      <button
        onClick={() => setEvidenceOpen(!evidenceOpen)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors border-t border-border bg-secondary/20 -mx-5 -mb-5 px-5"
        style={{ width: "calc(100% + 2.5rem)" }}
      >
        View Evidence ({pattern.evidence.length} trades)
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${evidenceOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Evidence table */}
      {evidenceOpen && (
        <div className="border-t border-border -mx-5 -mb-5" style={{ width: "calc(100% + 2.5rem)" }}>
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
