import { useEffect, useState } from "react";
import { TrendingUp, Share2, Wallet } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const sparklineData = [
  { v: 32000 }, { v: 33200 }, { v: 31800 }, { v: 34100 }, { v: 33500 },
  { v: 34800 }, { v: 33900 }, { v: 35200 }, { v: 34600 }, { v: 35800 },
  { v: 35100 }, { v: 36200 }, { v: 35500 }, { v: 36759 },
];

interface PLHeroProps {
  animate: boolean;
}

const PLHero = ({ animate }: PLHeroProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const target = 2846;

  useEffect(() => {
    if (!animate) return;
    const start = Date.now();
    const duration = 1000;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= duration) {
        setDisplayValue(target);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.round((elapsed / duration) * target));
      }
    }, 33);
    return () => clearInterval(interval);
  }, [animate]);

  const handleShare = () => {
    navigator.clipboard.writeText(
      "+$2,846 (+6.9%) — 30 day P&L across 2 wallets, 6 chains. Analyzed by MiaoFi → miaofi.app"
    );
    toast("P&L snapshot copied!");
  };

  const [activePeriod, setActivePeriod] = useState("30D");

  const periodLabels: Record<string, string> = {
    "1D": "Past 1 Day",
    "7D": "Past 7 Days",
    "30D": "Past 30 Days",
  };

  return (
    <section className="w-full py-12 relative">
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, hsla(160, 100%, 45%, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <span className="label-uppercase">Estimated P&L · {periodLabels[activePeriod]}</span>

        <div className="flex items-center gap-2">
          <h1
            className="font-display font-bold text-5xl md:text-[64px] text-profit glow-profit leading-none"
          >
            +${displayValue.toLocaleString()}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-profit text-xl md:text-2xl font-display font-semibold flex items-center gap-1">
            <TrendingUp className="w-5 h-5" />
            (+6.9%)
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
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160 100% 45%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(160 100% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="hsl(160 100% 45%)"
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
