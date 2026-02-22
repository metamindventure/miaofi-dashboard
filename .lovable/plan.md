

## Fix: Popover transparency issue

The "Pro Feature" popover uses the `glass-card` class which applies `rgba(255, 255, 255, 0.03)` as background — nearly transparent. The card below bleeds through.

### Solution

In `src/components/dashboard/AIDiagnosis.tsx`, replace the `glass-card` class on the popover div (line ~125) with explicit opaque styling:

- Remove `glass-card` from the popover
- Add solid dark background: `bg-[#1a1a2e]` (or similar dark color matching the theme)
- Keep `backdrop-blur`, border, rounded corners, shadow, and `z-50`
- Add `border border-[rgba(255,255,255,0.1)]` for the card edge

This ensures the popover fully covers content beneath it while still looking consistent with the dark luxe theme.

### Technical Detail

Change in `AIDiagnosis.tsx` line ~125:
```
// FROM:
className="absolute top-full left-0 mt-2 glass-card p-4 w-[280px] z-50"

// TO:
className="absolute top-full left-0 mt-2 p-4 w-[280px] z-50 bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-xl"
```

