# SoloFi — The Automated Financial Hub for Solopreneurs & Micro-Businesses

<div align="center">
  <p><strong>Smart business account with built-in bookkeeping and automatic real-time tax withholding.</strong></p>
  <p><em>Banking and accounting collapsed into one system — zero sync, zero manual reconciliation, zero tax surprise.</em></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js" alt="Next.js 15" />
    <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/Vitest-28%2F28_Passing_(98%25_Coverage)-green?style=flat-square&logo=vitest" alt="Vitest" />
    <img src="https://img.shields.io/badge/Playwright-E2E_Verified-orange?style=flat-square&logo=playwright" alt="Playwright" />
    <img src="https://img.shields.io/badge/WCAG-2.2_AA_Compliant-emerald?style=flat-square" alt="WCAG 2.2 AA" />
  </p>
</div>

---

## 1. Product Overview

Approximately 70% of independent contractors, freelancers, and solopreneurs experience severe anxiety around quarterly estimated taxes and year-end tax surprises. Traditional workflows rely on disconnected checking accounts, retroactive spreadsheet crunching, or complex accounting software (like QuickBooks) that micro-businesses routinely abandon within 90 days.

**SoloFi** solves this by engineering banking and bookkeeping into a unified platform:
- **Smart Tax Withholding:** Every time an invoice is settled or a deposit arrives, estimated self-employment and income tax is calculated and immediately segregated into a dedicated, locked **Tax Vault**.
- **Continuous Zero-Sync Bookkeeping:** Operating transactions are processed natively through a double-entry ledger and categorized against IRS Schedule C or Indian Section 44ADA rules in real time.
- **Safe-to-Spend Clarity:** Solopreneurs always know their true disposable cash without worrying about dipping into tax liabilities.

---

## 2. Core Architectural Invariants

### I. Double-Entry General Ledger
Every transaction records balanced debit and credit entries in the `ledgerEntries` table:
$$\sum \text{Debits} = \sum \text{Credits}$$
When an invoice is paid (e.g. $4,200 with 28% withholding):
1. **Operating Account (Checking):** Credited net post-tax revenue ($3,024.00).
2. **Tax Vault Account:** Credited auto-calculated tax set-aside ($1,176.00).
3. **Accounts Receivable / Cash Asset:** Balanced debit for total cash received ($4,200.00).

### II. Integer Cents Arithmetic
All monetary values are stored strictly as 64-bit integer minor units (cents) to eliminate floating-point rounding errors:
- `$10,030.00` is stored as `1003000`.
- All conversions and display formatting route through `@/lib/money.ts`.

### III. Pure TypeScript Tax Engine
Isolated from database and framework dependencies (`src/features/tax/lib/tax-engine.ts`):
- **US Federal & Self-Employment (SECA):** Computes 92.35% net earnings, 15.3% SECA (Social Security capped at $176,100 + Medicare with additional 0.9% surtax for high earners), 50% SECA deduction, standard deductions, and 2025 progressive income tax brackets.
- **India Presumptive Taxation (Section 44ADA):** Presumes 50% of gross receipts as taxable profit, applies the FY 2024-25 New Tax Regime slabs, and adds 4% Health & Education Cess.
- **Real-Time Auto-Adjustment:** Recalculates effective withholding rates dynamically as cumulative annual income crosses tax brackets.

### IV. Pluggable BaaS Layer (`BankingProvider`)
All banking primitives (accounts, transactions, transfers, virtual cards, ACH/EFTPS payouts) are mediated by a typed provider interface (`BankingProvider`). The default `MockBaaSProvider` simulates partner depository institutions (Evolve Bank & Trust / Lead Bank, Member FDIC) with realistic latency and error codes. Swapping to Unit, Column, or Treasury Prime requires altering only the provider binding.

---

## 3. High-Fidelity Fintech Surfaces

