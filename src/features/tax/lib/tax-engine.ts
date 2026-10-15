/**
 * SoloFi Pure Tax Engine
 * Pure TypeScript, deterministic, side-effect free.
 * Supports US Federal (SECA + progressive brackets) and India (Section 44ADA + New Regime).
 * All monetary amounts are handled strictly as integer minor units (cents / paise).
 */

import { US_TAX_RULES_2025, type UsFilingStatus } from './rules-us';
import { INDIA_TAX_RULES_2025 } from './rules-in';

export interface UsTaxCalculationInput {
  netBusinessProfitCents: number;
  filingStatus: UsFilingStatus;
  priorW2WagesCents?: number; // for social security wage base coordination
}

export interface UsTaxCalculationOutput {
  netBusinessProfitCents: number;
  secaNetEarningsCents: number;
  socialSecurityTaxCents: number;
  medicareTaxCents: number;
  additionalMedicareTaxCents: number;
  totalSecaTaxCents: number;
  secaDeductionCents: number; // 50% of SECA tax
  adjustedGrossIncomeCents: number;
  standardDeductionCents: number;
  taxableIncomeCents: number;
  incomeTaxCents: number;
  totalAnnualLiabilityCents: number;
  effectiveRateBps: number;
  marginalRateBps: number;
  bracketBreakdown: {
    bracketLabel: string;
    rateBps: number;
    taxableInBracketCents: number;
    taxCents: number;
  }[];
  quarterlyEstimatedDueCents: number;
}

export interface IndiaTaxCalculationInput {
  grossReceiptsPaise: number;
  actualDeductibleExpensesPaise?: number;
  usePresumptive44Ada: boolean;
}

export interface IndiaTaxCalculationOutput {
  grossReceiptsPaise: number;
  deemedTaxableIncomePaise: number;
  grossIncomeTaxPaise: number;
  section87ARebatePaise: number;
  taxAfterRebatePaise: number;
  healthAndEducationCessPaise: number;
  totalAnnualLiabilityPaise: number;
  effectiveRateBps: number;
  gstThresholdAlert: {
    triggered: boolean;
    exceededMandatory: boolean;
    currentTurnoverPaise: number;
    thresholdPaise: number;
  };
  advanceTaxSchedule: {
    instalment: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    dueDate: string;
    cumulativeRequiredPaise: number;
    instalmentDuePaise: number;
  }[];
}

export interface WithholdingCalculationInput {
  country: 'US' | 'IN';
  incomingPaymentCents: number;
  mode: 'auto' | 'fixed' | 'tiered';
  fixedRateBps?: number;
  roundUpIncrementCents?: number;
  annualProjectedRevenueCents?: number;
  annualProjectedExpensesCents?: number;
  filingStatus?: UsFilingStatus;
  usePresumptive44Ada?: boolean;
}

export interface WithholdingCalculationOutput {
  grossPaymentCents: number;
  withholdingRateBps: number;
  rawWithholdingAmountCents: number;
  withholdingAmountCents: number; // after round-up if configured
  netOperatingCents: number;
  effectiveMode: 'auto' | 'fixed' | 'tiered';
  disclaimer: string;
}

export interface DeductionSimulationInput {
  country: 'US' | 'IN';
  currentAnnualRevenueCents: number;
  currentAnnualExpensesCents: number;
  proposedPurchaseCents: number;
  deductiblePercentage?: number; // default 100
  filingStatus?: UsFilingStatus;
  usePresumptive44Ada?: boolean;
}

export interface DeductionSimulationOutput {
  proposedPurchaseCents: number;
  deductiblePortionCents: number;
  taxBeforePurchaseCents: number;
  taxAfterPurchaseCents: number;
  taxSavingsCents: number;
  effectiveCostOfPurchaseCents: number; // Purchase price minus tax saved!
  savingsPercentage: number;
}

