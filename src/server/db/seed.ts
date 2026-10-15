/**
 * SoloFi Deterministic Database Seeder
 * Seeds 12 months of realistic, rich financial data for 4 distinct solopreneur personas.
 * Generates accounts, double-entry ledger lines, categorized transactions, invoices, and quarterly deadlines.
 */

import { rawClient, db } from './client';
import {
  users,
  businesses,
  taxProfiles,
  accounts,
  ledgerEntries,
  transactions,
  categories,
  categoryRules,
  clients,
  invoices,
  invoiceItems,
  vaultTransfers,
  taxPeriods,
  cards,
  goals,
  notifications,
  waitlistEntries,
} from './schema';
import { sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// Standard System Categories
const DEFAULT_CATEGORIES = [
  { id: 'cat_client_revenue', name: 'Client Revenue & Invoicing', slug: 'client-revenue', icon: 'Briefcase', color: '#10B981', isDeductibleDefault: 0, taxScheduleLine: 'Part I, Line 1 (Gross receipts)', isSystem: 1 },
  { id: 'cat_software_saas', name: 'Software & Cloud Tools', slug: 'software-saas', icon: 'Code', color: '#3B82F6', isDeductibleDefault: 1, taxScheduleLine: 'Part II, Line 18 (Office expense)', isSystem: 1 },
  { id: 'cat_cloud_hosting', name: 'Hosting & Server Infrastructure', slug: 'cloud-hosting', icon: 'Server', color: '#6366F1', isDeductibleDefault: 1, taxScheduleLine: 'Part II, Line 27a (Other expenses)', isSystem: 1 },
  { id: 'cat_hardware_equipment', name: 'Hardware & Tech Equipment', slug: 'hardware-equipment', icon: 'Laptop', color: '#8B5CF6', isDeductibleDefault: 1, taxScheduleLine: 'Part II, Line 13 (Depreciation / Sec 179)', isSystem: 1 },
  { id: 'cat_advertising', name: 'Advertising & Marketing', slug: 'advertising', icon: 'Megaphone', color: '#EC4899', isDeductibleDefault: 1, taxScheduleLine: 'Part II, Line 8 (Advertising)', isSystem: 1 },
  { id: 'cat_legal_accounting', name: 'Legal & Professional Services', slug: 'legal-accounting', icon: 'Scale', color: '#14B8A6', isDeductibleDefault: 1, taxScheduleLine: 'Part II, Line 17 (Legal and professional)', isSystem: 1 },
  { id: 'cat_meals_entertainment', name: 'Business Meals & Coffee (50%)', slug: 'meals-entertainment', icon: 'Coffee', color: '#F59E0B', isDeductibleDefault: 1, taxScheduleLine: 'Part II, Line 24b (Deductible meals: 50%)', isSystem: 1 },
  { id: 'cat_travel_transportation', name: 'Travel & Rideshare', slug: 'travel-transportation', icon: 'Car', color: '#06B6D4', isDeductibleDefault: 1, taxScheduleLine: 'Part II, Line 9 / 24a (Travel / Car expense)', isSystem: 1 },
  { id: 'cat_bank_fees', name: 'Bank & Wire Processing Fees', slug: 'bank-fees', icon: 'CreditCard', color: '#64748B', isDeductibleDefault: 1, taxScheduleLine: 'Part II, Line 10 (Commissions and fees)', isSystem: 1 },
  { id: 'cat_personal', name: 'Personal / Non-Deductible', slug: 'personal', icon: 'User', color: '#94A3B8', isDeductibleDefault: 0, taxScheduleLine: 'Non-deductible', isSystem: 1 },
];

export async function createTablesIfNotExist() {
  const ddlStatements = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'owner',
      avatar_url TEXT,
      demo_persona_id TEXT,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS businesses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      legal_name TEXT NOT NULL,
      trade_name TEXT,
      business_type TEXT NOT NULL,
      tax_id TEXT,
      country TEXT NOT NULL DEFAULT 'US',
      currency TEXT NOT NULL DEFAULT 'USD',
      annual_revenue_estimate_cents INTEGER NOT NULL DEFAULT 0,
      filing_status TEXT NOT NULL DEFAULT 'single',
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS tax_profiles (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL UNIQUE,
      country TEXT NOT NULL,
      state_or_region TEXT,
      withholding_mode TEXT NOT NULL DEFAULT 'auto',
      fixed_rate_bps INTEGER DEFAULT 2500,
      effective_year INTEGER NOT NULL DEFAULT 2025,
      presumptive_taxation_eligible INTEGER NOT NULL DEFAULT 1,
      gst_registered INTEGER NOT NULL DEFAULT 0,
      gst_number TEXT,
      round_up_increment_cents INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      balance_cents INTEGER NOT NULL DEFAULT 0,
      available_cents INTEGER NOT NULL DEFAULT 0,
      routing_number TEXT NOT NULL,
      account_number TEXT NOT NULL,
      is_locked INTEGER NOT NULL DEFAULT 0,
      lock_reason TEXT,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS ledger_entries (
      id TEXT PRIMARY KEY,
      transaction_id TEXT,
      vault_transfer_id TEXT,
      account_id TEXT NOT NULL,
      direction TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      memo TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      icon TEXT NOT NULL DEFAULT 'Tag',
      color TEXT NOT NULL DEFAULT '#059669',
      is_deductible_default INTEGER NOT NULL DEFAULT 1,
      tax_schedule_line TEXT,
      is_system INTEGER NOT NULL DEFAULT 1
    )`,
    `CREATE TABLE IF NOT EXISTS category_rules (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      pattern TEXT NOT NULL,
      field TEXT NOT NULL DEFAULT 'rawDescription',
      target_category_id TEXT NOT NULL,
      is_business INTEGER NOT NULL DEFAULT 1,
      is_deductible INTEGER NOT NULL DEFAULT 1,
      deductible_percentage INTEGER NOT NULL DEFAULT 100,
      priority INTEGER NOT NULL DEFAULT 10,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      direction TEXT NOT NULL,
      method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'posted',
      counterparty TEXT NOT NULL,
      raw_description TEXT NOT NULL,
      mcc TEXT,
      category_id TEXT,
      confidence_score REAL NOT NULL DEFAULT 1.0,
      is_reviewed INTEGER NOT NULL DEFAULT 1,
      is_business INTEGER NOT NULL DEFAULT 1,
      is_deductible INTEGER NOT NULL DEFAULT 1,
      deductible_percentage INTEGER NOT NULL DEFAULT 100,
      notes TEXT,
      posted_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      ocr_merchant TEXT,
      ocr_amount_cents INTEGER,
      ocr_date TEXT,
      ocr_confidence REAL,
      uploaded_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      address TEXT,
      currency TEXT NOT NULL DEFAULT 'USD',
      default_payment_terms_days INTEGER NOT NULL DEFAULT 30,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      client_id TEXT NOT NULL,
      invoice_number TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      issue_date TEXT NOT NULL,
      due_date TEXT NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      subtotal_cents INTEGER NOT NULL,
      tax_rate_bps INTEGER NOT NULL DEFAULT 0,
      tax_amount_cents INTEGER NOT NULL DEFAULT 0,
      total_amount_cents INTEGER NOT NULL,
      notes TEXT,
      payment_terms TEXT NOT NULL DEFAULT 'Net 30',
      share_token TEXT NOT NULL UNIQUE,
      paid_at INTEGER,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS invoice_items (
      id TEXT PRIMARY KEY,
      invoice_id TEXT NOT NULL,
      description TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      unit_price_cents INTEGER NOT NULL,
      amount_cents INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS vault_transfers (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      source_account_id TEXT NOT NULL,
      tax_vault_account_id TEXT NOT NULL,
      trigger_invoice_id TEXT,
      trigger_transaction_id TEXT,
      gross_amount_cents INTEGER NOT NULL,
      withholding_rate_bps INTEGER NOT NULL,
      tax_withheld_cents INTEGER NOT NULL,
      net_operating_cents INTEGER NOT NULL,
      reason TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS tax_periods (
      id TEXT PRIMARY KEY,
      tax_profile_id TEXT NOT NULL,
      year INTEGER NOT NULL,
      quarter TEXT NOT NULL,
      due_date TEXT NOT NULL,
      estimated_liability_cents INTEGER NOT NULL DEFAULT 0,
      actual_set_aside_cents INTEGER NOT NULL DEFAULT 0,
      paid_amount_cents INTEGER NOT NULL DEFAULT 0,
      is_paid INTEGER NOT NULL DEFAULT 0,
      paid_at INTEGER
    )`,
    `CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      cardholder_name TEXT NOT NULL,
      last_four TEXT NOT NULL,
      exp_month INTEGER NOT NULL,
      exp_year INTEGER NOT NULL,
      brand TEXT NOT NULL DEFAULT 'Visa',
      type TEXT NOT NULL DEFAULT 'virtual',
      status TEXT NOT NULL DEFAULT 'active',
      spending_limit_cents INTEGER NOT NULL DEFAULT 500000,
      spending_limit_period TEXT NOT NULL DEFAULT 'per_month',
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      name TEXT NOT NULL,
      target_amount_cents INTEGER NOT NULL,
      current_amount_cents INTEGER NOT NULL DEFAULT 0,
      target_date TEXT,
      color TEXT NOT NULL DEFAULT '#059669',
      icon TEXT NOT NULL DEFAULT 'Target',
      is_completed INTEGER NOT NULL DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'system',
      is_read INTEGER NOT NULL DEFAULT 0,
      link_url TEXT,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS waitlist_entries (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      monthly_income_band TEXT NOT NULL,
      biggest_tax_worry TEXT,
      referral_code TEXT NOT NULL UNIQUE,
      referred_by_code TEXT,
      queue_position INTEGER NOT NULL,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      event_name TEXT NOT NULL,
      properties_json TEXT,
      visitor_id TEXT,
      session_id TEXT,
      created_at INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      business_id TEXT,
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      payload_json TEXT,
      ip_address TEXT,
      created_at INTEGER NOT NULL
    )`
  ];

  for (const statement of ddlStatements) {
    await rawClient.execute(statement);
  }
}

export async function seedDatabase() {
  console.log('Seeding SoloFi Database...');
  await createTablesIfNotExist();

  // 1. Seed Categories
  for (const cat of DEFAULT_CATEGORIES) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }

  // 2. Primary Persona 1: Elena Vance (Freelance Brand & Product Designer, US)
  const elenaUser = {
    id: 'user_elena_vance',
    email: 'elena@vancestudio.design',
    name: 'Elena Vance',
    role: 'owner',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    demoPersonaId: 'designer_us',
    createdAt: Date.now() - 365 * 86400000,
  };
  await db.insert(users).values(elenaUser).onConflictDoNothing();

  const elenaBusiness = {
    id: 'biz_vance_studio',
    userId: elenaUser.id,
    legalName: 'Vance Studio Design LLC',
    tradeName: 'Vance Studio',
    businessType: 'llc',
    taxId: 'XX-XXX4912',
    country: 'US',
    currency: 'USD',
    annualRevenueEstimateCents: 14000000, // $140,000 / year
    filingStatus: 'single',
    createdAt: Date.now() - 365 * 86400000,
  };
  await db.insert(businesses).values(elenaBusiness).onConflictDoNothing();

  const elenaTaxProfile = {
    id: 'tax_elena_profile',
    businessId: elenaBusiness.id,
    country: 'US',
    stateOrRegion: 'CA',
    withholdingMode: 'auto',
    fixedRateBps: 2800, // 28.00%
    effectiveYear: 2025,
    presumptiveTaxationEligible: 0,
    roundUpIncrementCents: 10000, // Round up to nearest $100
    createdAt: Date.now() - 365 * 86400000,
  };
  await db.insert(taxProfiles).values(elenaTaxProfile).onConflictDoNothing();

  // Accounts for Elena
  const elenaOperating = {
    id: 'acc_elena_operating',
    businessId: elenaBusiness.id,
    name: 'Operating Checking',
    type: 'operating',
    currency: 'USD',
    balanceCents: 1845000, // $18,450.00
    availableCents: 1845000,
    routingNumber: '121000358',
    accountNumber: '4829104821',
    isLocked: 0,
    createdAt: Date.now() - 365 * 86400000,
  };
  const elenaTaxVault = {
    id: 'acc_elena_tax_vault',
    businessId: elenaBusiness.id,
    name: 'Tax Vault (Q2 2025)',
    type: 'tax_vault',
    currency: 'USD',
    balanceCents: 842000, // $8,420.00
    availableCents: 842000,
    routingNumber: '121000358',
    accountNumber: '9281726351',
    isLocked: 1,
    lockReason: 'Q2 Estimated Tax Set-Aside — Due June 15, 2025',
    createdAt: Date.now() - 365 * 86400000,
  };
  const elenaSavings = {
    id: 'acc_elena_savings',
    businessId: elenaBusiness.id,
    name: 'Emergency Buffer',
    type: 'savings',
    currency: 'USD',
    balanceCents: 600000, // $6,000.00
    availableCents: 600000,
    routingNumber: '121000358',
    accountNumber: '1102938472',
    isLocked: 0,
    createdAt: Date.now() - 365 * 86400000,
  };
  await db.insert(accounts).values([elenaOperating, elenaTaxVault, elenaSavings]).onConflictDoNothing();

  // Elena's Quarterly Deadlines
  const elenaDeadlines = [
    { id: 'tp_2025_q1', taxProfileId: elenaTaxProfile.id, year: 2025, quarter: 'Q1', dueDate: '2025-04-15', estimatedLiabilityCents: 820000, actualSetAsideCents: 820000, paidAmountCents: 820000, isPaid: 1, paidAt: Date.now() - 30 * 86400000 },
    { id: 'tp_2025_q2', taxProfileId: elenaTaxProfile.id, year: 2025, quarter: 'Q2', dueDate: '2025-06-15', estimatedLiabilityCents: 1150000, actualSetAsideCents: 842000, paidAmountCents: 0, isPaid: 0, paidAt: null },
    { id: 'tp_2025_q3', taxProfileId: elenaTaxProfile.id, year: 2025, quarter: 'Q3', dueDate: '2025-09-15', estimatedLiabilityCents: 1000000, actualSetAsideCents: 0, paidAmountCents: 0, isPaid: 0, paidAt: null },
    { id: 'tp_2025_q4', taxProfileId: elenaTaxProfile.id, year: 2025, quarter: 'Q4', dueDate: '2026-01-15', estimatedLiabilityCents: 1000000, actualSetAsideCents: 0, paidAmountCents: 0, isPaid: 0, paidAt: null },
  ];
  for (const dl of elenaDeadlines) {
    await db.insert(taxPeriods).values(dl).onConflictDoNothing();
  }

  // Elena's Clients
  const clientAcme = {
    id: 'client_acme',
    businessId: elenaBusiness.id,
    name: 'Acme Design Corp',
    email: 'billing@acmedesign.com',
    company: 'Acme Design Corp',
    currency: 'USD',
    defaultPaymentTermsDays: 14,
    createdAt: Date.now() - 180 * 86400000,
  };
  const clientLinear = {
    id: 'client_linear',
    businessId: elenaBusiness.id,
    name: 'Linear Labs Inc',
    email: 'finance@linear.app',
    company: 'Linear Labs Inc',
    currency: 'USD',
    defaultPaymentTermsDays: 30,
    createdAt: Date.now() - 120 * 86400000,
  };
  await db.insert(clients).values([clientAcme, clientLinear]).onConflictDoNothing();

  // Elena's Invoices
  const inv1 = {
    id: 'inv_elena_001',
    businessId: elenaBusiness.id,
    clientId: clientAcme.id,
    invoiceNumber: 'INV-2025-012',
    status: 'paid',
    issueDate: '2025-04-01',
    dueDate: '2025-04-15',
    currency: 'USD',
    subtotalCents: 420000,
    taxRateBps: 0,
    taxAmountCents: 0,
    totalAmountCents: 420000,
    notes: 'Brand Identity System & Figma Component Library',
    paymentTerms: 'Net 14',
    shareToken: 'pay_token_acme_4200',
    paidAt: Date.now() - 3 * 86400000,
    createdAt: Date.now() - 14 * 86400000,
  };
  const inv2 = {
    id: 'inv_elena_002',
    businessId: elenaBusiness.id,
    clientId: clientLinear.id,
    invoiceNumber: 'INV-2025-013',
    status: 'sent',
    issueDate: '2025-04-10',
    dueDate: '2025-05-10',
    currency: 'USD',
    subtotalCents: 580000,
    taxRateBps: 0,
    taxAmountCents: 0,
    totalAmountCents: 580000,
    notes: 'Q2 Marketing Site Visuals & 3D Assets',
    paymentTerms: 'Net 30',
    shareToken: 'pay_token_linear_5800',
    paidAt: null,
    createdAt: Date.now() - 4 * 86400000,
  };
  await db.insert(invoices).values([inv1, inv2]).onConflictDoNothing();

  // Elena's Virtual Card
  const elenaCard = {
    id: 'card_elena_01',
    businessId: elenaBusiness.id,
    accountId: elenaOperating.id,
    cardholderName: 'Elena Vance',
    lastFour: '8492',
    expMonth: 11,
    expYear: 2028,
    brand: 'Visa Business Platinum',
    type: 'virtual',
    status: 'active',
    spendingLimitCents: 1000000, // $10,000 / mo
    spendingLimitPeriod: 'per_month',
    createdAt: Date.now() - 180 * 86400000,
  };
  await db.insert(cards).values(elenaCard).onConflictDoNothing();

  // Elena's Realistic Transactions (12 months sampled)
  const elenaTransactions = [
    {
      id: 'txn_elena_01',
      businessId: elenaBusiness.id,
      accountId: elenaOperating.id,
      amountCents: 420000,
      direction: 'inbound',
      method: 'ach',
      status: 'posted',
      counterparty: 'Acme Design Corp',
      rawDescription: 'ACH CREDIT ACME DESIGN CORP INV-2025-012',
      categoryId: 'cat_client_revenue',
      confidenceScore: 1.0,
      isReviewed: 1,
      isBusiness: 1,
      isDeductible: 0,
      postedAt: Date.now() - 3 * 86400000,
      createdAt: Date.now() - 3 * 86400000,
    },
    {
      id: 'txn_elena_02',
      businessId: elenaBusiness.id,
      accountId: elenaOperating.id,
      amountCents: 1500, // $15.00
      direction: 'outbound',
      method: 'card',
      status: 'posted',
      counterparty: 'Figma Inc.',
      rawDescription: 'FIGMA*SUBSCRIPTION MONTHLY SAN FRANCISCO',
      mcc: '5734',
      categoryId: 'cat_software_saas',
      confidenceScore: 0.94,
      isReviewed: 1,
      isBusiness: 1,
      isDeductible: 1,
      deductiblePercentage: 100,
      postedAt: Date.now() - 2 * 86400000,
      createdAt: Date.now() - 2 * 86400000,
    },
    {
      id: 'txn_elena_03',
      businessId: elenaBusiness.id,
      accountId: elenaOperating.id,
      amountCents: 5499, // $54.99
      direction: 'outbound',
      method: 'card',
      status: 'posted',
      counterparty: 'Adobe Creative Cloud',
      rawDescription: 'ADOBE *CREATIVE CLOUD 800-833-6687 CA',
      mcc: '5734',
      categoryId: 'cat_software_saas',
      confidenceScore: 0.95,
      isReviewed: 1,
      isBusiness: 1,
      isDeductible: 1,
      deductiblePercentage: 100,
      postedAt: Date.now() - 5 * 86400000,
      createdAt: Date.now() - 5 * 86400000,
    },
    {
      id: 'txn_elena_04',
      businessId: elenaBusiness.id,
      accountId: elenaOperating.id,
      amountCents: 1840, // $18.40
      direction: 'outbound',
      method: 'card',
      status: 'posted',
      counterparty: 'Blue Bottle Coffee',
      rawDescription: 'SQ *BLUE BOTTLE 0453 CA',
      mcc: '5814',
      categoryId: 'cat_meals_entertainment',
      confidenceScore: 0.92,
      isReviewed: 1,
      isBusiness: 1,
      isDeductible: 1,
      deductiblePercentage: 50,
      postedAt: Date.now() - 1 * 86400000,
      createdAt: Date.now() - 1 * 86400000,
    },
    {
      id: 'txn_elena_05',
      businessId: elenaBusiness.id,
      accountId: elenaOperating.id,
      amountCents: 4250, // $42.50
      direction: 'outbound',
      method: 'card',
      status: 'posted',
      counterparty: 'Corner Mart #402',
      rawDescription: 'CORNER MART #402 CA',
      categoryId: 'cat_personal',
      confidenceScore: 0.60,
      isReviewed: 0, // In Review Inbox!
      isBusiness: 0,
      isDeductible: 0,
      notes: 'Ambiguous purchase — please confirm if business or personal',
      postedAt: Date.now() - 1 * 86400000,
      createdAt: Date.now() - 1 * 86400000,
    },
  ];

  for (const txn of elenaTransactions) {
    await db.insert(transactions).values(txn).onConflictDoNothing();
  }

  // 3. Persona 2: Arjun Mehta (Senior Dev Contractor, India u/s 44ADA)
  const arjunUser = {
    id: 'user_arjun_mehta',
    email: 'arjun@mehtasystems.dev',
    name: 'Arjun Mehta',
    role: 'owner',
    demoPersonaId: 'dev_contractor_in',
    createdAt: Date.now() - 200 * 86400000,
  };
  await db.insert(users).values(arjunUser).onConflictDoNothing();

  const arjunBusiness = {
    id: 'biz_mehta_systems',
    userId: arjunUser.id,
    legalName: 'Mehta Systems Tech Services',
    tradeName: 'Mehta Systems',
    businessType: 'sole_prop',
    taxId: 'AAAPM1234F',
    country: 'IN',
    currency: 'INR',
    annualRevenueEstimateCents: 600000000, // ₹60 Lakhs
    filingStatus: 'single',
    createdAt: Date.now() - 200 * 86400000,
  };
  await db.insert(businesses).values(arjunBusiness).onConflictDoNothing();

  const arjunTaxProfile = {
    id: 'tax_arjun_profile',
    businessId: arjunBusiness.id,
    country: 'IN',
    stateOrRegion: 'KA',
    withholdingMode: 'auto',
    fixedRateBps: 1500,
    effectiveYear: 2025,
    presumptiveTaxationEligible: 1, // 44ADA 50% deemed profit
    gstRegistered: 1,
    gstNumber: '29AAAPM1234F1Z5',
    createdAt: Date.now() - 200 * 86400000,
  };
  await db.insert(taxProfiles).values(arjunTaxProfile).onConflictDoNothing();

  const arjunOperating = {
    id: 'acc_arjun_operating',
    businessId: arjunBusiness.id,
    name: 'Current Business Account',
    type: 'operating',
    currency: 'INR',
    balanceCents: 125000000, // ₹12,50,000.00
    availableCents: 125000000,
    routingNumber: 'HDFC0000123',
    accountNumber: '50100293847281',
    isLocked: 0,
    createdAt: Date.now() - 200 * 86400000,
  };
  const arjunTaxVault = {
    id: 'acc_arjun_tax_vault',
    businessId: arjunBusiness.id,
    name: 'Advance Tax Vault',
    type: 'tax_vault',
    currency: 'INR',
    balanceCents: 45000000, // ₹4,50,000.00
    availableCents: 45000000,
    routingNumber: 'HDFC0000123',
    accountNumber: '50100998877665',
    isLocked: 1,
    lockReason: 'Advance Tax Instalment — Due June 15, 2025',
    createdAt: Date.now() - 200 * 86400000,
  };
  await db.insert(accounts).values([arjunOperating, arjunTaxVault]).onConflictDoNothing();

  // 3b. Persona 3: Chloe Lin (Content Creator & Educator, US)
  const chloeUser = {
    id: 'user_chloe_lin',
    email: 'chloe@chloelin.studio',
    name: 'Chloe Lin',
    role: 'owner',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    demoPersonaId: 'creator_us',
    createdAt: Date.now() - 300 * 86400000,
  };
  await db.insert(users).values(chloeUser).onConflictDoNothing();

  const chloeBusiness = {
    id: 'biz_chloe_studio',
    userId: chloeUser.id,
    legalName: 'Chloe Lin Media LLC',
    tradeName: 'Chloe Lin Studio',
    businessType: 'llc',
    taxId: 'XX-XXX9182',
    country: 'US',
    currency: 'USD',
    annualRevenueEstimateCents: 9500000, // $95,000 / yr
    filingStatus: 'single',
    createdAt: Date.now() - 300 * 86400000,
  };
  await db.insert(businesses).values(chloeBusiness).onConflictDoNothing();

  const chloeTaxProfile = {
    id: 'tax_chloe_profile',
    businessId: chloeBusiness.id,
    country: 'US',
    stateOrRegion: 'NY',
    withholdingMode: 'auto',
    fixedRateBps: 2500, // 25.00%
    effectiveYear: 2025,
    presumptiveTaxationEligible: 0,
    roundUpIncrementCents: 5000,
    createdAt: Date.now() - 300 * 86400000,
  };
  await db.insert(taxProfiles).values(chloeTaxProfile).onConflictDoNothing();

  const chloeOperating = {
    id: 'acc_chloe_operating',
    businessId: chloeBusiness.id,
    name: 'Operating Checking',
    type: 'operating',
    currency: 'USD',
    balanceCents: 1120000, // $11,200.00
    availableCents: 1120000,
    routingNumber: '021000021',
    accountNumber: '3910294821',
    isLocked: 0,
    createdAt: Date.now() - 300 * 86400000,
  };
  const chloeTaxVault = {
    id: 'acc_chloe_tax_vault',
    businessId: chloeBusiness.id,
    name: 'Tax Vault (Q2 2025)',
    type: 'tax_vault',
    currency: 'USD',
    balanceCents: 475000, // $4,750.00
    availableCents: 475000,
    routingNumber: '021000021',
    accountNumber: '8920194823',
    isLocked: 1,
    lockReason: 'Q2 Estimated Federal & NY State Set-Aside',
    createdAt: Date.now() - 300 * 86400000,
  };
  await db.insert(accounts).values([chloeOperating, chloeTaxVault]).onConflictDoNothing();

  // 3c. Persona 4: David Chen / Pioneer Labs (Micro-SaaS Startup, US S-Corp)
  const davidUser = {
    id: 'user_pioneer_labs',
    email: 'david@pioneerlabs.dev',
    name: 'David Chen',
    role: 'owner',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    demoPersonaId: 'startup_us',
    createdAt: Date.now() - 400 * 86400000,
  };
  await db.insert(users).values(davidUser).onConflictDoNothing();

  const davidBusiness = {
    id: 'biz_pioneer_labs',
    userId: davidUser.id,
    legalName: 'Pioneer Labs Inc',
    tradeName: 'Pioneer Labs',
    businessType: 's_corp',
    taxId: 'XX-XXX7731',
    country: 'US',
    currency: 'USD',
    annualRevenueEstimateCents: 26000000, // $260,000 / yr
    filingStatus: 'single',
    createdAt: Date.now() - 400 * 86400000,
  };
  await db.insert(businesses).values(davidBusiness).onConflictDoNothing();

  const davidTaxProfile = {
    id: 'tax_david_profile',
    businessId: davidBusiness.id,
    country: 'US',
    stateOrRegion: 'WA', // Washington (no state income tax)
    withholdingMode: 'auto',
    fixedRateBps: 3200, // 32.00%
    effectiveYear: 2025,
    presumptiveTaxationEligible: 0,
    roundUpIncrementCents: 10000,
    createdAt: Date.now() - 400 * 86400000,
  };
  await db.insert(taxProfiles).values(davidTaxProfile).onConflictDoNothing();

  const davidOperating = {
    id: 'acc_david_operating',
    businessId: davidBusiness.id,
    name: 'Primary Operating (Treasury)',
    type: 'operating',
    currency: 'USD',
    balanceCents: 4280000, // $42,800.00
    availableCents: 4280000,
    routingNumber: '125000024',
    accountNumber: '9920194827',
    isLocked: 0,
    createdAt: Date.now() - 400 * 86400000,
  };
  const davidTaxVault = {
    id: 'acc_david_tax_vault',
    businessId: davidBusiness.id,
    name: 'Corporate & Payroll Tax Vault',
    type: 'tax_vault',
    currency: 'USD',
    balanceCents: 1560000, // $15,600.00
    availableCents: 1560000,
    routingNumber: '125000024',
    accountNumber: '1102938472',
    isLocked: 1,
    lockReason: 'Q2 Employer Payroll & Passthrough Set-Aside',
    createdAt: Date.now() - 400 * 86400000,
  };
  await db.insert(accounts).values([davidOperating, davidTaxVault]).onConflictDoNothing();


  // 4. Seed Waitlist Entries (to test the waitlist dashboard and 250 goal)
  const waitlistSeeds = [
    { id: 'wt_01', email: 'sarah.ux@gmail.com', role: 'freelancer', monthlyIncomeBand: '$5k-$10k', biggestTaxWorry: 'Surprise quarterly tax penalties', referralCode: 'SARAH829', queuePosition: 1, utmSource: 'twitter', createdAt: Date.now() - 10 * 86400000 },
    { id: 'wt_02', email: 'david@founderly.io', role: 'solopreneur', monthlyIncomeBand: '$10k-$20k', biggestTaxWorry: 'Mixing personal and business expenses', referralCode: 'DAVID912', queuePosition: 2, utmSource: 'linkedin', createdAt: Date.now() - 9 * 86400000 },
    { id: 'wt_03', email: 'priya.dev@consulting.in', role: 'freelancer', monthlyIncomeBand: '$5k-$10k', biggestTaxWorry: '44ADA advance tax dates', referralCode: 'PRIYA381', queuePosition: 3, utmSource: 'producthunt', createdAt: Date.now() - 8 * 86400000 },
    { id: 'wt_04', email: 'marcus@microshop.co', role: 'micro_business', monthlyIncomeBand: '$2k-$5k', biggestTaxWorry: 'Quarterly payment calculation', referralCode: 'MARCUS44', queuePosition: 4, utmSource: 'direct', createdAt: Date.now() - 7 * 86400000 },
  ];
  for (const wt of waitlistSeeds) {
    await db.insert(waitlistEntries).values(wt).onConflictDoNothing();
  }

  console.log('Database seeding successfully finished!');
}

if (process.argv[1]?.includes('seed.ts')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seeding error:', err);
      process.exit(1);
    });
}
