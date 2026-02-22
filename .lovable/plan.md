

## Improve muted text readability with Soft Lavender

Update the `--muted-foreground` CSS variable in `src/index.css` from `245 15% 50%` to `245 15% 65%`, shifting the color from `#6b6b80` to approximately `#9494AB`. This increases contrast against the dark background while keeping a cool lavender tone that complements the brand purple accent.

### Changes

**File: `src/index.css`** (line 24)
- Change `--muted-foreground: 245 15% 50%;` to `--muted-foreground: 245 15% 65%;`

That single variable controls all muted/secondary text across the app (labels, timestamps, disclaimers, chip text, footer links, etc.), so every instance will update automatically.

