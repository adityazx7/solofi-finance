/**
 * SoloFi Tax Engine — US Federal Ruleset (Tax Year 2025)
 * Source: Internal Revenue Service (IRS) Rev. Proc. 2024-40
 * All monetary thresholds in minor units (cents).
 */

export interface TaxBracket {
  minCents: number;
  maxCents: number | null; // null represents no upper cap
  rateBps: number;         // basis points (e.g. 2200 = 22.00%)
}

export type UsFilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_of_household';

export interface UsTaxRulesConfig {
  version: string;
  taxYear: number;
  socialSecurityWageBaseCents: number; // $176,100.00
  socialSecurityRateBps: number;       // 12.4% (1240 bps)
  medicareRateBps: number;             // 2.9% (290 bps)
  additionalMedicareRateBps: number;   // 0.9% (90 bps)
  additionalMedicareThresholdCents: Record<UsFilingStatus, number>;
  secaNetEarningsFactor: number;       // 0.9235 (92.35%)
  standardDeductionCents: Record<UsFilingStatus, number>;
  incomeTaxBrackets: Record<UsFilingStatus, TaxBracket[]>;
  quarterlyDeadlines: {
    quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    dueDateString: string; // MM-DD
    dueLabel: string;
  }[];
}

export const US_TAX_RULES_2025: UsTaxRulesConfig = {
  version: '2025.1-irs',
  taxYear: 2025,
  socialSecurityWageBaseCents: 17610000, // $176,100.00
  socialSecurityRateBps: 1240,           // 12.40%
  medicareRateBps: 290,                  // 2.90%
  additionalMedicareRateBps: 90,         // 0.90%
  additionalMedicareThresholdCents: {
    single: 20000000,                    // $200,000.00
    married_joint: 25000000,             // $250,000.00
    married_separate: 12500000,          // $125,000.00
    head_of_household: 20000000,         // $200,000.00
  },
  secaNetEarningsFactor: 0.9235,
  standardDeductionCents: {
    single: 1500000,                     // $15,000.00
    married_joint: 3000000,              // $30,000.00
    married_separate: 1500000,           // $15,000.00
    head_of_household: 2250000,          // $22,500.00
  },
  incomeTaxBrackets: {
    single: [
      { minCents: 0, maxCents: 1192500, rateBps: 1000 },
      { minCents: 1192500, maxCents: 4847500, rateBps: 1200 },
      { minCents: 4847500, maxCents: 10335000, rateBps: 2200 },
      { minCents: 10335000, maxCents: 19730000, rateBps: 2400 },
      { minCents: 19730000, maxCents: 25052500, rateBps: 3200 },
      { minCents: 25052500, maxCents: 62635000, rateBps: 3500 },
      { minCents: 62635000, maxCents: null, rateBps: 3700 },
    ],
    married_joint: [
      { minCents: 0, maxCents: 2385000, rateBps: 1000 },
      { minCents: 2385000, maxCents: 9695000, rateBps: 1200 },
      { minCents: 9695000, maxCents: 20670000, rateBps: 2200 },
      { minCents: 20670000, maxCents: 39460000, rateBps: 2400 },
      { minCents: 39460000, maxCents: 50105000, rateBps: 3200 },
      { minCents: 50105000, maxCents: 75160000, rateBps: 3500 },
      { minCents: 75160000, maxCents: null, rateBps: 3700 },
    ],
    married_separate: [
      { minCents: 0, maxCents: 1192500, rateBps: 1000 },
      { minCents: 1192500, maxCents: 4847500, rateBps: 1200 },
      { minCents: 4847500, maxCents: 10335000, rateBps: 2200 },
      { minCents: 10335000, maxCents: 19730000, rateBps: 2400 },
      { minCents: 19730000, maxCents: 25052500, rateBps: 3200 },
      { minCents: 25052500, maxCents: 37580000, rateBps: 3500 },
      { minCents: 37580000, maxCents: null, rateBps: 3700 },
    ],
    head_of_household: [
      { minCents: 0, maxCents: 1700000, rateBps: 1000 },
      { minCents: 1700000, maxCents: 6485000, rateBps: 1200 },
      { minCents: 6485000, maxCents: 10335000, rateBps: 2200 },
      { minCents: 10335000, maxCents: 19730000, rateBps: 2400 },
      { minCents: 19730000, maxCents: 25052500, rateBps: 3200 },
      { minCents: 25052500, maxCents: 62635000, rateBps: 3500 },
      { minCents: 62635000, maxCents: null, rateBps: 3700 },
    ],
  },
  quarterlyDeadlines: [
    { quarter: 'Q1', dueDateString: '04-15', dueLabel: 'April 15' },
    { quarter: 'Q2', dueDateString: '06-15', dueLabel: 'June 15' },
    { quarter: 'Q3', dueDateString: '09-15', dueLabel: 'September 15' },
    { quarter: 'Q4', dueDateString: '01-15', dueLabel: 'January 15' },
  ],
};
