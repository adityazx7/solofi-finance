import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\AP\\.gemini\\antigravity\\brain\\d762580b-f08b-4b27-802a-8d41b8c0496e';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Capture Hero in Light Mode
  const heroPath = path.join(ARTIFACT_DIR, 'phase3-marketing-hero.png');
  await page.screenshot({ path: heroPath, clip: { x: 0, y: 0, width: 1440, height: 980 } });
  console.log('Captured Marketing Hero:', heroPath);

  // 2. Click "Simulate $4,200 Invoice Paid" in the hero widget
  const simButton = page.locator('button:has-text("Simulate $4,200 Invoice Paid")');
  if (await simButton.count() > 0) {
    await simButton.click();
    console.log('Clicked simulate invoice button, waiting for animation...');
    await page.waitForTimeout(1400); // Wait for split animation
    const simPath = path.join(ARTIFACT_DIR, 'phase3-hero-simulated.png');
    await page.screenshot({ path: simPath, clip: { x: 0, y: 0, width: 1440, height: 980 } });
    console.log('Captured Simulated Split State:', simPath);
  }

  // 3. Capture Full Landing Page in Dark Mode
  const darkButton = page.locator('button[aria-label="Dark mode"]');
  if (await darkButton.count() > 0) {
    await darkButton.click();
    await page.waitForTimeout(600);
  }
  const fullDarkPath = path.join(ARTIFACT_DIR, 'phase3-marketing-full-dark.png');
  await page.screenshot({ path: fullDarkPath, fullPage: true });
  console.log('Captured Full Marketing Page Dark:', fullDarkPath);

  // 4. Test Waitlist Form Submission
  const emailInput = page.locator('input[placeholder="elena@vancestudio.design"]');
  if (await emailInput.count() > 0) {
    await emailInput.fill(`alex.founder.${Date.now()}@solostartup.co`);
    const worryInput = page.locator('input[placeholder*="Forgetting quarterly"]');
    if (await worryInput.count() > 0) {
      await worryInput.fill('Fearing an unexpected $10k tax bill at year-end');
    }
    const submitBtn = page.locator('button:has-text("Join the Priority Waitlist")');
    await submitBtn.click();
    await page.waitForTimeout(1500);

    const waitlistContainer = page.locator('#waitlist-section');
    await waitlistContainer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const waitlistSuccessPath = path.join(ARTIFACT_DIR, 'phase3-waitlist-success.png');
    await waitlistContainer.screenshot({ path: waitlistSuccessPath });
    console.log('Captured Waitlist Success State:', waitlistSuccessPath);
  }

  // 5. Navigate to /admin/waitlist
  console.log('Navigating to http://localhost:3000/admin/waitlist...');
  await page.goto('http://localhost:3000/admin/waitlist', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const adminPath = path.join(ARTIFACT_DIR, 'phase3-admin-waitlist.png');
  await page.screenshot({ path: adminPath, fullPage: true });
  console.log('Captured Admin Waitlist Dashboard:', adminPath);

  // 6. Mobile Viewport 390px
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const mobilePath = path.join(ARTIFACT_DIR, 'phase3-marketing-mobile.png');
  await page.screenshot({ path: mobilePath, clip: { x: 0, y: 0, width: 390, height: 844 } });
  console.log('Captured Mobile Viewport:', mobilePath);

  await browser.close();
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
