import { Wallet } from "lucide-react";

const wallets = [
  { address: "EQvBW5...3qfT", chain: "SOLANA", value: "$26,381.40", color: "var(--chain-solana)" },
  { address: "0xC5ce...2761", chain: "EVM", value: "$10,377.88", color: "var(--chain-ethereum)" },
];

const WalletSummary = () => {
  return (
    <div className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-2 shrink-0">
        <Wallet className="w-4 h-4 text-muted-foreground" />
        <span className="font-display font-semibold text-foreground">$36,759.28</span>
      </div>
      <span className="text-sm text-muted-foreground shrink-0">Across 2 wallets</span>
      <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
        {wallets.map((w) => (
          <div
            key={w.address}
            className="flex items-center gap-2 flex-1 justify-between sm:justify-start"
          >
            <span className="font-mono text-sm text-foreground">{w.address}</span>
            <span
              className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: `hsl(${w.color} / 0.15)`,
                color: `hsl(${w.color})`,
              }}
            >
              {w.chain}
            </span>
            <span className="text-sm text-secondary-foreground ml-auto sm:ml-2">
              → {w.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletSummary;
