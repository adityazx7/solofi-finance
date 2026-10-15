import { describe, it, expect } from 'vitest';
import { TaxEngine } from '@/features/tax/lib/tax-engine';
import { US_TAX_RULES_2025 } from '@/features/tax/lib/rules-us';
import { INDIA_TAX_RULES_2025 } from '@/features/tax/lib/rules-in';

describe('TaxEngine — US Federal Calculations', () => {
  it('handles zero business profit gracefully', () => {
    const result = TaxEngine.calculateUsTaxes({
      netBusinessProfitCents: 0,
      filingStatus: 'single',
    });
    expect(result.totalAnnualLiabilityCents).toBe(0);
    expect(result.effectiveRateBps).toBe(0);
    expect(result.quarterlyEstimatedDueCents).toBe(0);
  });

  it('calculates SECA and income tax accurately for $100,000 profit (Single)', () => {
    // $100,000 = 10,000,000 cents
    const result = TaxEngine.calculateUsTaxes({
      netBusinessProfitCents: 10000000,
      filingStatus: 'single',
    });

    // 1. SECA check:
    // Net earnings = $100,000 * 0.9235 = $92,350 (9,235,000 cents)
    expect(result.secaNetEarningsCents).toBe(9235000);

    // Social security: 12.4% of $92,350 = $11,451.40 -> $11,451 (1,145,140 cents)
    expect(result.socialSecurityTaxCents).toBe(1145140);

    // Medicare: 2.9% of $92,350 = $2,678.15 -> $2,678 (267,815 cents)
    expect(result.medicareTaxCents).toBe(267815);

    // Additional Medicare: 0 (under $200k)
    expect(result.additionalMedicareTaxCents).toBe(0);

    // Total SECA: $14,129.55 -> $14,130 (1,412,955 cents)
    expect(result.totalSecaTaxCents).toBe(1412955);

    // 50% SECA deduction: $7,064.78 -> $7,065 (706,478 cents)
    expect(result.secaDeductionCents).toBe(706478);

    // AGI: $100,000 - $7,065 = $92,935 (9,293,522 cents)
    expect(result.adjustedGrossIncomeCents).toBe(9293522);

    // Standard deduction Single: $15,000 (1,500,000 cents)
    expect(result.standardDeductionCents).toBe(1500000);

    // Taxable income: AGI - $15,000 = $77,935.22
    expect(result.taxableIncomeCents).toBe(7793522);

    // Brackets check:
    // 10% on $11,925 = $1,192.50
    // 12% on ($48,475 - $11,925 = $36,550) = $4,386.00
    // 22% on ($77,935.22 - $48,475 = $29,460.22) = $6,481.25
    expect(result.incomeTaxCents).toBeGreaterThan(1200000); // > $12,000
    expect(result.totalAnnualLiabilityCents).toBe(result.totalSecaTaxCents + result.incomeTaxCents);

    // Quarterly check
    expect(result.quarterlyEstimatedDueCents).toBe(Math.round(result.totalAnnualLiabilityCents / 4));
  });

  it('caps Social Security tax at the wage base threshold ($176,100)', () => {
    // $300,000 profit = 30,000,000 cents
    const result = TaxEngine.calculateUsTaxes({
      netBusinessProfitCents: 30000000,
      filingStatus: 'single',
    });

    // Net earnings = $277,050 (above $176,100 cap)
    // Max Social Security tax: $176,100 * 12.4% = $21,836.40 (2,183,640 cents)
    expect(result.socialSecurityTaxCents).toBe(2183640);

    // Additional Medicare tax should trigger on earnings above $200k
    expect(result.additionalMedicareTaxCents).toBeGreaterThan(0);
  });
});

describe('TaxEngine — India New Regime & Section 44ADA', () => {
  it('applies 50% presumptive profit under Section 44ADA', () => {
    // Gross turnover: ₹50,00,000 (5,00,000,000 paise)
    const result = TaxEngine.calculateIndiaTaxes({
      grossReceiptsPaise: 500000000,
      usePresumptive44Ada: true,
    });

    // Deemed profit: 50% = ₹25,00,000 (2,50,000,000 paise)
    expect(result.deemedTaxableIncomePaise).toBe(250000000);

    // Health & Education cess is 4%
    expect(result.healthAndEducationCessPaise).toBe(Math.round((result.taxAfterRebatePaise * 4) / 100));

    // GST alert: ₹50L is well over ₹20L mandatory registration threshold
    expect(result.gstThresholdAlert.exceededMandatory).toBe(true);
  });

  it('applies Section 87A rebate for income up to ₹7,00,000 (zero tax)', () => {
    // Gross: ₹12,00,000 -> 50% deemed profit = ₹6,00,000 (below ₹7L rebate threshold)
    const result = TaxEngine.calculateIndiaTaxes({
      grossReceiptsPaise: 120000000,
      usePresumptive44Ada: true,
    });

    expect(result.deemedTaxableIncomePaise).toBe(60000000);
    expect(result.totalAnnualLiabilityPaise).toBe(0);
    expect(result.effectiveRateBps).toBe(0);
  });

  it('generates 4 advance tax instalments (15%, 45%, 75%, 100%)', () => {
    const result = TaxEngine.calculateIndiaTaxes({
      grossReceiptsPaise: 400000000, // ₹40 Lakh
      usePresumptive44Ada: true,
    });

    expect(result.advanceTaxSchedule).toHaveLength(4);
    expect(result.advanceTaxSchedule[0].instalment).toBe('Q1');
    expect(result.advanceTaxSchedule[3].cumulativeRequiredPaise).toBe(result.totalAnnualLiabilityPaise);
  });
});

