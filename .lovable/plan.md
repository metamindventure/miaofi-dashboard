

## Analysis & Plan

### Issue 1: Retry Button Visual Confusion

Currently the Retry "button" is just styled text (`<span>`) with reduced opacity when disabled. It still looks interactive. 

**Fix**: When `credits === 0`, change Retry to plain dimmed text with a tooltip or label explaining why it's unavailable (e.g., "No credits remaining"). Remove the hover effect entirely and add `opacity-40` to make it obviously inert.

### Issue 2: ConversionNudge Placement — UX Analysis

You raise a good point. Let me think through this:

**Current placement**: Between PLHero and AIDiagnosis, as a large standalone card.

**Problems with current placement**:
- It **interrupts the diagnosis flow**. The user just saw their P&L summary and wants to see the AI insights — the nudge blocks that momentum.
- It's **competing with the diagnosis result** for attention. The spec explicitly says "the sign-in prompt should complement, not compete with" the diagnosis.
- It feels like a **gate**, not an invitation — exactly what the spec warns against.

**Better approach**: Move the conversion nudge **inside or after the AI Diagnosis section**, as a contextual inline banner. The user has already scrolled through their diagnosis insights and felt the value. At that point, "save this + get more" makes emotional sense. Specifically:

- **Remove** the standalone `ConversionNudge` card from between PLHero and AIDiagnosis.
- **Add** a compact inline nudge banner at the **bottom of the AIDiagnosis section** (before the pricing cards area), only in `anonymous-post-diagnosis` state. This is where the user has just consumed the diagnosis value and is naturally at a decision point.
- The nudge becomes a **single-row banner** with the CTA button, not a large multi-card block — lighter, less interruptive.

### Changes

**File: `src/components/dashboard/AIDiagnosis.tsx`**
- Change Retry from hover-interactive span to a clearly disabled element when `credits === 0` — use `opacity-30`, no cursor change, no hover styles
- Add an inline conversion nudge banner at the bottom of the diagnosis section (before pricing cards) for `anonymous-post-diagnosis` state, with a compact "Sign in to save & unlock 2 more" CTA

**File: `src/pages/Index.tsx`**
- Remove `<ConversionNudge />` from the main layout flow

**File: `src/components/dashboard/ConversionNudge.tsx`**
- Can be kept for reference or deleted; its content moves inline into AIDiagnosis

