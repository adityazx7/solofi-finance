import { describe, it, expect, beforeAll } from 'vitest';
import { seedDatabase } from '@/server/db/seed';
import { LedgerService } from '@/server/banking/ledger-service';
import { MockBaaSProvider } from '@/server/banking/mock-baas-provider';
import { db } from '@/server/db/client';
import { accounts } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

describe('BaaS & Double-Entry Ledger Invariants', () => {
  const baas = new MockBaaSProvider();

  beforeAll(async () => {
    await seedDatabase();
  });

  it('verifies initial ledger integrity has zero discrepancy', async () => {
    const integrity = await LedgerService.verifyLedgerIntegrity();
    expect(integrity.isBalanced).toBe(true);
    expect(integrity.discrepancyCents).toBe(0);
  });

  it('simulates an incoming payment, calculates auto-withholding and splits into Tax Vault', async () => {
    // Check initial Tax Vault balance
    const vaultBefore = (
      await db.select().from(accounts).where(eq(accounts.id, 'acc_elena_tax_vault')).limit(1)
    )[0];
    const initialVaultCents = vaultBefore.balanceCents;

    // Simulate $4,200 invoice received from Acme Design
    const result = await baas.simulateIncomingPayment({
      businessId: 'biz_vance_studio',
      counterparty: 'Acme Design Corp',
      amountCents: 420000, // $4,200.00
      invoiceId: 'inv_elena_001',
      triggerAutoWithholding: true,
    });

    expect(result.grossAmountCents).toBe(420000);
    // Auto-engine calculated rate based on $50.4k projected income: ~16.5% rounded up -> $700.00 (70,000 cents)
    expect(result.taxWithheldCents).toBe(70000);
    expect(result.netOperatingCents).toBe(350000);

    // Verify Tax Vault balance increased by exactly the taxWithheldCents
    const vaultAfter = (
      await db.select().from(accounts).where(eq(accounts.id, 'acc_elena_tax_vault')).limit(1)
    )[0];
    expect(vaultAfter.balanceCents).toBe(initialVaultCents + 70000);

    // Verify double-entry ledger remains mathematically balanced (debits == credits)
    const integrityAfter = await LedgerService.verifyLedgerIntegrity();
    expect(integrityAfter.isBalanced).toBe(true);
    expect(integrityAfter.discrepancyCents).toBe(0);
  });

  it('prevents unauthorized withdrawal from locked Tax Vault', async () => {
    await expect(
      baas.transferFunds({
        businessId: 'biz_vance_studio',
        sourceAccountId: 'acc_elena_tax_vault',
        targetAccountId: 'acc_elena_operating',
        amountCents: 100000,
        memo: 'Attempted withdrawal',
        overrideTaxVaultLock: false, // Locked!
      })
    ).rejects.toThrow(/Tax Vault is locked/);
  });

  it('allows withdrawal when explicit override and tax consequence acknowledgement is provided', async () => {
    const transfer = await baas.transferFunds({
      businessId: 'biz_vance_studio',
      sourceAccountId: 'acc_elena_tax_vault',
      targetAccountId: 'acc_elena_operating',
      amountCents: 50000, // $500
      memo: 'Approved emergency withdrawal',
      overrideTaxVaultLock: true,
    });

    expect(transfer.success).toBe(true);

    // Verify ledger still balanced after withdrawal
    const integrity = await LedgerService.verifyLedgerIntegrity();
    expect(integrity.isBalanced).toBe(true);
    expect(integrity.discrepancyCents).toBe(0);
  });
});