export class TaxEngine {
  /**
   * Computes complete US Federal tax liability for a self-employed individual.
   */
  static calculateUsTaxes(input: UsTaxCalculationInput): UsTaxCalculationOutput {
    const rules = US_TAX_RULES_2025;
    const profit = Math.max(0, input.netBusinessProfitCents);

    if (profit === 0) {
      return {
        netBusinessProfitCents: 0,
        secaNetEarningsCents: 0,
        socialSecurityTaxCents: 0,
        medicareTaxCents: 0,
        additionalMedicareTaxCents: 0,
        totalSecaTaxCents: 0,
        secaDeductionCents: 0,
        adjustedGrossIncomeCents: 0,
        standardDeductionCents: rules.standardDeductionCents[input.filingStatus],
        taxableIncomeCents: 0,
        incomeTaxCents: 0,
        totalAnnualLiabilityCents: 0,
        effectiveRateBps: 0,
        marginalRateBps: 0,
        bracketBreakdown: [],
        quarterlyEstimatedDueCents: 0,
      };
    }

    // 1. SECA Calculation
    // Schedule SE net earnings = 92.35% of net profit
    const secaNetEarnings = Math.round(profit * rules.secaNetEarningsFactor);

    // Social Security: 12.4% up to cap ($176,100)
    const priorW2 = input.priorW2WagesCents || 0;
    const remainingSocialSecurityCap = Math.max(0, rules.socialSecurityWageBaseCents - priorW2);
    const taxableForSocialSecurity = Math.min(secaNetEarnings, remainingSocialSecurityCap);
    const socialSecurityTax = Math.round((taxableForSocialSecurity * rules.socialSecurityRateBps) / 10000);

    // Medicare: 2.9% uncapped
    const medicareTax = Math.round((secaNetEarnings * rules.medicareRateBps) / 10000);

    // Additional Medicare: 0.9% on earnings above filing status threshold
    const addlThreshold = rules.additionalMedicareThresholdCents[input.filingStatus];
    const taxableForAddlMedicare = Math.max(0, secaNetEarnings - addlThreshold);
    const additionalMedicareTax = Math.round((taxableForAddlMedicare * rules.additionalMedicareRateBps) / 10000);

    const totalSecaTax = socialSecurityTax + medicareTax + additionalMedicareTax;

    // 2. 50% SECA Deduction against AGI
    const secaDeduction = Math.round(totalSecaTax / 2);
    const adjustedGrossIncome = Math.max(0, profit - secaDeduction);

    // 3. Standard Deduction
    const standardDeduction = rules.standardDeductionCents[input.filingStatus];
    const taxableIncome = Math.max(0, adjustedGrossIncome - standardDeduction);

    // 4. Progressive Federal Income Tax Brackets
    const brackets = rules.incomeTaxBrackets[input.filingStatus];
    let incomeTax = 0;
    let marginalRateBps = 0;
    const bracketBreakdown: UsTaxCalculationOutput['bracketBreakdown'] = [];

    for (const bracket of brackets) {
      if (taxableIncome > bracket.minCents) {
        const upperLimit = bracket.maxCents !== null ? Math.min(taxableIncome, bracket.maxCents) : taxableIncome;
        const taxableInThisBracket = Math.max(0, upperLimit - bracket.minCents);
        const taxInThisBracket = Math.round((taxableInThisBracket * bracket.rateBps) / 10000);

        incomeTax += taxInThisBracket;
        marginalRateBps = bracket.rateBps;

        bracketBreakdown.push({
          bracketLabel: `${bracket.rateBps / 100}% bracket`,
          rateBps: bracket.rateBps,
          taxableInBracketCents: taxableInThisBracket,
          taxCents: taxInThisBracket,
        });
      }
    }

    const totalAnnualLiability = totalSecaTax + incomeTax;
    const effectiveRateBps = profit > 0 ? Math.round((totalAnnualLiability / profit) * 10000) : 0;
    const quarterlyEstimatedDue = Math.round(totalAnnualLiability / 4);

    return {
      netBusinessProfitCents: profit,
      secaNetEarningsCents: secaNetEarnings,
      socialSecurityTaxCents: socialSecurityTax,
      medicareTaxCents: medicareTax,
      additionalMedicareTaxCents: additionalMedicareTax,
      totalSecaTaxCents: totalSecaTax,
      secaDeductionCents: secaDeduction,
      adjustedGrossIncomeCents: adjustedGrossIncome,
      standardDeductionCents: standardDeduction,
      taxableIncomeCents: taxableIncome,
      incomeTaxCents: incomeTax,
      totalAnnualLiabilityCents: totalAnnualLiability,
      effectiveRateBps: effectiveRateBps,
      marginalRateBps: marginalRateBps,
      bracketBreakdown: bracketBreakdown,
      quarterlyEstimatedDueCents: quarterlyEstimatedDue,
    };
  }

