import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Copy, Check, Gift, Crown, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
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
    buildUrl: (_text: string) => null,
  },
];

const highlightColorMap = {
  profit: "text-profit",
  loss: "text-loss",
  primary: "text-primary",
};

const ShareCardModal = ({ open, onClose, context, data }: ShareCardModalProps) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const referralLink = `${SHARE_BASE_URL}${REFERRAL_CODE}`;

  const handleDownloadPng = useCallback(async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: "#0d0d14",
      });
      const link = document.createElement("a");
      link.download = `miaofi-${context}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Card saved as PNG!");
    } catch {
      toast.error("Failed to save image");
    } finally {
      setDownloading(false);
    }
  }, [context, downloading]);

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
        className="relative w-full max-w-[420px] rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
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

        {/* Capturable Card Area */}
        <div ref={cardRef} className="p-6 pb-5" style={{ background: "hsl(240 20% 7%)" }}>
          <div
            className="rounded-xl p-5 space-y-3 relative overflow-hidden"
            style={{
              border: "1px solid hsl(var(--glass-border))",
              background: context === "portfolio-pnl"
                ? (data.highlightColor === "loss"
                    ? "linear-gradient(160deg, hsl(350 40% 10%), hsl(240 30% 6%))"
                    : "linear-gradient(160deg, hsl(160 40% 8%), hsl(240 30% 6%))")
                : "linear-gradient(160deg, hsl(252 50% 12%), hsl(240 30% 6%))",
            }}
          >
            {/* Animated background layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
              {context === "portfolio-pnl" && data.highlightColor !== "loss" && (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `${3 + Math.random() * 4}px`,
                        height: `${3 + Math.random() * 4}px`,
                        left: `${10 + i * 11}%`,
                        bottom: `-10%`,
                        background: `hsla(160, 100%, 55%, ${0.15 + Math.random() * 0.2})`,
                        animation: `shareCardFloat ${3 + i * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.4}s`,
                      }}
                    />
                  ))}
                  <div
                    className="absolute w-32 h-32 rounded-full"
                    style={{
                      top: "-20%",
                      right: "-10%",
                      background: "radial-gradient(circle, hsla(160, 100%, 50%, 0.12) 0%, transparent 70%)",
                      animation: "shareCardPulse 4s ease-in-out infinite",
                    }}
                  />
                  <svg className="absolute bottom-0 left-0 w-full h-[40%] opacity-[0.07]" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path d="M0 35 L10 30 L20 32 L30 22 L40 25 L50 18 L60 20 L70 12 L80 15 L90 8 L100 5 L100 40 L0 40Z" fill="hsl(160 100% 50%)" />
                  </svg>
                </>
              )}

              {context === "portfolio-pnl" && data.highlightColor === "loss" && (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: `${2 + Math.random() * 3}px`,
                        height: `${2 + Math.random() * 3}px`,
                        left: `${15 + i * 13}%`,
                        top: `-10%`,
                        background: `hsla(350, 100%, 65%, ${0.12 + Math.random() * 0.15})`,
                        animation: `shareCardFall ${4 + i * 0.6}s ease-in-out infinite`,
                        animationDelay: `${i * 0.5}s`,
                      }}
                    />
                  ))}
                  <div
                    className="absolute w-28 h-28 rounded-full"
                    style={{
                      bottom: "-15%",
                      left: "-5%",
                      background: "radial-gradient(circle, hsla(350, 100%, 60%, 0.1) 0%, transparent 70%)",
                      animation: "shareCardPulse 5s ease-in-out infinite",
                    }}
                  />
                </>
              )}

              {context === "trading-behavior" && (
                <>
                  <div
                    className="absolute w-[200px] h-[200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ animation: "shareCardOrbit 20s linear infinite" }}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          width: `${4 + i}px`,
                          height: `${4 + i}px`,
                          top: "50%",
                          left: "50%",
                          transform: `rotate(${i * 72}deg) translateX(${60 + i * 12}px)`,
                          background: `hsla(252, 80%, 65%, ${0.15 + i * 0.05})`,
                        }}
                      />
                    ))}
                  </div>
                  <div
                    className="absolute w-36 h-36 rounded-full"
                    style={{
                      top: "-25%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "radial-gradient(circle, hsla(252, 80%, 60%, 0.1) 0%, transparent 70%)",
                      animation: "shareCardPulse 3.5s ease-in-out infinite",
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: "linear-gradient(hsl(252 80% 70%) 1px, transparent 1px), linear-gradient(90deg, hsl(252 80% 70%) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                </>
              )}
            </div>

            {/* Card content */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider uppercase text-primary">MiaoFi 🐱</span>
                <span className="text-[10px] text-muted-foreground">miaofi.app</span>
              </div>

              <p className="text-xs text-muted-foreground">{data.title}</p>

              <h3 className={`font-display font-bold text-2xl ${highlightColorMap[data.highlightColor || "primary"]}`}>
                {data.highlight}
              </h3>

              <p className="text-sm text-secondary-foreground">{data.subtitle}</p>

              {data.details && data.details.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.details.map((d, i) => (
                    <span key={i} className="glass-chip text-xs">{d}</span>
                  ))}
                </div>
              )}

              {/* QR Code + Referral Link Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center gap-3">
                <div className="shrink-0 rounded-lg overflow-hidden p-1.5" style={{ background: "white" }}>
                  <QRCodeSVG
                    value={referralLink}
                    size={56}
                    bgColor="#ffffff"
                    fgColor="#0d0d14"
                    level="M"
                    imageSettings={{
                      src: "",
                      height: 0,
                      width: 0,
                      excavate: false,
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-[10px] text-muted-foreground">Scan to analyze your portfolio</p>
                  <p className="text-xs text-primary font-mono truncate">{referralLink}</p>
                  <p className="text-[10px] text-muted-foreground">Referral: {REFERRAL_CODE}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="px-6 pb-3 space-y-3">
          {/* Download PNG */}
          <button
            onClick={handleDownloadPng}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-foreground transition-all hover:scale-[1.01] disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, hsla(252, 75%, 63%, 0.25), hsla(200, 80%, 55%, 0.15))",
              border: "1px solid hsla(252, 75%, 63%, 0.3)",
            }}
          >
            <Download className="w-4 h-4" />
            {downloading ? "Saving…" : "Save as Image"}
          </button>

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
