

## Redesign NavBar following UI/UX best practices

The current navbar has several issues:
- "Sign Out" exposed as a top-level text button (should be tucked inside an avatar/user menu)
- Truncated wallet address displayed as plain text with no interaction
- Language selector, wallet, and sign-out all sit in a flat row with no visual hierarchy
- On mobile, these items are completely hidden

### Design approach (following patterns from crypto/DeFi dashboards like Zerion, DeBank, Zapper)

**Left side**: Logo + brand name (unchanged)

**Right side**, from left to right:
1. **Language selector** -- kept as a small ghost button with chevron
2. **Upgrade to Pro** -- gradient CTA pill (unchanged)
3. **User avatar dropdown** -- a clickable avatar chip showing the truncated wallet address; clicking opens a dropdown menu containing:
   - Wallet address (copyable)
   - Settings (placeholder)
   - Sign Out

This moves "Sign Out" into a user dropdown (standard pattern), gives the wallet address a proper interactive home, and keeps the navbar clean.

### Technical changes

**File: `src/components/dashboard/NavBar.tsx`**
- Import `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator` from the existing `@/components/ui/dropdown-menu`
- Import `Avatar`, `AvatarFallback` from `@/components/ui/avatar`
- Import additional icons: `LogOut`, `Copy`, `Settings`, `Globe` from lucide-react
- Replace the flat right-side items with:
  1. A `Globe` icon ghost button for language (hidden on mobile, tooltip-style)
  2. The "Upgrade to Pro" CTA (unchanged)
  3. A `DropdownMenu` wrapping an `Avatar` trigger (small, 32px, showing wallet initials "0x") that opens a menu with:
     - Label showing full-ish wallet address + copy button
     - Separator
     - "Settings" item
     - "Sign Out" item (with `LogOut` icon, styled subtly in muted-foreground)
- On mobile, the avatar dropdown remains visible (solving the current hidden-on-mobile problem)

No new files needed; only `NavBar.tsx` changes.

