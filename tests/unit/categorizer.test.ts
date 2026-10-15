import { describe, it, expect } from 'vitest';
import { Categorizer } from '@/features/transactions/lib/categorizer';

describe('Categorizer — Sanitization & Matching', () => {
  it('cleans messy card strings correctly', () => {
    expect(Categorizer.sanitizeCounterparty('SQ *BLUE BOTTLE 0453 CA')).toBe('Blue Bottle');
    expect(Categorizer.sanitizeCounterparty('TST* SWEETGREEN 12')).toBe('Sweetgreen');
    expect(Categorizer.sanitizeCounterparty('AMZN MKTP US*2B3DF')).toBe('Amazon Marketplace');
  });

  it('matches known vendors with high confidence (≥ 0.90)', () => {
    const figma = Categorizer.categorize({
      rawDescription: 'FIGMA*SUBSCRIPTION MONTHLY',
      amountCents: 1500,
    });
    expect(figma.categorySlug).toBe('software-saas');
    expect(figma.confidenceScore).toBe(0.92);
    expect(figma.requiresReview).toBe(false);
    expect(figma.sanitizedCounterparty).toBe('Figma');

    const aws = Categorizer.categorize({
      rawDescription: 'AWS.AMAZON.COM/BILL 10294',
      amountCents: 8520,
    });
    expect(aws.categorySlug).toBe('cloud-hosting');
    expect(aws.confidenceScore).toBe(0.92);
    expect(aws.requiresReview).toBe(false);
  });

  it('matches MCC codes when keyword is ambiguous', () => {
    const legal = Categorizer.categorize({
      rawDescription: 'WILSON & ASSOCIATES',
      mcc: '8111',
      amountCents: 150000,
    });
    expect(legal.categorySlug).toBe('legal-accounting');
    expect(legal.confidenceScore).toBe(0.88);
    expect(legal.requiresReview).toBe(false);
  });

  it('routes low-confidence unclassified expenses to Review Inbox', () => {
    const ambiguous = Categorizer.categorize({
      rawDescription: 'CORNER MART #402',
      amountCents: 3250,
    });
    expect(ambiguous.confidenceScore).toBeLessThan(0.85);
    expect(ambiguous.requiresReview).toBe(true);
  });

  it('prioritizes user custom rules over default patterns', () => {
    const customRule = Categorizer.createRuleFromCorrection(
      'corner mart',
      'office-supplies',
      'Office Supplies',
      true,
      true,
      100
    );

    const match = Categorizer.categorize({
      rawDescription: 'CORNER MART #402',
      amountCents: 3250,
      customRules: [customRule],
    });

    expect(match.matchedRuleType).toBe('user_rule');
    expect(match.confidenceScore).toBe(0.98);
    expect(match.categorySlug).toBe('office-supplies');
    expect(match.requiresReview).toBe(false);
  });
});