  /**
   * Computes complete Indian income tax liability under New Regime & Section 44ADA.
   */
  static calculateIndiaTaxes(input: IndiaTaxCalculationInput): IndiaTaxCalculationOutput {
    const rules = INDIA_TAX_RULES_2025;
    const grossReceipts = Math.max(0, input.grossReceiptsPaise);

    let deemedTaxableIncome = 0;
    if (input.usePresumptive44Ada) {
      // 50% deemed profit u/s 44ADA
      deemedTaxableIncome = Math.round(grossReceipts * rules.presumptiveDeemedProfitFactor);
    } else {
      const expenses = input.actualDeductibleExpensesPaise || 0;
      deemedTaxableIncome = Math.max(0, grossReceipts - expenses);
    }

    // New Regime Slab Calculation
    let grossIncomeTax = 0;
    for (const slab of rules.slabsNewRegime) {
      if (deemedTaxableIncome > slab.minPaise) {
        const ceiling = slab.maxPaise !== null ? Math.min(deemedTaxableIncome, slab.maxPaise) : deemedTaxableIncome;
        const taxableInSlab = Math.max(0, ceiling - slab.minPaise);
        const slabTax = Math.round((taxableInSlab * slab.rateBps) / 10000);
        grossIncomeTax += slabTax;
      }
    }

    // Section 87A Rebate: if taxable income <= ₹7,00,000, rebate covers entire tax
    let section87ARebate = 0;
    if (deemedTaxableIncome <= rules.section87ARebateThresholdPaise) {
      section87ARebate = grossIncomeTax;
    }

    const taxAfterRebate = Math.max(0, grossIncomeTax - section87ARebate);

    // 4% Health & Education Cess
    const cess = Math.round((taxAfterRebate * rules.cessRateBps) / 10000);
    const totalAnnualLiability = taxAfterRebate + cess;

    const effectiveRateBps = grossReceipts > 0 ? Math.round((totalAnnualLiability / grossReceipts) * 10000) : 0;

    // GST Threshold Alert (₹20L annual services threshold)
    const alertTriggered = grossReceipts >= rules.gstServiceThresholdPaise * rules.gstAlertThresholdFactor;
    const exceededMandatory = grossReceipts >= rules.gstServiceThresholdPaise;

    // Advance Tax Schedule Calculation
    let previousCumulative = 0;
    const advanceTaxSchedule = rules.advanceTaxInstalments.map((inst) => {
      const cumulativeRequired = Math.round((totalAnnualLiability * inst.cumulativePercentageRequired) / 100);
      const instalmentDue = Math.max(0, cumulativeRequired - previousCumulative);
      previousCumulative = cumulativeRequired;
      return {
        instalment: inst.instalment,
        dueDate: inst.dueDateString,
        cumulativeRequiredPaise: cumulativeRequired,
        instalmentDuePaise: instalmentDue,
      };
    });

    return {
      grossReceiptsPaise: grossReceipts,
      deemedTaxableIncomePaise: deemedTaxableIncome,
      grossIncomeTaxPaise: grossIncomeTax,
      section87ARebatePaise: section87ARebate,
      taxAfterRebatePaise: taxAfterRebate,
      healthAndEducationCessPaise: cess,
      totalAnnualLiabilityPaise: totalAnnualLiability,
      effectiveRateBps: effectiveRateBps,
      gstThresholdAlert: {
        triggered: alertTriggered,
        exceededMandatory: exceededMandatory,
        currentTurnoverPaise: grossReceipts,
        thresholdPaise: rules.gstServiceThresholdPaise,
      },
      advanceTaxSchedule: advanceTaxSchedule,
    };
  }

  /**
   * Computes per-invoice automatic withholding for the Tax Vault split.
   */
  static calculateWithholding(input: WithholdingCalculationInput): WithholdingCalculationOutput {
    const gross = Math.max(0, input.incomingPaymentCents);

    let withholdingRateBps = 0;

    if (input.mode === 'fixed') {
      withholdingRateBps = input.fixedRateBps ?? 2500; // default 25%
    } else if (input.mode === 'auto') {
      if (input.country === 'US') {
        const estRevenue = input.annualProjectedRevenueCents || gross * 12;
        const estExpenses = input.annualProjectedExpensesCents || Math.round(estRevenue * 0.2); // estimate 20% expenses
        const profit = Math.max(0, estRevenue - estExpenses);

        const usTax = TaxEngine.calculateUsTaxes({
          netBusinessProfitCents: profit,
          filingStatus: input.filingStatus || 'single',
        });
        // Withholding rate is based on profit effective rate adjusted for gross
        withholdingRateBps = estRevenue > 0 ? Math.round((usTax.totalAnnualLiabilityCents / estRevenue) * 10000) : 2500;
        // Bound between 15% and 40% for safety buffer
        withholdingRateBps = Math.max(1500, Math.min(4000, withholdingRateBps));
      } else {
        const estRevenue = input.annualProjectedRevenueCents || gross * 12;
        const inTax = TaxEngine.calculateIndiaTaxes({
          grossReceiptsPaise: estRevenue,
          usePresumptive44Ada: input.usePresumptive44Ada ?? true,
        });
        withholdingRateBps = inTax.effectiveRateBps;
        withholdingRateBps = Math.max(1000, Math.min(3000, withholdingRateBps));
      }
    } else {
      // Tiered mode based on invoice size
      if (gross < 200000) {
        withholdingRateBps = 2000; // 20% under $2k
      } else if (gross < 500000) {
        withholdingRateBps = 2500; // 25% $2k - $5k
      } else {
        withholdingRateBps = 3000; // 30% $5k+
      }
    }

    const rawWithholding = Math.round((gross * withholdingRateBps) / 10000);

    let finalWithholding = rawWithholding;
    if (input.roundUpIncrementCents && input.roundUpIncrementCents > 0) {
      finalWithholding = Math.ceil(rawWithholding / input.roundUpIncrementCents) * input.roundUpIncrementCents;
      finalWithholding = Math.min(gross, finalWithholding); // cannot exceed gross
    }

    const netOperating = Math.max(0, gross - finalWithholding);

    return {
      grossPaymentCents: gross,
      withholdingRateBps: withholdingRateBps,
      rawWithholdingAmountCents: rawWithholding,
      withholdingAmountCents: finalWithholding,
      netOperatingCents: netOperating,
      effectiveMode: input.mode,
      disclaimer: 'Estimates are for planning purposes and do not constitute certified tax advice.',
    };
  }

