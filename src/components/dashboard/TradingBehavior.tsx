import { useState } from "react";
import { Activity, TrendingDown, TrendingUp, Shield, Clock, ChevronDown, Share2, ThumbsUp, ThumbsDown, X } from "lucide-react";
import { toast } from "sonner";
import ShareCardModal from "./ShareCardModal";

type Period = "30D" | "7D" | "1D";

interface BehaviorPattern {
  label: string;
  emoji: string;
  description: string;
  severity: "danger" | "warning" | "good";
  confidence: number;
  detailAnalysis: string;
}

interface PeriodData {
  summary: string;
  mainBehavior: string;
  mainEmoji: string;
  patterns: BehaviorPattern[];
  stats: { trades: number; winRate: number; avgHold: string };
}

interface PatternFeedback {
  vote: "up" | "down";
  reason?: string;
  timestamp: number;
}

const saveFeedback = (patternId: string, feedback: PatternFeedback) => {
  const stored = JSON.parse(localStorage.getItem("miaofi_pattern_feedback") || "{}");
  stored[patternId] = feedback;
  localStorage.setItem("miaofi_pattern_feedback", JSON.stringify(stored));
};

const getFeedback = (patternId: string): PatternFeedback | null => {
  const stored = JSON.parse(localStorage.getItem("miaofi_pattern_feedback") || "{}");
  return stored[patternId] || null;
};

const periodData: Record<Period, PeriodData> = {
  "30D": {
    summary: "You tend to chase pumps and panic sell on dips — classic momentum chasing.",
    mainBehavior: "Momentum Chaser",
    mainEmoji: "🎢",
    patterns: [
      { label: "Chasing Pumps", emoji: "📈", description: "4 of 6 buys happened after 15%+ price surges", severity: "danger", confidence: 87, detailAnalysis: "Over the past 30 days, 4 out of your 6 buy orders were placed within 2 hours of a 15%+ price surge. This is a classic FOMO pattern — buying after momentum has already peaked. Historically, assets purchased during sharp pumps retrace 60-70% of gains within 48 hours. Your average entry price on these trades was 12% above the pre-pump level, meaning you're consistently buying near local tops. Consider setting limit orders at support levels instead of market-buying during surges. A simple rule: if it's already up 15%+, wait for a pullback before entering." },
      { label: "Panic Selling", emoji: "😰", description: "Sold RCH and SOL within hours of 10%+ dips", severity: "danger", confidence: 74, detailAnalysis: "You sold both RCH and SOL within 3 hours of a 10%+ price dip. While cutting losses can be smart, your sell timing suggests emotional reaction rather than strategic risk management. Both assets recovered within 48 hours — RCH rebounded 18% and SOL 12%. Pre-setting stop-loss orders at key support levels (e.g., -15% from entry) removes emotion from the equation. Data shows that panic sellers underperform holders by 23% annually in volatile markets." },
      { label: "Overtrading", emoji: "⚡", description: "18 trades in 30 days — 3x the avg for your portfolio size", severity: "warning", confidence: 68, detailAnalysis: "With 18 trades in 30 days on a $36K portfolio, your trading frequency is approximately 3x higher than the average for similar portfolio sizes. Each trade incurs fees (avg $2-5 per swap on Solana) and potential slippage, costing you an estimated $50-90 this month in execution costs alone. More importantly, high-frequency trading correlates with lower returns for retail investors — studies show that the most active traders underperform passive holders by 6-8% annually. Consider reducing to 4-6 strategic trades per month." },
    ],
    stats: { trades: 18, winRate: 38, avgHold: "2.1 days" },
  },
  "7D": {
    summary: "Mostly holding this week with one impulsive buy after a Twitter hype cycle.",
    mainBehavior: "Impulsive Buyer",
    mainEmoji: "🎯",
    patterns: [
      { label: "FOMO Buy", emoji: "🔥", description: "Bought TSLAx after 22% surge — bought near local top", severity: "danger", confidence: 91, detailAnalysis: "Your TSLAx purchase was triggered within 45 minutes of a viral Twitter thread about tokenized stocks. The 22% surge had already priced in the hype — you entered at $407.50, just $3 below the local top of $410.80. Social media-driven buys have a 72% probability of resulting in losses within the first week. The pattern shows classic information cascade behavior: seeing others profit creates urgency to buy, but by the time retail investors act, smart money has already sold. Next time, add a 24-hour cooling period for any trade triggered by social media." },
      { label: "Diamond Hands", emoji: "💎", description: "Held SOL through 8% dip without selling", severity: "good", confidence: 82, detailAnalysis: "You held your SOL position through an 8% intraday dip without panic selling — this is excellent discipline. SOL recovered fully within 36 hours and went on to gain another 5%. This behavior shows growing emotional resilience. Historical data confirms that holding through 5-10% dips in large-cap assets (like SOL) is the optimal strategy 78% of the time. Your conviction was rewarded here, and building this habit will significantly improve long-term returns." },
    ],
    stats: { trades: 3, winRate: 33, avgHold: "4.5 days" },
  },
  "1D": {
    summary: "No trades today — sometimes the best trade is no trade.",
    mainBehavior: "Sitting Tight",
    mainEmoji: "🧘",
    patterns: [
      { label: "No Activity", emoji: "✅", description: "Zero trades today — patience is a strategy", severity: "good", confidence: 100, detailAnalysis: "Taking a day off from trading is one of the most underrated strategies. On days with no major catalysts, the expected value of a random trade is slightly negative after fees. By sitting tight today, you avoided potential impulse trades and preserved capital. Research shows that traders who take regular 'no-trade days' outperform daily traders by 4-6% annually. Keep building this discipline — it's a sign of a maturing trading mindset." },
    ],
    stats: { trades: 0, winRate: 0, avgHold: "—" },
  },
};

