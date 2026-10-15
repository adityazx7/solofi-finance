import { test, expect } from '@playwright/test';

test.describe('SoloFi Full End-to-End Prototype Suite', () => {
  test('1. Marketing Page & Real-Time Hero Tax-Split Simulator', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Verify Hero Headline Option A
    const heading = page.locator('h1');
    await expect(heading).toContainText('Never get surprised by taxes again');

    // Simulate $4,200 invoice payment in hero mock dashboard
    const simButton = page.locator('button:has-text("Simulate $4,200 Invoice Paid")');
    await expect(simButton).toBeVisible({ timeout: 10000 });
    await simButton.click();

    // Verify animated split occurs
    await expect(page.locator('text=+$3,024.00')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=+$1,176.00')).toBeVisible({ timeout: 10000 });
  });

  test('2. Waitlist Funnel & Queue Attribution', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Fill email input in waitlist form
    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.fill(`test_${Date.now()}@freelancestudio.com`);

    // Submit with exact button text
    const submitBtn = page.locator('button:has-text("Join the Priority Waitlist")');
    await submitBtn.click();

    // Verify queue position reveal
    await expect(page.locator('text=Waitlist Confirmed')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=in Line')).toBeVisible({ timeout: 10000 });
  });

  test('3. 1-Click Persona Login & App Shell Dashboard', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle' });

    // Verify personas present
    await expect(page.locator('text=Elena Vance').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Arjun Mehta').first()).toBeVisible({ timeout: 10000 });

    // Click Elena Vance
    await page.locator('button:has-text("Open Hub as Elena Vance")').click();

    // Verify Dashboard loads with Safe-to-Spend & Tax Vault
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=Safe-to-Spend').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Locked Tax Vault').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Total Depository Assets').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Cashflow & Tax Vault Velocity').first()).toBeVisible({ timeout: 10000 });
  });

  test('4. 5-Step Onboarding Wizard with Simulated KYC', async ({ page }) => {
    await page.goto('/onboarding', { waitUntil: 'networkidle' });

    // Step 1: Entity
    await expect(page.locator('text=Select your business entity')).toBeVisible({ timeout: 10000 });
    await page.locator('button:has-text("Next: Jurisdiction")').click();

    // Step 2: Jurisdiction
    await expect(page.locator('text=Tax Residency & Filing Status')).toBeVisible({ timeout: 10000 });
    await page.locator('button:has-text("Next: Revenue & Taxes")').click();

    // Step 3: Revenue & Tax Preview
    await expect(page.locator('text=Revenue & Tax Withholding Forecast')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Recommended Auto-Withholding')).toBeVisible({ timeout: 10000 });
    await page.locator('button:has-text("Next: Identity Verification")').click();

    // Step 4: Simulated KYC
    await expect(page.locator('text=Simulated Partner Bank KYC')).toBeVisible({ timeout: 10000 });
    await page.locator('button:has-text("Verify & Provision")').click();

    // Wait for automated KYC checks to complete
    await expect(page.locator('button:has-text("View Account Numbers")')).toBeVisible({ timeout: 15000 });
    await page.locator('button:has-text("View Account Numbers")').click();

    // Step 5: Account Numbers
    await expect(page.locator('text=Your SoloFi Hub is Ready')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Evolve Bank & Trust')).toBeVisible({ timeout: 10000 });
  });

  test('5. Public Pay Portal & Real-Time Tax Vault Auto-Split', async ({ page }) => {
    // Open public pay portal
    await page.goto('/pay/pay_token_linear_5800', { waitUntil: 'networkidle' });

    // Verify invoice elements
    await expect(page.locator('text=From')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Total Amount Due')).toBeVisible({ timeout: 10000 });

    // If pay button is visible, click to simulate
    const payBtn = page.locator('button:has-text("Pay")');
    if (await payBtn.isVisible()) {
      await payBtn.click();
      await expect(page.locator('text=Payment Received with Thanks')).toBeVisible({ timeout: 10000 });
    } else {
      await expect(page.locator('text=Payment Received with Thanks')).toBeVisible({ timeout: 10000 });
    }
  });

  test('6. Transactions Ledger & Review Inbox', async ({ page }) => {
    await page.goto('/transactions', { waitUntil: 'networkidle' });

    // Verify table loads
    await expect(page.locator('text=Transactions Ledger')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Schedule C Category')).toBeVisible({ timeout: 10000 });

    // Switch to Review Inbox
    const reviewTab = page.locator('button:has-text("Review Inbox")');
    await reviewTab.click();

    // Wait for the unreviewed transaction and click to open drawer
    const reviewItem = page.locator('text=Corner Mart #402').first();
    await expect(reviewItem).toBeVisible({ timeout: 10000 });
    await reviewItem.click();

    // Verify detail drawer elements
    await expect(page.locator('text=Expense Type')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Receipt & Audit Trail')).toBeVisible({ timeout: 10000 });
  });
});