describe('TaxEngine — Withholding & Deduction Simulation', () => {
  it('computes auto-withholding for a $4,200 invoice with round-up', () => {
    const result = TaxEngine.calculateWithholding({
      country: 'US',
      incomingPaymentCents: 420000, // $4,200.00
      mode: 'fixed',
      fixedRateBps: 2800,           // 28.00%
      roundUpIncrementCents: 10000, // Round up to nearest $100
    });

    // 28% of $4,200 = $1,176.00 (117,600 cents)
    expect(result.rawWithholdingAmountCents).toBe(117600);
    // Rounded up to nearest $100 -> $1,200.00 (120,000 cents)
    expect(result.withholdingAmountCents).toBe(120000);
    // Net operating: $4,200 - $1,200 = $3,000.00
    expect(result.netOperatingCents).toBe(300000);
  });

  it('simulates purchasing a $3,000 laptop and shows tax savings', () => {
    const sim = TaxEngine.simulateDeductionImpact({
      country: 'US',
      currentAnnualRevenueCents: 12000000, // $120,000
      currentAnnualExpensesCents: 2000000,  // $20,000 (net $100k)
      proposedPurchaseCents: 300000,       // $3,000
      deductiblePercentage: 100,
      filingStatus: 'single',
    });

    expect(sim.proposedPurchaseCents).toBe(300000);
    expect(sim.taxSavingsCents).toBeGreaterThan(0);
    expect(sim.effectiveCostOfPurchaseCents).toBeLessThan(300000);
    expect(sim.effectiveCostOfPurchaseCents + sim.taxSavingsCents).toBe(300000);
  });

  it('calculates taxes for Married Filing Jointly with higher standard deduction', () => {
    const result = TaxEngine.calculateUsTaxes({
      netBusinessProfitCents: 15000000, // $150,000
      filingStatus: 'married_joint',
    });
    expect(result.standardDeductionCents).toBe(3000000); // $30,000
    expect(result.totalAnnualLiabilityCents).toBeGreaterThan(0);
  });

  it('calculates auto withholding for India under 44ADA', () => {
    const result = TaxEngine.calculateWithholding({
      country: 'IN',
      incomingPaymentCents: 25000000, // ₹2,50,000.00
      mode: 'auto',
      annualProjectedRevenueCents: 450000000, // ₹45L
      usePresumptive44Ada: true,
    });
    expect(result.withholdingRateBps).toBeGreaterThan(0);
    expect(result.withholdingAmountCents).toBeGreaterThan(0);
  });

  it('calculates tiered withholding mode correctly', () => {
    const small = TaxEngine.calculateWithholding({
      country: 'US',
      incomingPaymentCents: 150000, // $1,500 (< $2k)
      mode: 'tiered',
    });
    expect(small.withholdingRateBps).toBe(2000); // 20%

    const mid = TaxEngine.calculateWithholding({
      country: 'US',
      incomingPaymentCents: 350000, // $3,500 ($2k - $5k)
      mode: 'tiered',
    });
    expect(mid.withholdingRateBps).toBe(2500); // 25%

    const large = TaxEngine.calculateWithholding({
      country: 'US',
      incomingPaymentCents: 800000, // $8,000 (> $5k)
      mode: 'tiered',
    });
    expect(large.withholdingRateBps).toBe(3000); // 30%
  });

  it('handles deduction simulation for India (actual expenses vs 44ADA)', () => {
    // Under 44ADA, single item does not lower deemed 50% profit
    const sim44Ada = TaxEngine.simulateDeductionImpact({
      country: 'IN',
      currentAnnualRevenueCents: 300000000,
      currentAnnualExpensesCents: 0,
      proposedPurchaseCents: 20000000, // ₹2 Lakh
      usePresumptive44Ada: true,
    });
    expect(sim44Ada.taxSavingsCents).toBe(0);

    // Non-44ADA actual expenses
    const simActual = TaxEngine.simulateDeductionImpact({
      country: 'IN',
      currentAnnualRevenueCents: 300000000,
      currentAnnualExpensesCents: 50000000,
      proposedPurchaseCents: 20000000,
      usePresumptive44Ada: false,
    });
    expect(simActual.taxSavingsCents).toBeGreaterThan(0);
  });
});