const severityStyles = {
  danger: { bg: "hsla(350, 100%, 65%, 0.12)", text: "text-loss", border: "border-loss/20" },
  warning: { bg: "hsla(30, 100%, 64%, 0.12)", text: "text-warning", border: "border-warning/20" },
  good: { bg: "hsla(160, 100%, 45%, 0.12)", text: "text-profit", border: "border-profit/20" },
};

const PatternCard = ({ pattern, period, index }: { pattern: BehaviorPattern; period: Period; index: number }) => {
  const style = severityStyles[pattern.severity];
  const patternId = `pattern-${period}-${index}`;
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [feedbackVote, setFeedbackVote] = useState<"up" | "down" | null>(() => getFeedback(patternId)?.vote || null);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackReason, setFeedbackReason] = useState("");

  return (
    <div
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

      {/* See Detail Analysis toggle */}
      <button
        onClick={() => setAnalysisOpen(!analysisOpen)}
        className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
      >
        See Detail Analysis
        <ChevronDown className={`w-3 h-3 transition-transform ${analysisOpen ? "rotate-180" : ""}`} />
      </button>

      {analysisOpen && (
        <div className="mt-2 p-3 rounded-lg border border-white/10 bg-[#1a1a2e]">
          <p className="text-xs text-secondary-foreground leading-relaxed">{pattern.detailAnalysis}</p>

          {/* Feedback */}
          <div className="mt-3 pt-2.5 border-t border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground">Was this helpful?</span>
              <button
                onClick={() => {
                  setFeedbackVote("up");
                  setShowFeedbackInput(false);
                  saveFeedback(patternId, { vote: "up", timestamp: Date.now() });
                  toast("Thanks for your feedback!");
                }}
                className={`p-1 rounded-md transition-colors ${feedbackVote === "up" ? "bg-profit/20 text-profit" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setFeedbackVote("down");
                  setShowFeedbackInput(true);
                  saveFeedback(patternId, { vote: "down", timestamp: Date.now() });
                }}
                className={`p-1 rounded-md transition-colors ${feedbackVote === "down" ? "bg-loss/20 text-loss" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {showFeedbackInput && feedbackVote === "down" && (
              <div className="mt-2 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Tell us why (optional)</span>
                  <button onClick={() => setShowFeedbackInput(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <textarea
                  value={feedbackReason}
                  onChange={(e) => setFeedbackReason(e.target.value)}
                  placeholder="What could be improved?"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50"
                  rows={2}
                />
                <button
                  onClick={() => {
                    saveFeedback(patternId, { vote: "down", reason: feedbackReason, timestamp: Date.now() });
                    setShowFeedbackInput(false);
                    toast("Thanks for your feedback!");
                  }}
                  className="self-end text-[10px] glass-button px-2.5 py-1 rounded-md text-foreground"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TradingBehavior = () => {
  const [period, setPeriod] = useState<Period>("30D");
  const [sectionOpen, setSectionOpen] = useState(false);
  const [patternsOpen, setPatternsOpen] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const data = periodData[period];

  return (
    <div className="glass-card p-5 space-y-3">
      {/* Header */}
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

      {/* Summary */}
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
              {data.patterns.map((pattern, i) => (
                <PatternCard key={i} pattern={pattern} period={period} index={i} />
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
