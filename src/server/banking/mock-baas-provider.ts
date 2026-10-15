/**
 * SoloFi Mock BaaS Provider Implementation
 * Simulates a modern banking partner (Unit / Column / Treasury Prime).
 * Enforces double-entry ledger invariants and triggers real-time Tax Vault splits.
 */

import {
  type BankingProvider,
  type CreateAccountParams,
  type AccountRecord,
  type TransferFundsParams,
  type SimulateDepositParams,
  type DepositResult,
} from './provider-interface';
import { db } from '../db/client';
import {
  accounts,
  transactions,
  vaultTransfers,
  taxProfiles,
  taxPeriods,
  notifications,
  cards,
} from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { LedgerService } from './ledger-service';
import { TaxEngine } from '@/features/tax/lib/tax-engine';

export class MockBaaSProvider implements BankingProvider {
  /**
   * Provisions a simulated checking or vault bucket with realistic routing/account numbers.
   */
  async createAccount(params: CreateAccountParams): Promise<AccountRecord> {
    const accountId = `acc_${nanoid(12)}`;
    const routingNumber = '121000358'; // Simulated Partner Bank routing number
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const isLocked = params.type === 'tax_vault' ? 1 : 0;
    const lockReason = isLocked ? 'Dedicated Tax Vault — locked to prevent unintended tax shortfalls' : null;

    const newAccount = {
      id: accountId,
      businessId: params.businessId,
      name: params.name,
      type: params.type,
      currency: params.currency || 'USD',
      balanceCents: 0,
      availableCents: 0,
      routingNumber: routingNumber,
      accountNumber: accountNumber,
      isLocked: isLocked,
      lockReason: lockReason,
      createdAt: Date.now(),
    };

    await db.insert(accounts).values(newAccount);

    return {
      ...newAccount,
      isLocked: Boolean(isLocked),
    };
  }

  async getAccount(accountId: string): Promise<AccountRecord | null> {
    const res = await db.select().from(accounts).where(eq(accounts.id, accountId)).limit(1);
    if (!res[0]) return null;
    return {
      ...res[0],
      type: res[0].type as AccountRecord['type'],
      isLocked: Boolean(res[0].isLocked),
    };
  }

  async getBusinessAccounts(businessId: string): Promise<AccountRecord[]> {
    const list = await db.select().from(accounts).where(eq(accounts.businessId, businessId));
    return list.map((acc) => ({
      ...acc,
      type: acc.type as AccountRecord['type'],
      isLocked: Boolean(acc.isLocked),
    }));
  }

  /**
   * Transfers funds between buckets with friction check for Tax Vault.
   */
  async transferFunds(params: TransferFundsParams): Promise<{ success: boolean; transferId: string }> {
    const sourceAcc = await this.getAccount(params.sourceAccountId);
    if (!sourceAcc) throw new Error('Source account not found');

    if (sourceAcc.isLocked && !params.overrideTaxVaultLock) {
      throw new Error(
        'Tax Vault is locked to safeguard your quarterly tax liability. Withdrawal requires explicit tax penalty acknowledgement.'
      );
    }

    if (sourceAcc.availableCents < params.amountCents) {
      throw new Error(`Insufficient funds: available $${(sourceAcc.availableCents / 100).toFixed(2)}, required $${(params.amountCents / 100).toFixed(2)}`);
    }

    const transferId = `txf_${nanoid(10)}`;

    await LedgerService.postTransfer({
      sourceAccountId: params.sourceAccountId,
      targetAccountId: params.targetAccountId,
      amountCents: params.amountCents,
      memo: params.memo,
      transactionId: transferId,
    });

    return { success: true, transferId };
  }

