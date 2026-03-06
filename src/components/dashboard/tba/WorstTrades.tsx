import { Skull, ArrowRight } from "lucide-react";
import { WorstTrade } from "./types";

const WorstTradeCard = ({ trade, rank }: { trade: WorstTrade; rank: number }) => (
  <div className="glass-card p-4 relative overflow-hidden flex-1 min-w-[260px]">
    {/* Rank badge */}
    <div className="absolute top-3 right-4 text-[40px] font-display font-black text-foreground/[0.04] leading-none select-none">
      #{rank}
    </div>

    <div className="flex items-start gap-2.5 mb-2.5">
      <div className="w-7 h-7 rounded-lg bg-loss/10 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-loss font-mono">#{rank}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-display font-semibold text-sm text-foreground">{trade.asset}</h4>
          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
            trade.status === "sold" ? "text-muted-foreground bg-secondary" : "text-warning bg-warning/10"
          }`}>
            {trade.status === "sold" ? "CLOSED" : "STILL HOLDING"}
          </span>
        </div>
        {trade.linkedPatternLabel && (
          <span className="text-[10px] text-loss/80 bg-loss/8 px-1.5 py-0.5 rounded inline-flex items-center gap-1 mt-1">
            <ArrowRight className="w-2.5 h-2.5" />
            {trade.linkedPatternLabel}
          </span>
        )}
      </div>
    </div>

    {/* Trade details */}
    <div className="text-[11px] text-muted-foreground mb-2 leading-relaxed">
      <span>{trade.buyDate}</span>
      <span className="text-border mx-1">•</span>
      <span>{trade.amount} @ {trade.buyPrice}</span>
      {trade.sellDate && (
        <>
          <br />
          <span className="text-border">→</span>{" "}
          <span>Sold @ {trade.sellPrice} on {trade.sellDate}</span>
        </>
      )}
    </div>

    {/* Loss display */}
    <div className="mb-2.5">
      <span className="text-xl font-bold font-mono text-loss tabular-nums">
        -${Math.abs(trade.lossAmount).toLocaleString()}
      </span>
      <span className="text-xs text-loss/70 font-mono ml-1.5">
        ({trade.lossPercent}%)
      </span>
    </div>

    {/* Comment */}
    <p className="text-[11px] text-secondary-foreground leading-relaxed italic border-l-2 border-border pl-2.5">
      "{trade.comment}"
    </p>
  </div>
);

const WorstTrades = ({ trades }: { trades: WorstTrade[] }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2.5">
      <Skull className="w-[18px] h-[18px] text-loss" />
      <h3 className="font-display font-semibold text-[15px] text-foreground">Worst Trades</h3>
      <span className="text-[11px] text-muted-foreground">Top {trades.length} losses</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {trades.map((trade, i) => (
        <WorstTradeCard key={trade.id} trade={trade} rank={i + 1} />
      ))}
    </div>
  </div>
);

export default WorstTrades;
