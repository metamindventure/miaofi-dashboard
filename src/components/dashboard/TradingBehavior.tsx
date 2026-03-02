import { useState, useRef, useEffect } from "react";
import { Activity, ChevronDown, Share2, Check, Sparkles, ThumbsUp, ThumbsDown, X } from "lucide-react";
import { toast } from "sonner";
import ShareCardModal from "./ShareCardModal";

type Period = "30D" | "7D" | "1D";

interface ActionOption {
  label: string;
  description: string;
}

interface BehaviorPattern {
  label: string;
  emoji: string;
  description: string;
  severity: "danger" | "warning" | "good";
  confidence: number;
  ctaLabel?: string;
  actions?: ActionOption[];
  detailAnalysis?: string;
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
      {
        label: "Chasing Pumps", emoji: "📈",
        description: "4 of 6 buys happened after 15%+ price surges",
        severity: "danger", confidence: 87,
        ctaLabel: "Set Buy Rules",
        actions: [
          { label: "Enable DCA mode", description: "Auto-buy at fixed intervals to avoid FOMO entries" },
          { label: "Set price alerts instead", description: "Get notified at target prices, don't chase" },
        ],
        detailAnalysis: "You consistently buy after significant price surges (15%+), which statistically leads to buying near local tops. Of your last 6 buys, 4 were executed within 2 hours of a major pump. Historical data shows that buying after 15%+ surges results in negative short-term returns 68% of the time. Switching to a DCA strategy or setting limit orders at predetermined levels can improve your average entry price by 8-12%.",
      },
      {
        label: "Panic Selling", emoji: "😰",
        description: "Sold RCH and SOL within hours of 10%+ dips",
        severity: "danger", confidence: 74,
        ctaLabel: "Set Stop-Loss",
        actions: [
          { label: "Set -15% stop-loss", description: "Automated exit prevents emotional selling" },
          { label: "Use trailing stop at 10%", description: "Lock in gains while limiting downside" },
        ],
        detailAnalysis: "You sold RCH and SOL within 2-3 hours of 10%+ dips, both of which recovered within 48 hours. Panic selling during normal volatility is one of the most costly behavioral patterns — it locks in losses and misses recoveries. Setting automated stop-losses at predetermined levels removes emotion from the equation and gives assets room to recover from normal market fluctuations.",
      },
      {
        label: "Overtrading", emoji: "⚡",
        description: "18 trades in 30 days — 3x the avg for your portfolio size",
        severity: "warning", confidence: 68,
        ctaLabel: "Review Frequency",
        actions: [
          { label: "Switch to weekly rebalance", description: "Reduce trades by 70% with similar returns" },
          { label: "Set 24h cooldown rule", description: "Wait 24h before executing any trade" },
        ],
        detailAnalysis: "With 18 trades in 30 days, you're trading 3x more than the average for your portfolio size (~$36K). Each trade incurs fees and slippage, and studies show that the most frequent traders underperform buy-and-hold by 6-8% annually. A weekly rebalance schedule can achieve similar portfolio optimization with 70% fewer transactions, saving on fees and reducing emotional decision-making.",
      },
    ],
    stats: { trades: 18, winRate: 38, avgHold: "2.1 days" },
  },
  "7D": {
    summary: "Mostly holding this week with one impulsive buy after a Twitter hype cycle.",
    mainBehavior: "Impulsive Buyer",
    mainEmoji: "🎯",
    patterns: [
      {
        label: "FOMO Buy", emoji: "🔥",
        description: "Bought TSLAx after 22% surge — bought near local top",
        severity: "danger", confidence: 91,
        ctaLabel: "Undo FOMO",
        actions: [
          { label: "Sell 50% TSLAx position", description: "Cut exposure from FOMO entry" },
          { label: "Set limit sell at +5%", description: "Take profit if price recovers to your entry" },
        ],
        detailAnalysis: "You bought TSLAx immediately after a 22% surge driven by social media hype. This is a classic FOMO pattern — the asset was already extended from its moving averages and statistically likely to mean-revert. Entries after 20%+ daily moves have a 73% chance of being underwater within 48 hours. Consider scaling out of this position or setting a limit sell to minimize the damage.",
      },
      {
        label: "Diamond Hands", emoji: "💎",
        description: "Held SOL through 8% dip without selling",
        severity: "good", confidence: 82,
        ctaLabel: "Keep Strategy",
        actions: [
          { label: "Set alerts for next dip", description: "Buy more SOL if it dips 10%+ again" },
        ],
        detailAnalysis: "Great discipline! You held SOL through an 8% dip without panic selling. This is exactly the kind of conviction that separates profitable traders from reactive ones. SOL recovered within 3 days, validating your hold. Consider setting buy alerts for the next dip to add to your position at better prices — buying dips on conviction holds is a proven strategy.",
      },
    ],
    stats: { trades: 3, winRate: 33, avgHold: "4.5 days" },
  },
  "1D": {
    summary: "No trades today — sometimes the best trade is no trade.",
    mainBehavior: "Sitting Tight",
    mainEmoji: "🧘",
    patterns: [
      {
        label: "No Activity", emoji: "✅",
        description: "Zero trades today — patience is a strategy",
        severity: "good", confidence: 100,
        detailAnalysis: "Taking a day off from trading is one of the best things you can do for your portfolio. Overtrading is the #1 destroyer of retail returns. Today you demonstrated patience and discipline — keep it up. The best trades often come from waiting for high-conviction setups rather than forcing entries.",
      },
    ],
    stats: { trades: 0, winRate: 0, avgHold: "—" },
  },
};

