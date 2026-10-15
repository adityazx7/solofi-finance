/**
 * Merchant Category Code (MCC) Dictionary & Tax Schedule Line Mappings
 * Used by the SoloFi auto-categorization engine to classify card authorizations
 * and ACH transactions with IRS Schedule C line item attribution.
 */

export interface MccClassification {
  mcc: string;
  categorySlug: string;
  categoryName: string;
  isBusinessDefault: boolean;
  isDeductibleDefault: boolean;
  deductiblePercentage: number;
  scheduleCLine: string; // e.g. "Line 18: Office expense"
  description: string;
}

export const MCC_DICTIONARY: Record<string, MccClassification> = {
  // Software & Cloud Infrastructure
  '5734': {
    mcc: '5734',
    categorySlug: 'software-saas',
    categoryName: 'Software & Cloud Services',
    isBusinessDefault: true,
    isDeductibleDefault: true,
    deductiblePercentage: 100,
    scheduleCLine: 'Line 18 (Office expense / software)',
    description: 'Computer Software Stores & SaaS Subscriptions',
  },
  '4816': {
    mcc: '4816',
    categorySlug: 'cloud-hosting',
    categoryName: 'Hosting & Infrastructure',
    isBusinessDefault: true,
    isDeductibleDefault: true,
    deductiblePercentage: 100,
    scheduleCLine: 'Line 27a (Other expenses: Cloud hosting)',
    description: 'Computer Network & Web Hosting Services',
  },
  // Professional Services & Contractors
  '7372': {
    mcc: '7372',
    categorySlug: 'subcontractors',
    categoryName: 'Subcontractors & Dev Services',
    isBusinessDefault: true,
    isDeductibleDefault: true,
    deductiblePercentage: 100,
    scheduleCLine: 'Line 11 (Contract labor)',
    description: 'Computer Programming & Systems Design',
  },
  '7311': {
    mcc: '7311',
    categorySlug: 'advertising',
    categoryName: 'Advertising & Marketing',
    isBusinessDefault: true,
    isDeductibleDefault: true,
    deductiblePercentage: 100,
    scheduleCLine: 'Line 8 (Advertising)',
    description: 'Advertising Services (Google Ads, Meta, LinkedIn)',
  },
  '8111': {
    mcc: '8111',
    categorySlug: 'legal-accounting',
    categoryName: 'Legal & Professional Fees',
    isBusinessDefault: true,
    isDeductibleDefault: true,
    deductiblePercentage: 100,
    scheduleCLine: 'Line 17 (Legal and professional services)',
    description: 'Legal Services & Attorneys',
  },
  '8931': {
    mcc: '8931',
    categorySlug: 'legal-accounting',
    categoryName: 'Accounting & Bookkeeping',
    isBusinessDefault: true,
    isDeductibleDefault: true,
    deductiblePercentage: 100,
    scheduleCLine: 'Line 17 (Legal and professional services)',
    description: 'Accounting, Auditing, and Bookkeeping Services',
  },
  // Hardware & Office Supplies
  '5045': {
    mcc: '5045',
    categorySlug: 'hardware-equipment',
    categoryName: 'Hardware & Tech Equipment',
    isBusinessDefault: true,
    isDeductibleDefault: true,
    deductiblePercentage: 100,
    scheduleCLine: 'Line 13 (Depreciation / Section 179 expense)',
    description: 'Computers, Peripherals, and Software Wholesale',
  },
  '5943': {
    mcc: '5943',
    categorySlug: 'office-supplies',
    categoryName: 'Office Supplies & Stationery',
    isBusinessDefault: true,
    isDeductibleDefault: true,
    deductiblePercentage: 100,
    scheduleCLine: 'Line 18 (Office expense)',
    description: 'Stationery & Office Supplies Stores',
  },
  // Meals & Client Entertainment
  '5812': {
    mcc: '5812',
    categorySlug: 'meals-entertainment',
    categoryName: 'Business Meals',
    isBusinessDefault: true,
    isDeductibleDefault: true,
    deductiblePercentage: 50, // 50% IRS limit
    scheduleCLine: 'Line 24b (Deductible meals: 50%)',
    description: 'Eating Places & Restaurants',
  },
  '5814': {
    mcc: '5814',
    categorySlug: 'meals-entertainment',
    categoryName: 'Coffee & Fast Food',
    isBusinessDefault: true,
    isDeductibleDefault: true,
    deductiblePercentage: 50,
    scheduleCLine: 'Line 24b (Deductible meals: 50%)',
    description: 'Fast Food Restaurants & Coffee Shops',
  },
  // Travel & Transportation
  '4121': {
    mcc: '4121',
    categorySlug: 'travel-transportation',
    categoryName: 'Rideshare & Taxis',
    isBusinessDefault: true,
    isDeductibleDefault: true,
    deductiblePercentage: 100,
    scheduleCLine: 'Line 9 (Car and truck expenses)',
    description: 'Taxicabs, Limousines, Uber & Lyft',
  },
  '4511': {
    mcc: '4511',
    categorySlug: 'travel-transportation',
    categoryName: 'Air Travel',
    isBusinessDefault: true,
    isDeductibleDefault: true,
    deductiblePercentage: 100,
    scheduleCLine: 'Line 24a (Travel)',
    description: 'Airlines & Air Carriers',
  },
  '7011': {
    mcc: '7011',
    categorySlug: 'travel-transportation',
    categoryName: 'Lodging & Hotels',
    isBusinessDefault: true,
    isDeductibleDefault: true,
    deductiblePercentage: 100,
    scheduleCLine: 'Line 24a (Travel)',
    description: 'Hotels, Motels, and Resorts',
  },
  // Banking, Fees & Wire Charges
  '6012': {
    mcc: '6012',
    categorySlug: 'bank-fees',
    categoryName: 'Bank & Payment Processing Fees',
    isBusinessDefault: true,
    isDeductibleDefault: true,
    deductiblePercentage: 100,
    scheduleCLine: 'Line 10 (Commissions and fees)',
    description: 'Financial Institutions & Wire Transfer Fees',
  },
};
