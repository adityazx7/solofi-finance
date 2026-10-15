import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/AP/.gemini/antigravity/brain/d762580b-f08b-4b27-802a-8d41b8c0496e';

async function capture() {
  console.log('Launching browser for Phase 6 visual verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  // 1. Invoices Hub
  console.log('Navigating to /invoices...');
  await page.goto('http://localhost:3000/invoices', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase6-invoices-hub.png'),
    fullPage: false,
  });

  // 2. Open New Invoice Modal
  console.log('Opening New Invoice Builder Modal...');
  await page.click('button:has-text("New Invoice")');
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase6-invoice-builder-modal.png'),
    fullPage: false,
  });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // 3. Navigate to Public Pay Portal
  console.log('Navigating to public pay portal /pay/pay_token_linear_5800...');
  await page.goto('http://localhost:3000/pay/pay_token_linear_5800', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase6-public-pay-portal.png'),
    fullPage: false,
  });

  // 4. Click Pay to simulate client payment and auto-split trigger
  console.log('Submitting client payment...');
  await page.click('button:has-text("Pay")');
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase6-public-pay-success.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('All Phase 6 visual artifacts captured successfully!');
}

capture().catch((err) => {
  console.error('Error capturing Phase 6 screenshots:', err);
  process.exit(1);
});
