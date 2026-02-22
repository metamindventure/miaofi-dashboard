import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const allocationData = [
  { name: "TSLAx", value: 22496, color: "#6C5CE7" },
  { name: "WBTC", value: 3838, color: "#F7931A" },
  { name: "GOOGLx", value: 2960, color: "#00E5A0" },
  { name: "ETH", value: 2860, color: "#627EEA" },
  { name: "RCH", value: 2526, color: "#FF6B6B" },
  { name: "Others", value: 2079, color: "#3A3A4F" },
];

const chainData = [
  { name: "Solana", value: 26381, pct: 71.8, color: "var(--chain-solana)" },
  { name: "Ethereum", value: 5358, pct: 14.6, color: "var(--chain-ethereum)" },
  { name: "Optimism", value: 3141, pct: 8.5, color: "var(--chain-optimism)" },
  { name: "Arbitrum", value: 697, pct: 1.9, color: "var(--chain-arbitrum)" },
  { name: "Blast", value: 28, pct: 0.1, color: "var(--chain-blast)" },
  { name: "BSC", value: 25, pct: 0.1, color: "var(--chain-bsc)" },
];

const total = 36759;

const PortfolioBento = () => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Donut chart */}
        <div className="md:col-span-2 glass-card p-5">
          <h3 className="label-uppercase mb-4">Asset Allocation</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-[140px] h-[140px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {allocationData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-bold text-xl text-foreground">13</span>
                <span className="text-[10px] text-muted-foreground">Assets</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {allocationData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: item.color }}
                  />
                  <span className="text-secondary-foreground">{item.name}</span>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {((item.value / total) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chain distribution */}
        <div className="md:col-span-3 glass-card p-5">
          <h3 className="label-uppercase mb-4">Chain Distribution</h3>
          <div className="flex flex-col gap-3">
            {chainData.map((chain) => (
              <div key={chain.name} className="flex items-center gap-3">
                <span className="text-xs text-secondary-foreground w-20 shrink-0">
                  {chain.name}
                </span>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${chain.pct}%`,
                      background: `hsl(${chain.color})`,
                    }}
                  />
                </div>
                <span className="text-xs font-mono text-muted-foreground w-24 text-right">
                  ${chain.value.toLocaleString()}
                </span>
                <span className="text-[11px] text-muted-foreground w-12 text-right">
                  {chain.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioBento;
