# SoloFi Recommended Fintech Typography

The SoloFi fintech interface relies on sharp, high-legibility typefaces matching top-tier products like Mercury, Stripe, and Ramp.

## 1. Headings & Body Typefaces
- **Geist Sans (Primary):** Integrated natively via `next/font/google` (`Geist`)
- **Inter:** Available via Google Fonts: `https://fonts.google.com/specimen/Inter`
- **Plus Jakarta Sans:** `https://fonts.google.com/specimen/Plus+Jakarta+Sans`
- **DM Sans:** `https://fonts.google.com/specimen/DM+Sans`

## 2. Tabular Currency & Number Fonts (Mono)
- **Geist Mono (Default in SoloFi):** Ensures all numbers and ledger dollar values align vertically with zero jitter during live animations.
- **JetBrains Mono:** Available via Google Fonts: `https://fonts.google.com/specimen/JetBrains+Mono`

## 3. Quick CSS Import (if using external fonts)
```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;900&family=Geist+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
```
