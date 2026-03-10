import { Wallet } from "lucide-react";

const wallets = [
  { address: "EQvBW5...3qfT", chain: "SOLANA", value: "$26,381.40", color: "var(--chain-solana)" },
  { address: "0xC5ce...2761", chain: "EVM", value: "$10,377.88", color: "var(--chain-ethereum)" },
  { address: "0x7a3F...e9B2", chain: "OPTIMISM", value: "$3,141.00", color: "var(--chain-optimism)" },
  { address: "0xdE42...a1C7", chain: "ARBITRUM", value: "$697.00", color: "var(--chain-arbitrum)" },
  { address: "bnb1q...x8f4", chain: "BSC", value: "$48.00", color: "var(--chain-bsc)" },
];

const WalletSummary = () => {
  return (
    <div className="glass-card p-5">
      {/* Top row: Total value + wallet count */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Total Portfolio Value
          </span>
        </div>
        <span className="font-display font-bold text-lg text-foreground">$36,759.28</span>
        <span className="text-xs text-muted-foreground">
          Across {wallets.length} wallet{wallets.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Wallet grid — adapts to any count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {wallets.map((w) => (
          <div
            key={w.address}
            className="flex items-center gap-2 rounded-lg px-3 py-2 bg-secondary/30"
          >
            <span className="font-mono text-sm text-foreground truncate">{w.address}</span>
            <span
              className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{
                background: `hsl(${w.color} / 0.15)`,
                color: `hsl(${w.color})`,
              }}
            >
              {w.chain}
            </span>
            <span className="text-sm text-secondary-foreground ml-auto shrink-0">
              → {w.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletSummary;
