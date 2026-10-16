import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

const logosDir = path.resolve(process.cwd(), 'assets/logos');
const badgesDir = path.resolve(process.cwd(), 'assets/badges');

if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });
if (!fs.existsSync(badgesDir)) fs.mkdirSync(badgesDir, { recursive: true });

const BRAND_LOGOS = [
  { name: 'stripe', slug: 'stripe', color: '#635BFF' },
  { name: 'notion', slug: 'notion', color: '#000000' },
  { name: 'figma', slug: 'figma', color: '#F24E1E' },
  { name: 'slack', slug: 'slack', color: '#4A154B' },
  { name: 'adobe', slug: 'adobe', color: '#FF0000' },
  { name: 'aws', slug: 'amazonaws', color: '#232F3E' },
  { name: 'uber', slug: 'uber', color: '#000000' },
  { name: 'upwork', slug: 'upwork', color: '#14A800' },
  { name: 'fiverr', slug: 'fiverr', color: '#1DBF73' },
  { name: 'shopify', slug: 'shopify', color: '#7AB55C' },
];

const BADGES = {
  'fdic-member-badge': `
    <svg viewBox="0 0 320 100" width="320" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fdic-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0F172A" />
          <stop offset="100%" stop-color="#1E293B" />
        </linearGradient>
      </defs>
      <rect width="320" height="100" rx="14" fill="url(#fdic-grad)" stroke="#38BDF8" stroke-width="2" />
      <g transform="translate(18, 16)">
        <!-- Bank Icon -->
        <polygon points="30 8 54 22 6 22" fill="#38BDF8" />
        <rect x="12" y="24" width="6" height="24" fill="#38BDF8" />
        <rect x="22" y="24" width="6" height="24" fill="#38BDF8" />
        <rect x="32" y="24" width="6" height="24" fill="#38BDF8" />
        <rect x="42" y="24" width="6" height="24" fill="#38BDF8" />
        <rect x="6" y="50" width="48" height="6" rx="2" fill="#38BDF8" />
      </g>
      <text x="86" y="42" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" letter-spacing="1.5">FDIC</text>
      <text x="86" y="60" font-family="system-ui, sans-serif" font-weight="bold" font-size="11" fill="#38BDF8">FDIC-INSURED DEPOSITS</text>
      <text x="86" y="74" font-family="system-ui, sans-serif" font-size="9" fill="#94A3B8">Protected up to $250,000 via Lead Bank</text>
    </svg>
  `,

  'soc2-compliance-badge': `
    <svg viewBox="0 0 320 100" width="320" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="soc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0F172A" />
          <stop offset="100%" stop-color="#1E293B" />
        </linearGradient>
      </defs>
      <rect width="320" height="100" rx="14" fill="url(#soc-grad)" stroke="#10B981" stroke-width="2" />
      <g transform="translate(24, 20)">
        <circle cx="28" cy="30" r="24" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="2" />
        <path d="M 20 30 L 26 36 L 38 24" fill="none" stroke="#10B981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <text x="86" y="42" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#FFFFFF">AICPA SOC 2</text>
      <text x="86" y="60" font-family="system-ui, sans-serif" font-weight="bold" font-size="11" fill="#10B981">TYPE II CERTIFIED</text>
      <text x="86" y="74" font-family="system-ui, sans-serif" font-size="9" fill="#94A3B8">Audited Security, Availability & Privacy</text>
    </svg>
  `,

  'pci-dss-badge': `
    <svg viewBox="0 0 320 100" width="320" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="100" rx="14" fill="#0F172A" stroke="#F59E0B" stroke-width="2" />
      <g transform="translate(24, 20)">
        <rect x="4" y="10" width="48" height="34" rx="4" fill="none" stroke="#F59E0B" stroke-width="2.5" />
        <line x1="4" y1="20" x2="52" y2="20" stroke="#F59E0B" stroke-width="3" />
        <rect x="10" y="30" width="8" height="6" fill="#F59E0B" />
      </g>
      <text x="86" y="42" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#FFFFFF">PCI DSS</text>
      <text x="86" y="60" font-family="system-ui, sans-serif" font-weight="bold" font-size="11" fill="#F59E0B">LEVEL 1 COMPLIANT</text>
      <text x="86" y="74" font-family="system-ui, sans-serif" font-size="9" fill="#94A3B8">Highest Standard Payment Security</text>
    </svg>
  `,

  'encryption-256bit-badge': `
    <svg viewBox="0 0 320 100" width="320" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="100" rx="14" fill="#0F172A" stroke="#6366F1" stroke-width="2" />
      <g transform="translate(26, 20)">
        <rect x="8" y="20" width="40" height="32" rx="6" fill="#6366F1" />
        <path d="M 16 20 L 16 14 C 16 7 40 7 40 14 L 40 20" fill="none" stroke="#6366F1" stroke-width="4" />
        <circle cx="28" cy="34" r="4" fill="#FFFFFF" />
        <path d="M 28 38 L 28 44" stroke="#FFFFFF" stroke-width="2.5" />
      </g>
      <text x="86" y="42" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#FFFFFF">256-BIT ENCRYPTION</text>
      <text x="86" y="60" font-family="system-ui, sans-serif" font-weight="bold" font-size="11" fill="#818CF8">BANK-GRADE SECURITY</text>
      <text x="86" y="74" font-family="system-ui, sans-serif" font-size="9" fill="#94A3B8">TLS 1.3 & AES-256 End-to-End</text>
    </svg>
  `,

  'product-hunt-badge': `
    <svg viewBox="0 0 250 54" width="250" height="54" xmlns="http://www.w3.org/2000/svg">
      <rect width="250" height="54" rx="12" fill="#DA552F" />
      <circle cx="30" cy="27" r="15" fill="#FFFFFF" />
      <text x="25" y="34" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#DA552F">P</text>
      <text x="56" y="25" font-family="sans-serif" font-size="10" font-weight="bold" fill="#FEE2E2" letter-spacing="1">FEATURED ON</text>
      <text x="56" y="42" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#FFFFFF">Product Hunt</text>
      <text x="195" y="34" font-family="sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF">▲ 580</text>
    </svg>
  `,

  'g2-rating-badge': `
    <svg viewBox="0 0 250 54" width="250" height="54" xmlns="http://www.w3.org/2000/svg">
      <rect width="250" height="54" rx="12" fill="#FA4616" />
      <g transform="translate(14, 12)">
        <circle cx="15" cy="15" r="14" fill="#FFFFFF" />
        <text x="9" y="21" font-family="system-ui, sans-serif" font-weight="900" font-size="15" fill="#FA4616">G2</text>
      </g>
      <text x="54" y="24" font-family="sans-serif" font-size="10" font-weight="bold" fill="#FFE4E1">HIGH PERFORMER</text>
      <text x="54" y="42" font-family="system-ui, sans-serif" font-size="15" font-weight="900" fill="#FFFFFF">Leader Fall 2026</text>
      <text x="180" y="34" font-family="sans-serif" font-size="13" font-weight="bold" fill="#FFFFFF">★ 4.9/5</text>
    </svg>
  `,

  'trustpilot-stars': `
    <svg viewBox="0 0 250 54" width="250" height="54" xmlns="http://www.w3.org/2000/svg">
      <rect width="250" height="54" rx="12" fill="#00B67A" />
      <g transform="translate(16, 15)">
        <polygon points="12,1 15,8 23,9 17,14 19,22 12,18 5,22 7,14 1,9 9,8" fill="#FFFFFF" />
      </g>
      <text x="48" y="24" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#DCFCE7">Trustpilot</text>
      <text x="48" y="42" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#FFFFFF">★★★★★ 4.9</text>
      <text x="145" y="35" font-family="sans-serif" font-size="10" fill="#DCFCE7">| 450+ Reviews</text>
    </svg>
  `,

  'app-store-download-badge': `
    <svg viewBox="0 0 156 52" width="156" height="52" xmlns="http://www.w3.org/2000/svg">
      <rect width="156" height="52" rx="10" fill="#000000" stroke="#A1A1AA" stroke-width="1" />
      <!-- Apple Logo -->
      <path d="M28.4 25.6c-.03-3.6 2.9-5.3 3.1-5.4-1.7-2.4-4.2-2.8-5.1-2.8-2.2-.2-4.3 1.3-5.4 1.3-1.1 0-2.8-1.3-4.6-1.2-2.4.04-4.6 1.4-5.8 3.5-2.5 4.4-.6 10.8 1.8 14.3 1.2 1.7 2.6 3.6 4.4 3.5 1.8-.07 2.5-1.1 4.6-1.1 2.1 0 2.8 1.1 4.6 1.1 1.9-.03 3.1-1.7 4.3-3.4 1.4-2 1.9-3.9 2-4-.04-.08-3.7-1.4-3.8-5.8zM24.7 15.5c1-.1 2-.7 2.6-1.4.6-.7 1.1-1.8.9-2.8-1 .04-2 .7-2.6 1.4-.6.7-1.1 1.7-.9 2.8z" fill="#FFFFFF"/>
      <text x="44" y="20" font-family="-apple-system, system-ui, sans-serif" font-size="9" fill="#FFFFFF">Download on the</text>
      <text x="44" y="36" font-family="-apple-system, system-ui, sans-serif" font-weight="bold" font-size="16" fill="#FFFFFF">App Store</text>
    </svg>
  `,

  'google-play-badge': `
    <svg viewBox="0 0 168 52" width="168" height="52" xmlns="http://www.w3.org/2000/svg">
      <rect width="168" height="52" rx="10" fill="#000000" stroke="#A1A1AA" stroke-width="1" />
      <!-- Play icon -->
      <g transform="translate(16, 12)">
        <path d="M2.5 2.5 L18 14 L2.5 25.5 Z" fill="#00C853" />
        <path d="M2.5 2.5 L12 18 L2.5 25.5 Z" fill="#0091EA" />
        <path d="M12 18 L18 14 L15 11 Z" fill="#FFD600" />
        <path d="M2.5 2.5 L15 11 L18 14 Z" fill="#FF3D00" />
      </g>
      <text x="44" y="20" font-family="system-ui, sans-serif" font-size="9" fill="#FFFFFF">GET IT ON</text>
      <text x="44" y="36" font-family="system-ui, sans-serif" font-weight="bold" font-size="16" fill="#FFFFFF">Google Play</text>
    </svg>
  `
};

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('1. Fetching Brand Logos (Simple Icons SVG)...');
  for (const b of BRAND_LOGOS) {
    try {
      const url = `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${b.slug}.svg`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let svg = await res.text();
      // Ensure fill color
      svg = svg.replace('<svg ', `<svg fill="${b.color}" `);
      fs.writeFileSync(path.join(logosDir, `${b.name}.svg`), svg, 'utf-8');

      // Also render 64x64 PNG
      await page.setViewportSize({ width: 64, height: 64 });
      await page.setContent(`
        <html style="margin:0;padding:0;background:transparent;">
          <body style="margin:0;padding:0;background:transparent;display:flex;align-items:center;justify-content:center;height:64px;width:64px;">
            ${svg.replace('<svg ', '<svg width="44" height="44" ')}
          </body>
        </html>
      `);
      const pngBuffer = await page.screenshot({ type: 'png', omitBackground: true });
      fs.writeFileSync(path.join(logosDir, `${b.name}.png`), pngBuffer);

      console.log(`  ✓ ${b.name} logo (SVG + PNG)`);
    } catch (err) {
      console.error(`  ✗ Error fetching ${b.name}:`, err.message);
    }
  }

  console.log('\n2. Generating Compliance, Trust & Store Badges...');
  for (const [key, svg] of Object.entries(BADGES)) {
    const cleanSvg = svg.trim();
    // Save SVG
    fs.writeFileSync(path.join(badgesDir, `${key}.svg`), cleanSvg, 'utf-8');

    // Extract width and height from SVG
    const widthMatch = cleanSvg.match(/width="(\d+)"/);
    const heightMatch = cleanSvg.match(/height="(\d+)"/);
    const w = widthMatch ? parseInt(widthMatch[1]) : 320;
    const h = heightMatch ? parseInt(heightMatch[1]) : 100;

    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`
      <html style="margin:0;padding:0;background:transparent;">
        <body style="margin:0;padding:0;background:transparent;display:flex;align-items:center;justify-content:center;height:${h}px;width:${w}px;">
          ${cleanSvg}
        </body>
      </html>
    `);
    const pngBuffer = await page.screenshot({ type: 'png', omitBackground: true });
    fs.writeFileSync(path.join(badgesDir, `${key}.png`), pngBuffer);

    console.log(`  ✓ Created ${key}.svg & ${key}.png`);
  }

  await browser.close();
  console.log('Finished badges and logos.');
}

run().catch(console.error);
