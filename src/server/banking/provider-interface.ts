/**
 * SoloFi Banking-as-a-Service (BaaS) Provider Interface
 * Standardizes bank account management, card provisioning, and fund transfers.
 * The production implementation could be Unit, Column, or Treasury Prime.
 */

export interface CreateAccountParams {
  businessId: string;
  name: string;
  type: 'operating' | 'tax_vault' | 'savings' | 'personal';
  currency?: 'USD' | 'INR';
}

export interface AccountRecord {
  id: string;
  businessId: string;
  name: string;
  type: 'operating' | 'tax_vault' | 'savings' | 'personal';
  currency: string;
  balanceCents: number;
  availableCents: number;
  routingNumber: string;
  accountNumber: string;
  isLocked: boolean;
  lockReason?: string | null;
}

export interface TransferFundsParams {
  businessId: string;
  sourceAccountId: string;
  targetAccountId: string;
  amountCents: number;
  memo: string;
  overrideTaxVaultLock?: boolean; // Must be true if withdrawing from Tax Vault
}

export interface SimulateDepositParams {
  businessId: string;
  counterparty: string;
  amountCents: number;
  invoiceId?: string;
  rawDescription?: string;
  triggerAutoWithholding?: boolean;
}

export interface DepositResult {
  transactionId: string;
  grossAmountCents: number;
  netOperatingCents: number;
  taxWithheldCents: number;
  withholdingRateBps: number;
  vaultTransferId?: string;
}

export interface IssueCardParams {
  businessId: string;
  accountId: string;
  cardholderName: string;
  spendingLimitCents?: number;
}

export interface BankingProvider {
  createAccount(params: CreateAccountParams): Promise<AccountRecord>;
  getAccount(accountId: string): Promise<AccountRecord | null>;
  getBusinessAccounts(businessId: string): Promise<AccountRecord[]>;
  transferFunds(params: TransferFundsParams): Promise<{ success: boolean; transferId: string }>;
  simulateIncomingPayment(params: SimulateDepositParams): Promise<DepositResult>;
  freezeCard(cardId: string): Promise<boolean>;
  unfreezeCard(cardId: string): Promise<boolean>;
}
