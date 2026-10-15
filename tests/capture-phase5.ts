import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/AP/.gemini/antigravity/brain/d762580b-f08b-4b27-802a-8d41b8c0496e';

async function capture() {
  console.log('Launching browser for Phase 5 visual verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  // 1. Dashboard with Cashflow Area Chart & Liquid Vault
  console.log('Navigating to /dashboard...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase5-dashboard-cashflow.png'),
    fullPage: false,
  });

  // 2. Full Transactions Ledger
  console.log('Navigating to /transactions...');
  await page.goto('http://localhost:3000/transactions', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase5-transactions-ledger.png'),
    fullPage: false,
  });

  // 3. Switch to Review Inbox tab
  console.log('Switching to Review Inbox...');
  await page.click('button:has-text("Review Inbox")');
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase5-transactions-review-inbox.png'),
    fullPage: false,
  });

  // 4. Open Transaction Detail & OCR Drawer
  console.log('Opening Transaction Detail Drawer...');
  await page.locator('tbody tr').first().click();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase5-transaction-ocr-drawer.png'),
    fullPage: false,
  });

  // Close drawer
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 5. Tax Vault Hub
  console.log('Navigating to /tax-vault...');
  await page.goto('http://localhost:3000/tax-vault', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase5-tax-vault-hub.png'),
    fullPage: false,
  });

  // 6. Open Friction Unlock Modal
  console.log('Opening Friction Unlock Modal...');
  await page.click('button:has-text("Unlock Vault")');
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase5-tax-vault-unlock-friction.png'),
    fullPage: false,
  });

  // Cancel unlock
  await page.click('button:has-text("Cancel & Keep Safe")');
  await page.waitForTimeout(400);

  // 7. Open Pay Estimated Tax (EFTPS) Modal
  console.log('Opening Pay Estimated Tax Modal...');
  await page.click('button:has-text("Pay Estimated Tax")');
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase5-tax-vault-eftps-pay.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('All Phase 5 visual artifacts captured successfully!');
}

capture().catch((err) => {
  console.error('Error capturing Phase 5 screenshots:', err);
  process.exit(1);
});
