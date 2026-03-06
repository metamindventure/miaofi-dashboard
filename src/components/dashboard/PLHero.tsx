import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Share2, Wallet, Info } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import ShareCardModal from "./ShareCardModal";

interface PeriodEntry {
  valueChange: number;
  valuePct: string;
  estPnl: number;
  estPnlPct: string;
  totalValue: number;
  sparkline: { v: number }[];
}

const periodData: Record<string, PeriodEntry> = {
  "1D": {
    valueChange: -312,
    valuePct: "-0.6%",
    estPnl: -489,
    estPnlPct: "-0.9%",
    totalValue: 52109.29,
    sparkline: [
      { v: 52400 }, { v: 52350 }, { v: 52220 }, { v: 52180 }, { v: 51950 },
      { v: 52080 }, { v: 51820 }, { v: 51690 }, { v: 51900 }, { v: 52109 },
    ],
  },
  "7D": {
    valueChange: -2156,
    valuePct: "-4.0%",
    estPnl: -3842,
    estPnlPct: "-7.1%",
    totalValue: 52109.29,
    sparkline: [
      { v: 54200 }, { v: 53800 }, { v: 53100 }, { v: 54000 }, { v: 52900 },
      { v: 53200 }, { v: 52400 }, { v: 51800 }, { v: 52300 }, { v: 52109 },
    ],
  },
  "30D": {
    valueChange: -10228.09,
    valuePct: "-16.4%",
    estPnl: -12642,
    estPnlPct: "-44.6%",
    totalValue: 52109.29,
    sparkline: [
      { v: 62300 }, { v: 60800 }, { v: 58200 }, { v: 59100 }, { v: 56400 },
      { v: 54800 }, { v: 55200 }, { v: 53100 }, { v: 51800 }, { v: 52800 },
      { v: 51200 }, { v: 52400 }, { v: 51600 }, { v: 52109 },
    ],
  },
};

const periodLabels: Record<string, string> = {
  "1D": "Past 1 Day",
  "7D": "Past 7 Days",
  "30D": "Past 30 Days",
};

interface PLHeroProps {
  animate: boolean;
}

const formatCompact = (v: number) => {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
};

const PLHero = ({ animate }: PLHeroProps) => {
  const [activePeriod, setActivePeriod] = useState("30D");
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const data = periodData[activePeriod];
  const { valueChange, valuePct, estPnl, estPnlPct, totalValue, sparkline } = data;
  const isLoss = valueChange < 0;

  // Sparkline Y range
  const sparkValues = sparkline.map((d) => d.v);
  const sparkMin = Math.min(...sparkValues);
  const sparkMax = Math.max(...sparkValues);

  useEffect(() => {
    if (!animate) return;
    const target = valueChange;
    const start = Date.now();
    const duration = hasAnimated ? 400 : 1000;
    const startValue = displayValue;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= duration) {
        setDisplayValue(target);
        setHasAnimated(true);
        clearInterval(interval);
      } else {
        const progress = elapsed / duration;
        setDisplayValue(startValue + (target - startValue) * progress);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [animate, activePeriod]);

  const handleShare = () => {
    setShareOpen(true);
  };

  const getEmotionalData = () => {
    if (isLoss) {
      return {
        title: `Portfolio Snapshot · ${periodLabels[activePeriod]}`,
        subtitle: "Drawdowns are part of the game. Every legend has a red chapter 📖",
        highlight: `${valuePct} · -$${Math.abs(valueChange).toLocaleString()}`,
        highlightColor: "loss" as const,
        details: [`Total: $${totalValue.toLocaleString()}`, "2 Wallets", "6 Chains", "Still standing 💪"],
      };
    }
    return {
      title: `Portfolio Snapshot · ${periodLabels[activePeriod]}`,
      subtitle: "Steady gains, compounding wins ✨",
      highlight: `${valuePct} · +$${valueChange.toLocaleString()}`,
      highlightColor: "profit" as const,
      details: [`Total: $${totalValue.toLocaleString()}`, "2 Wallets", "6 Chains", "On track 🎯"],
    };
  };

  const formattedDisplay = Math.abs(displayValue) >= 1
    ? Math.abs(displayValue).toLocaleString(undefined, { minimumFractionDigits: displayValue % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 })
    : "0";

  return (
    <section className="w-full py-12 relative">
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-500"
        style={{
          background: isLoss
            ? "radial-gradient(ellipse at center, hsla(350, 100%, 65%, 0.08) 0%, transparent 70%)"
            : "radial-gradient(ellipse at center, hsla(160, 100%, 45%, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <span className="label-uppercase">
          Portfolio Value Change · {periodLabels[activePeriod]}
        </span>

        <div className="flex items-center gap-2">
          <h1
            className={`font-display font-bold text-5xl md:text-[64px] leading-none transition-colors duration-300 ${
              isLoss ? "text-loss" : "text-profit glow-profit"
            }`}
            style={isLoss ? { textShadow: "0 0 40px hsl(var(--loss-glow))" } : undefined}
          >
            {isLoss ? "-" : "+"}${formattedDisplay}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className={`${isLoss ? "text-loss" : "text-profit"} text-xl md:text-2xl font-display font-semibold flex items-center gap-1 transition-colors duration-300`}>
            {isLoss ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
            ({valuePct})
          </span>
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:border hover:border-primary"
            style={{ background: "hsl(0 0% 100% / 0.08)" }}
            title="Share your P&L"
          >
            <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Includes deposits note */}
        <p className="text-sm text-muted-foreground">Includes deposits &amp; withdrawals</p>

        {/* Est. P&L line */}
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-medium ${isLoss ? "text-loss" : "text-profit"}`}>
            Est. P&amp;L: {estPnl < 0 ? "-" : "+"}${Math.abs(estPnl).toLocaleString()} ({estPnlPct})
          </span>
          <Info className="w-3.5 h-3.5 text-muted-foreground" />
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <div className="glass-chip">Total Portfolio Value · ${totalValue.toLocaleString()}</div>
          <div className="glass-chip flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5" /> 2 wallets
          </div>
          <div className="glass-chip flex items-center gap-2">
            {["1D", "7D", "30D"].map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={`text-xs transition-colors ${
                  activePeriod === p
                    ? "text-profit border-b border-profit"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Sparkline with Y-axis labels */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] font-mono text-muted-foreground tabular-nums">{formatCompact(sparkMax)}</span>
          <div className="w-[140px] h-[40px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkline}>
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isLoss ? "hsl(350 100% 65%)" : "hsl(160 100% 45%)"} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={isLoss ? "hsl(350 100% 65%)" : "hsl(160 100% 45%)"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={isLoss ? "hsl(350 100% 65%)" : "hsl(160 100% 45%)"}
                  strokeWidth={1.5}
                  fill="url(#sparkGrad)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground tabular-nums">{formatCompact(sparkMin)}</span>
        </div>
      </div>

      <ShareCardModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        context="portfolio-pnl"
        data={getEmotionalData()}
      />
    </section>
  );
};

export default PLHero;
