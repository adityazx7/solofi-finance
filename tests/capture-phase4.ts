import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/AP/.gemini/antigravity/brain/d762580b-f08b-4b27-802a-8d41b8c0496e';

async function capture() {
  console.log('Launching browser for Phase 4 visual verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  // 1. Login Page with 1-Click Personas
  console.log('Navigating to /login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase4-login-personas.png'),
    fullPage: false,
  });

  // 2. Onboarding Wizard Step 1 & Step 3
  console.log('Navigating to /onboarding...');
  await page.goto('http://localhost:3000/onboarding', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase4-onboarding-wizard.png'),
    fullPage: false,
  });

  // Step through onboarding to KYC & Account Provisioning
  console.log('Stepping through onboarding wizard...');
  // Click Next to Step 2
  await page.click('button:has-text("Next: Jurisdiction")');
  await page.waitForTimeout(300);
  // Click Next to Step 3
  await page.click('button:has-text("Next: Revenue & Taxes")');
  await page.waitForTimeout(300);
  // Click Next to Step 4 (KYC)
  await page.click('button:has-text("Next: Identity Verification")');
  await page.waitForTimeout(300);
  // Run simulated KYC
  await page.click('button:has-text("Verify & Provision")');
  await page.waitForTimeout(4000); // Wait for animated steps to finish
  // Click View Account Numbers (Step 5)
  await page.click('button:has-text("View Account Numbers")');
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase4-onboarding-provisioned.png'),
    fullPage: false,
  });

  // 3. Dashboard with Desktop App Shell
  console.log('Navigating to /dashboard...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase4-app-shell-dashboard.png'),
    fullPage: false,
  });

  // 4. Open Command Palette (⌘K)
  console.log('Opening Command Palette...');
  await page.keyboard.press('Control+K');
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase4-command-palette.png'),
    fullPage: false,
  });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);

  // 5. Open Floating Demo Control Panel
  console.log('Opening Floating Demo Control Panel...');
  await page.locator('button:has-text("Demo Sandbox")').click({ force: true });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase4-demo-control-panel.png'),
    fullPage: false,
  });

  // 6. Mobile 390px Viewport (Native feel)
  console.log('Capturing 390px mobile app shell...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, 'phase4-mobile-app-shell.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('All Phase 4 visual artifacts captured successfully!');
}

capture().catch((err) => {
  console.error('Error capturing Phase 4 screenshots:', err);
  process.exit(1);
});
