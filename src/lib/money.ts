/**
 * SoloFi Monetary Arithmetic & Formatting Utility
 * All monetary amounts are strictly stored and computed as integer minor units (cents / paise).
 * Floating-point representation is strictly prohibited for financial calculations.
 */

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  decimals: number;
  locale: string;
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', decimals: 2, locale: 'en-US' },
  INR: { code: 'INR', symbol: '₹', decimals: 2, locale: 'en-IN' },
  EUR: { code: 'EUR', symbol: '€', decimals: 2, locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', decimals: 2, locale: 'en-GB' },
};

export class Money {
  readonly cents: number;
  readonly currency: CurrencyCode;

  constructor(cents: number, currency: CurrencyCode = 'USD') {
    if (!Number.isInteger(cents)) {
      throw new Error(`Money amounts must be exact integers (minor units). Received: ${cents}`);
    }
    this.cents = cents;
    this.currency = currency;
  }

  static fromCents(cents: number, currency: CurrencyCode = 'USD'): Money {
    return new Money(Math.round(cents), currency);
  }

  static fromMajor(major: number, currency: CurrencyCode = 'USD'): Money {
    const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
    const factor = Math.pow(10, config.decimals);
    return new Money(Math.round(major * factor), currency);
  }

  static zero(currency: CurrencyCode = 'USD'): Money {
    return new Money(0, currency);
  }

  add(other: Money): Money {
    this.assertMatchingCurrency(other);
    return new Money(this.cents + other.cents, this.currency);
  }

  subtract(other: Money): Money {
    this.assertMatchingCurrency(other);
    return new Money(this.cents - other.cents, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(Math.round(this.cents * factor), this.currency);
  }

  /**
   * Calculates basis points (1 bps = 0.01% = 0.0001)
   * Example: 2500 bps = 25.00%
   */
  applyBps(bps: number): Money {
    const product = BigInt(this.cents) * BigInt(Math.round(bps));
    const result = Number(product / 10000n);
    return new Money(result, this.currency);
  }

  percentage(percent: number): Money {
    const bps = Math.round(percent * 100);
    return this.applyBps(bps);
  }

  isPositive(): boolean {
    return this.cents > 0;
  }

  isNegative(): boolean {
    return this.cents < 0;
  }

  isZero(): boolean {
    return this.cents === 0;
  }

  toMajor(): number {
    const config = CURRENCY_CONFIGS[this.currency] || CURRENCY_CONFIGS.USD;
    return this.cents / Math.pow(10, config.decimals);
  }

  format(options?: { showSign?: boolean; showCents?: boolean }): string {
    const config = CURRENCY_CONFIGS[this.currency] || CURRENCY_CONFIGS.USD;
    const major = this.toMajor();
    const showCents = options?.showCents !== false;

    const formatter = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: showCents ? config.decimals : 0,
      maximumFractionDigits: showCents ? config.decimals : 0,
      signDisplay: options?.showSign ? 'always' : 'auto',
    });

    return formatter.format(major);
  }

  formatCompact(): string {
    const config = CURRENCY_CONFIGS[this.currency] || CURRENCY_CONFIGS.USD;
    const major = this.toMajor();
    const formatter = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    });
    return formatter.format(major);
  }

  private assertMatchingCurrency(other: Money) {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }
}