  /**
   * Simulates the tax deduction benefit of an upcoming expense ("What if I buy a $3,000 laptop?").
   */
  static simulateDeductionImpact(input: DeductionSimulationInput): DeductionSimulationOutput {
    const purchase = Math.max(0, input.proposedPurchaseCents);
    const deductiblePct = input.deductiblePercentage ?? 100;
    const deductiblePortion = Math.round((purchase * deductiblePct) / 100);

    if (input.country === 'US') {
      const profitBefore = Math.max(0, input.currentAnnualRevenueCents - input.currentAnnualExpensesCents);
      const profitAfter = Math.max(0, profitBefore - deductiblePortion);

      const taxBefore = TaxEngine.calculateUsTaxes({
        netBusinessProfitCents: profitBefore,
        filingStatus: input.filingStatus || 'single',
      }).totalAnnualLiabilityCents;

      const taxAfter = TaxEngine.calculateUsTaxes({
        netBusinessProfitCents: profitAfter,
        filingStatus: input.filingStatus || 'single',
      }).totalAnnualLiabilityCents;

      const taxSavings = Math.max(0, taxBefore - taxAfter);
      const effectiveCost = Math.max(0, purchase - taxSavings);
      const savingsPct = purchase > 0 ? (taxSavings / purchase) * 100 : 0;

      return {
        proposedPurchaseCents: purchase,
        deductiblePortionCents: deductiblePortion,
        taxBeforePurchaseCents: taxBefore,
        taxAfterPurchaseCents: taxAfter,
        taxSavingsCents: taxSavings,
        effectiveCostOfPurchaseCents: effectiveCost,
        savingsPercentage: Number(savingsPct.toFixed(1)),
      };
    } else {
      // For India Section 44ADA, expenses are deemed at 50% unless using actual expenses
      const use44Ada = input.usePresumptive44Ada ?? true;
      if (use44Ada) {
        // Under 44ADA presumptive taxation, individual item deduction does not reduce taxable income
        const tax = TaxEngine.calculateIndiaTaxes({
          grossReceiptsPaise: input.currentAnnualRevenueCents,
          usePresumptive44Ada: true,
        }).totalAnnualLiabilityPaise;

        return {
          proposedPurchaseCents: purchase,
          deductiblePortionCents: 0,
          taxBeforePurchaseCents: tax,
          taxAfterPurchaseCents: tax,
          taxSavingsCents: 0,
          effectiveCostOfPurchaseCents: purchase,
          savingsPercentage: 0,
        };
      } else {
        const taxBefore = TaxEngine.calculateIndiaTaxes({
          grossReceiptsPaise: input.currentAnnualRevenueCents,
          actualDeductibleExpensesPaise: input.currentAnnualExpensesCents,
          usePresumptive44Ada: false,
        }).totalAnnualLiabilityPaise;

        const taxAfter = TaxEngine.calculateIndiaTaxes({
          grossReceiptsPaise: input.currentAnnualRevenueCents,
          actualDeductibleExpensesPaise: input.currentAnnualExpensesCents + deductiblePortion,
          usePresumptive44Ada: false,
        }).totalAnnualLiabilityPaise;

        const taxSavings = Math.max(0, taxBefore - taxAfter);
        const effectiveCost = Math.max(0, purchase - taxSavings);
        const savingsPct = purchase > 0 ? (taxSavings / purchase) * 100 : 0;

        return {
          proposedPurchaseCents: purchase,
          deductiblePortionCents: deductiblePortion,
          taxBeforePurchaseCents: taxBefore,
          taxAfterPurchaseCents: taxAfter,
          taxSavingsCents: taxSavings,
          effectiveCostOfPurchaseCents: effectiveCost,
          savingsPercentage: Number(savingsPct.toFixed(1)),
        };
      }
    }
  }
}
