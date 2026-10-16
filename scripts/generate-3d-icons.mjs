import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

const targetDir = path.resolve(process.cwd(), 'assets/3d-icons');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const ICONS_3D = {
  '3d-wallet-icon': `
    <svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="w-base" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="60%" stop-color="#059669" />
          <stop offset="100%" stop-color="#047857" />
        </radialGradient>
        <linearGradient id="w-flap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34D399" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
        <radialGradient id="gold-metal" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FDE68A" />
          <stop offset="40%" stop-color="#F59E0B" />
          <stop offset="100%" stop-color="#B45309" />
        </radialGradient>
        <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="24" stdDeviation="20" flood-color="#064E3B" flood-opacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#shadow3d)">
        <!-- Back Bill -->
        <rect x="130" y="110" width="250" height="100" rx="14" fill="#6EE7B7" transform="rotate(-6 250 160)" />
        <circle cx="255" cy="160" r="18" fill="#10B981" fill-opacity="0.4" transform="rotate(-6 250 160)" />

        <!-- Main Wallet Body -->
        <rect x="90" y="160" width="332" height="230" rx="36" fill="url(#w-base)" />
        
        <!-- Flap -->
        <path d="M 90 200 C 90 200 180 180 422 180 L 422 280 C 320 280 200 300 90 270 Z" fill="url(#w-flap)" opacity="0.9" />

        <!-- Gold Clasp -->
        <rect x="350" y="240" width="80" height="60" rx="18" fill="url(#gold-metal)" />
        <circle cx="390" cy="270" r="10" fill="#78350F" />
        
        <!-- Highlights -->
        <path d="M 120 180 L 390 180" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="6" stroke-linecap="round" />
      </g>
    </svg>
  `,

  '3d-calendar-icon': `
    <svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cal-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#E2E8F0" />
        </linearGradient>
        <linearGradient id="cal-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EF4444" />
          <stop offset="100%" stop-color="#B91C1C" />
        </linearGradient>
        <linearGradient id="metal-ring" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#E2E8F0" />
          <stop offset="100%" stop-color="#64748B" />
        </linearGradient>
        <filter id="cal-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#0F172A" flood-opacity="0.25" />
        </filter>
      </defs>
      <g filter="url(#cal-shadow)">
        <!-- Base Body -->
        <rect x="96" y="110" width="320" height="310" rx="40" fill="url(#cal-body)" />
        <!-- Red Header -->
        <path d="M 96 150 C 96 128 114 110 136 110 L 376 110 C 398 110 416 128 416 150 L 416 190 L 96 190 Z" fill="url(#cal-top)" />

        <!-- Rings -->
        <rect x="160" y="80" width="24" height="60" rx="12" fill="url(#metal-ring)" />
        <rect x="328" y="80" width="24" height="60" rx="12" fill="url(#metal-ring)" />

        <!-- Date "15" (Quarterly Tax Date) -->
        <text x="256" y="320" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="110" fill="#0F172A">15</text>
        <text x="256" y="380" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#EF4444">IRS QUARTERLY DUE</text>
      </g>
    </svg>
  `,

  '3d-receipt-icon': `
    <svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rec-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="100%" stop-color="#F1F5F9" />
        </linearGradient>
        <filter id="rec-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="24" stdDeviation="20" flood-color="#0F172A" flood-opacity="0.2" />
        </filter>
      </defs>
      <g filter="url(#rec-shadow)" transform="rotate(-4 256 256)">
        <!-- Zigzag bottom paper receipt -->
        <path d="M 120 70 L 392 70 L 392 410 L 365 390 L 338 410 L 311 390 L 284 410 L 257 390 L 230 410 L 203 390 L 176 410 L 149 390 L 120 410 Z" fill="url(#rec-grad)" rx="12" />
        
        <!-- Store Icon -->
        <circle cx="256" cy="130" r="24" fill="#10B981" />
        <path d="M 246 130 L 253 137 L 267 123" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" />

        <!-- Receipt Lines -->
        <rect x="160" y="180" width="192" height="8" rx="4" fill="#CBD5E1" />
        <rect x="160" y="210" width="120" height="8" rx="4" fill="#CBD5E1" />
        <rect x="310" y="210" width="42" height="8" rx="4" fill="#64748B" />

        <rect x="160" y="240" width="140" height="8" rx="4" fill="#CBD5E1" />
        <rect x="310" y="240" width="42" height="8" rx="4" fill="#64748B" />

        <line x1="160" y1="280" x2="352" y2="280" stroke="#94A3B8" stroke-dasharray="6 6" stroke-width="2" />

        <!-- Total -->
        <text x="160" y="325" font-family="sans-serif" font-weight="bold" font-size="16" fill="#0F172A">TOTAL</text>
        <text x="352" y="325" text-anchor="end" font-family="monospace" font-weight="bold" font-size="20" fill="#10B981">$4,200</text>

        <!-- OCR Approved Stamp -->
        <rect x="180" y="340" width="150" height="30" rx="6" fill="#ECFDF5" stroke="#10B981" stroke-width="1.5" />
        <text x="255" y="360" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="11" fill="#059669">98% OCR MATCH</text>
      </g>
    </svg>
  `,

  '3d-bank-building-icon': `
    <svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="b-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38BDF8" />
          <stop offset="50%" stop-color="#0284C7" />
          <stop offset="100%" stop-color="#0369A1" />
        </linearGradient>
        <filter id="b-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#0369A1" flood-opacity="0.3" />
        </filter>
      </defs>
      <g filter="url(#b-shadow)">
        <!-- Pediment Triangle -->
        <path d="M 256 80 L 420 170 L 92 170 Z" fill="url(#b-grad)" />
        <circle cx="256" cy="135" r="16" fill="#FFFFFF" fill-opacity="0.8" />

        <!-- Architrave -->
        <rect x="96" y="170" width="320" height="24" rx="6" fill="#0284C7" />

        <!-- Columns -->
        <rect x="120" y="194" width="36" height="150" rx="8" fill="url(#b-grad)" />
        <rect x="194" y="194" width="36" height="150" rx="8" fill="url(#b-grad)" />
        <rect x="282" y="194" width="36" height="150" rx="8" fill="url(#b-grad)" />
        <rect x="356" y="194" width="36" height="150" rx="8" fill="url(#b-grad)" />

        <!-- Steps Base -->
        <rect x="80" y="344" width="352" height="28" rx="8" fill="#0284C7" />
        <rect x="60" y="372" width="392" height="32" rx="10" fill="#0369A1" />

        <!-- FDIC Badge on Steps -->
        <rect x="186" y="414" width="140" height="28" rx="6" fill="#0F172A" />
        <text x="256" y="433" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="12" fill="#38BDF8">FDIC INSURED</text>
      </g>
    </svg>
  `,

  '3d-calculator-icon': `
    <svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="calc-body" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="100%" stop-color="#0F172A" />
        </radialGradient>
        <filter id="calc-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#000000" flood-opacity="0.4" />
        </filter>
      </defs>
      <g filter="url(#calc-shadow)">
        <!-- Body -->
        <rect x="116" y="70" width="280" height="380" rx="42" fill="url(#calc-body)" stroke="#475569" stroke-width="4" />
        
        <!-- Screen -->
        <rect x="146" y="110" width="220" height="74" rx="16" fill="#022C22" stroke="#059669" stroke-width="2" />
        <text x="346" y="160" text-anchor="end" font-family="monospace" font-weight="bold" font-size="34" fill="#34D399">28.00%</text>

        <!-- Buttons Grid -->
        <circle cx="176" cy="230" r="24" fill="#475569" />
        <text x="176" y="238" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#FFFFFF">7</text>
        
        <circle cx="256" cy="230" r="24" fill="#475569" />
        <text x="256" y="238" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#FFFFFF">8</text>

        <circle cx="336" cy="230" r="24" fill="#F59E0B" />
        <text x="336" y="238" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="22" fill="#FFFFFF">÷</text>

        <circle cx="176" cy="300" r="24" fill="#475569" />
        <text x="176" y="308" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#FFFFFF">4</text>
        
        <circle cx="256" cy="300" r="24" fill="#475569" />
        <text x="256" y="308" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#FFFFFF">5</text>

        <circle cx="336" cy="300" r="24" fill="#F59E0B" />
        <text x="336" y="308" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="22" fill="#FFFFFF">×</text>

        <circle cx="176" cy="370" r="24" fill="#475569" />
        <text x="176" y="378" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#FFFFFF">1</text>
        
        <circle cx="256" cy="370" r="24" fill="#475569" />
        <text x="256" y="378" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#FFFFFF">2</text>

        <circle cx="336" cy="370" r="24" fill="#10B981" />
        <text x="336" y="378" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="22" fill="#FFFFFF">=</text>
      </g>
    </svg>
  `,

  '3d-chart-growth-icon': `
    <svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bar1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#34D399" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
        <linearGradient id="bar2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#10B981" />
          <stop offset="100%" stop-color="#047857" />
        </linearGradient>
        <linearGradient id="bar3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#F59E0B" />
          <stop offset="100%" stop-color="#D97706" />
        </linearGradient>
        <filter id="ch-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="24" stdDeviation="20" flood-color="#064E3B" flood-opacity="0.3" />
        </filter>
      </defs>
      <g filter="url(#ch-shadow)">
        <!-- Pedestal Base -->
        <rect x="80" y="400" width="352" height="32" rx="12" fill="#1E293B" />

        <!-- 3D Bars -->
        <rect x="120" y="280" width="64" height="120" rx="16" fill="url(#bar1)" />
        <rect x="224" y="200" width="64" height="200" rx="16" fill="url(#bar2)" />
        <rect x="328" y="120" width="64" height="280" rx="16" fill="url(#bar3)" />

        <!-- Ascending Arrow 3D -->
        <path d="M 120 250 Q 240 180 370 80" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" />
        <polygon points="385,70 350,75 375,100" fill="#FFFFFF" />
      </g>
    </svg>
  `,

  '3d-lock-key-icon': `
    <svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="shackle" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#E2E8F0" />
          <stop offset="60%" stop-color="#94A3B8" />
          <stop offset="100%" stop-color="#475569" />
        </radialGradient>
        <radialGradient id="padlock-body" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#FDE68A" />
          <stop offset="50%" stop-color="#F59E0B" />
          <stop offset="100%" stop-color="#B45309" />
        </radialGradient>
        <filter id="lock-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#78350F" flood-opacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#lock-shadow)">
        <!-- Shackle -->
        <path d="M 176 220 L 176 150 C 176 106 212 70 256 70 C 300 70 336 106 336 150 L 336 220" fill="none" stroke="url(#shackle)" stroke-width="44" stroke-linecap="round" />

        <!-- Padlock Body -->
        <rect x="136" y="200" width="240" height="210" rx="42" fill="url(#padlock-body)" />

        <!-- Keyhole -->
        <circle cx="256" cy="285" r="22" fill="#451A03" />
        <polygon points="246,285 266,285 272,345 240,345" fill="#451A03" />
      </g>
    </svg>
  `,

  '3d-piggy-bank-icon': `
    <svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pig-pink" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#F472B6" />
          <stop offset="70%" stop-color="#EC4899" />
          <stop offset="100%" stop-color="#BE185D" />
        </radialGradient>
        <filter id="pig-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#BE185D" flood-opacity="0.3" />
        </filter>
      </defs>
      <g filter="url(#pig-shadow)">
        <!-- Pig Body -->
        <ellipse cx="256" cy="290" rx="150" ry="120" fill="url(#pig-pink)" />
        
        <!-- Snout -->
        <ellipse cx="120" cy="290" rx="40" ry="50" fill="#F472B6" stroke="#DB2777" stroke-width="3" />
        <ellipse cx="110" cy="290" rx="8" ry="14" fill="#9D174D" />
        <ellipse cx="130" cy="290" rx="8" ry="14" fill="#9D174D" />

        <!-- Ear -->
        <polygon points="180,200 230,150 240,210" fill="#DB2777" />

        <!-- Eye -->
        <circle cx="180" cy="245" r="12" fill="#1E293B" />
        <circle cx="176" cy="241" r="4" fill="#FFFFFF" />

        <!-- Coin Slot -->
        <rect x="250" y="170" width="70" height="12" rx="6" fill="#831843" />

        <!-- Gold Coin Dropping In -->
        <g transform="translate(0, -20)">
          <circle cx="285" cy="140" r="32" fill="#FBBF24" stroke="#D97706" stroke-width="4" />
          <text x="285" y="152" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="28" fill="#78350F">$</text>
        </g>

        <!-- Feet -->
        <rect x="170" y="380" width="40" height="50" rx="14" fill="#DB2777" />
        <rect x="300" y="380" width="40" height="50" rx="14" fill="#DB2777" />
      </g>
    </svg>
  `,

  '3d-dollar-coin-icon': `
    <svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="coin-gold" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#FEF08A" />
          <stop offset="35%" stop-color="#F59E0B" />
          <stop offset="80%" stop-color="#D97706" />
          <stop offset="100%" stop-color="#92400E" />
        </radialGradient>
        <filter id="coin-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="26" stdDeviation="24" flood-color="#92400E" flood-opacity="0.4" />
        </filter>
      </defs>
      <g filter="url(#coin-shadow)">
        <!-- Outer Coin Rim 3D Edge -->
        <circle cx="256" cy="266" r="170" fill="#B45309" />
        <!-- Main Face -->
        <circle cx="256" cy="246" r="170" fill="url(#coin-gold)" />
        <!-- Inner Border Ring -->
        <circle cx="256" cy="246" r="145" fill="none" stroke="#FDE68A" stroke-width="6" stroke-dasharray="14 8" />

        <!-- Dollar Sign Embossed -->
        <text x="256" y="316" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="210" fill="#FFFFFF" fill-opacity="0.95" style="filter: drop-shadow(0 4px 6px #78350F);">$</text>
      </g>
    </svg>
  `
};

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 512, height: 512 });

  console.log(`Generating ${Object.keys(ICONS_3D).length} 3D icons (SVG + transparent PNG)...`);

  for (const [key, svg] of Object.entries(ICONS_3D)) {
    const cleanSvg = svg.trim();
    // Save SVG
    const svgPath = path.join(targetDir, `${key}.svg`);
    fs.writeFileSync(svgPath, cleanSvg, 'utf-8');

    // Render to PNG
    await page.setContent(`
      <html style="margin:0;padding:0;background:transparent;">
        <body style="margin:0;padding:0;background:transparent;display:flex;align-items:center;justify-content:center;">
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
  console.log('Finished 3D icons generation.');
}

run().catch(console.error);
