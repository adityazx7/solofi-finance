import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

const targetDir = path.resolve(process.cwd(), 'assets/illustrations');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const ILLUSTRATIONS = {
  'freelancer-illustration': `
    <svg viewBox="0 0 800 600" width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
        <linearGradient id="grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F8FAFC" />
          <stop offset="100%" stop-color="#E2E8F0" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0F172A" flood-opacity="0.12" />
        </filter>
      </defs>
      <!-- Background elements -->
      <rect width="800" height="600" rx="24" fill="url(#grad-bg)" />
      <circle cx="680" cy="120" r="80" fill="#10B981" fill-opacity="0.1" />
      <circle cx="120" cy="480" r="100" fill="#F59E0B" fill-opacity="0.08" />
      
      <!-- Desk Base -->
      <rect x="140" y="440" width="520" height="16" rx="8" fill="#CBD5E1" />
      <rect x="180" y="456" width="16" height="80" rx="4" fill="#94A3B8" />
      <rect x="604" y="456" width="16" height="80" rx="4" fill="#94A3B8" />

      <!-- Freelancer Figure -->
      <path d="M 360 270 Q 400 240 440 270 Q 450 340 430 440 L 370 440 Z" fill="#0F172A" />
      <circle cx="400" cy="200" r="42" fill="#FBBF24" />
      <!-- Glasses / Hair -->
      <path d="M 370 180 C 370 150 430 150 430 180 C 430 190 370 190 370 180 Z" fill="#1E293B" />
      <circle cx="390" cy="200" r="10" fill="none" stroke="#0F172A" stroke-width="3" />
      <circle cx="410" cy="200" r="10" fill="none" stroke="#0F172A" stroke-width="3" />
      <line x1="400" y1="200" x2="400" y2="200" stroke="#0F172A" stroke-width="3" />

      <!-- Laptop Open with SoloFi Dashboard UI -->
      <path d="M 300 440 L 500 440 L 480 340 L 320 340 Z" fill="#1E293B" filter="url(#shadow)" />
      <rect x="330" y="350" width="140" height="80" rx="6" fill="#0F172A" />
      <!-- Dashboard Screen Mini UI -->
      <rect x="340" y="360" width="40" height="12" rx="3" fill="#10B981" />
      <rect x="390" y="360" width="70" height="6" rx="2" fill="#64748B" />
      <path d="M 340 410 Q 370 380 400 395 T 460 380" fill="none" stroke="#10B981" stroke-width="3" />

      <!-- Coffee Mug -->
      <rect x="540" y="400" width="36" height="40" rx="6" fill="#F59E0B" />
      <path d="M 576 410 Q 590 415 576 430" fill="none" stroke="#F59E0B" stroke-width="4" />

      <!-- Floating Income & Tax Badges -->
      <g filter="url(#shadow)">
        <rect x="180" y="160" width="180" height="60" rx="14" fill="#FFFFFF" />
        <circle cx="210" cy="190" r="16" fill="#10B981" fill-opacity="0.15" />
        <path d="M 204 190 L 209 195 L 217 184" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" />
        <text x="236" y="185" font-family="system-ui, sans-serif" font-weight="bold" font-size="14" fill="#0F172A">Invoice Paid</text>
        <text x="236" y="202" font-family="monospace" font-weight="600" font-size="12" fill="#10B981">+$4,200.00</text>
      </g>

      <g filter="url(#shadow)">
        <rect x="460" y="180" width="190" height="60" rx="14" fill="#FFFFFF" />
        <circle cx="490" cy="210" r="16" fill="#F59E0B" fill-opacity="0.15" />
        <path d="M 484 210 L 496 210 M 490 204 L 490 216" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" />
        <text x="516" y="205" font-family="system-ui, sans-serif" font-weight="bold" font-size="14" fill="#0F172A">Auto-Tax Vault</text>
        <text x="516" y="222" font-family="monospace" font-weight="600" font-size="12" fill="#F59E0B">28% Locked</text>
      </g>
    </svg>
  `,

  'invoice-illustration': `
    <svg viewBox="0 0 800 600" width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="inv-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0F172A" />
          <stop offset="100%" stop-color="#1E293B" />
        </linearGradient>
        <linearGradient id="inv-accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#3B82F6" />
        </linearGradient>
        <filter id="inv-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="20" stdDeviation="24" flood-color="#000000" flood-opacity="0.3" />
        </filter>
      </defs>
      <rect width="800" height="600" rx="24" fill="#0B0F17" />
      
      <!-- Invoice Sheet Document -->
      <g filter="url(#inv-shadow)">
        <rect x="220" y="70" width="360" height="460" rx="16" fill="#FFFFFF" />
        <rect x="220" y="70" width="360" height="12" rx="6" fill="url(#inv-accent)" />
        
        <!-- Header -->
        <circle cx="265" cy="120" r="18" fill="#10B981" />
        <text x="260" y="126" font-family="sans-serif" font-weight="bold" font-size="16" fill="#FFFFFF">S</text>
        <text x="295" y="120" font-family="system-ui, sans-serif" font-weight="bold" font-size="16" fill="#0F172A">INVOICE #INV-2026-08</text>
        <text x="295" y="136" font-family="system-ui, sans-serif" font-size="11" fill="#64748B">Due on receipt • SoloFi Direct ACH</text>

        <!-- Divider -->
        <line x1="250" y1="160" x2="550" y2="160" stroke="#E2E8F0" stroke-width="1.5" />

        <!-- Line items -->
        <text x="250" y="195" font-family="sans-serif" font-size="12" font-weight="600" fill="#334155">Brand Design & Design System</text>
        <text x="510" y="195" font-family="monospace" font-size="13" font-weight="bold" fill="#0F172A">$3,600.00</text>
        
        <text x="250" y="235" font-family="sans-serif" font-size="12" font-weight="600" fill="#334155">Product Strategy & Prototype</text>
        <text x="510" y="235" font-family="monospace" font-size="13" font-weight="bold" fill="#0F172A">$2,200.00</text>

        <rect x="250" y="270" width="300" height="50" rx="10" fill="#F1F5F9" />
        <text x="265" y="295" font-family="sans-serif" font-size="12" fill="#475569">Total Due</text>
        <text x="475" y="302" font-family="monospace" font-size="18" font-weight="bold" fill="#059669">$5,800.00</text>

        <!-- Split Preview Callout inside Invoice -->
        <rect x="250" y="340" width="300" height="90" rx="10" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
        <text x="265" y="365" font-family="sans-serif" font-weight="bold" font-size="11" fill="#065F46">SOLOFI AUTOMATIC SPLIT ENGINE</text>
        <text x="265" y="390" font-family="sans-serif" font-size="12" fill="#047857">Checking (Safe-to-Spend 72%):</text>
        <text x="475" y="390" font-family="monospace" font-weight="bold" font-size="12" fill="#047857">$4,176.00</text>
        <text x="265" y="412" font-family="sans-serif" font-size="12" fill="#B45309">Tax Vault (Estimated Tax 28%):</text>
        <text x="475" y="412" font-family="monospace" font-weight="bold" font-size="12" fill="#B45309">$1,624.00</text>

        <!-- Pay Button -->
        <rect x="250" y="450" width="300" height="44" rx="10" fill="#10B981" />
        <text x="350" y="477" font-family="sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF">Pay via SoloFi Pay</text>
      </g>
    </svg>
  `,

  'online-payment-illustration': `
    <svg viewBox="0 0 800 600" width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pay-card" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E293B" />
          <stop offset="100%" stop-color="#0F172A" />
        </linearGradient>
        <linearGradient id="emerald-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#10B981" flood-opacity="0.3" />
        </filter>
      </defs>
      <rect width="800" height="600" rx="24" fill="#0B132B" />

      <!-- Phone Frame -->
      <rect x="280" y="70" width="240" height="460" rx="36" fill="#1C2541" stroke="#3A506B" stroke-width="4" />
      <rect x="360" y="85" width="80" height="16" rx="8" fill="#0B132B" />

      <!-- Screen UI -->
      <rect x="295" y="120" width="210" height="380" rx="24" fill="#FFFFFF" />

      <!-- Payment Success Ring -->
      <circle cx="400" cy="200" r="40" fill="url(#emerald-glow)" filter="url(#glow)" />
      <path d="M 386 200 L 396 210 L 416 190" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />

      <text x="400" y="265" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="bold" font-size="18" fill="#0F172A">Payment Settled</text>
      <text x="400" y="290" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="22" fill="#10B981">+$4,200.00</text>
      <text x="400" y="315" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="#64748B">Instant BaaS ACH Transfer</text>

      <!-- Vault Auto-Split Progress Bar -->
      <rect x="315" y="340" width="170" height="40" rx="8" fill="#F1F5F9" />
      <text x="325" y="364" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0F172A">Auto-Vault:</text>
      <text x="440" y="364" font-family="monospace" font-size="12" font-weight="bold" fill="#F59E0B">-$1,176</text>

      <!-- Return Button -->
      <rect x="315" y="420" width="170" height="42" rx="10" fill="#0F172A" />
      <text x="400" y="446" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#FFFFFF">View in Hub</text>
    </svg>
  `,

  'savings-illustration': `
    <svg viewBox="0 0 800 600" width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vault-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#047857" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" rx="24" fill="#F8FAFC" />

      <!-- Central Safe / Vault -->
      <rect x="250" y="140" width="300" height="320" rx="28" fill="#1E293B" />
      <rect x="270" y="160" width="260" height="280" rx="20" fill="#0F172A" />

      <!-- Vault Dial -->
      <circle cx="400" cy="300" r="80" fill="#334155" stroke="#10B981" stroke-width="6" />
      <circle cx="400" cy="300" r="50" fill="#1E293B" />
      <circle cx="400" cy="300" r="14" fill="#F59E0B" />
      
      <!-- Spokes -->
      <line x1="400" y1="230" x2="400" y2="250" stroke="#10B981" stroke-width="4" stroke-linecap="round" />
      <line x1="400" y1="350" x2="400" y2="370" stroke="#10B981" stroke-width="4" stroke-linecap="round" />
      <line x1="330" y1="300" x2="350" y2="300" stroke="#10B981" stroke-width="4" stroke-linecap="round" />
      <line x1="450" y1="300" x2="470" y2="300" stroke="#10B981" stroke-width="4" stroke-linecap="round" />

      <!-- Falling Coins -->
      <circle cx="280" cy="90" r="24" fill="#F59E0B" stroke="#D97706" stroke-width="3" />
      <text x="274" y="98" font-family="monospace" font-weight="bold" font-size="20" fill="#FFFFFF">$</text>
      
      <circle cx="510" cy="100" r="28" fill="#F59E0B" stroke="#D97706" stroke-width="3" />
      <text x="503" y="109" font-family="monospace" font-weight="bold" font-size="24" fill="#FFFFFF">$</text>

      <!-- Label -->
      <rect x="300" y="490" width="200" height="40" rx="20" fill="#10B981" />
      <text x="400" y="515" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF">TAX HARBOR SECURED</text>
    </svg>
  `,

  'secure-data-illustration': `
    <svg viewBox="0 0 800 600" width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3B82F6" />
          <stop offset="100%" stop-color="#1D4ED8" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" rx="24" fill="#0A0E1A" />

      <!-- Center Shield -->
      <path d="M 400 120 L 520 180 C 520 320 400 440 400 440 C 400 440 280 320 280 180 Z" fill="url(#shield-grad)" />
      
      <!-- Keyhole Lock in Shield -->
      <circle cx="400" cy="240" r="28" fill="#FFFFFF" />
      <path d="M 390 250 L 410 250 L 416 300 L 384 300 Z" fill="#FFFFFF" />

      <!-- Orbiting Security Nodes -->
      <circle cx="210" cy="200" r="30" fill="#1E293B" stroke="#10B981" stroke-width="2" />
      <text x="210" y="205" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="#10B981">AES-256</text>

      <circle cx="590" cy="200" r="30" fill="#1E293B" stroke="#10B981" stroke-width="2" />
      <text x="590" y="205" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="#10B981">SOC 2</text>

      <circle cx="400" cy="500" r="30" fill="#1E293B" stroke="#10B981" stroke-width="2" />
      <text x="400" y="505" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="#10B981">FDIC</text>

      <!-- Connecting Lines -->
      <line x1="240" y1="210" x2="310" y2="240" stroke="#10B981" stroke-dasharray="4 4" stroke-width="1.5" />
      <line x1="560" y1="210" x2="490" y2="240" stroke="#10B981" stroke-dasharray="4 4" stroke-width="1.5" />
      <line x1="400" y1="440" x2="400" y2="470" stroke="#10B981" stroke-dasharray="4 4" stroke-width="1.5" />
    </svg>
  `,

  'tax-illustration': `
    <svg viewBox="0 0 800 600" width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" rx="24" fill="#F8FAFC" />

      <!-- Tax 1040 Form Paper -->
      <rect x="250" y="80" width="300" height="420" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
      
      <rect x="280" y="110" width="80" height="12" rx="3" fill="#0F172A" />
      <rect x="280" y="130" width="240" height="4" rx="2" fill="#E2E8F0" />
      <rect x="280" y="145" width="200" height="4" rx="2" fill="#E2E8F0" />

      <!-- Schedule C Section -->
      <rect x="280" y="170" width="240" height="80" rx="8" fill="#F1F5F9" />
      <text x="295" y="195" font-family="sans-serif" font-weight="bold" font-size="12" fill="#0F172A">Schedule C (Form 1040)</text>
      <text x="295" y="215" font-family="sans-serif" font-size="10" fill="#64748B">Profit or Loss From Business</text>
      <text x="295" y="235" font-family="monospace" font-weight="bold" font-size="12" fill="#10B981">Auto-Categorized: 100%</text>

      <!-- Calculator on Side -->
      <rect x="460" y="280" width="160" height="230" rx="18" fill="#1E293B" />
      <rect x="480" y="300" width="120" height="40" rx="6" fill="#0F172A" />
      <text x="590" y="328" text-anchor="end" font-family="monospace" font-weight="bold" font-size="16" fill="#10B981">28.0%</text>
      
      <!-- Keypad -->
      <circle cx="500" cy="365" r="10" fill="#334155" />
      <circle cx="540" cy="365" r="10" fill="#334155" />
      <circle cx="580" cy="365" r="10" fill="#F59E0B" />

      <circle cx="500" cy="405" r="10" fill="#334155" />
      <circle cx="540" cy="405" r="10" fill="#334155" />
      <circle cx="580" cy="405" r="10" fill="#10B981" />

      <circle cx="500" cy="445" r="10" fill="#334155" />
      <circle cx="540" cy="445" r="10" fill="#334155" />
      <circle cx="580" cy="445" r="10" fill="#334155" />
      
      <!-- Rubber Stamp: PAID & PROTECTED -->
      <g transform="rotate(-12 360 400)">
        <rect x="290" y="380" width="160" height="46" rx="8" fill="none" stroke="#059669" stroke-width="3" stroke-dasharray="6 2" />
        <text x="370" y="410" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#059669">NO TAX SURPRISE</text>
      </g>
    </svg>
  `,

  'financial-growth-illustration': `
    <svg viewBox="0 0 800 600" width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chart-area" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#10B981" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#10B981" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" rx="24" fill="#0B132B" />

      <!-- Grid lines -->
      <line x1="140" y1="460" x2="680" y2="460" stroke="#1E293B" stroke-width="2" />
      <line x1="140" y1="360" x2="680" y2="360" stroke="#1E293B" stroke-width="1.5" stroke-dasharray="6 6" />
      <line x1="140" y1="260" x2="680" y2="260" stroke="#1E293B" stroke-width="1.5" stroke-dasharray="6 6" />
      <line x1="140" y1="160" x2="680" y2="160" stroke="#1E293B" stroke-width="1.5" stroke-dasharray="6 6" />

      <!-- Area fill -->
      <path d="M 160 440 Q 280 400 360 320 T 540 220 T 660 140 L 660 460 L 160 460 Z" fill="url(#chart-area)" />
      <!-- Line graph -->
      <path d="M 160 440 Q 280 400 360 320 T 540 220 T 660 140" fill="none" stroke="#10B981" stroke-width="5" stroke-linecap="round" />

      <!-- Milestone points -->
      <circle cx="160" cy="440" r="7" fill="#10B981" stroke="#FFFFFF" stroke-width="3" />
      <circle cx="360" cy="320" r="7" fill="#10B981" stroke="#FFFFFF" stroke-width="3" />
      <circle cx="540" cy="220" r="7" fill="#10B981" stroke="#FFFFFF" stroke-width="3" />
      <circle cx="660" cy="140" r="9" fill="#F59E0B" stroke="#FFFFFF" stroke-width="3" />

      <!-- Floating Stat Bubble -->
      <rect x="580" y="80" width="140" height="44" rx="10" fill="#1E293B" stroke="#10B981" stroke-width="1.5" />
      <text x="650" y="108" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="14" fill="#10B981">$140k ARR</text>
    </svg>
  `,

  'empty-state-ledger-illustration': `
    <svg viewBox="0 0 800 600" width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" rx="24" fill="#F8FAFC" />

      <!-- Floating Empty Box / Folder -->
      <rect x="300" y="160" width="200" height="150" rx="16" fill="#E2E8F0" />
      <path d="M 280 210 L 520 210 L 490 340 L 310 340 Z" fill="#CBD5E1" />
      
      <!-- Checkmark Bubble Floating Above -->
      <circle cx="400" cy="160" r="36" fill="#10B981" />
      <path d="M 388 160 L 396 168 L 414 150" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />

      <text x="400" y="390" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#0F172A">Review Inbox Zero</text>
      <text x="400" y="420" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#64748B">All incoming transactions are balanced and categorized</text>
      
      <!-- Sub-badge -->
      <rect x="330" y="450" width="140" height="32" rx="8" fill="#ECFDF5" />
      <text x="400" y="471" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="12" fill="#059669">Continuous Sync</text>
    </svg>
  `,

  'success-checkmark-illustration': `
    <svg viewBox="0 0 800 600" width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="succ-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#047857" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" rx="24" fill="#0B132B" />

      <!-- Glowing Rings -->
      <circle cx="400" cy="270" r="140" fill="#10B981" fill-opacity="0.08" />
      <circle cx="400" cy="270" r="100" fill="#10B981" fill-opacity="0.15" />
      <circle cx="400" cy="270" r="70" fill="url(#succ-grad)" />

      <!-- Checkmark -->
      <path d="M 374 270 L 392 288 L 428 250" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Success Text -->
      <text x="400" y="420" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="bold" font-size="24" fill="#FFFFFF">Action Completed Successfully</text>
      <text x="400" y="450" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#94A3B8">Double-entry ledger verified • All accounts balanced</text>
    </svg>
  `,

  '404-error-illustration': `
    <svg viewBox="0 0 800 600" width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" rx="24" fill="#0F172A" />

      <!-- 404 Large Numerals -->
      <text x="240" y="270" font-family="monospace" font-weight="900" font-size="140" fill="#334155">4</text>
      
      <!-- Vault Dial as the 0 -->
      <circle cx="400" cy="220" r="60" fill="#1E293B" stroke="#F59E0B" stroke-width="6" />
      <circle cx="400" cy="220" r="24" fill="#0F172A" />
      <path d="M 388 208 L 412 232 M 412 208 L 388 232" stroke="#EF4444" stroke-width="4" stroke-linecap="round" />

      <text x="560" y="270" font-family="monospace" font-weight="900" font-size="140" fill="#334155">4</text>

      <text x="400" y="360" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="bold" font-size="22" fill="#FFFFFF">Page Not Found in Vault</text>
      <text x="400" y="395" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#94A3B8">The requested ledger entry or route could not be found.</text>

      <rect x="330" y="430" width="140" height="42" rx="10" fill="#10B981" />
      <text x="400" y="456" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#FFFFFF">Return to Dashboard</text>
    </svg>
  `
};

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 800, height: 600 });

  console.log(`Generating ${Object.keys(ILLUSTRATIONS).length} illustrations (SVG + PNG)...`);

  for (const [key, svg] of Object.entries(ILLUSTRATIONS)) {
    const cleanSvg = svg.trim();
    // Save SVG
    const svgPath = path.join(targetDir, `${key}.svg`);
    fs.writeFileSync(svgPath, cleanSvg, 'utf-8');

    // Render to PNG
    await page.setContent(`
      <html style="margin:0;padding:0;background:transparent;">
        <body style="margin:0;padding:0;background:transparent;">
          ${cleanSvg}
        </body>
      </html>
    `);
    const pngBuffer = await page.screenshot({ type: 'png', omitBackground: true });
    const pngPath = path.join(targetDir, `${key}.png`);
    fs.writeFileSync(pngPath, pngBuffer);

    console.log(`  ✓ Created ${key}.svg & ${key}.png (${(pngBuffer.length / 1024).toFixed(1)} KB)`);
  }

  await browser.close();
  console.log('Finished illustrations generation.');
}

run().catch(console.error);
