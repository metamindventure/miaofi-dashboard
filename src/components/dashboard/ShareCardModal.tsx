import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Copy, Check, Gift, Crown } from "lucide-react";
import { toast } from "sonner";

type ShareContext = "trading-behavior" | "portfolio-pnl";

interface ShareCardModalProps {
  open: boolean;
  onClose: () => void;
  context: ShareContext;
  data: {
    title: string;
    subtitle: string;
    highlight: string;
    highlightColor?: "profit" | "loss" | "primary";
    details?: string[];
  };
}

const REFERRAL_CODE = "MIAO-X7K9";
const SHARE_BASE_URL = "https://miaofi.app/r/";

const socialChannels = [
  {
    name: "𝕏",
    label: "Post",
    bg: "hsl(0 0% 100% / 0.08)",
    hoverBg: "hsl(0 0% 100% / 0.14)",
    buildUrl: (text: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
  },
  {
    name: "✈️",
    label: "Telegram",
    bg: "hsla(200, 80%, 55%, 0.12)",
    hoverBg: "hsla(200, 80%, 55%, 0.22)",
    buildUrl: (text: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(SHARE_BASE_URL + REFERRAL_CODE)}&text=${encodeURIComponent(text)}`,
  },
  {
    name: "📷",
    label: "Instagram",
    bg: "hsla(330, 80%, 55%, 0.12)",
    hoverBg: "hsla(330, 80%, 55%, 0.22)",
    buildUrl: (_text: string) => null, // Instagram doesn't support direct share URLs
  },
];

const highlightColorMap = {
  profit: "text-profit",
  loss: "text-loss",
  primary: "text-primary",
};

const ShareCardModal = ({ open, onClose, context, data }: ShareCardModalProps) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `${SHARE_BASE_URL}${REFERRAL_CODE}`;

  if (!open) return null;

  const shareText =
    context === "trading-behavior"
      ? `${data.highlight} — ${data.subtitle}. My trading personality revealed by MiaoFi AI 🐱\n\nAnalyze yours → ${referralLink}`
      : `${data.highlight} ${data.subtitle} across my portfolio. Analyzed by MiaoFi AI 🐱\n\nCheck yours → ${referralLink}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialShare = (buildUrl: (text: string) => string | null) => {
    const url = buildUrl(shareText);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer,width=600,height=400");
    } else {
      navigator.clipboard.writeText(shareText);
      toast("Share text copied! Paste it on Instagram.");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-[420px] rounded-2xl overflow-hidden"
        style={{
          background: "hsl(240 20% 7%)",
          border: "1px solid hsl(var(--glass-border))",
          boxShadow: "0 24px 64px -16px hsl(0 0% 0% / 0.6), 0 0 80px -20px hsl(252 75% 63% / 0.15)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Card Preview */}
        <div className="p-6 pb-5">
          <div
            className="rounded-xl p-5 space-y-3"
            style={{
              background: "linear-gradient(135deg, hsl(252 60% 12%), hsl(240 30% 8%))",
              border: "1px solid hsl(var(--glass-border))",
            }}
          >
            {/* Brand */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-primary">MiaoFi 🐱</span>
              <span className="text-[10px] text-muted-foreground">miaofi.app</span>
            </div>

            {/* Title */}
            <p className="text-xs text-muted-foreground">{data.title}</p>

            {/* Highlight */}
            <h3 className={`font-display font-bold text-2xl ${highlightColorMap[data.highlightColor || "primary"]}`}>
              {data.highlight}
            </h3>

            {/* Subtitle */}
            <p className="text-sm text-secondary-foreground">{data.subtitle}</p>

            {/* Detail chips */}
            {data.details && data.details.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {data.details.map((d, i) => (
                  <span key={i} className="glass-chip text-xs">{d}</span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Referral: {REFERRAL_CODE}</span>
              <span className="text-[10px] text-muted-foreground">Analyze your portfolio →</span>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="px-6 pb-3 space-y-4">
          {/* Social buttons */}
          <div className="flex gap-2">
            {socialChannels.map((ch) => (
              <button
                key={ch.label}
                onClick={() => handleSocialShare(ch.buildUrl)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-foreground transition-all hover:scale-[1.02]"
                style={{ background: ch.bg }}
                onMouseEnter={(e) => (e.currentTarget.style.background = ch.hoverBg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = ch.bg)}
              >
                <span>{ch.name}</span>
                <span className="text-xs text-secondary-foreground">{ch.label}</span>
              </button>
            ))}
          </div>

          {/* Referral link */}
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-3"
            style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(var(--glass-border))" }}
          >
            <span className="flex-1 text-sm text-secondary-foreground truncate font-mono">
              {referralLink}
            </span>
            <button
              onClick={handleCopyLink}
              className="shrink-0 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-profit" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Referral Rewards */}
        <div className="px-6 pb-6 pt-2">
          <div
            className="rounded-xl p-4 space-y-2.5"
            style={{
              background: "hsla(252, 75%, 63%, 0.06)",
              border: "1px solid hsla(252, 75%, 63%, 0.12)",
            }}
          >
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Referral Rewards</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-profit mt-0.5 shrink-0" />
                <p className="text-xs text-secondary-foreground">
                  Friend signs up → <span className="text-foreground font-medium">both get 1 free AI diagnosis</span>
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Crown className="w-3.5 h-3.5 text-warning mt-0.5 shrink-0" />
                <p className="text-xs text-secondary-foreground">
                  Friend upgrades to Pro → <span className="text-foreground font-medium">both get 10 AI diagnoses</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  , document.body);
};

export default ShareCardModal;
