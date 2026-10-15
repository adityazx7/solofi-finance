import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\AP\\.gemini\\antigravity\\brain\\d762580b-f08b-4b27-802a-8d41b8c0496e';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // Retina fidelity
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000/design...');
  await page.goto('http://localhost:3000/design', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Capture Light Mode
  const lightPath = path.join(ARTIFACT_DIR, 'phase1-design-light.png');
  await page.screenshot({ path: lightPath, fullPage: true });
  console.log('Captured Light Mode:', lightPath);

  // 2. Switch to Dark Mode by clicking the dark mode theme button
  const darkButton = page.locator('button[aria-label="Dark mode"]');
  if (await darkButton.count() > 0) {
    await darkButton.click();
    await page.waitForTimeout(800);
  } else {
    // Alternatively add 'dark' class to html element
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    });
    await page.waitForTimeout(500);
  }

  // 3. Capture Dark Mode
  const darkPath = path.join(ARTIFACT_DIR, 'phase1-design-dark.png');
  await page.screenshot({ path: darkPath, fullPage: true });
  console.log('Captured Dark Mode:', darkPath);

  // 4. Capture Mobile Viewport (390px iPhone standard as requested in prompt)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  const mobileDarkPath = path.join(ARTIFACT_DIR, 'phase1-design-mobile-dark.png');
  await page.screenshot({ path: mobileDarkPath, fullPage: false });
  console.log('Captured Mobile Dark Mode:', mobileDarkPath);

  await browser.close();
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