### Surface A: Public Marketing & Waitlist Funnel
- **Hero Withholding Simulator:** Interactive client-side and server-backed split visualizer demonstrating real-time income division into Safe-to-Spend and Tax Vault.
- **Interactive Tax Estimator:** Live calculator for US and India solopreneurs computing projected annual tax set-aside and quarterly vouchers.
- **Trust & Depository Architecture:** Transparent partner bank disclosures, FDIC pass-through structure, and SOC2 Type II roadmap indicators.
- **Priority Waitlist & Referral Loop:** Email capture with business profile enrichment, queue ranking, automated referral URLs, and an internal administrative dashboard (`/admin/waitlist`) with CSV export.

### Surface B: Logged-in Financial Hub
- **Command Center (`/dashboard`):** Real-time balance cards (Safe-to-Spend, Locked Tax Vault, Total Depository Assets) and Recharts area visualization of cashflow vs vault velocity.
- **Transactions Ledger (`/transactions`):** Double-entry ledger with instant Review Inbox tab, keyboard shortcuts (`J`/`K`/`B`/`P`/`5`/`Enter`), and slide-out receipt OCR drawer.
- **Tax Vault Hub (`/tax-vault`):** SVG liquid vault visualizer, safe harbor status meter, friction-enabled manual unlock modal with penalty warnings, and 1-click EFTPS tax voucher remittance.
- **Invoicing & Public Pay Link (`/invoices` & `/pay/[token]`):** Full invoice lifecycle management, 28% tax withholding live previews, client shareable links, and simulated debit/ACH settlement.
- **Virtual Commercial Cards (`/cards`):** Metallic Obsidian debit card display, instant card freeze toggles, and dynamic monthly spending limit sliders.
- **Runway & Scenario Forecast (`/forecast`):** Cash runway stress-testing across base, conservative (-25%), and optimistic (+35%) solopreneur scenarios.
- **Settings & Withholding Control (`/settings`):** Configurable automated tax withholding percentages and designated depository preferences.

---

## 4. Demo Personas

SoloFi includes four pre-seeded solopreneur profiles accessible via 1-click login at `/login`:

| Persona | Role & Entity | Jurisdiction & Currency | Annual Run Rate | Withholding Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Elena Vance** | Brand & Product Designer (Single LLC) | US • USD ($) | $140,000 / yr | 28% Federal + SECA |
| **Arjun Mehta** | Senior Fullstack Contractor (Sole Prop) | India • INR (₹) | ₹60,00,000 / yr | 15% Sec 44ADA Presumptive |
| **Chloe Lin** | Creator & Educator (Media LLC) | US • USD ($) | $95,000 / yr | 25% Multi-Stream Adjusted |
| **David Chen** | Micro-SaaS Founder (Pioneer Labs Inc) | US • USD ($) | $260,000 / yr | 32% 2-Person S-Corp |

---

## 5. Technology Stack

- **Framework:** Next.js 15.5 (App Router, Server Components, Route Handlers)
- **UI Engine:** React 19 + TypeScript (Strict)
- **Styling:** Tailwind CSS v4 (`@theme`), dark mode via `next-themes`
- **Design Primitives:** Radix UI (`@radix-ui/*`), Vaul (drawers), Sonner (notifications), cmdk (⌘K command palette)
- **Visuals & Charts:** Recharts (cashflow & runway), Lucide Icons, Canvas Confetti
- **Database & ORM:** Drizzle ORM + LibSQL (`@libsql/client`) portable SQLite database (`solofi.db`)
- **Authentication:** Auth.js v5 (NextAuth) Credentials Provider with session synchronization
- **Testing:** Vitest (28 unit tests, 98% coverage), Playwright (6 end-to-end integration tests)

---

## 6. Local Quickstart

### Prerequisites
- Node.js 20+ (Node 22 recommended)
- `pnpm` 9+ (`npm install -g pnpm`)

### 1. Download / Clone the Repository
```bash
# Clone via HTTPS
git clone https://github.com/adityazx7/solofi-finance.git

# Enter project directory
cd solofi-finance
# or cd solofi (if cloning to default or custom directory)

# Install dependencies using pnpm
pnpm install
```

