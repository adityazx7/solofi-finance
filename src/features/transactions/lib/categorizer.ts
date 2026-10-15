/**
 * SoloFi Auto-Categorization Engine
 * Classifies raw transaction descriptions and MCC codes into tax-ready categories.
 * Calculates confidence score (0.0 to 1.0) and flags low-confidence items for Review Inbox.
 */

import { MCC_DICTIONARY, type MccClassification } from './mcc-dictionary';

export interface CategoryRuleItem {
  id: string;
  pattern: string; // Regex or lowercase substring
  field: 'counterparty' | 'rawDescription' | 'mcc';
  categorySlug: string;
  categoryName: string;
  isBusiness: boolean;
  isDeductible: boolean;
  deductiblePercentage: number;
  priority: number; // Higher takes precedence
}

export interface CategorizationInput {
  rawDescription: string;
  counterparty?: string;
  mcc?: string;
  amountCents: number;
  customRules?: CategoryRuleItem[];
}

export interface CategorizationResult {
  categorySlug: string;
  categoryName: string;
  isBusiness: boolean;
  isDeductible: boolean;
  deductiblePercentage: number;
  confidenceScore: number; // 0.00 to 1.00
  requiresReview: boolean; // true if confidenceScore < 0.85
  matchedRuleType: 'user_rule' | 'merchant_pattern' | 'mcc_code' | 'heuristic_fallback';
  explanation: string;
  sanitizedCounterparty: string;
}

export const AUTO_APPROVE_THRESHOLD = 0.85;

/**
 * Built-in high-confidence solopreneur merchant patterns
 */
interface MerchantPattern {
  keywords: string[];
  cleanName: string;
  categorySlug: string;
  categoryName: string;
  isBusiness: boolean;
  isDeductible: boolean;
  deductiblePercentage: number;
}

