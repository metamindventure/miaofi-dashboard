

## 3 Dynamic Background Design Proposals

The current background is a flat dark color (`hsl(240, 33%, 4%)`). Here are 3 proposals ranked by visual impact, all following the "Dark Luxe" aesthetic and trends from leading crypto/fintech products (Linear, Stripe, Phantom, Rainbow Wallet).

---

### Option A: Animated Mesh Gradient (Recommended)

Inspired by: **Stripe, Phantom Wallet, Vercel**

A slow-moving, blurred mesh gradient using 2-3 large radial gradients that drift subtly via CSS keyframe animation. Colors pulled from the brand palette (deep purple, teal, dark blue).

- 2-3 large `div` elements with radial gradients, positioned absolutely behind content
- Each blob animates on a slow loop (20-30s) with `translate` and slight `scale` changes
- Heavy `blur(100px+)` and low opacity (0.08-0.12) to keep it subtle
- Pure CSS, no JS, no performance cost

Visual effect: Soft, living aurora of brand colors gently shifting behind the dashboard.

---

### Option B: Dot Grid with Radial Fade

Inspired by: **Linear, Raycast, Cal.com**

A subtle dot grid pattern that fades out radially from center, giving depth without movement. Combined with a soft radial gradient overlay in brand purple.

- CSS `radial-gradient` for the dot pattern (1px dots, ~24px spacing)
- A large radial gradient overlay fading from subtle purple at center to transparent
- Optional: very slow `background-position` animation for gentle drift
- Extremely lightweight, purely CSS

Visual effect: Technical, precise feel with depth -- fits the "Bloomberg designed by Apple" vision.

---

### Option C: Noise Texture + Gradient Sweep

Inspired by: **Arc Browser, Figma, Midjourney**

A fine noise/grain texture overlay combined with a diagonal gradient sweep that shifts slowly between brand colors.

- SVG noise filter applied as a pseudo-element with low opacity (0.03-0.05)
- Background uses a large `linear-gradient` that animates its angle or position over 30-60s
- Colors: deep navy to dark purple to near-black
- Adds organic texture that breaks the "flat screen" feel

Visual effect: Cinematic, premium feel with subtle grain -- like a high-end product launch page.

---

### Implementation Notes

- All 3 options are pure CSS (Option C uses an inline SVG filter for noise)
- Changes limited to `src/index.css` and possibly `src/pages/Index.tsx` for the gradient blobs (Option A)
- No new dependencies needed
- All respect the existing glass-card and glassmorphism design language
- Performance impact is negligible

Pick one (or a combination) and I will implement it.

