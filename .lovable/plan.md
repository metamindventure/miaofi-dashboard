

## Dynamic period label in PLHero

Update the "Estimated P&L · Past 30 Days" label in `src/components/dashboard/PLHero.tsx` to reflect the selected time period.

### Changes

**File: `src/components/dashboard/PLHero.tsx`**

Create a mapping from `activePeriod` to label text, then use it in the label:

- `1D` → "Past 1 Day"
- `7D` → "Past 7 Days"  
- `30D` → "Past 30 Days"

Replace the hardcoded string `"Estimated P&L · Past 30 Days"` (around line 63) with a dynamic expression using `activePeriod`.

```tsx
const periodLabels: Record<string, string> = {
  "1D": "Past 1 Day",
  "7D": "Past 7 Days",
  "30D": "Past 30 Days",
};

// In JSX:
<span className="label-uppercase">Estimated P&L · {periodLabels[activePeriod]}</span>
```

Single file, minimal change.

