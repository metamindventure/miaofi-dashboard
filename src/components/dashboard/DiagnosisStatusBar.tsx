import { useState } from "react";
import { Sparkles, RefreshCw, Zap, Info } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Unified status bar for the AI Diagnosis "session".
 * Trading Behavior Analysis (TBA) and Portfolio Analysis (PA) are two
 * sections of the SAME diagnosis report and share one Re-analyze action.
 * Per-section Retry should ONLY appear inside a card when that section
 * fails to load (error recovery), never as a normal refresh affordance.
 */
const DiagnosisStatusBar = () => {
  const { credits, totalCredits, setUpgradeModalOpen } = useAuth();
  const [generatedAt] = useState(() => new Date(Date.now() - 17 * 1000)); // mock: 17s ago
  const [isRefreshing, setIsRefreshing] = useState(false);

  const secondsAgo = Math.max(1, Math.floor((Date.now() - generatedAt.getTime()) / 1000));
  const timeAgoLabel =
    secondsAgo < 60
      ? `${secondsAgo}s ago`
      : secondsAgo < 3600
      ? `${Math.floor(secondsAgo / 60)}m ago`
      : `${Math.floor(secondsAgo / 3600)}h ago`;

  const canRefresh = credits > 0 && !isRefreshing;

  const handleReanalyze = () => {
    if (credits <= 0) {
      setUpgradeModalOpen(true);
      return;
    }
    setIsRefreshing(true);
    toast("Refreshing diagnosis — Trading Behavior & Portfolio Analysis");
    // TODO: wire to real refresh; for mock UI just simulate
    setTimeout(() => setIsRefreshing(false), 1800);
  };

  return (
    <div className="glass-card px-4 py-3 flex items-center justify-between flex-wrap gap-3 border-l-2 border-l-primary/40">
      {/* Left: identity + freshness */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">AI Diagnosis Report</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-profit inline-block" />
              Up to date
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            Generated {timeAgoLabel} · Includes Trading Behavior + Portfolio Analysis
          </span>
        </div>
      </div>

      {/* Right: credits + re-analyze */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-1 text-xs font-medium">
          <Zap className={`w-3 h-3 ${credits === 0 ? "text-loss" : "text-primary"}`} />
          <span className={credits === 0 ? "text-loss" : "text-foreground"}>{credits}</span>
          <span className="text-muted-foreground">/ {totalCredits} credits</span>
        </span>

        <div className="relative group">
          <button
            onClick={handleReanalyze}
            disabled={isRefreshing}
            className={`glass-button-primary text-primary-foreground text-xs font-semibold rounded-lg px-3.5 py-2 flex items-center gap-1.5 ${
              !canRefresh ? "opacity-60" : ""
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Re-analyzing…" : "Re-analyze"}</span>
            <span className="hidden sm:inline text-[10px] opacity-80 border-l border-primary-foreground/30 pl-1.5 ml-0.5">
              1 credit
            </span>
          </button>
          {/* Tooltip */}
          <div className="pointer-events-none absolute right-0 top-full mt-2 w-[260px] rounded-lg bg-[#1a1a2e] border border-white/10 shadow-xl p-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-50">
            <div className="flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-secondary-foreground leading-snug">
                Refreshes the entire diagnosis — both Trading Behavior and
                Portfolio Analysis are regenerated together so timestamps stay
                in sync. Costs <span className="text-primary font-semibold">1 credit</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisStatusBar;
