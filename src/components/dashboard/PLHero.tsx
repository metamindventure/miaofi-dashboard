import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Share2, Wallet } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const periodData: Record<string, { pnl: number; pct: string; sparkline: { v: number }[] }> = {
  "1D": {
    pnl: -312,
    pct: "-0.8%",
    sparkline: [
      { v: 37100 }, { v: 37050 }, { v: 36920 }, { v: 36980 }, { v: 36750 },
      { v: 36680 }, { v: 36820 }, { v: 36590 }, { v: 36500 }, { v: 36759 },
    ],
  },
  "7D": {
    pnl: 1122,
    pct: "+3.1%",
    sparkline: [
      { v: 34800 }, { v: 35100 }, { v: 34900 }, { v: 35400 }, { v: 35200 },
      { v: 35800 }, { v: 36100 }, { v: 35900 }, { v: 36400 }, { v: 36759 },
    ],
  },
  "30D": {
    pnl: 2846,
    pct: "+6.9%",
    sparkline: [
      { v: 32000 }, { v: 33200 }, { v: 31800 }, { v: 34100 }, { v: 33500 },
      { v: 34800 }, { v: 33900 }, { v: 35200 }, { v: 34600 }, { v: 35800 },
      { v: 35100 }, { v: 36200 }, { v: 35500 }, { v: 36759 },
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

const PLHero = ({ animate }: PLHeroProps) => {
  const [activePeriod, setActivePeriod] = useState("30D");
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const { pnl, pct, sparkline } = periodData[activePeriod];
  const isLoss = pnl < 0;

  useEffect(() => {
    if (!animate) return;
    const target = pnl;
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
        setDisplayValue(Math.round(startValue + (target - startValue) * progress));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [animate, activePeriod]);

  const handleShare = () => {
    navigator.clipboard.writeText(
      `+$${pnl.toLocaleString()} (${pct}) — ${periodLabels[activePeriod]} P&L across 2 wallets, 6 chains. Analyzed by MiaoFi → miaofi.app`
    );
    toast("P&L snapshot copied!");
  };

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
        <span className="label-uppercase">Estimated P&L · {periodLabels[activePeriod]}</span>

        <div className="flex items-center gap-2">
          <h1
            className={`font-display font-bold text-5xl md:text-[64px] leading-none transition-colors duration-300 ${
              isLoss ? "text-loss" : "text-profit glow-profit"
            }`}
            style={isLoss ? { textShadow: "0 0 40px hsl(var(--loss-glow))" } : undefined}
          >
            {isLoss ? "-" : "+"}${Math.abs(displayValue).toLocaleString()}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className={`${isLoss ? "text-loss" : "text-profit"} text-xl md:text-2xl font-display font-semibold flex items-center gap-1 transition-colors duration-300`}>
            {isLoss ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
            ({pct})
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

        {/* Info chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <div className="glass-chip">Total Value · $36,759.28</div>
          <div className="glass-chip flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5" /> 2 Wallets
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

        {/* Sparkline */}
        <div className="w-[140px] h-[40px] mt-1">
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
      </div>
    </section>
  );
};

export default PLHero;
