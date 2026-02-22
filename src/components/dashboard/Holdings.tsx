import { useState } from "react";
import { ChevronRight, Table2 } from "lucide-react";

const holdings = [
  { token: "TSLAx", chain: "Solana", balance: "54.75", price: "$410.87", value: "$22,496", pnl: "+$18.11", pnlPct: "+0.1%", positive: true },
  { token: "WBTC", chain: "Optimism", balance: "0.046287", price: "$67,854.22", value: "$3,141", pnl: "+$10.50", pnlPct: "+0.3%", positive: true },
  { token: "GOOGLx", chain: "Solana", balance: "9.38", price: "$315.44", value: "$2,960", pnl: "+$1.93", pnlPct: "+0.1%", positive: true },
  { token: "ETH", chain: "Ethereum", balance: "1.43", price: "$1,977.25", value: "$2,832", pnl: "+$19.67", pnlPct: "+0.7%", positive: true },
  { token: "RCH", chain: "Ethereum", balance: "20,435", price: "$0.12", value: "$2,526", pnl: "+$26.34", pnlPct: "+1.1%", positive: true },
  { token: "WBTC", chain: "Arbitrum", balance: "0.010267", price: "$67,854.22", value: "$697", pnl: "+$2.33", pnlPct: "+0.3%", positive: true },
  { token: "ETH", chain: "Blast", balance: "0.014048", price: "$1,977.25", value: "$28", pnl: "+$0.19", pnlPct: "+0.7%", positive: true },
  { token: "BNB", chain: "BSC", balance: "0.036305", price: "$626.33", value: "$23", pnl: "+$0.03", pnlPct: "+0.1%", positive: true },
  { token: "USDT", chain: "Solana", balance: "3.56", price: "$1.00", value: "$4", pnl: "+$0.00", pnlPct: "+0.1%", positive: true },
  { token: "USDS", chain: "Solana", balance: "2.42", price: "$1.00", value: "$2", pnl: "+$0.00", pnlPct: "+0.2%", positive: true },
  { token: "JupSOL", chain: "Solana", balance: "0.018258", price: "$99.73", value: "$2", pnl: "+$0.01", pnlPct: "+0.7%", positive: true },
  { token: "ERA", chain: "BSC", balance: "11,333", price: "$0.00", value: "$2", pnl: "+$0.01", pnlPct: "+0.7%", positive: true },
  { token: "POL", chain: "Polygon", balance: "10.28", price: "$0.11", value: "$1", pnl: "+$0.02", pnlPct: "+2.3%", positive: true },
];

const chainColor: Record<string, string> = {
  Solana: "var(--chain-solana)",
  Ethereum: "var(--chain-ethereum)",
  Optimism: "var(--chain-optimism)",
  Arbitrum: "var(--chain-arbitrum)",
  Blast: "var(--chain-blast)",
  BSC: "var(--chain-bsc)",
  Polygon: "var(--chain-polygon)",
};

const Holdings = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-5 hover:bg-secondary/30 transition-colors"
      >
        <Table2 className="w-4 h-4 text-muted-foreground" />
        <span className="font-display font-semibold text-foreground">Holdings</span>
        <span className="text-xs text-muted-foreground">(13 assets)</span>
        <ChevronRight
          className={`w-4 h-4 text-muted-foreground ml-auto transition-transform duration-200 ${
            expanded ? "rotate-90" : ""
          }`}
        />
      </button>

      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: expanded ? "1000px" : "0",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-border">
                <th className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  Asset
                </th>
                <th className="text-right px-3 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  Balance
                </th>
                <th className="text-right px-3 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium hidden sm:table-cell">
                  Price
                </th>
                <th className="text-right px-3 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  Value
                </th>
                <th className="text-right px-5 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  P&L
                </th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => (
                <tr
                  key={`${h.token}-${h.chain}`}
                  className="border-t border-border/50 hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{h.token}</span>
                      <span
                        className="text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded"
                        style={{
                          background: `hsl(${chainColor[h.chain]} / 0.15)`,
                          color: `hsl(${chainColor[h.chain]})`,
                        }}
                      >
                        {h.chain}
                      </span>
                    </div>
                  </td>
                  <td className="text-right px-3 py-3 font-mono text-xs text-secondary-foreground">
                    {h.balance}
                  </td>
                  <td className="text-right px-3 py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">
                    {h.price}
                  </td>
                  <td className="text-right px-3 py-3 font-mono text-xs text-foreground">
                    {h.value}
                  </td>
                  <td className="text-right px-5 py-3">
                    <span className="font-mono text-xs text-profit">
                      {h.pnl}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-1">
                      ({h.pnlPct})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Holdings;
