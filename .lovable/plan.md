

## Plan: Convert AI Diagnosis into Collapsible "Portfolio Analysis" Card

### UX Assessment

The user's instinct is correct. Currently the dashboard shows TBA (collapsible) followed by a High Risk banner + 4 diagnosis cards all expanded — it's visually overwhelming. Making Portfolio Analysis collapsible mirrors the TBA pattern, creating a consistent "summary → drill down" interaction model. Users scan two compact summary cards, then expand whichever interests them.

### What Changes

**1. Restructure `AIDiagnosis.tsx` into a collapsible "Portfolio Analysis" card**

Follow the exact same pattern as `TradingBehaviorAnalysis.tsx`:

- **Collapsed state (default)** — A single `glass-card` button showing:
  - Header row: Brain icon + "Portfolio Analysis" title + risk score badge (e.g., "High Risk · 7/10") with red styling + ChevronDown
  - Summary line: "71.8% concentrated in Solana tokenized stocks with idle stablecoins" (the current High Risk banner text)
  - Key stats row: "Issues Found: 4", "Critical: 1", "At Risk: ~$6,698" (similar to TBA's Trades/Win Rate/Avg Hold)
  - Collapsed footer: "Insights detected (4)" + severity dots + chevron hint

- **Expanded state** — Shows the existing InsightCards, conversion nudge, and paywall CTA below the header card

**2. Remove the standalone "High Risk" banner** — Its content is absorbed into the collapsed summary.

**3. Remove the separate header row** (Brain icon, "AI Diagnosis", credits counter, risk ring) — Merge the title and credits display into the collapsible card header. The risk ring moves into the header row as a compact badge.

**4. Keep everything else unchanged** — InsightCard component, paywall section, conversion nudge, TradingBehaviorAnalysis import all stay as-is.

### Technical Details

- Rename section header from "AI Diagnosis" to "Portfolio Analysis"
- Add `expanded` state (default `false`)
- Collapsed card structure mirrors TBA: single `<button>` with `glass-card p-5`, onClick toggles expanded
- The credits counter (Zap icon + credits/total), retry button, "Powered by Claude", and response time move into the header row of the collapsible card
- Risk score displayed as a badge (like TBA's "total behavior cost" badge) instead of a standalone ring — e.g., red-bordered pill showing "High Risk · 7/10"
- When expanded, all existing content renders below in a `<div className="space-y-4 pt-4">` — identical to TBA's expanded pattern
- TradingBehaviorAnalysis remains rendered BEFORE the Portfolio Analysis card (current order preserved)

### File Changes

- **`src/components/dashboard/AIDiagnosis.tsx`** — Major restructure of the outer wrapper; InsightCard component untouched

