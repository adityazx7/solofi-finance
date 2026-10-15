# SoloFi Design Tokens & Aesthetic System

> **Aesthetic Philosophy:** "Calm Confidence."  
> Premium, quiet, trustworthy, warm editorial finance. Generous whitespace, razor-sharp typography, restrained color, and one memorable signature element: the **Tax Vault**.

---

## 1. Color Palette

### 1.1 Neutrals (Warm Greys & Deep Inks)
- **Light Surface (`--background`):** `#FAFAF7` (warm tinted paper, not clinical white)
- **Light Cards (`--card`):** `#FFFFFF` with subtle 1px border `#E4E4DC`
- **Light Elevated (`--surface-elevated`):** `#F8F8F4`
- **Dark Surface (`--background`):** `#0B0D10` (deep ink, avoid blue saturation)
- **Dark Cards (`--card`):** `#12151B` with subtle 1px hairline border `#222834`
- **Dark Elevated (`--surface-elevated`):** `#161B24`

### 1.2 Brand Primary (Emerald / Teal)
- **Light Primary:** `#059669` (rich botanical emerald, conveys safety & growth)
- **Dark Primary:** `#10B981` (high-clarity luminescent emerald)
- **Primary Foreground:** `#FFFFFF` (light) / `#042F24` (dark)

### 1.3 Signature Accent (Tax Vault Amber / Gold)
Reserved strictly for the Tax Vault, withholding progress, and caution/tax indicators.
- **Light Vault Gold:** `#D97706` (deep amber)
- **Light Vault Tint:** `#FEF3C7` (soft warm gold highlight)
- **Dark Vault Gold:** `#F59E0B` (luminous gold)
- **Dark Vault Tint:** `rgba(245, 158, 11, 0.12)`

### 1.4 Semantic Values
- **Income / Positive Delta:** `#059669` (light) / `#10B981` (dark)
- **Expense / Operating Outflow:** `#334155` (light) / `#94A3B8` (dark) — *deliberately avoids aggressive red for standard spending*
- **Critical / Danger:** `#E11D48` (light) / `#F43F5E` (dark)

---

## 2. Typography & Numerals

- **Display & UI Sans:** Geist Sans (or system sans-serif with tight tracking `-0.02em` on headings)
- **Financial & Data Mono:** Geist Mono with forced `tabular-nums`
- **Rule:** Every currency amount, percentage, date, and invoice number MUST use `tabular-nums` to guarantee vertical decimal alignment across ledgers and summary cards.

---

## 3. Radii & Spacing Grid

- **Card Radius:** `14px` (`rounded-2xl` / `0.875rem`)
- **Control / Button Radius:** `10px` (`rounded-xl` / `0.625rem`)
- **Badge / Pill Radius:** `9999px` (`rounded-full`)
- **Spacing Grid:** 8pt base (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`)
- **Hairlines:** 1px solid borders (`var(--border)`) on all elevated containers.

---

## 4. Motion Guidelines

- **Standard Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (spring-settle)
- **Duration:** 180ms – 250ms for interactive hovers and state changes
- **Signature Transitions:**
  - Split animation: Coin/particle splitting off from incoming gross deposit into the Tax Vault bucket.
  - Count-up digit roll: Balances animate from previous value to new value on updates.
