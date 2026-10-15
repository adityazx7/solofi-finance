/**
 * SoloFi Database Schema (Drizzle ORM + SQLite/LibSQL)
 * Mathematical guarantees:
 * - All monetary balances, deposits, taxes, and fees are stored in integer minor units (cents / paise).
 * - Double-entry ledger architecture: every money movement creates balancing debit/credit entries in ledgerEntries.
 */

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// 1. Users
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('owner'), // 'owner' | 'accountant' | 'viewer'
  avatarUrl: text('avatar_url'),
  demoPersonaId: text('demo_persona_id'),
  createdAt: integer('created_at').notNull(),
});

// 2. Businesses
export const businesses = sqliteTable('businesses', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  legalName: text('legal_name').notNull(),
  tradeName: text('trade_name'),
  businessType: text('business_type').notNull(), // 'freelancer' | 'sole_prop' | 'llc' | 'startup'
  taxId: text('tax_id'),
  country: text('country').notNull().default('US'), // 'US' | 'IN'
  currency: text('currency').notNull().default('USD'), // 'USD' | 'INR'
  annualRevenueEstimateCents: integer('annual_revenue_estimate_cents').notNull().default(0),
  filingStatus: text('filing_status').notNull().default('single'),
  createdAt: integer('created_at').notNull(),
});

// 3. Tax Profiles
export const taxProfiles = sqliteTable('tax_profiles', {
  id: text('id').primaryKey(),
  businessId: text('business_id').notNull().unique().references(() => businesses.id),
  country: text('country').notNull(),
  stateOrRegion: text('state_or_region'),
  withholdingMode: text('withholding_mode').notNull().default('auto'), // 'auto' | 'fixed' | 'tiered'
  fixedRateBps: integer('fixed_rate_bps').default(2500), // e.g. 2500 = 25.00%
  effectiveYear: integer('effective_year').notNull().default(2025),
  presumptiveTaxationEligible: integer('presumptive_taxation_eligible').notNull().default(1),
  gstRegistered: integer('gst_registered').notNull().default(0),
  gstNumber: text('gst_number'),
  roundUpIncrementCents: integer('round_up_increment_cents').default(0),
  createdAt: integer('created_at').notNull(),
});

// 4. Accounts (Operating, Tax Vault, Savings, Personal)
export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  businessId: text('business_id').notNull().references(() => businesses.id),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'operating' | 'tax_vault' | 'savings' | 'personal'
  currency: text('currency').notNull().default('USD'),
  balanceCents: integer('balance_cents').notNull().default(0),
  availableCents: integer('available_cents').notNull().default(0),
  routingNumber: text('routing_number').notNull(),
  accountNumber: text('account_number').notNull(),
  isLocked: integer('is_locked').notNull().default(0), // 1 for Tax Vault
  lockReason: text('lock_reason'),
  createdAt: integer('created_at').notNull(),
});

// 5. Double-Entry Ledger Entries (Invariant: Debits == Credits)
export const ledgerEntries = sqliteTable('ledger_entries', {
  id: text('id').primaryKey(),
  transactionId: text('transaction_id'),
  vaultTransferId: text('vault_transfer_id'),
  accountId: text('account_id').notNull().references(() => accounts.id),
  direction: text('direction').notNull(), // 'debit' | 'credit'
  amountCents: integer('amount_cents').notNull(),
  memo: text('memo').notNull(),
  createdAt: integer('created_at').notNull(),
});

// 6. Categories & Rules
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon').notNull().default('Tag'),
  color: text('color').notNull().default('#059669'),
  isDeductibleDefault: integer('is_deductible_default').notNull().default(1),
  taxScheduleLine: text('tax_schedule_line'),
  isSystem: integer('is_system').notNull().default(1),
});

export const categoryRules = sqliteTable('category_rules', {
  id: text('id').primaryKey(),
  businessId: text('business_id').notNull().references(() => businesses.id),
  pattern: text('pattern').notNull(),
  field: text('field').notNull().default('rawDescription'), // 'rawDescription' | 'counterparty' | 'mcc'
  targetCategoryId: text('target_category_id').notNull().references(() => categories.id),
  isBusiness: integer('is_business').notNull().default(1),
  isDeductible: integer('is_deductible').notNull().default(1),
  deductiblePercentage: integer('deductible_percentage').notNull().default(100),
  priority: integer('priority').notNull().default(10),
  createdAt: integer('created_at').notNull(),
});

