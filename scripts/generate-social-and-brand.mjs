import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

const socialDir = path.resolve(process.cwd(), 'assets/social-and-brand');
const fontsDir = path.resolve(process.cwd(), 'assets/fonts');

if (!fs.existsSync(socialDir)) fs.mkdirSync(socialDir, { recursive: true });
if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

const SOCIAL_SVGS = {
  'social-x': `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  `,

  'social-linkedin': `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  `,

  'social-instagram': `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#E1306C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  `,

  'social-youtube': `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="#FF0000" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  `,

  'wave-divider': `
    <svg viewBox="0 0 1200 120" width="1200" height="120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z" fill="#0B0D10"/>
    </svg>
  `,

  'curved-section-divider': `
    <svg viewBox="0 0 1200 120" width="1200" height="120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,0 C300,100 900,100 1200,0 L1200,120 L0,120 Z" fill="#0E1116"/>
    </svg>
  `,

  'favicon': `
    <svg viewBox="0 0 128 128" width="128" height="128" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="28" fill="#10B981"/>
      <text x="64" y="94" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="88" fill="#FFFFFF">S</text>
    </svg>
  `,

  'og-image-1200x630': `
    <svg viewBox="0 0 1200 630" width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="og-glow" cx="80%" cy="20%" r="60%">
          <stop offset="0%" stop-color="#10B981" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#0B0D10" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="#0B0D10"/>
      <rect width="1200" height="630" fill="url(#og-glow)"/>

      <!-- Top Badge -->
      <g transform="translate(100, 100)">
        <rect width="170" height="38" rx="19" fill="#13171F" stroke="#10B981" stroke-width="1.5"/>
        <circle cx="24" cy="19" r="6" fill="#10B981"/>
        <text x="40" y="24" font-family="sans-serif" font-size="12" font-weight="bold" fill="#10B981">SOLOFI FINTECH</text>
      </g>

      <!-- Headline -->
      <text x="100" y="220" font-family="system-ui, sans-serif" font-weight="900" font-size="64" fill="#FFFFFF">Never get surprised</text>
      <text x="100" y="295" font-family="system-ui, sans-serif" font-weight="900" font-size="64" fill="#10B981">by taxes again.</text>

      <!-- Subtitle -->
      <text x="100" y="370" font-family="system-ui, sans-serif" font-size="24" fill="#94A3B8">The automated financial hub for freelancers & solopreneurs.</text>
      <text x="100" y="405" font-family="system-ui, sans-serif" font-size="20" fill="#64748B">Smart business checking • Native bookkeeping • Automatic Tax Vault</text>

      <!-- Metric Badges -->
      <g transform="translate(100, 480)">
        <rect width="260" height="74" rx="14" fill="#13171F" stroke="#1E293B"/>
        <text x="24" y="32" font-family="sans-serif" font-size="12" fill="#94A3B8">Estimated Tax Set-Aside</text>
        <text x="24" y="58" font-family="monospace" font-weight="bold" font-size="22" fill="#F59E0B">28% Auto-Locked</text>
      </g>

      <g transform="translate(390, 480)">
        <rect width="260" height="74" rx="14" fill="#13171F" stroke="#1E293B"/>
        <text x="24" y="32" font-family="sans-serif" font-size="12" fill="#94A3B8">Reconciliation Sync</text>
        <text x="24" y="58" font-family="monospace" font-weight="bold" font-size="22" fill="#10B981">0 Sec (Zero Sync)</text>
      </g>

      <!-- Right Side Visual Illustration Card -->
      <g transform="translate(740, 140)">
        <rect width="360" height="380" rx="28" fill="#13171F" stroke="#232B38" stroke-width="2"/>
        <circle cx="180" cy="140" r="64" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="4"/>
        <text x="180" y="152" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="34" fill="#10B981">72 / 28</text>
        
        <text x="180" y="245" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#FFFFFF">Real-Time Income Split</text>
        <text x="180" y="275" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#94A3B8">Checking: $3,024 • Vault: $1,176</text>
        
        <rect x="50" y="310" width="260" height="40" rx="10" fill="#10B981"/>
        <text x="180" y="335" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF">Protected Safe Harbor</text>
      </g>
    </svg>
  `
};

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Generating Social and Brand SVGs & PNGs...');
  for (const [key, svg] of Object.entries(SOCIAL_SVGS)) {
    const cleanSvg = svg.trim();
    fs.writeFileSync(path.join(socialDir, `${key}.svg`), cleanSvg, 'utf-8');

    // For OG image and favicon, render high-res PNG
    if (key === 'og-image-1200x630') {
      await page.setViewportSize({ width: 1200, height: 630 });
      await page.setContent(cleanSvg);
      const pngBuffer = await page.screenshot({ type: 'png' });
      fs.writeFileSync(path.join(socialDir, `${key}.png`), pngBuffer);
      console.log(`  ✓ ${key}.svg & ${key}.png (1200x630 OpenGraph)`);
    } else if (key === 'favicon') {
      await page.setViewportSize({ width: 128, height: 128 });
      await page.setContent(cleanSvg);
      const pngBuffer = await page.screenshot({ type: 'png', omitBackground: true });
      fs.writeFileSync(path.join(socialDir, `apple-touch-icon.png`), pngBuffer);
      fs.writeFileSync(path.join(socialDir, `favicon-32x32.png`), pngBuffer);
      console.log(`  ✓ favicon.svg, apple-touch-icon.png, favicon-32x32.png`);
    } else {
      console.log(`  ✓ ${key}.svg`);
    }
  }

  // Create Fonts Guide
  const fontsGuide = `# SoloFi Recommended Fintech Typography

The SoloFi fintech interface relies on sharp, high-legibility typefaces matching top-tier products like Mercury, Stripe, and Ramp.

## 1. Headings & Body Typefaces
- **Geist Sans (Primary):** Integrated natively via \`next/font/google\` (\`Geist\`)
- **Inter:** Available via Google Fonts: \`https://fonts.google.com/specimen/Inter\`
- **Plus Jakarta Sans:** \`https://fonts.google.com/specimen/Plus+Jakarta+Sans\`
- **DM Sans:** \`https://fonts.google.com/specimen/DM+Sans\`

## 2. Tabular Currency & Number Fonts (Mono)
- **Geist Mono (Default in SoloFi):** Ensures all numbers and ledger dollar values align vertically with zero jitter during live animations.
- **JetBrains Mono:** Available via Google Fonts: \`https://fonts.google.com/specimen/JetBrains+Mono\`

## 3. Quick CSS Import (if using external fonts)
\`\`\`css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;900&family=Geist+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
\`\`\`
`;
  fs.writeFileSync(path.join(fontsDir, 'README.md'), fontsGuide, 'utf-8');
  console.log('  ✓ Created assets/fonts/README.md');

  await browser.close();
  console.log('Finished social and brand assets.');
}

run().catch(console.error);