const KNOWN_MERCHANT_PATTERNS: MerchantPattern[] = [
  // Cloud & SaaS
  {
    keywords: ['figma'],
    cleanName: 'Figma',
    categorySlug: 'software-saas',
    categoryName: 'Software & Cloud Services',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  {
    keywords: ['github', 'git hub'],
    cleanName: 'GitHub',
    categorySlug: 'software-saas',
    categoryName: 'Software & Cloud Services',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  {
    keywords: ['vercel'],
    cleanName: 'Vercel',
    categorySlug: 'cloud-hosting',
    categoryName: 'Hosting & Infrastructure',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  {
    keywords: ['aws', 'amazon web services', 'aws.amazon'],
    cleanName: 'Amazon Web Services',
    categorySlug: 'cloud-hosting',
    categoryName: 'Hosting & Infrastructure',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  {
    keywords: ['google cloud', 'gcp'],
    cleanName: 'Google Cloud Platform',
    categorySlug: 'cloud-hosting',
    categoryName: 'Hosting & Infrastructure',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  {
    keywords: ['google workspace', 'google*gsuite', 'google apps'],
    cleanName: 'Google Workspace',
    categorySlug: 'software-saas',
    categoryName: 'Software & Cloud Services',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  {
    keywords: ['openai', 'chatgpt', 'open ai'],
    cleanName: 'OpenAI',
    categorySlug: 'software-saas',
    categoryName: 'Software & Cloud Services',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  {
    keywords: ['adobe', 'creative cloud'],
    cleanName: 'Adobe Creative Cloud',
    categorySlug: 'software-saas',
    categoryName: 'Software & Cloud Services',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  {
    keywords: ['slack'],
    cleanName: 'Slack Technologies',
    categorySlug: 'software-saas',
    categoryName: 'Software & Cloud Services',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  {
    keywords: ['linear'],
    cleanName: 'Linear Orbit',
    categorySlug: 'software-saas',
    categoryName: 'Software & Cloud Services',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  {
    keywords: ['notion'],
    cleanName: 'Notion Labs',
    categorySlug: 'software-saas',
    categoryName: 'Software & Cloud Services',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  // Advertising
  {
    keywords: ['meta ads', 'fb ads', 'facebook ads'],
    cleanName: 'Meta Ads',
    categorySlug: 'advertising',
    categoryName: 'Advertising & Marketing',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  {
    keywords: ['google ads', 'adwords'],
    cleanName: 'Google Ads',
    categorySlug: 'advertising',
    categoryName: 'Advertising & Marketing',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  // Hardware & Office
  {
    keywords: ['apple store', 'apple.com/bill', 'apple store #'],
    cleanName: 'Apple',
    categorySlug: 'hardware-equipment',
    categoryName: 'Hardware & Tech Equipment',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  // Meals & Coffee (50% business deductible if meeting)
  {
    keywords: ['blue bottle', 'sq *blue bottle'],
    cleanName: 'Blue Bottle Coffee',
    categorySlug: 'meals-entertainment',
    categoryName: 'Business Meals & Coffee',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 50,
  },
  {
    keywords: ['starbucks', 'sbux'],
    cleanName: 'Starbucks',
    categorySlug: 'meals-entertainment',
    categoryName: 'Business Meals & Coffee',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 50,
  },
  // Rideshare / Travel
  {
    keywords: ['uber *trip', 'uber trip', 'uber *ride'],
    cleanName: 'Uber',
    categorySlug: 'travel-transportation',
    categoryName: 'Rideshare & Transportation',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
  {
    keywords: ['lyft *ride', 'lyft ride'],
    cleanName: 'Lyft',
    categorySlug: 'travel-transportation',
    categoryName: 'Rideshare & Transportation',
    isBusiness: true,
    isDeductible: true,
    deductiblePercentage: 100,
  },
];

export class Categorizer {
  /**
   * Cleans messy bank strings (e.g. "SQ *BLUE BOTTLE 0453 CA" -> "Blue Bottle Coffee")
   */
  static sanitizeCounterparty(raw: string): string {
    if (!raw) return 'Unknown Merchant';

    let cleaned = raw
      .replace(/^SQ\s*\*\s*/i, '')
      .replace(/^TST\s*\*\s*/i, '')
      .replace(/^AMZN\s+MKTP\s+US\*[A-Z0-9]+/i, 'Amazon Marketplace')
      .replace(/\s+\d{3,}\s+[A-Z]{2}$/i, '') // e.g. " 0453 CA"
      .replace(/\s+[A-Z]{2}\s+\d{3,}$/i, '') // e.g. " CA 0453"
      .replace(/#\d+/g, '')
      .replace(/\s+\d+$/g, '')               // trailing numeric ID e.g. " 12"
      .replace(/\*+/g, ' ')
      .trim();

    // Capitalize words
    return cleaned
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Categorizes a transaction using our layered rule hierarchy:
   * 1. User-defined custom rules (Highest precedence: 0.98 confidence)
   * 2. Known merchant keywords (0.92 confidence)
   * 3. MCC code dictionary (0.88 confidence)
   * 4. Heuristic fallback (0.50 – 0.65 confidence -> Review Inbox)
   */
  static categorize(input: CategorizationInput): CategorizationResult {
    const rawLower = (input.rawDescription || '').toLowerCase();
    const counterpartyLower = (input.counterparty || '').toLowerCase();
    const combinedText = `${rawLower} ${counterpartyLower}`;
    const sanitizedName = Categorizer.sanitizeCounterparty(input.counterparty || input.rawDescription);

    // 1. User Custom Rules
    if (input.customRules && input.customRules.length > 0) {
      const sortedRules = [...input.customRules].sort((a, b) => b.priority - a.priority);
      for (const rule of sortedRules) {
        let matches = false;
        if (rule.field === 'mcc' && input.mcc) {
          matches = input.mcc.trim() === rule.pattern.trim();
        } else if (rule.field === 'counterparty') {
          matches = counterpartyLower.includes(rule.pattern.toLowerCase());
        } else {
          matches = combinedText.includes(rule.pattern.toLowerCase());
        }

        if (matches) {
          return {
            categorySlug: rule.categorySlug,
            categoryName: rule.categoryName,
            isBusiness: rule.isBusiness,
            isDeductible: rule.isDeductible,
            deductiblePercentage: rule.deductiblePercentage,
            confidenceScore: 0.98,
            requiresReview: false,
            matchedRuleType: 'user_rule',
            explanation: `Matched your custom rule for "${rule.pattern}"`,
            sanitizedCounterparty: sanitizedName,
          };
        }
      }
    }

    // 2. Known Merchant Patterns
    for (const merchant of KNOWN_MERCHANT_PATTERNS) {
      for (const keyword of merchant.keywords) {
        if (combinedText.includes(keyword.toLowerCase())) {
          return {
            categorySlug: merchant.categorySlug,
            categoryName: merchant.categoryName,
            isBusiness: merchant.isBusiness,
            isDeductible: merchant.isDeductible,
            deductiblePercentage: merchant.deductiblePercentage,
            confidenceScore: 0.92,
            requiresReview: false,
            matchedRuleType: 'merchant_pattern',
            explanation: `Identified known vendor "${merchant.cleanName}"`,
            sanitizedCounterparty: merchant.cleanName,
          };
        }
      }
    }

    // 3. MCC Code Resolution
    if (input.mcc && MCC_DICTIONARY[input.mcc]) {
      const mccInfo = MCC_DICTIONARY[input.mcc];
      return {
        categorySlug: mccInfo.categorySlug,
        categoryName: mccInfo.categoryName,
        isBusiness: mccInfo.isBusinessDefault,
        isDeductible: mccInfo.isDeductibleDefault,
        deductiblePercentage: mccInfo.deductiblePercentage,
        confidenceScore: 0.88,
        requiresReview: false,
        matchedRuleType: 'mcc_code',
        explanation: `Classified via Merchant Category Code ${input.mcc} (${mccInfo.description})`,
        sanitizedCounterparty: sanitizedName,
      };
    }

    // 4. Ambiguous Heuristics (Flags for Review Inbox)
    const isLikelyPersonal = combinedText.includes('groceries') || combinedText.includes('cinema') || combinedText.includes('target') || combinedText.includes('walmart');
    
    if (isLikelyPersonal) {
      return {
        categorySlug: 'personal-unclassified',
        categoryName: 'Personal / Unclassified',
        isBusiness: false,
        isDeductible: false,
        deductiblePercentage: 0,
        confidenceScore: 0.65,
        requiresReview: true,
        matchedRuleType: 'heuristic_fallback',
        explanation: 'Likely personal purchase — needs your confirmation',
        sanitizedCounterparty: sanitizedName,
      };
    }

    // Fallback: General Operating Expense (Needs review)
    return {
      categorySlug: 'general-operating',
      categoryName: 'General Operating Expense',
      isBusiness: true,
      isDeductible: true,
      deductiblePercentage: 100,
      confidenceScore: 0.50,
      requiresReview: true,
      matchedRuleType: 'heuristic_fallback',
      explanation: 'Unrecognized merchant — please confirm category and tax deductibility',
      sanitizedCounterparty: sanitizedName,
    };
  }

  /**
   * Generates a persistent custom rule when a user manually recategorizes an item.
   */
  static createRuleFromCorrection(
    merchantPattern: string,
    targetCategorySlug: string,
    targetCategoryName: string,
    isBusiness: boolean,
    isDeductible: boolean,
    deductiblePercentage: number = 100
  ): CategoryRuleItem {
    return {
      id: `rule_${Date.now()}`,
      pattern: merchantPattern.trim().toLowerCase(),
      field: 'rawDescription',
      categorySlug: targetCategorySlug,
      categoryName: targetCategoryName,
      isBusiness: isBusiness,
      isDeductible: isDeductible,
      deductiblePercentage: deductiblePercentage,
      priority: 100, // higher than defaults
    };
  }
}
