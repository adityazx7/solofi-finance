import { describe, it, expect } from 'vitest';
import { Money } from '@/lib/money';

describe('Money Utility — Minor Unit Arithmetic', () => {
  it('prevents floating point inaccuracies in financial addition', () => {
    // Famous float bug: 0.1 + 0.2 = 0.30000000000000004
    // In cents: 10 + 20 = 30
    const m1 = Money.fromCents(10);
    const m2 = Money.fromCents(20);
    const sum = m1.add(m2);

    expect(sum.cents).toBe(30);
    expect(sum.toMajor()).toBe(0.3);
  });

  it('correctly calculates basis points (bps)', () => {
    const gross = Money.fromCents(420000); // $4,200.00
    const tax = gross.applyBps(2800);      // 28.00%

    expect(tax.cents).toBe(117600); // $1,176.00
    expect(tax.toMajor()).toBe(1176);
  });

  it('throws on non-integer cent initialization', () => {
    expect(() => new Money(10.55 as any)).toThrow();
  });

  it('formats USD and INR appropriately', () => {
    const usd = Money.fromCents(425050, 'USD');
    expect(usd.format()).toContain('$4,250.50');

    const inr = Money.fromCents(35000000, 'INR');
    expect(inr.format()).toContain('3,50,000.00');
  });

  it('rejects adding differing currencies without conversion', () => {
    const usd = Money.fromCents(100, 'USD');
    const inr = Money.fromCents(100, 'INR');
    expect(() => usd.add(inr)).toThrow();
  });

  it('handles subtract, multiply, percentage, and zero methods correctly', () => {
    const a = Money.fromCents(5000);
    const b = Money.fromCents(2000);

    expect(a.subtract(b).cents).toBe(3000);
    expect(a.multiply(2).cents).toBe(10000);
    expect(a.percentage(50).cents).toBe(2500);

    const zero = Money.zero();
    expect(zero.isZero()).toBe(true);
    expect(a.isPositive()).toBe(true);
    expect(Money.fromCents(-100).isNegative()).toBe(true);
  });

  it('formats compact amounts like $4.2k and creates from major currency units', () => {
    const fromMajor = Money.fromMajor(42.5);
    expect(fromMajor.cents).toBe(4250);

    const compact = Money.fromCents(420000); // $4,200.00
    expect(compact.formatCompact()).toContain('4.2K');
  });
});
