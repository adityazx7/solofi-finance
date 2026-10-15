/**
 * SoloFi Tax Engine — India Ruleset (FY 2024-25 / FY 2025-26)
 * Source: Income Tax Act, 1961 (New Tax Regime u/s 115BAC & Section 44ADA)
 * All monetary amounts in minor units (paise / cents: ₹1 = 100 paise).
 */

export interface IndiaTaxBracket {
  minPaise: number;
  maxPaise: number | null;
  rateBps: number;
}

export interface IndiaTaxRulesConfig {
  version: string;
  financialYear: string;
  presumptive44AdaThresholdPaise: number; // ₹75,00,000 (with digital mode >= 95%)
  presumptiveDeemedProfitFactor: number;   // 0.50 (50%)
  section87ARebateThresholdPaise: number;  // ₹7,00,000
  cessRateBps: number;                    // 400 bps (4.00%)
  gstServiceThresholdPaise: number;       // ₹20,00,000
  gstAlertThresholdFactor: number;        // 0.80 (80% = ₹16,00,000)
  slabsNewRegime: IndiaTaxBracket[];
  advanceTaxInstalments: {
    instalment: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    dueDateString: string;
    cumulativePercentageRequired: number;
    dueLabel: string;
  }[];
}

export const INDIA_TAX_RULES_2025: IndiaTaxRulesConfig = {
  version: '2025.1-cbdt',
  financialYear: '2025-26',
  presumptive44AdaThresholdPaise: 750000000, // ₹75,00,000.00
  presumptiveDeemedProfitFactor: 0.50,       // 50% deemed profit
  section87ARebateThresholdPaise: 70000000,  // ₹7,00,000.00
  cessRateBps: 400,                          // 4% health & education cess
  gstServiceThresholdPaise: 200000000,       // ₹20,00,000.00
  gstAlertThresholdFactor: 0.80,
  slabsNewRegime: [
    { minPaise: 0, maxPaise: 30000000, rateBps: 0 },          // Up to ₹3 Lakh: Nil
    { minPaise: 30000000, maxPaise: 70000000, rateBps: 500 },  // ₹3L - ₹7L: 5%
    { minPaise: 70000000, maxPaise: 100000000, rateBps: 1000 },// ₹7L - ₹10L: 10%
    { minPaise: 100000000, maxPaise: 120000000, rateBps: 1500 },// ₹10L - ₹12L: 15%
    { minPaise: 120000000, maxPaise: 150000000, rateBps: 2000 },// ₹12L - ₹15L: 20%
    { minPaise: 150000000, maxPaise: null, rateBps: 3000 },      // Above ₹15L: 30%
  ],
  advanceTaxInstalments: [
    { instalment: 'Q1', dueDateString: '06-15', cumulativePercentageRequired: 15, dueLabel: 'June 15 (15%)' },
    { instalment: 'Q2', dueDateString: '09-15', cumulativePercentageRequired: 45, dueLabel: 'September 15 (45%)' },
    { instalment: 'Q3', dueDateString: '12-15', cumulativePercentageRequired: 75, dueLabel: 'December 15 (75%)' },
    { instalment: 'Q4', dueDateString: '03-15', cumulativePercentageRequired: 100, dueLabel: 'March 15 (100%)' },
  ],
};