// 7. Transactions (The Unified Ledger View)
export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  businessId: text('business_id').notNull().references(() => businesses.id),
  accountId: text('account_id').notNull().references(() => accounts.id),
  amountCents: integer('amount_cents').notNull(),
  direction: text('direction').notNull(), // 'inbound' | 'outbound'
  method: text('method').notNull(), // 'ach' | 'wire' | 'card' | 'transfer' | 'fee' | 'tax_split'
  status: text('status').notNull().default('posted'), // 'pending' | 'posted' | 'declined'
  counterparty: text('counterparty').notNull(),
  rawDescription: text('raw_description').notNull(),
  mcc: text('mcc'),
  categoryId: text('category_id').references(() => categories.id),
  confidenceScore: real('confidence_score').notNull().default(1.0),
  isReviewed: integer('is_reviewed').notNull().default(1),
  isBusiness: integer('is_business').notNull().default(1),
  isDeductible: integer('is_deductible').notNull().default(1),
  deductiblePercentage: integer('deductible_percentage').notNull().default(100),
  notes: text('notes'),
  postedAt: integer('posted_at').notNull(),
  createdAt: integer('created_at').notNull(),
});

// 8. Receipts & Mock OCR
export const receipts = sqliteTable('receipts', {
  id: text('id').primaryKey(),
  transactionId: text('transaction_id').notNull().references(() => transactions.id),
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name').notNull(),
  mimeType: text('mime_type').notNull(),
  fileSize: integer('file_size').notNull(),
  ocrMerchant: text('ocr_merchant'),
  ocrAmountCents: integer('ocr_amount_cents'),
  ocrDate: text('ocr_date'),
  ocrConfidence: real('ocr_confidence'),
  uploadedAt: integer('uploaded_at').notNull(),
});

// 9. Clients & Invoices
export const clients = sqliteTable('clients', {
  id: text('id').primaryKey(),
  businessId: text('business_id').notNull().references(() => businesses.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  address: text('address'),
  currency: text('currency').notNull().default('USD'),
  defaultPaymentTermsDays: integer('default_payment_terms_days').notNull().default(30),
  createdAt: integer('created_at').notNull(),
});

export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey(),
  businessId: text('business_id').notNull().references(() => businesses.id),
  clientId: text('client_id').notNull().references(() => clients.id),
  invoiceNumber: text('invoice_number').notNull(),
  status: text('status').notNull().default('draft'), // 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue'
  issueDate: text('issue_date').notNull(),
  dueDate: text('due_date').notNull(),
  currency: text('currency').notNull().default('USD'),
  subtotalCents: integer('subtotal_cents').notNull(),
  taxRateBps: integer('tax_rate_bps').notNull().default(0),
  taxAmountCents: integer('tax_amount_cents').notNull().default(0),
  totalAmountCents: integer('total_amount_cents').notNull(),
  notes: text('notes'),
  paymentTerms: text('payment_terms').notNull().default('Net 30'),
  shareToken: text('share_token').notNull().unique(),
  paidAt: integer('paid_at'),
  createdAt: integer('created_at').notNull(),
});

export const invoiceItems = sqliteTable('invoice_items', {
  id: text('id').primaryKey(),
  invoiceId: text('invoice_id').notNull().references(() => invoices.id),
  description: text('description').notNull(),
  quantity: real('quantity').notNull().default(1),
  unitPriceCents: integer('unit_price_cents').notNull(),
  amountCents: integer('amount_cents').notNull(),
});

