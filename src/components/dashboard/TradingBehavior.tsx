import { useState, useEffect } from "react";
import { Activity, ChevronDown, Share2, Check, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import ShareCardModal from "./ShareCardModal";

/* ── i18n ── */
type Lang = "en" | "zh" | "ko";

const t: Record<string, Record<Lang, string>> = {
  analyzing: { en: "Analyzing your trading behavior...", zh: "正在分析你的交易行为...", ko: "거래 행동 분석 중..." },
  trades: { en: "TRADES", zh: "交易次数", ko: "거래 수" },
  winRate: { en: "WIN RATE", zh: "胜率", ko: "승률" },
  avgHold: { en: "AVG HOLD", zh: "平均持仓", ko: "평균 보유" },
  detectedPatterns: { en: "Detected Patterns", zh: "识别到的模式", ko: "감지된 패턴" },
  seeAiBelow: { en: "See detailed AI diagnosis below", zh: "详细 AI 诊断见下方", ko: "아래에서 AI 진단 확인" },
  iKnow: { en: "I know", zh: "我知道了", ko: "알겠어요" },
  reviewed: { en: "Reviewed", zh: "已确认", ko: "확인됨" },
  title: { en: "Trading Behavior", zh: "交易行为分析", ko: "거래 행동 분석" },
  // Pattern names
  "Chasing Pumps": { en: "Chasing Pumps", zh: "追涨", ko: "펌프 추격" },
  "Panic Selling": { en: "Panic Selling", zh: "恐慌卖出", ko: "패닉 셀링" },
  "Overtrading": { en: "Overtrading", zh: "过度交易", ko: "과잉 거래" },
  "FOMO Buy": { en: "FOMO Buy", zh: "FOMO 追买", ko: "FOMO 매수" },
  "Diamond Hands": { en: "Diamond Hands", zh: "钻石手", ko: "다이아몬드 핸드" },
  "No Activity": { en: "No Activity", zh: "无交易", ko: "거래 없음" },
  confidence: { en: "confidence", zh: "置信度", ko: "신뢰도" },
};

const lang: Lang = "en"; // swap to "zh" or "ko" as needed
const i = (key: string) => t[key]?.[lang] || t[key]?.["en"] || key;

/* ── Types ── */
type Period = "30D" | "7D" | "1D";
type Severity = "high" | "medium" | "low";

interface BehaviorPattern {
  label: string;
  emoji: string;
  description: string;
  severity: Severity;
  confidence: number;
  ctaLabel: string;
}

interface PeriodData {
  summary: string;
  mainBehavior: string;
  mainEmoji: string;
  patterns: BehaviorPattern[];
  stats: { trades: number; winRate: number; avgHold: string };
}

/* ── Mock Data ── */
const periodData: Record<Period, PeriodData> = {
  "30D": {
    summary: "You tend to chase pumps and panic sell on dips — classic momentum chasing.",
    mainBehavior: "Momentum Chaser",
    mainEmoji: "🎢",
    patterns: [
      { label: "Chasing Pumps", emoji: "📈", description: "4 of 6 buys happened after 15%+ price surges", severity: "high", confidence: 87, ctaLabel: "Set Buy Rules" },
      { label: "Panic Selling", emoji: "😰", description: "Sold RCH and SOL within hours of 10%+ dips", severity: "medium", confidence: 74, ctaLabel: "Set Stop-Loss" },
      { label: "Overtrading", emoji: "⚡", description: "18 trades in 30 days — 3× the avg for your portfolio size", severity: "medium", confidence: 68, ctaLabel: "Review Frequency" },
    ],
    stats: { trades: 18, winRate: 38, avgHold: "2.1 days" },
  },
  "7D": {
    summary: "Mostly holding this week with one impulsive buy after a Twitter hype cycle.",
    mainBehavior: "Impulsive Buyer",
    mainEmoji: "🎯",
    patterns: [
      { label: "FOMO Buy", emoji: "🔥", description: "Bought TSLAx after 22% surge — bought near local top", severity: "high", confidence: 91, ctaLabel: "Undo FOMO" },
      { label: "Diamond Hands", emoji: "💎", description: "Held SOL through 8% dip without selling", severity: "low", confidence: 82, ctaLabel: "Keep Strategy" },
    ],
    stats: { trades: 3, winRate: 33, avgHold: "4.5 days" },
  },
  "1D": {
    summary: "No trades today — sometimes the best trade is no trade.",
    mainBehavior: "Sitting Tight",
    mainEmoji: "🧘",
    patterns: [
      { label: "No Activity", emoji: "✅", description: "Zero trades today — patience is a strategy", severity: "low", confidence: 100, ctaLabel: "Keep Going" },
    ],
    stats: { trades: 0, winRate: 0, avgHold: "—" },
  },
};

/* ── Severity styles ── */
const severityColor: Record<Severity, { text: string; border: string; bg: string; glow: string }> = {
  high: { text: "text-loss", border: "border-loss/30", bg: "bg-loss/8", glow: "shadow-[inset_0_0_20px_hsl(350_100%_65%/0.06)]" },
  medium: { text: "text-warning", border: "border-warning/25", bg: "bg-warning/6", glow: "shadow-[inset_0_0_20px_hsl(30_100%_64%/0.05)]" },
  low: { text: "text-profit", border: "border-profit/25", bg: "bg-profit/6", glow: "shadow-[inset_0_0_20px_hsl(160_100%_45%/0.05)]" },
};

/* ── Skeleton Loading State ── */
const LoadingSkeleton = () => (
  <div className="glass-card p-5 space-y-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-[18px] h-[18px] rounded bg-white/10" />
        <div className="h-4 w-36 rounded bg-white/10" />
      </div>
      <div className="h-5 w-10 rounded bg-white/10" />
    </div>
    {/* Trader type skeleton */}
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/8" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="h-3 w-64 rounded bg-white/6" />
      </div>
    </div>
    {/* Stats skeleton */}
    <div className="flex gap-6">
      {[1, 2, 3].map((n) => (
        <div key={n} className="space-y-1.5">
          <div className="h-2.5 w-14 rounded bg-white/6" />
          <div className="h-5 w-10 rounded bg-white/10" />
        </div>
      ))}
    </div>
    {/* Analyzing text */}
    <p className="text-xs text-muted-foreground">{i("analyzing")}</p>
  </div>
);

/* ── Pattern Card ── */
const PatternCard = ({ pattern, rank }: { pattern: BehaviorPattern; rank: number }) => {
  const s = severityColor[pattern.severity];
  const [dismissed, setDismissed] = useState(false);

  return (
    <div
      className={`rounded-xl border ${s.border} ${s.glow} px-4 py-3 transition-all ${dismissed ? "opacity-40" : ""}`}
      style={{
        background: `hsl(var(--card) / ${rank === 0 ? 0.9 : 0.7})`,
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="flex items-center gap-2">
          <span className="text-base">{pattern.emoji}</span>
          <span className={`text-sm font-semibold ${s.text}`}>{i(pattern.label)}</span>
        </span>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {pattern.confidence}% {i("confidence")}
        </span>
      </div>

      <p className="text-xs text-secondary-foreground mb-3">{pattern.description}</p>

      <div className="flex items-center gap-2.5">
        <button
          onClick={() => toast(`Selected: ${pattern.ctaLabel}`)}
          className="glass-button-primary text-primary-foreground text-xs font-semibold rounded-lg px-3.5 py-1.5"
        >
          {pattern.ctaLabel}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          {dismissed ? <><Check className="w-3 h-3" /> {i("reviewed")}</> : <>{i("iKnow")} <Check className="w-3 h-3" /></>}
        </button>
      </div>
    </div>
  );
};

/* ── Main Component ── */
const TradingBehavior = () => {
  const [period] = useState<Period>("30D");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const data = periodData[period];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSkeleton />;

  const isWinRateBad = data.stats.winRate > 0 && data.stats.winRate < 50;

  return (
    <div className="glass-card p-5 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Activity className="w-[18px] h-[18px] text-primary" />
          <h3 className="font-display font-semibold text-[15px] text-foreground">{i("title")}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShareOpen(true)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-medium text-muted-foreground bg-white/5 px-2 py-0.5 rounded-md">{period}</span>
        </div>
      </div>

      {/* Trader Type summary — always visible */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{data.mainEmoji}</span>
        <div className="flex-1 min-w-0">
          <span className="text-base font-semibold text-foreground">{data.mainBehavior}</span>
          <p className="text-xs text-secondary-foreground mt-0.5 line-clamp-2">{data.summary}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{i("trades")}</span>
          <span className="text-sm font-bold text-foreground tabular-nums">{data.stats.trades}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{i("winRate")}</span>
          <span className={`text-sm font-bold tabular-nums ${isWinRateBad ? "text-loss" : data.stats.winRate > 0 ? "text-profit" : "text-muted-foreground"}`}>
            {data.stats.winRate > 0 ? `${data.stats.winRate}%` : "—"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{i("avgHold")}</span>
          <span className="text-sm font-bold text-foreground tabular-nums">{data.stats.avgHold}</span>
        </div>
      </div>

      {/* Patterns toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors pt-1"
      >
        {i("detectedPatterns")} ({data.patterns.length})
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* Expanded: Pattern cards */}
      {expanded && (
        <div className="space-y-2.5 pt-1">
          {data.patterns
            .sort((a, b) => b.confidence - a.confidence)
            .map((pattern, idx) => (
              <PatternCard key={`${period}-${idx}`} pattern={pattern} rank={idx} />
            ))}

          {/* Guide to AI Diagnosis */}
          <div className="flex items-center justify-center gap-1.5 pt-2 pb-1">
            <ArrowDown className="w-3.5 h-3.5 text-primary/60 animate-bounce" />
            <span className="text-xs text-muted-foreground">{i("seeAiBelow")}</span>
          </div>
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
