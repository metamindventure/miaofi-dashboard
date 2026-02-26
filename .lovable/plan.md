

## Trading Behavior Analysis Module

### Placement
Between **Portfolio Bento Grid** and **Wallet Summary** -- this is the natural spot for behavioral insights after users have seen their portfolio composition but before diving into wallet/holdings details. The layout order becomes: P&L Hero, AI Diagnosis, Share Strip, Portfolio Bento, **Trading Behavior**, Wallets, Holdings, Footer.

### Design

**Structure**: A collapsible `glass-card` (same pattern as Holdings component) that defaults to **folded** state. The collapsed header shows:
- Icon (Activity or TrendingUp) + "Trading Behavior" title
- A fun emoji-based "trader persona" badge (e.g. "Diamond Hands", "Paper Hands", "Dip Buyer")
- A one-line AI summary visible even when collapsed (e.g. "You tend to buy high and sell low -- classic FOMO trader")
- ChevronRight that rotates on expand

**Expanded Content**:

1. **Persona Card** -- A highlighted banner with the user's "trader type" emoji + name + witty description (providing emotional value). Examples:
   - "FOMO Fred" -- "You bought 73% of assets within 24h of their local peak"
   - "Diamond Hands" -- "Average hold time: 47 days. You don't flinch"
   - "Profit Sniper" -- "You took profits on 4/6 winning trades before reversals"

2. **Behavior Breakdown** -- A list of 4-5 behavioral traits with progress bars and labels:
   - "Chasing Pumps" (追涨) -- frequency score with bar
   - "Panic Selling" (杀跌) -- frequency score with bar  
   - "Taking Profits" (及时止盈) -- score
   - "Cutting Losses" (及时止损) -- score
   - "Buy & Hold" (长期持有) -- score
   
   Each bar is color-coded: green for good behaviors, orange/red for risky ones.

3. **AI Summary** -- A short paragraph of personalized commentary written in a fun, slightly snarky but supportive tone.

4. **Time Period Tabs** -- "30D / 90D / All Time" toggle to switch analysis periods.

### Technical Details

- New file: `src/components/dashboard/TradingBehavior.tsx`
- Uses same collapsible pattern as `Holdings.tsx` (useState + maxHeight transition)
- Mock/hardcoded data (no backend)
- Add to `Index.tsx` between `PortfolioBento` and `WalletSummary`
- Uses existing design tokens: `glass-card`, `section-header`, `glass-chip`, severity colors
- Behavior scores rendered with colored progress bars using inline styles (same approach as chain distribution bars in PortfolioBento)
- Time period selector uses `glass-chip` styled buttons with active state