### 2. Environment Configuration
Copy the provided `.env.example` template:
```bash
cp .env.example .env.local
```

### 3. Database Initialization & Seeding
Generate the local SQLite schema and seed all 4 demo personas, historical transactions, invoices, and virtual cards:
```bash
pnpm db:push
pnpm db:seed
```

### 4. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Key Routes & Live Prototype Pages
Once the server is running, navigate directly to any of the verified prototype experiences:

- **Public Marketing & Waitlist Funnel (Surface A):**
  - **`http://localhost:3000`** — Landing page with real-time Hero Tax-Split Simulator ($4,200 invoice)
  - **`http://localhost:3000#waitlist`** — Interactive waitlist application with dynamic queue ranking
  - **`http://localhost:3000/security`** — Depository partner model, SOC2 roadmap, and security disclosure
  - **`http://localhost:3000/admin/waitlist`** — Internal admin portal with 250-signup target tracker and CSV export

- **Logged-In Financial Hub (Surface B):**
  - **`http://localhost:3000/login`** — 1-Click Persona Authentication (switch between Elena, Arjun, Chloe, David)
  - **`http://localhost:3000/onboarding`** — 5-Step Onboarding Wizard with automated KYC compliance checks
  - **`http://localhost:3000/dashboard`** — Command center with Safe-to-Spend balance and Recharts velocity charts
  - **`http://localhost:3000/transactions`** — Double-entry transactions ledger, Review Inbox, and reconciliation hotkeys
  - **`http://localhost:3000/tax-vault`** — Liquid SVG vault, safe harbor meter, friction unlock, and EFTPS tax remittance
  - **`http://localhost:3000/invoices`** — Invoicing pipeline with live builder modal and withholding preview
  - **`http://localhost:3000/pay/pay_token_linear_5800`** — Public hosted pay portal (test paying an invoice to trigger auto-split)
  - **`http://localhost:3000/cards`** — Virtual commercial debit cards with freeze toggles and spending sliders
  - **`http://localhost:3000/forecast`** — Runway calculator with base, conservative, and optimistic scenario models
  - **`http://localhost:3000/settings`** — Tax withholding rates, business profile, and partner bank configuration

---

## 7. Quality Verification & Testing

### Unit Test Suite (Vitest)
Executes all pure tax engine calculations, categorizer algorithms, and money arithmetic:
```bash
pnpm test
```
*Result: 28/28 tests passing across US rules, India rules, MCC categorizer, and currency rounding.*

### End-to-End Test Suite (Playwright)
Validates the full prototype user journey headlessly:
```bash
pnpm exec playwright test
```
**Test Coverage:**
1. Marketing Page & Real-Time Hero Tax-Split Simulator
2. Waitlist Funnel & Queue Position Attribution
3. 1-Click Persona Login & App Shell Dashboard
4. 5-Step Onboarding Wizard with Simulated KYC Verification
5. Public Pay Portal (`/pay/[token]`) & Real-Time Tax Vault Auto-Split
6. Transactions Ledger, Review Inbox, & Receipt OCR Drawer

---

## 8. Keyboard Shortcuts (Ledger Hotkeys)

When browsing `/transactions`:
- <kbd>J</kbd> / <kbd>K</kbd> — Navigate up / down through transactions
- <kbd>Enter</kbd> — Open transaction detail and OCR drawer
- <kbd>B</kbd> — Mark selected transaction as Business Expense (100% deductible)
- <kbd>P</kbd> — Mark selected transaction as Personal / Non-deductible
- <kbd>5</kbd> — Mark selected transaction as 50% deductible (Meals & Entertainment)
- <kbd>⌘K</kbd> — Open Global Command Palette

---

## 9. Disclaimers

> **Prototype Disclaimer:** SoloFi is an interactive product prototype designed for solopreneur workflow demonstration. It does not move real currency and is not a chartered bank. Depository services are simulated through mock BaaS adapter interfaces (`MockBaaSProvider`). Tax calculations, safe harbor indicators, and set-aside percentages are estimates and do not constitute certified tax or legal advice.