  /**
   * The Hero Flow: When an invoice payment is received:
   * 1. Finds Operating Account and Tax Vault.
   * 2. Calculates auto-withholding percentage via pure Tax Engine.
   * 3. Posts gross incoming deposit to Operating Account.
   * 4. Automatically executes double-entry split from Operating Account into Tax Vault.
   * 5. Increments quarterly tax set-aside audit.
   */
  async simulateIncomingPayment(params: SimulateDepositParams): Promise<DepositResult> {
    const businessAccounts = await this.getBusinessAccounts(params.businessId);
    const operatingAcc = businessAccounts.find((a) => a.type === 'operating');
    const taxVaultAcc = businessAccounts.find((a) => a.type === 'tax_vault');

    if (!operatingAcc || !taxVaultAcc) {
      throw new Error('Operating Account or Tax Vault not found for business');
    }

    // 1. Fetch Tax Profile for business
    const profileRes = await db
      .select()
      .from(taxProfiles)
      .where(eq(taxProfiles.businessId, params.businessId))
      .limit(1);

    const profile = profileRes[0];
    const country = (profile?.country as 'US' | 'IN') || 'US';

    // 2. Compute withholding via pure TaxEngine
    const withholding = TaxEngine.calculateWithholding({
      country: country,
      incomingPaymentCents: params.amountCents,
      mode: (profile?.withholdingMode as 'auto' | 'fixed' | 'tiered') || 'auto',
      fixedRateBps: profile?.fixedRateBps || 2800,
      roundUpIncrementCents: profile?.roundUpIncrementCents || 0,
      usePresumptive44Ada: Boolean(profile?.presumptiveTaxationEligible ?? 1),
    });

    const timestamp = Date.now();
    const transactionId = `txn_${nanoid(12)}`;

    // 3. Post gross incoming payment into Operating account
    await db.insert(transactions).values({
      id: transactionId,
      businessId: params.businessId,
      accountId: operatingAcc.id,
      amountCents: params.amountCents,
      direction: 'inbound',
      method: 'ach',
      status: 'posted',
      counterparty: params.counterparty,
      rawDescription: params.rawDescription || `Incoming payment from ${params.counterparty}`,
      categoryId: 'cat_client_revenue',
      confidenceScore: 1.0,
      isReviewed: 1,
      isBusiness: 1,
      isDeductible: 0,
      postedAt: timestamp,
      createdAt: timestamp,
    });

    // 4. Update Operating balance for gross deposit
    await db
      .update(accounts)
      .set({
        balanceCents: operatingAcc.balanceCents + params.amountCents,
        availableCents: operatingAcc.availableCents + params.amountCents,
      })
      .where(eq(accounts.id, operatingAcc.id));

    // 5. If withholding > 0, execute double-entry split into Tax Vault
    let vaultTransferId: string | undefined = undefined;
    if (withholding.withholdingAmountCents > 0 && params.triggerAutoWithholding !== false) {
      vaultTransferId = `vtx_${nanoid(12)}`;

      // Create VaultTransfer audit record
      await db.insert(vaultTransfers).values({
        id: vaultTransferId,
        businessId: params.businessId,
        sourceAccountId: operatingAcc.id,
        taxVaultAccountId: taxVaultAcc.id,
        triggerInvoiceId: params.invoiceId,
        triggerTransactionId: transactionId,
        grossAmountCents: params.amountCents,
        withholdingRateBps: withholding.withholdingRateBps,
        taxWithheldCents: withholding.withholdingAmountCents,
        netOperatingCents: withholding.netOperatingCents,
        reason: `Auto-withheld ${withholding.withholdingRateBps / 100}% into Tax Vault from ${params.counterparty}`,
        createdAt: timestamp,
      });

      // Post double-entry movement from Operating to Tax Vault
      await LedgerService.postTransfer({
        transactionId: transactionId,
        vaultTransferId: vaultTransferId,
        sourceAccountId: operatingAcc.id,
        targetAccountId: taxVaultAcc.id,
        amountCents: withholding.withholdingAmountCents,
        memo: `Auto-split into Tax Vault (${withholding.withholdingRateBps / 100}%)`,
      });

      // Update current quarter actualSetAside in taxPeriods
      const currentQuarter = 'Q2'; // Default demo quarter
      await db
        .update(taxPeriods)
        .set({
          actualSetAsideCents: taxVaultAcc.balanceCents + withholding.withholdingAmountCents,
        })
        .where(
          and(
            eq(taxPeriods.taxProfileId, profile?.id || ''),
            eq(taxPeriods.quarter, currentQuarter)
          )
        );

      // Create high-priority notification
      await db.insert(notifications).values({
        id: `notif_${nanoid(10)}`,
        userId: 'user_demo_1',
        title: 'Tax Vault Funded',
        message: `$${(withholding.withholdingAmountCents / 100).toFixed(2)} auto-transferred to your Tax Vault from ${params.counterparty}.`,
        type: 'tax_withholding',
        isRead: 0,
        createdAt: timestamp,
      });
    }

    return {
      transactionId,
      grossAmountCents: params.amountCents,
      netOperatingCents: withholding.netOperatingCents,
      taxWithheldCents: withholding.withholdingAmountCents,
      withholdingRateBps: withholding.withholdingRateBps,
      vaultTransferId,
    };
  }

  async freezeCard(cardId: string): Promise<boolean> {
    await db.update(cards).set({ status: 'frozen' }).where(eq(cards.id, cardId));
    return true;
  }

  async unfreezeCard(cardId: string): Promise<boolean> {
    await db.update(cards).set({ status: 'active' }).where(eq(cards.id, cardId));
    return true;
  }
}

export const bankingProvider: BankingProvider = new MockBaaSProvider();