const severityStyles = {
  danger: { bg: "hsla(350, 100%, 65%, 0.12)", text: "text-loss", border: "border-loss/20" },
  warning: { bg: "hsla(30, 100%, 64%, 0.12)", text: "text-warning", border: "border-warning/20" },
  good: { bg: "hsla(160, 100%, 45%, 0.12)", text: "text-profit", border: "border-profit/20" },
};

/* ── Feedback helpers ── */
const savePatternFeedback = (id: string, fb: { vote: "up" | "down"; reason?: string; timestamp: number }) => {
  const stored = JSON.parse(localStorage.getItem("miaofi_pattern_feedback") || "{}");
  stored[id] = fb;
  localStorage.setItem("miaofi_pattern_feedback", JSON.stringify(stored));
};
const getPatternFeedback = (id: string) => {
  const stored = JSON.parse(localStorage.getItem("miaofi_pattern_feedback") || "{}");
  return stored[id] || null;
};

/* ── Pattern Card ── */
const PatternCard = ({ pattern, index, period }: { pattern: BehaviorPattern; index: number; period: Period }) => {
  const style = severityStyles[pattern.severity];
  const patternId = `${period}-${index}`;

  const [reviewed, setReviewed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [feedbackVote, setFeedbackVote] = useState<"up" | "down" | null>(() => getPatternFeedback(patternId)?.vote || null);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackReason, setFeedbackReason] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      className={`rounded-lg px-3.5 py-2.5 border ${style.border} transition-all overflow-visible relative`}
      style={{ background: style.bg, opacity: reviewed ? 0.5 : 1, zIndex: dropdownOpen ? 50 : 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-0.5">
        <span className="flex items-center gap-1.5">
          <span className="text-sm">{pattern.emoji}</span>
          <span className={`text-sm font-medium ${style.text}`}>{pattern.label}</span>
          {reviewed && <span className="text-xs text-profit flex items-center gap-1 ml-1"><Check className="w-3 h-3" /> Reviewed</span>}
        </span>
        <span className="text-[10px] text-muted-foreground">{pattern.confidence}% confidence</span>
      </div>
      <p className="text-xs text-secondary-foreground mb-3">{pattern.description}</p>

      {/* Action buttons row */}
      <div className="flex flex-wrap items-center gap-2.5">
        {pattern.ctaLabel && pattern.actions && pattern.actions.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="glass-button-primary text-primary-foreground text-xs font-semibold rounded-lg px-3 py-1.5 flex items-center gap-1"
            >
              {pattern.ctaLabel}
              <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-[260px] z-50 rounded-xl overflow-hidden bg-[#1a1a2e] border border-white/10 shadow-xl">
                {pattern.actions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => { toast(`Selected: ${action.label}`); setDropdownOpen(false); }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                  >
                    <div className="flex items-center gap-1.5">
                      {i === 0 && <Sparkles className="w-3 h-3 text-primary shrink-0" />}
                      <span className="text-xs font-medium text-foreground">{action.label}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 ml-[18px]">{action.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {pattern.detailAnalysis && (
          <button
            onClick={() => setAnalysisOpen(!analysisOpen)}
            className="glass-button text-xs text-secondary-foreground rounded-lg px-3 py-1.5 flex items-center gap-1"
          >
            See Detail Analysis <ChevronDown className={`w-3 h-3 transition-transform ${analysisOpen ? "rotate-180" : ""}`} />
          </button>
        )}

        <button
          onClick={() => setReviewed(true)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          {reviewed ? <>Reviewed <Check className="w-3 h-3" /></> : <>I know <Check className="w-3 h-3" /></>}
        </button>
      </div>

      {/* Detail Analysis expandable */}
      {analysisOpen && pattern.detailAnalysis && (
        <div className="mt-3 p-3 rounded-lg border border-white/10 bg-[#1a1a2e]">
          <p className="text-xs text-secondary-foreground leading-relaxed whitespace-pre-line">{pattern.detailAnalysis}</p>
          <div className="mt-3 pt-2 border-t border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground">Was this helpful?</span>
              <button
                onClick={() => { setFeedbackVote("up"); setShowFeedbackInput(false); savePatternFeedback(patternId, { vote: "up", timestamp: Date.now() }); toast("Thanks for your feedback!"); }}
                className={`p-1 rounded-md transition-colors ${feedbackVote === "up" ? "bg-profit/20 text-profit" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
              ><ThumbsUp className="w-3.5 h-3.5" /></button>
              <button
                onClick={() => { setFeedbackVote("down"); setShowFeedbackInput(true); savePatternFeedback(patternId, { vote: "down", timestamp: Date.now() }); }}
                className={`p-1 rounded-md transition-colors ${feedbackVote === "down" ? "bg-loss/20 text-loss" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
              ><ThumbsDown className="w-3.5 h-3.5" /></button>
            </div>
            {showFeedbackInput && feedbackVote === "down" && (
              <div className="mt-2 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Tell us why (optional)</span>
                  <button onClick={() => setShowFeedbackInput(false)} className="text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
                </div>
                <textarea
                  value={feedbackReason}
                  onChange={(e) => setFeedbackReason(e.target.value)}
                  placeholder="What could be improved?"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50"
                  rows={2}
                />
                <button
                  onClick={() => { savePatternFeedback(patternId, { vote: "down", reason: feedbackReason, timestamp: Date.now() }); setShowFeedbackInput(false); toast("Thanks for your feedback!"); }}
                  className="self-end text-[10px] glass-button px-2.5 py-1 rounded-md text-foreground"
                >Submit</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Main Component ── */
const TradingBehavior = () => {
  const [period, setPeriod] = useState<Period>("30D");
  const [sectionOpen, setSectionOpen] = useState(false);
  const [patternsOpen, setPatternsOpen] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const data = periodData[period];

  return (
    <div className="glass-card p-5 space-y-3">
      {/* Header */}
      <button onClick={() => setSectionOpen(!sectionOpen)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Activity className="w-[18px] h-[18px] text-primary" />
          <h3 className="font-display font-semibold text-[15px] text-foreground">Trading Behavior</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setShareOpen(true); }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            title="Share your trading behavior"
          ><Share2 className="w-4 h-4" /></button>
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
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md transition-all ${period === p ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >{p}</button>
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
              {data.patterns.map((pattern, i) => (
                <PatternCard key={`${period}-${i}`} pattern={pattern} index={i} period={period} />
              ))}
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
