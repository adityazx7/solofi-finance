/**
 * SoloFi Double-Entry Ledger Service
 * Enforces fundamental accounting invariants:
 * 1. For every money movement, total debits MUST equal total credits.
 * 2. Balances cannot be updated arbitrarily without corresponding ledger entries.
 * 3. Supports audit trail and ledger verification.
 */

import { db } from '../db/client';
import { accounts, ledgerEntries, transactions, vaultTransfers } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export interface PostDoubleEntryParams {
  transactionId?: string;
  vaultTransferId?: string;
  sourceAccountId: string;
  targetAccountId: string;
  amountCents: number;
  memo: string;
}

export class LedgerService {
  /**
   * Posts balanced debit and credit entries between two accounts.
   * Decrements source account (credit in asset accounting) and increments target (debit).
   */
  static async postTransfer(params: PostDoubleEntryParams) {
    if (params.amountCents <= 0) {
      throw new Error(`Transfer amount must be positive. Received: ${params.amountCents}`);
    }

    const timestamp = Date.now();
    const debitEntryId = `led_deb_${nanoid(10)}`;
    const creditEntryId = `led_crd_${nanoid(10)}`;

    // 1. Insert balanced ledger lines
    await db.insert(ledgerEntries).values([
      {
        id: debitEntryId,
        transactionId: params.transactionId,
        vaultTransferId: params.vaultTransferId,
        accountId: params.targetAccountId, // Target receives funds (Debit)
        direction: 'debit',
        amountCents: params.amountCents,
        memo: params.memo,
        createdAt: timestamp,
      },
      {
        id: creditEntryId,
        transactionId: params.transactionId,
        vaultTransferId: params.vaultTransferId,
        accountId: params.sourceAccountId, // Source gives funds (Credit)
        direction: 'credit',
        amountCents: params.amountCents,
        memo: params.memo,
        createdAt: timestamp,
      },
    ]);

    // 2. Atomically update target account balance (+ amount)
    await db
      .update(accounts)
      .set({
        balanceCents: sql`${accounts.balanceCents} + ${params.amountCents}`,
        availableCents: sql`${accounts.availableCents} + ${params.amountCents}`,
      })
      .where(eq(accounts.id, params.targetAccountId));

    // 3. Atomically update source account balance (- amount)
    await db
      .update(accounts)
      .set({
        balanceCents: sql`${accounts.balanceCents} - ${params.amountCents}`,
        availableCents: sql`${accounts.availableCents} - ${params.amountCents}`,
      })
      .where(eq(accounts.id, params.sourceAccountId));

    return {
      debitEntryId,
      creditEntryId,
      amountCents: params.amountCents,
      timestamp,
    };
  }

  /**
   * Verifies the fundamental mathematical balance of the entire ledger across all accounts.
   */
  static async verifyLedgerIntegrity() {
    const allDebitsResult = await db
      .select({ totalDebits: sql<number>`coalesce(sum(${ledgerEntries.amountCents}), 0)` })
      .from(ledgerEntries)
      .where(eq(ledgerEntries.direction, 'debit'));

    const allCreditsResult = await db
      .select({ totalCredits: sql<number>`coalesce(sum(${ledgerEntries.amountCents}), 0)` })
      .from(ledgerEntries)
      .where(eq(ledgerEntries.direction, 'credit'));

    const totalDebits = allDebitsResult[0]?.totalDebits ?? 0;
    const totalCredits = allCreditsResult[0]?.totalCredits ?? 0;

    const isBalanced = totalDebits === totalCredits;

    return {
      isBalanced,
      totalDebitsCents: totalDebits,
      totalCreditsCents: totalCredits,
      discrepancyCents: Math.abs(totalDebits - totalCredits),
    };
  }
}
