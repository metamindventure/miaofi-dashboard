import { useState, useRef, useEffect } from "react";
import TradingBehavior from "./TradingBehavior";
import {
  Brain,
  Share2,
  ChevronDown,
  Check,
  Lock,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ActionOption {
  label: string;
  description: string;
}

interface InsightFeedback {
  vote: "up" | "down";
  reason?: string;
  timestamp: number;
}

const saveFeedback = (insightId: string, feedback: InsightFeedback) => {
  const stored = JSON.parse(localStorage.getItem("miaofi_feedback") || "{}");
  stored[insightId] = feedback;
  localStorage.setItem("miaofi_feedback", JSON.stringify(stored));
};

const getFeedback = (insightId: string): InsightFeedback | null => {
  const stored = JSON.parse(localStorage.getItem("miaofi_feedback") || "{}");
  return stored[insightId] || null;
};

interface InsightCardProps {
  insightId: string;
  severity: "critical" | "warning" | "tip";
  impact: string;
  title: string;
  body: string;
  blurred?: boolean;
  ctaLabel?: string;
  actions?: ActionOption[];
  detailAnalysis?: string;
}



const severityConfig = {
  critical: {
    border: "hsl(var(--loss))",
    bg: "hsla(350, 100%, 65%, 0.15)",
    text: "text-loss",
    label: "CRITICAL",
  },
  warning: {
    border: "hsl(var(--warning))",
    bg: "hsla(30, 100%, 64%, 0.15)",
    text: "text-warning",
    label: "WARNING",
  },
  tip: {
    border: "hsl(var(--info))",
    bg: "hsla(174, 60%, 55%, 0.15)",
    text: "text-info",
    label: "TIP",
  },
};

const InsightCard = ({
  insightId,
  severity,
  impact,
  title,
  body,
  blurred,
  ctaLabel,
  actions = [],
  detailAnalysis,
}: InsightCardProps) => {
  const config = severityConfig[severity];
  const [reviewed, setReviewed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [feedbackVote, setFeedbackVote] = useState<"up" | "down" | null>(() => getFeedback(insightId)?.vote || null);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackReason, setFeedbackReason] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleShare = () => {
    navigator.clipboard.writeText(
      `MiaoFi AI found: ${title}. Check your portfolio → miaofi.app`
    );
    toast("Insight copied! Share it on Twitter");
  };

  const handleReview = () => {
    setReviewed(true);
    setTimeout(() => setCollapsed(true), 200);
  };

  return (
    <div
      className="glass-card p-5 relative transition-all duration-200 overflow-visible"
      style={{
        borderLeft: `3px solid ${config.border}`,
        opacity: reviewed ? 0.5 : 1,
        zIndex: dropdownOpen ? 50 : 1,
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${config.text}`}
            style={{ background: config.bg }}
          >
            {config.label}
          </span>
          {reviewed && (
            <span className="text-xs text-profit flex items-center gap-1">
              <Check className="w-3 h-3" /> Reviewed
            </span>
          )}
          <span className={`text-xs ${config.text}`}>{impact}</span>
        </div>
        {!blurred && (
          <button
            onClick={handleShare}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-[17px] text-foreground mb-2">
        {title}
      </h3>

      {/* Body + Buttons */}
      {!collapsed && (
        <div className="relative">
          <div className={blurred ? "blur-[6px] select-none pointer-events-none" : ""}>
            <p className="text-sm text-secondary-foreground leading-relaxed mb-4">
              {body}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {ctaLabel && actions.length > 0 && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => !blurred && setDropdownOpen(!dropdownOpen)}
                    className="glass-button-primary text-primary-foreground text-sm font-semibold rounded-lg px-4 py-2 flex items-center gap-1.5"
                  >
                    {ctaLabel}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {dropdownOpen && (
                    <div
                      className="absolute top-full left-0 mt-2 w-[300px] z-50 rounded-xl overflow-hidden bg-[#1a1a2e] border border-white/10 shadow-xl"
                    >
                      {actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            toast(`Selected: ${action.label}`);
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            {i === 0 && <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />}
                            <span className="text-sm font-medium text-foreground">{action.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 ml-[22px]">{i === 0 ? "" : ""}{action.description}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {detailAnalysis && (
                <button
                  onClick={() => !blurred && setAnalysisOpen(!analysisOpen)}
                  className="glass-button text-sm text-secondary-foreground rounded-lg px-4 py-2 flex items-center gap-1"
                >
                  See Detail Analysis <ChevronDown className={`w-3.5 h-3.5 transition-transform ${analysisOpen ? "rotate-180" : ""}`} />
                </button>
              )}
              {!blurred && (
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
              )}
            </div>
          </div>

          {/* Detail Analysis expandable */}
          {analysisOpen && detailAnalysis && !blurred && (
            <div className="mt-3 p-4 rounded-lg border border-white/10 bg-[#1a1a2e]">
              <p className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-line">{detailAnalysis}</p>
              
              {/* Feedback */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Was this helpful?</span>
                  <button
                    onClick={() => {
                      setFeedbackVote("up");
                      setShowFeedbackInput(false);
                      saveFeedback(insightId, { vote: "up", timestamp: Date.now() });
                      toast("Thanks for your feedback!");
                    }}
                    className={`p-1.5 rounded-md transition-colors ${feedbackVote === "up" ? "bg-profit/20 text-profit" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setFeedbackVote("down");
                      setShowFeedbackInput(true);
                      saveFeedback(insightId, { vote: "down", timestamp: Date.now() });
                    }}
                    className={`p-1.5 rounded-md transition-colors ${feedbackVote === "down" ? "bg-loss/20 text-loss" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
                
                {showFeedbackInput && feedbackVote === "down" && (
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Tell us why (optional)</span>
                      <button onClick={() => setShowFeedbackInput(false)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <textarea
                      value={feedbackReason}
                      onChange={(e) => setFeedbackReason(e.target.value)}
                      placeholder="What could be improved?"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50"
                      rows={2}
                    />
                    <button
                      onClick={() => {
                        saveFeedback(insightId, { vote: "down", reason: feedbackReason, timestamp: Date.now() });
                        setShowFeedbackInput(false);
                        toast("Thanks for your feedback!");
                      }}
                      className="self-end text-xs glass-button px-3 py-1.5 rounded-md text-foreground"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Blur overlay for paywall cards */}
          {blurred && (
            <div
              className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(10, 10, 15, 0.6) 80%)",
              }}
            >
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AIDiagnosis = () => {
  const { credits, totalCredits, authState, signIn } = useAuth();

  return (
    <section className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 flex-wrap">
          <Brain className="w-5 h-5 text-primary" />
          <h2 className="section-header text-foreground">AI Diagnosis</h2>
          <span className="text-xs text-muted-foreground italic">Powered by Claude</span>
          <span className="text-xs text-muted-foreground">⏱ 32.8s</span>
          {credits > 0 ? (
            <span className="text-xs flex items-center gap-1 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">↻ Retry</span>
          ) : (
            <span className="text-xs flex items-center gap-1 text-muted-foreground opacity-30 select-none">↻ Retry</span>
          )}
          <span className="flex items-center gap-1 text-xs font-medium">
            <Zap className={`w-3 h-3 ${credits === 0 ? "text-loss" : "text-primary"}`} />
            <span className={credits === 0 ? "text-loss" : "text-foreground"}>{credits}</span>
            <span className="text-muted-foreground">/ {totalCredits}</span>
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${credits > 0 ? "bg-profit" : "bg-loss"} inline-block`} />
        </div>
        {/* Risk ring */}
        <div
          className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:translate-y-[-2px]"
          style={{
            background: "hsl(0 0% 100% / 0.06)",
            backdropFilter: "blur(30px)",
            boxShadow:
              "inset 0 1px 0 0 hsl(0 0% 100% / 0.10), 0 4px 12px -2px hsl(0 0% 0% / 0.4), 0 2px 4px -1px hsl(0 0% 0% / 0.3)",
          }}
        >
          <svg viewBox="0 0 40 40" className="w-9 h-9 -rotate-90">
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="hsl(var(--glass-border))"
              strokeWidth="3"
            />
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="hsl(var(--loss))"
              strokeWidth="3"
              strokeDasharray={`${0.7 * 100.5} ${0.3 * 100.5}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-foreground font-bold text-xs">
            7/10
          </span>
        </div>
      </div>

      {/* Trading Behavior Analysis */}
      <TradingBehavior />

      {/* Summary banner */}
      <div
        className="glass-card rounded-lg p-4"
        style={{
          borderLeft: "3px solid hsl(var(--loss))",
          boxShadow:
            "inset 0 0 20px 0 hsla(350, 100%, 65%, 0.06), inset 0 1px 0 0 hsl(0 0% 100% / 0.08), 0 4px 24px -4px hsl(0 0% 0% / 0.3), 0 0 40px -10px hsl(252 75% 63% / 0.08)",
        }}
      >
        <p className="text-sm">
          <span className="text-loss font-bold">High Risk</span>
          <span className="text-secondary-foreground">
            {" "}— 71.8% concentrated in Solana tokenized stocks with idle stablecoins
          </span>
        </p>
      </div>

      {/* Insight cards */}
      <InsightCard
        insightId="tslax-concentration"
        severity="critical"
        impact="Impact: ~$6,698 at risk"
        title="69% Portfolio in Single Tokenized Stock"
        body={"You hold 54.75 TSLAx worth $22,327 — that\u2019s 61.4% of your portfolio. Combined with GOOGLx ($2,838), tokenized stocks make up 69% of total value. If TSLAx drops 30%, you lose ~$6,698."}
        ctaLabel="Diversify TSLAx"
        actions={[
          { label: "Swap 50% TSLAx → SOL", description: "Reduce concentration while keeping upside exposure" },
          { label: "Swap 30% TSLAx → USDT", description: "Lock in profits and reduce volatility" },
          { label: "Split into 3 tokenized stocks", description: "Diversify across AAPL, AMZN, MSFT" },
        ]}
        detailAnalysis="TSLAx represents a single-asset concentration risk that exceeds safe portfolio allocation thresholds. With 61.4% in one tokenized stock, a market correction or Tesla-specific event (earnings miss, regulatory action) could wipe out a significant portion of your portfolio. Historical data shows single-stock portfolios underperform diversified ones by 4-7% annually on a risk-adjusted basis. Swapping 50% into SOL maintains crypto exposure while cutting single-asset risk in half. The USDT option locks in gains during uncertain markets. Splitting across multiple tokenized stocks preserves your equity thesis while spreading company-specific risk."
      />

      <InsightCard
        insightId="rch-microcap"
        severity="warning"
        impact="Impact: High volatility exposure"
        title="RCH Positions: High-Risk Micro-Cap Exposure"
        body="Your RCH holdings ($2,526) represent a significant micro-cap allocation with limited liquidity. This token has 90-day volatility of 340%. Consider reducing to <5% of portfolio."
        ctaLabel="Reduce RCH"
        actions={[
          { label: "Sell 70% RCH → USDT", description: "Drastically lower micro-cap risk" },
          { label: "Sell 50% RCH → SOL", description: "Rotate into large-cap for stability" },
          { label: "Set stop-loss at -20%", description: "Auto-sell if price drops further" },
        ]}
        detailAnalysis="RCH is a micro-cap token with extremely high volatility (340% over 90 days) and thin liquidity. Micro-caps below $50M market cap carry elevated risks: rug pulls, low trading volume causing slippage, and lack of institutional backing. Your $2,526 position represents ~7% of your portfolio — well above the recommended 2-3% micro-cap allocation. Selling 70% to USDT immediately reduces downside exposure. Rotating into SOL provides large-cap stability with strong ecosystem growth. A stop-loss at -20% is the minimum safeguard if you want to hold, automatically exiting before catastrophic loss."
      />

      <InsightCard
        insightId="idle-stablecoins"
        severity="tip"
        impact="Impact: +8.2% APY available"
        title="Your Stablecoins Are Sitting Idle — Earn 8.2% APY"
        body="Your $5.98 in USDT and USDS could be earning yield in Aave or Morpho. Current best rate for USDT on Solana is 8.2% via Kamino Finance, which has $450M TVL and 2 audits."
        blurred
        ctaLabel="Earn Yield"
        actions={[
          { label: "Deposit USDT → Kamino 8.2% APY", description: "Highest yield, audited protocol" },
          { label: "Deposit USDT → Aave 6.1% APY", description: "Lower yield, battle-tested" },
          { label: "Deposit USDS → Morpho 7.5% APY", description: "Good balance of risk and return" },
        ]}
        detailAnalysis="Idle stablecoins are a missed opportunity. At 8.2% APY on Kamino Finance, even small amounts compound meaningfully over time. Kamino is a battle-tested protocol on Solana with $450M TVL and 2 completed audits, making it one of the safer yield options. Aave offers lower yield but has the longest track record in DeFi. Morpho provides an intermediate option with optimized lending rates."
      />

      <InsightCard
        insightId="wbtc-fragmented"
        severity="warning"
        impact="Impact: $3,141 fragmented across chains"
        title="WBTC Split Across 2 Chains — Consolidate for Lower Fees"
        body="You hold 0.046 WBTC on Optimism ($3,141) and 0.010 WBTC on Arbitrum ($697). Consolidating to one chain would save gas fees and simplify management."
        blurred
        ctaLabel="Consolidate WBTC"
        actions={[
          { label: "Bridge all to Optimism", description: "Lower fees, larger liquidity pool" },
          { label: "Bridge all to Arbitrum", description: "Faster transactions, growing DeFi" },
          { label: "Bridge all to Ethereum L1", description: "Maximum security, higher gas" },
        ]}
        detailAnalysis="Holding WBTC across multiple L2 chains creates unnecessary complexity and gas costs. Each cross-chain transaction incurs bridge fees ($2-8) and potential slippage. Consolidating to Optimism gives you access to deeper liquidity pools and lower transaction costs. Arbitrum is growing rapidly but currently has slightly higher fees. Ethereum L1 offers maximum security but at 10-50x the gas cost of L2s."
      />

      {/* Inline conversion nudge for anonymous-post-diagnosis */}
      {authState === "anonymous-post-diagnosis" && (
        <div
          className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{
            border: "1px solid hsla(252, 75%, 63%, 0.2)",
            boxShadow: "0 0 40px -15px hsla(252, 75%, 63%, 0.12), inset 0 1px 0 0 hsl(0 0% 100% / 0.08)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Save this diagnosis & unlock 2 more free</p>
              <p className="text-xs text-muted-foreground">Sign in to keep your results and analyze more wallets</p>
            </div>
          </div>
          <button
            onClick={signIn}
            className="glass-button-primary text-primary-foreground text-sm font-semibold rounded-full px-6 py-2 flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Sign in free
          </button>
        </div>
      )}

      {/* Paywall CTA - Diagnosis Packages */}
      <div
        className="glass-card p-6 md:p-8"
        style={{ border: "1px solid hsla(252, 75%, 63%, 0.2)" }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <Lock className="w-7 h-7 text-muted-foreground mb-4" />
          <h3 className="font-display font-semibold text-lg text-foreground mb-2">
            Want deeper insights? Get more diagnoses.
          </h3>
          <p className="text-sm text-secondary-foreground max-w-md">
            Each diagnosis scans your entire portfolio with our best AI model. Unlock hidden risks and save{" "}
            <span className="text-profit font-bold">~$9,839</span> in potential losses.
          </p>
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {/* Starter */}
          <div className="glass-card p-5 rounded-xl text-center border border-white/5 hover:border-white/15 transition-colors">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Starter</p>
            <p className="text-3xl font-bold text-foreground">5</p>
            <p className="text-xs text-muted-foreground mb-3">diagnoses</p>
            <p className="text-xl font-semibold text-foreground mb-1">$3.99</p>
            <p className="text-[11px] text-muted-foreground mb-4">$0.80 / diagnosis</p>
            <button className="glass-button text-sm text-foreground rounded-lg px-4 py-2 w-full">
              Get Started
            </button>
          </div>

          {/* Standard - recommended */}
          <div className="glass-card p-5 rounded-xl text-center relative border border-primary/30 hover:border-primary/50 transition-colors">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase px-3 py-0.5 rounded-full bg-primary text-primary-foreground">
              Best Value
            </span>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 mt-1">Standard</p>
            <p className="text-3xl font-bold text-foreground">15</p>
            <p className="text-xs text-muted-foreground mb-3">diagnoses</p>
            <p className="text-xl font-semibold text-foreground mb-1">$8.99</p>
            <p className="text-[11px] text-profit mb-4">$0.60 / diagnosis · Save 25%</p>
            <button className="glass-button-primary text-primary-foreground text-sm font-semibold rounded-lg px-4 py-2 w-full">
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              Buy Standard
            </button>
          </div>

          {/* Pro */}
          <div className="glass-card p-5 rounded-xl text-center border border-white/5 hover:border-white/15 transition-colors">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Pro</p>
            <p className="text-3xl font-bold text-foreground">40</p>
            <p className="text-xs text-muted-foreground mb-3">diagnoses</p>
            <p className="text-xl font-semibold text-foreground mb-1">$15.99</p>
            <p className="text-[11px] text-profit mb-4">$0.40 / diagnosis · Save 50%</p>
            <button className="glass-button text-sm text-foreground rounded-lg px-4 py-2 w-full">
              Buy Pro
            </button>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground mt-5 text-center flex items-center justify-center gap-3 flex-wrap">
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-profit" /> Full AI analysis unlocked
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-profit" /> Personalized action plans
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-profit" /> Diagnoses never expire
          </span>
        </p>
      </div>
    </section>
  );
};

export default AIDiagnosis;
