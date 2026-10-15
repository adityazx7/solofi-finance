import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/AP/.gemini/antigravity/brain/d762580b-f08b-4b27-802a-8d41b8c0496e';

async function capture() {
  console.log('Launching browser for Phase 7 visual verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  // 1. Virtual Cards Page
  console.log('Navigating to /cards...');
  await page.goto('http://localhost:3000/cards', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase7-virtual-cards.png'),
    fullPage: false,
  });

  // 2. Runway & Salary Smoothing Forecast Page
  console.log('Navigating to /forecast...');
  await page.goto('http://localhost:3000/forecast', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase7-runway-forecast.png'),
    fullPage: false,
  });

  // 3. Tax & Account Settings Page
  console.log('Navigating to /settings...');
  await page.goto('http://localhost:3000/settings', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase7-tax-settings.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('All Phase 7 visual artifacts captured successfully!');
}

capture().catch((err) => {
  console.error('Error capturing Phase 7 screenshots:', err);
  process.exit(1);
});
