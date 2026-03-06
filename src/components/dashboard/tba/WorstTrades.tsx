import { Skull, ArrowRight } from "lucide-react";
import { WorstTrade } from "./types";

const WorstTradeCard = ({ trade, rank }: { trade: WorstTrade; rank: number }) => (
  <div className="glass-card p-4 md:p-5 relative overflow-hidden">
    {/* Rank badge */}
    <div className="absolute top-3 right-4 text-[40px] font-display font-black text-foreground/[0.04] leading-none select-none">
      #{rank}
    </div>

    <div className="flex items-start gap-3 mb-3">
      <div className="w-8 h-8 rounded-lg bg-loss/10 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-loss font-mono">#{rank}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-display font-semibold text-[15px] text-foreground">{trade.asset}</h4>
          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
            trade.status === "sold" ? "text-muted-foreground bg-secondary" : "text-warning bg-warning/10"
          }`}>
            {trade.status === "sold" ? "CLOSED" : "STILL HOLDING"}
          </span>
          {trade.linkedPatternLabel && (
            <span className="text-[10px] text-loss/80 bg-loss/8 px-1.5 py-0.5 rounded flex items-center gap-1">
              <ArrowRight className="w-2.5 h-2.5" />
              {trade.linkedPatternLabel}
            </span>
          )}
        </div>

        {/* Trade details */}
        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground flex-wrap">
          <span>{trade.buyDate}</span>
          <span className="text-border">•</span>
          <span>{trade.amount} @ {trade.buyPrice}</span>
          {trade.sellDate && (
            <>
              <span className="text-border">→</span>
              <span>Sold @ {trade.sellPrice} on {trade.sellDate}</span>
            </>
          )}
        </div>
      </div>
    </div>

    {/* Loss display */}
    <div className="flex items-end justify-between mb-3">
      <div>
        <span className="text-2xl font-bold font-mono text-loss tabular-nums">
          -${Math.abs(trade.lossAmount).toLocaleString()}
        </span>
        <span className="text-sm text-loss/70 font-mono ml-2">
          ({trade.lossPercent}%)
        </span>
      </div>
    </div>

    {/* Comment */}
    <p className="text-xs text-secondary-foreground leading-relaxed italic border-l-2 border-border pl-3">
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
    <div className="grid gap-3">
      {trades.map((trade, i) => (
        <WorstTradeCard key={trade.id} trade={trade} rank={i + 1} />
      ))}
    </div>
  </div>
);

export default WorstTrades;
