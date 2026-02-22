import { useState } from "react";
import {
  Brain,
  Share2,
  ChevronDown,
  Check,
  Lock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface InsightCardProps {
  severity: "critical" | "warning" | "tip";
  impact: string;
  title: string;
  body: string;
  blurred?: boolean;
  ctaLabel?: string;
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
  severity,
  impact,
  title,
  body,
  blurred,
  ctaLabel,
}: InsightCardProps) => {
  const config = severityConfig[severity];
  const [reviewed, setReviewed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

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
        zIndex: showPopover ? 50 : 1,
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
              {ctaLabel && (
                <div className="relative">
                  <button
                    onClick={() => !blurred && setShowPopover(!showPopover)}
                    className="glass-button-primary text-primary-foreground text-sm font-semibold rounded-lg px-4 py-2"
                  >
                    {ctaLabel}
                  </button>
                  {showPopover && (
                    <div
                      className="absolute top-full left-0 mt-2 p-4 w-[280px] z-50 bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-primary" />
                        <span className="brand-gradient-text font-semibold text-[13px]">
                          Pro Feature
                        </span>
                      </div>
                      <p className="text-xs text-secondary-foreground mb-3">
                        Get personalized swap links and direct DEX recommendations
                      </p>
                      <button className="glass-button-primary text-primary-foreground text-xs font-semibold rounded-lg px-4 py-2 w-full">
                        Start 7-Day Free Trial →
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button className="glass-button text-sm text-secondary-foreground rounded-lg px-4 py-2 flex items-center gap-1">
                See risk breakdown <ChevronDown className="w-3.5 h-3.5" />
              </button>
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
  return (
    <section className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Brain className="w-5 h-5 text-primary" />
          <h2 className="section-header text-foreground">AI Diagnosis</h2>
          <span className="text-xs text-muted-foreground italic">Powered by Claude</span>
        </div>
        {/* Risk ring */}
        <div className="relative w-10 h-10">
          <svg viewBox="0 0 40 40" className="w-10 h-10 -rotate-90">
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
        severity="critical"
        impact="Impact: ~$6,698 at risk"
        title="69% Portfolio in Single Tokenized Stock"
        body={"You hold 54.75 TSLAx worth $22,327 — that\u2019s 61.4% of your portfolio. Combined with GOOGLx ($2,838), tokenized stocks make up 69% of total value. If TSLAx drops 30%, you lose ~$6,698."}
        ctaLabel="Diversify TSLAx → See Options"
      />

      <InsightCard
        severity="warning"
        impact="Impact: High volatility exposure"
        title="RCH Positions: High-Risk Micro-Cap Exposure"
        body="Your RCH holdings ($2,526) represent a significant micro-cap allocation with limited liquidity. This token has 90-day volatility of 340%. Consider reducing to <5% of portfolio."
        ctaLabel="Reduce RCH → See Options"
      />

      <InsightCard
        severity="tip"
        impact="Impact: +8.2% APY available"
        title="Your Stablecoins Are Sitting Idle — Earn 8.2% APY"
        body="Your $5.98 in USDT and USDS could be earning yield in Aave or Morpho. Current best rate for USDT on Solana is 8.2% via Kamino Finance, which has $450M TVL and 2 audits."
        blurred
        ctaLabel="Earn Yield → See Options"
      />

      <InsightCard
        severity="warning"
        impact="Impact: $3,141 fragmented across chains"
        title="WBTC Split Across 2 Chains — Consolidate for Lower Fees"
        body="You hold 0.046 WBTC on Optimism ($3,141) and 0.010 WBTC on Arbitrum ($697). Consolidating to one chain would save gas fees and simplify management."
        blurred
        ctaLabel="Consolidate WBTC"
      />

      {/* Paywall CTA */}
      <div
        className="glass-card p-8 flex flex-col items-center text-center"
        style={{ border: "1px solid hsla(252, 75%, 63%, 0.2)" }}
      >
        <Lock className="w-7 h-7 text-muted-foreground mb-4" />
        <h3 className="font-display font-semibold text-lg text-foreground mb-2">
          3 more insights available
        </h3>
        <p className="text-sm text-secondary-foreground mb-6 max-w-md">
          Based on your portfolio, Pro insights could help you save{" "}
          <span className="text-profit font-bold">~$9,839</span> in potential losses
        </p>
        <button className="glass-button-primary text-primary-foreground font-semibold rounded-lg px-8 py-3 text-base w-full max-w-[320px]">
          <Sparkles className="w-4 h-4 inline mr-2" />
          Start 7-Day Free Trial
        </button>
        <p className="text-xs text-muted-foreground mt-3">
          Then $9.99/mo · Cancel anytime
        </p>
        <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-profit" /> All insights unlocked
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-profit" /> Personalized swap links
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-profit" /> Unlimited refreshes
          </span>
        </p>
      </div>
    </section>
  );
};

export default AIDiagnosis;