// 10. Vault Transfers (Auto-Split Audit Records)
export const vaultTransfers = sqliteTable('vault_transfers', {
  id: text('id').primaryKey(),
  businessId: text('business_id').notNull().references(() => businesses.id),
  sourceAccountId: text('source_account_id').notNull().references(() => accounts.id),
  taxVaultAccountId: text('tax_vault_account_id').notNull().references(() => accounts.id),
  triggerInvoiceId: text('trigger_invoice_id').references(() => invoices.id),
  triggerTransactionId: text('trigger_transaction_id').references(() => transactions.id),
  grossAmountCents: integer('gross_amount_cents').notNull(),
  withholdingRateBps: integer('withholding_rate_bps').notNull(),
  taxWithheldCents: integer('tax_withheld_cents').notNull(),
  netOperatingCents: integer('net_operating_cents').notNull(),
  reason: text('reason').notNull(),
  createdAt: integer('created_at').notNull(),
});

// 11. Tax Periods & Deadlines
export const taxPeriods = sqliteTable('tax_periods', {
  id: text('id').primaryKey(),
  taxProfileId: text('tax_profile_id').notNull().references(() => taxProfiles.id),
  year: integer('year').notNull(),
  quarter: text('quarter').notNull(), // 'Q1' | 'Q2' | 'Q3' | 'Q4'
  dueDate: text('due_date').notNull(),
  estimatedLiabilityCents: integer('estimated_liability_cents').notNull().default(0),
  actualSetAsideCents: integer('actual_set_aside_cents').notNull().default(0),
  paidAmountCents: integer('paid_amount_cents').notNull().default(0),
  isPaid: integer('is_paid').notNull().default(0),
  paidAt: integer('paid_at'),
});

// 12. Cards, Goals, Notifications, Waitlist & Audits
export const cards = sqliteTable('cards', {
  id: text('id').primaryKey(),
  businessId: text('business_id').notNull().references(() => businesses.id),
  accountId: text('account_id').notNull().references(() => accounts.id),
  cardholderName: text('cardholder_name').notNull(),
  lastFour: text('last_four').notNull(),
  expMonth: integer('exp_month').notNull(),
  expYear: integer('exp_year').notNull(),
  brand: text('brand').notNull().default('Visa'),
  type: text('type').notNull().default('virtual'),
  status: text('status').notNull().default('active'), // 'active' | 'frozen' | 'cancelled'
  spendingLimitCents: integer('spending_limit_cents').notNull().default(500000), // $5,000
  spendingLimitPeriod: text('spending_limit_period').notNull().default('per_month'),
  createdAt: integer('created_at').notNull(),
});

export const goals = sqliteTable('goals', {
  id: text('id').primaryKey(),
  businessId: text('business_id').notNull().references(() => businesses.id),
  name: text('name').notNull(),
  targetAmountCents: integer('target_amount_cents').notNull(),
  currentAmountCents: integer('current_amount_cents').notNull().default(0),
  targetDate: text('target_date'),
  color: text('color').notNull().default('#059669'),
  icon: text('icon').notNull().default('Target'),
  isCompleted: integer('is_completed').notNull().default(0),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('system'), // 'tax_withholding' | 'invoice_paid' | 'review_needed' | 'limit_alert' | 'system'
  isRead: integer('is_read').notNull().default(0),
  linkUrl: text('link_url'),
  createdAt: integer('created_at').notNull(),
});

export const waitlistEntries = sqliteTable('waitlist_entries', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  role: text('role').notNull(),
  monthlyIncomeBand: text('monthly_income_band').notNull(),
  biggestTaxWorry: text('biggest_tax_worry'),
  referralCode: text('referral_code').notNull().unique(),
  referredByCode: text('referred_by_code'),
  queuePosition: integer('queue_position').notNull(),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium'),
  utmCampaign: text('utm_campaign'),
  createdAt: integer('created_at').notNull(),
});

export const analyticsEvents = sqliteTable('analytics_events', {
  id: text('id').primaryKey(),
  eventName: text('event_name').notNull(),
  propertiesJson: text('properties_json'),
  visitorId: text('visitor_id'),
  sessionId: text('session_id'),
  createdAt: integer('created_at').notNull(),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  businessId: text('business_id'),
  userId: text('user_id'),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  payloadJson: text('payload_json'),
  ipAddress: text('ip_address'),
  createdAt: integer('created_at').notNull(),
});
