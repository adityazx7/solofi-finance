import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

const targetDir = path.resolve(process.cwd(), 'assets/mockups');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const MOCKUPS = {
  'macbook-mockup-dark': {
    w: 1000,
    h: 620,
    svg: `
      <svg viewBox="0 0 1000 620" width="1000" height="620" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mac-bezel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1E293B" />
            <stop offset="100%" stop-color="#0F172A" />
          </linearGradient>
          <linearGradient id="mac-base" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#334155" />
            <stop offset="100%" stop-color="#1E293B" />
          </linearGradient>
          <filter id="mac-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="28" stdDeviation="30" flood-color="#000000" flood-opacity="0.45" />
          </filter>
        </defs>
        <g filter="url(#mac-shadow)">
          <!-- Screen Display Lid -->
          <rect x="130" y="40" width="740" height="480" rx="20" fill="url(#mac-bezel)" stroke="#475569" stroke-width="2" />
          <circle cx="500" cy="54" r="3.5" fill="#0284C7" /> <!-- Camera -->

          <!-- Display Screen Inside -->
          <rect x="146" y="66" width="708" height="440" rx="8" fill="#0B0D10" />
          
          <!-- SoloFi Dashboard UI inside MacBook -->
          <!-- Topbar -->
          <rect x="146" y="66" width="708" height="38" fill="#13171F" />
          <circle cx="166" cy="85" r="5" fill="#EF4444" />
          <circle cx="180" cy="85" r="5" fill="#F59E0B" />
          <circle cx="194" cy="85" r="5" fill="#10B981" />
          <text x="220" y="89" font-family="system-ui, sans-serif" font-weight="bold" font-size="12" fill="#FFFFFF">SoloFi Financial Hub — Operating Checking</text>

          <!-- Sidebar -->
          <rect x="146" y="104" width="150" height="402" fill="#0E1116" />
          <text x="166" y="136" font-family="sans-serif" font-weight="bold" font-size="11" fill="#10B981">● DASHBOARD</text>
          <text x="166" y="166" font-family="sans-serif" font-size="11" fill="#94A3B8">Transactions (1 to review)</text>
          <text x="166" y="196" font-family="sans-serif" font-size="11" fill="#94A3B8">Tax Vault (Auto-Split)</text>
          <text x="166" y="226" font-family="sans-serif" font-size="11" fill="#94A3B8">Invoices & Pay</text>
          <text x="166" y="256" font-family="sans-serif" font-size="11" fill="#94A3B8">Virtual Cards</text>

          <!-- Safe-to-Spend Pill in Sidebar -->
          <rect x="160" y="430" width="122" height="50" rx="8" fill="#161C24" stroke="#10B981" stroke-width="1" />
          <text x="170" y="450" font-family="sans-serif" font-size="9" fill="#94A3B8">SAFE-TO-SPEND</text>
          <text x="170" y="468" font-family="monospace" font-weight="bold" font-size="14" fill="#10B981">$10,030.00</text>

          <!-- Main Dashboard Cards -->
          <rect x="316" y="124" width="250" height="90" rx="10" fill="#13171F" stroke="#232B38" />
          <text x="332" y="150" font-family="sans-serif" font-size="11" fill="#94A3B8">Available Operating Cash</text>
          <text x="332" y="184" font-family="monospace" font-weight="bold" font-size="24" fill="#FFFFFF">$10,030.00</text>

          <rect x="586" y="124" width="248" height="90" rx="10" fill="#13171F" stroke="#F59E0B" stroke-width="1" />
          <text x="602" y="150" font-family="sans-serif" font-size="11" fill="#F59E0B">Locked Tax Vault (28% set aside)</text>
          <text x="602" y="184" font-family="monospace" font-weight="bold" font-size="24" fill="#F59E0B">$4,820.00</text>

          <!-- Chart Area inside Macbook -->
          <rect x="316" y="230" width="518" height="170" rx="10" fill="#13171F" stroke="#232B38" />
          <text x="332" y="256" font-family="sans-serif" font-weight="bold" font-size="12" fill="#FFFFFF">Cashflow & Tax Velocity</text>
          <path d="M 340 370 Q 440 330 520 300 T 700 280 T 810 260" fill="none" stroke="#10B981" stroke-width="3" />
          <path d="M 340 380 Q 440 360 520 340 T 700 330 T 810 310" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-dasharray="4 4" />

          <!-- Base Chasis & Trackpad Notch -->
          <path d="M 60 520 L 940 520 L 910 534 L 90 534 Z" fill="url(#mac-base)" />
          <rect x="440" y="520" width="120" height="6" rx="3" fill="#64748B" />
        </g>
      </svg>
    `
  },

  'browser-frame-mockup': {
    w: 960,
    h: 600,
    svg: `
      <svg viewBox="0 0 960 600" width="960" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="bf-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#000000" flood-opacity="0.3" />
          </filter>
        </defs>
        <g filter="url(#bf-shadow)">
          <!-- Window Body -->
          <rect x="40" y="30" width="880" height="540" rx="16" fill="#0B0D10" stroke="#1E293B" stroke-width="2" />
          <!-- Browser Header Bar -->
          <rect x="40" y="30" width="880" height="46" fill="#13171F" rx="16" />
          <rect x="40" y="60" width="880" height="16" fill="#13171F" />

          <!-- Window Controls -->
          <circle cx="66" cy="53" r="6" fill="#EF4444" />
          <circle cx="84" cy="53" r="6" fill="#F59E0B" />
          <circle cx="102" cy="53" r="6" fill="#10B981" />

          <!-- URL Bar -->
          <rect x="180" y="41" width="600" height="26" rx="7" fill="#0B0D10" stroke="#232B38" />
          <text x="200" y="58" font-family="monospace" font-size="11" fill="#10B981">🔒 https://solofi.app/dashboard</text>

          <!-- Inside View: Landing / App Preview -->
          <rect x="42" y="78" width="876" height="490" fill="#0B0D10" />

          <!-- Hero Headline preview -->
          <text x="80" y="160" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF">Never get surprised by taxes again.</text>
          <text x="80" y="196" font-family="system-ui, sans-serif" font-size="16" fill="#94A3B8">Smart business checking with built-in bookkeeping & automated tax withholding.</text>

          <!-- Hero Buttons -->
          <rect x="80" y="230" width="170" height="46" rx="10" fill="#10B981" />
          <text x="165" y="258" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF">Join the Waitlist →</text>

          <rect x="264" y="230" width="160" height="46" rx="10" fill="#1E293B" stroke="#334155" />
          <text x="344" y="258" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF">Try Live Demo</text>

          <!-- Floating Interactive Card inside Frame -->
          <rect x="80" y="320" width="800" height="200" rx="14" fill="#13171F" stroke="#1E293B" />
          <text x="110" y="356" font-family="sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF">Simulate Invoice Auto-Split Engine</text>
          <text x="110" y="380" font-family="monospace" font-size="12" fill="#64748B">When $4,200 arrives from client:</text>
          
          <rect x="110" y="400" width="360" height="80" rx="10" fill="#0E1116" stroke="#10B981" stroke-width="1" />
          <text x="130" y="430" font-family="sans-serif" font-size="12" fill="#94A3B8">Operating Account (Safe-to-Spend 72%)</text>
          <text x="130" y="460" font-family="monospace" font-weight="bold" font-size="20" fill="#10B981">+$3,024.00</text>

          <rect x="490" y="400" width="360" height="80" rx="10" fill="#0E1116" stroke="#F59E0B" stroke-width="1" />
          <text x="510" y="430" font-family="sans-serif" font-size="12" fill="#94A3B8">Tax Vault (Estimated Tax 28%)</text>
          <text x="510" y="460" font-family="monospace" font-weight="bold" font-size="20" fill="#F59E0B">+$1,176.00</text>
        </g>
      </svg>
    `
  },

  'iphone-15-mockup': {
    w: 420,
    h: 780,
    svg: `
      <svg viewBox="0 0 420 780" width="420" height="780" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ph-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#475569" />
            <stop offset="50%" stop-color="#1E293B" />
            <stop offset="100%" stop-color="#0F172A" />
          </linearGradient>
          <filter id="ph-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="28" stdDeviation="28" flood-color="#000000" flood-opacity="0.4" />
          </filter>
        </defs>
        <g filter="url(#ph-shadow)">
          <!-- Outer Phone Chassis -->
          <rect x="40" y="20" width="340" height="740" rx="54" fill="#0B0D10" stroke="url(#ph-border)" stroke-width="6" />

          <!-- Display Screen -->
          <rect x="52" y="32" width="316" height="716" rx="46" fill="#0F172A" />

          <!-- Dynamic Island Pill -->
          <rect x="160" y="46" width="100" height="26" rx="13" fill="#000000" />
          <circle cx="240" cy="59" r="4.5" fill="#0284C7" /> <!-- Camera lens -->

          <!-- Mobile SoloFi Screen Header -->
          <text x="76" y="115" font-family="sans-serif" font-size="11" fill="#94A3B8">VANCE STUDIO DESIGN</text>
          <text x="76" y="140" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF">Financial Hub</text>

          <!-- Safe-to-Spend Big Card -->
          <rect x="68" y="160" width="284" height="150" rx="18" fill="#13171F" stroke="#10B981" stroke-width="1.5" />
          <text x="88" y="195" font-family="sans-serif" font-size="12" fill="#94A3B8">Safe-to-Spend Balance</text>
          <text x="88" y="240" font-family="monospace" font-weight="bold" font-size="34" fill="#10B981">$10,030</text>
          <text x="88" y="280" font-family="sans-serif" font-size="11" fill="#64748B">🛡️ Tax Vault Locked: $4,820</text>

          <!-- Quick Action Buttons -->
          <rect x="68" y="326" width="86" height="44" rx="12" fill="#1E293B" />
          <text x="111" y="352" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF">Send $</text>

          <rect x="167" y="326" width="86" height="44" rx="12" fill="#10B981" />
          <text x="210" y="352" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF">+ Invoice</text>

          <rect x="266" y="326" width="86" height="44" rx="12" fill="#1E293B" />
          <text x="309" y="352" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFFFFF">Cards</text>

          <!-- Recent Transactions -->
          <text x="76" y="410" font-family="sans-serif" font-weight="bold" font-size="13" fill="#FFFFFF">Recent Activity</text>

          <rect x="68" y="426" width="284" height="60" rx="12" fill="#13171F" />
          <circle cx="94" cy="456" r="14" fill="#10B981" fill-opacity="0.15" />
          <text x="94" y="460" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#10B981">↓</text>
          <text x="120" y="450" font-family="sans-serif" font-weight="bold" font-size="12" fill="#FFFFFF">Linear Labs Inc</text>
          <text x="120" y="466" font-family="sans-serif" font-size="10" fill="#64748B">Invoice Paid • 28% Auto-Vaulted</text>
          <text x="332" y="456" text-anchor="end" font-family="monospace" font-weight="bold" font-size="12" fill="#10B981">+$5,800</text>

          <rect x="68" y="496" width="284" height="60" rx="12" fill="#13171F" />
          <circle cx="94" cy="526" r="14" fill="#64748B" fill-opacity="0.15" />
          <text x="94" y="530" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#94A3B8">↑</text>
          <text x="120" y="520" font-family="sans-serif" font-weight="bold" font-size="12" fill="#FFFFFF">Corner Mart #402</text>
          <text x="120" y="536" font-family="sans-serif" font-size="10" fill="#64748B">Personal / Non-Deductible</text>
          <text x="332" y="526" text-anchor="end" font-family="monospace" font-weight="bold" font-size="12" fill="#94A3B8">-$42.50</text>

          <!-- Bottom Home Indicator -->
          <rect x="145" y="730" width="130" height="4" rx="2" fill="#FFFFFF" fill-opacity="0.4" />
        </g>
      </svg>
    `
  },

  'iphone-floating-angle-mockup': {
    w: 520,
    h: 700,
    svg: `
      <svg viewBox="0 0 520 700" width="520" height="700" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="flt-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="-14" dy="34" stdDeviation="30" flood-color="#000000" flood-opacity="0.5" />
          </filter>
        </defs>
        <g filter="url(#flt-shadow)" transform="rotate(-8 260 350)">
          <!-- Angled Phone Body -->
          <rect x="110" y="40" width="300" height="620" rx="48" fill="#0B0D10" stroke="#334155" stroke-width="6" />
          <rect x="122" y="52" width="276" height="596" rx="40" fill="#0F172A" />

          <!-- Dynamic Island -->
          <rect x="210" y="66" width="100" height="24" rx="12" fill="#000000" />

          <!-- Tax Vault Hero Screen -->
          <circle cx="260" cy="220" r="70" fill="#10B981" fill-opacity="0.1" stroke="#10B981" stroke-width="4" stroke-dasharray="10 6" />
          <text x="260" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#94A3B8">TAX VAULT</text>
          <text x="260" y="240" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="28" fill="#10B981">$4,820</text>
          
          <rect x="146" y="320" width="228" height="40" rx="10" fill="#10B981" />
          <text x="260" y="345" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#FFFFFF">Safe Harbor Protected (110%)</text>

          <rect x="146" y="380" width="228" height="160" rx="14" fill="#13171F" stroke="#232B38" />
          <text x="166" y="410" font-family="sans-serif" font-weight="bold" font-size="13" fill="#FFFFFF">Quarterly Vouchers</text>
          <text x="166" y="435" font-family="sans-serif" font-size="11" fill="#94A3B8">Q1 IRS 1040-ES: $1,205</text>
          <text x="166" y="458" font-family="sans-serif" font-size="11" fill="#94A3B8">Q2 IRS 1040-ES: $1,205</text>
          <text x="166" y="481" font-family="sans-serif" font-size="11" fill="#94A3B8">Q3 IRS 1040-ES: $1,205</text>
          <text x="166" y="504" font-family="sans-serif" font-size="11" fill="#F59E0B">Q4 IRS 1040-ES: Due Jan 15</text>
        </g>
      </svg>
    `
  },

  'credit-card-mockup-front-back': {
    w: 800,
    h: 520,
    svg: `
      <svg viewBox="0 0 800 520" width="800" height="520" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="card-front" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1E293B" />
            <stop offset="60%" stop-color="#0F172A" />
            <stop offset="100%" stop-color="#020617" />
          </linearGradient>
          <linearGradient id="card-back" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0F172A" />
            <stop offset="100%" stop-color="#1E293B" />
          </linearGradient>
          <filter id="card-shd" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#000000" flood-opacity="0.45" />
          </filter>
        </defs>
        <!-- Back Card (Shifted & Rotated) -->
        <g filter="url(#card-shd)" transform="rotate(8 500 240)">
          <rect x="340" y="80" width="380" height="230" rx="18" fill="url(#card-back)" stroke="#334155" stroke-width="1.5" />
          <!-- Magnetic Stripe -->
          <rect x="340" y="115" width="380" height="42" fill="#000000" />
          <!-- Signature Panel -->
          <rect x="365" y="180" width="220" height="32" rx="4" fill="#E2E8F0" />
          <text x="595" y="202" font-family="monospace" font-weight="bold" font-size="13" fill="#FFFFFF">842</text>
          <text x="365" y="235" font-family="sans-serif" font-size="8" fill="#64748B">ISSUED BY LEAD BANK, MEMBER FDIC • COMMERCIAL DEBIT</text>
        </g>

        <!-- Front Card (Hero Foreground) -->
        <g filter="url(#card-shd)" transform="rotate(-4 250 280)">
          <rect x="80" y="160" width="380" height="230" rx="18" fill="url(#card-front)" stroke="#10B981" stroke-width="2" />
          
          <!-- SoloFi Logo & Chip -->
          <text x="110" y="205" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#10B981">SoloFi</text>
          <text x="180" y="205" font-family="sans-serif" font-size="10" font-weight="bold" fill="#64748B">BUSINESS DEBIT</text>
          
          <!-- EMV Chip -->
          <rect x="110" y="225" width="46" height="36" rx="6" fill="#FBBF24" stroke="#D97706" />

          <!-- Card Number -->
          <text x="110" y="305" font-family="monospace" font-weight="bold" font-size="18" fill="#FFFFFF" letter-spacing="3">•••• 4892</text>

          <!-- Cardholder & Expiry -->
          <text x="110" y="340" font-family="sans-serif" font-size="9" fill="#94A3B8">CARDHOLDER</text>
          <text x="110" y="358" font-family="sans-serif" font-weight="bold" font-size="13" fill="#FFFFFF">ELENA VANCE</text>

          <text x="250" y="340" font-family="sans-serif" font-size="9" fill="#94A3B8">EXPIRES</text>
          <text x="250" y="358" font-family="monospace" font-weight="bold" font-size="13" fill="#FFFFFF">08/29</text>

          <!-- Contactless Waves -->
          <path d="M 400 230 C 405 235 405 245 400 250" fill="none" stroke="#FFFFFF" stroke-width="2.5" />
          <path d="M 408 225 C 416 235 416 248 408 258" fill="none" stroke="#FFFFFF" stroke-width="2.5" />
        </g>
      </svg>
    `
  },

  'invoice-pdf-mockup': {
    w: 600,
    h: 760,
    svg: `
      <svg viewBox="0 0 600 760" width="600" height="760" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="pdf-shd" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#000000" flood-opacity="0.35" />
          </filter>
        </defs>
        <g filter="url(#pdf-shd)">
          <!-- Clean PDF White Paper -->
          <rect x="60" y="40" width="480" height="680" rx="12" fill="#FFFFFF" />

          <!-- Emerald Header Band -->
          <rect x="60" y="40" width="480" height="12" rx="6" fill="#10B981" />

          <!-- Company Info -->
          <text x="100" y="100" font-family="system-ui, sans-serif" font-weight="bold" font-size="20" fill="#0F172A">Vance Studio Design LLC</text>
          <text x="100" y="120" font-family="sans-serif" font-size="11" fill="#64748B">hello@vancestudio.design • San Francisco, CA</text>

          <text x="440" y="100" text-anchor="end" font-family="system-ui, sans-serif" font-weight="bold" font-size="18" fill="#10B981">INVOICE</text>
          <text x="440" y="120" text-anchor="end" font-family="monospace" font-size="11" fill="#64748B">#INV-2026-08</text>

          <line x1="100" y1="145" x2="500" y2="145" stroke="#E2E8F0" stroke-width="1.5" />

          <!-- Billed to -->
          <text x="100" y="175" font-family="sans-serif" font-size="10" font-weight="bold" fill="#94A3B8">BILLED TO:</text>
          <text x="100" y="195" font-family="sans-serif" font-weight="bold" font-size="13" fill="#0F172A">Linear Labs Inc</text>
          <text x="100" y="210" font-family="sans-serif" font-size="11" fill="#64748B">billing@linear.app • 800 Market St, SF</text>

          <!-- Table Header -->
          <rect x="100" y="240" width="400" height="32" rx="6" fill="#F8FAFC" />
          <text x="115" y="260" font-family="sans-serif" font-weight="bold" font-size="11" fill="#475569">DESCRIPTION</text>
          <text x="480" y="260" text-anchor="end" font-family="sans-serif" font-weight="bold" font-size="11" fill="#475569">AMOUNT</text>

          <!-- Table Rows -->
          <text x="115" y="300" font-family="sans-serif" font-size="12" fill="#0F172A">Brand Strategy & Identity System</text>
          <text x="480" y="300" text-anchor="end" font-family="monospace" font-weight="bold" font-size="12" fill="#0F172A">$3,600.00</text>

          <text x="115" y="335" font-family="sans-serif" font-size="12" fill="#0F172A">Interactive Design System Components</text>
          <text x="480" y="335" text-anchor="end" font-family="monospace" font-weight="bold" font-size="12" fill="#0F172A">$2,200.00</text>

          <line x1="100" y1="365" x2="500" y2="365" stroke="#E2E8F0" stroke-width="1.5" />

          <!-- Total Due -->
          <text x="360" y="400" font-family="sans-serif" font-weight="bold" font-size="14" fill="#0F172A">Total Due:</text>
          <text x="480" y="400" text-anchor="end" font-family="monospace" font-weight="bold" font-size="20" fill="#10B981">$5,800.00</text>

          <!-- Automated Auto-Split Notice -->
          <rect x="100" y="440" width="400" height="85" rx="10" fill="#ECFDF5" stroke="#10B981" stroke-width="1" />
          <text x="120" y="468" font-family="sans-serif" font-weight="bold" font-size="12" fill="#065F46">SOLOFI AUTOMATIC WITHHOLDING NOTICE</text>
          <text x="120" y="490" font-family="sans-serif" font-size="11" fill="#047857">Upon settlement, $1,624.00 (28%) is auto-diverted to the tax vault.</text>
          <text x="120" y="508" font-family="sans-serif" font-size="11" fill="#047857">$4,176.00 (72%) is instantly available as Safe-to-Spend.</text>

          <!-- Paid Stamp -->
          <g transform="rotate(-15 300 600)">
            <rect x="220" y="580" width="160" height="44" rx="8" fill="none" stroke="#10B981" stroke-width="4" stroke-dasharray="6 2" />
            <text x="300" y="610" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="18" fill="#10B981">PAID IN FULL</text>
          </g>
        </g>
      </svg>
    `
  },

  'receipt-mockup': {
    w: 480,
    h: 680,
    svg: `
      <svg viewBox="0 0 480 680" width="480" height="680" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="rc-shd" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="22" stdDeviation="22" flood-color="#000000" flood-opacity="0.3" />
          </filter>
        </defs>
        <g filter="url(#rc-shd)">
          <!-- Thermal Paper Base with Jagged Edge -->
          <path d="M 60 40 L 420 40 L 420 620 L 395 605 L 370 620 L 345 605 L 320 620 L 295 605 L 270 620 L 245 605 L 220 620 L 195 605 L 170 620 L 145 605 L 120 620 L 95 605 L 70 620 L 60 610 Z" fill="#FFFFFF" />

          <!-- Merchant Logo -->
          <circle cx="240" cy="100" r="24" fill="#0F172A" />
          <text x="240" y="107" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#FFFFFF">☕</text>

          <text x="240" y="145" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="bold" font-size="16" fill="#0F172A">CORNER MART & COFFEE</text>
          <text x="240" y="165" text-anchor="middle" font-family="monospace" font-size="10" fill="#64748B">STORE #402 • SAN FRANCISCO, CA</text>
          <text x="240" y="180" text-anchor="middle" font-family="monospace" font-size="10" fill="#64748B">OCT 14, 2026 • 09:42 AM</text>

          <line x1="90" y1="205" x2="390" y2="205" stroke="#94A3B8" stroke-dasharray="4 4" stroke-width="1.5" />

          <!-- Items -->
          <text x="90" y="240" font-family="monospace" font-size="12" fill="#0F172A">1x Client Meeting Espresso</text>
          <text x="390" y="240" text-anchor="end" font-family="monospace" font-weight="bold" font-size="12" fill="#0F172A">$6.50</text>

          <text x="90" y="270" font-family="monospace" font-size="12" fill="#0F172A">1x Designer Notebook</text>
          <text x="390" y="270" text-anchor="end" font-family="monospace" font-weight="bold" font-size="12" fill="#0F172A">$32.00</text>

          <text x="90" y="300" font-family="monospace" font-size="12" fill="#0F172A">CA Sales Tax (8.5%)</text>
          <text x="390" y="300" text-anchor="end" font-family="monospace" font-weight="bold" font-size="12" fill="#0F172A">$4.00</text>

          <line x1="90" y1="330" x2="390" y2="330" stroke="#0F172A" stroke-width="2" />

          <!-- Total -->
          <text x="90" y="365" font-family="sans-serif" font-weight="bold" font-size="16" fill="#0F172A">TOTAL USD</text>
          <text x="390" y="365" text-anchor="end" font-family="monospace" font-weight="bold" font-size="22" fill="#059669">$42.50</text>

          <!-- Card Paid -->
          <text x="90" y="405" font-family="monospace" font-size="11" fill="#64748B">PAID: SoloFi Debit (•••• 4892)</text>
          <text x="90" y="425" font-family="monospace" font-size="11" fill="#64748B">AUTH CODE: #0928491</text>

          <!-- OCR Verification Banner on Receipt -->
          <rect x="90" y="460" width="300" height="70" rx="10" fill="#F0FDF4" stroke="#10B981" stroke-width="1.5" />
          <text x="110" y="488" font-family="sans-serif" font-weight="bold" font-size="12" fill="#15803D">✓ OCR VERIFIED FOR SCHEDULE C</text>
          <text x="110" y="508" font-family="sans-serif" font-size="10" fill="#166534">50% Meals Deduction Verified ($3.25 deduction)</text>

          <!-- Barcode -->
          <rect x="120" y="545" width="240" height="30" fill="#0F172A" />
        </g>
      </svg>
    `
  }
};

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`Generating ${Object.keys(MOCKUPS).length} mockups (SVG + high-res PNG)...`);

  for (const [key, data] of Object.entries(MOCKUPS)) {
    const cleanSvg = data.svg.trim();
    // Save SVG
    fs.writeFileSync(path.join(targetDir, `${key}.svg`), cleanSvg, 'utf-8');

    // Render to PNG
    await page.setViewportSize({ width: data.w, height: data.h });
    await page.setContent(`
      <html style="margin:0;padding:0;background:transparent;">
        <body style="margin:0;padding:0;background:transparent;display:flex;align-items:center;justify-content:center;height:${data.h}px;width:${data.w}px;">
          ${cleanSvg}
        </body>
      </html>
    `);
    const pngBuffer = await page.screenshot({ type: 'png', omitBackground: true });
    fs.writeFileSync(path.join(targetDir, `${key}.png`), pngBuffer);

    console.log(`  ✓ Created ${key}.svg & ${key}.png (${(pngBuffer.length / 1024).toFixed(1)} KB)`);
  }

  await browser.close();
  console.log('Finished mockups generation.');
}

run().catch(console.error);
