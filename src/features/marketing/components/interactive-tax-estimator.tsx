'use client';

import * as React from 'react';
import { TaxEngine } from '@/features/tax/lib/tax-engine';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoneyText } from '@/components/ui/money-text';
import { Calculator, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export function InteractiveTaxEstimator() {
  const [country, setCountry] = React.useState<'US' | 'IN'>('US');
  const [monthlyIncome, setMonthlyIncome] = React.useState(8500); // $8,500 / mo
  const [filingStatus, setFilingStatus] = React.useState<'single' | 'married_joint'>('single');
  const [usePresumptive44Ada, setUsePresumptive44Ada] = React.useState(true);

  // Compute live estimate using our pure TaxEngine
  const calculation = React.useMemo(() => {
    if (country === 'US') {
      const annualGrossCents = monthlyIncome * 12 * 100;
      const estimatedExpensesCents = Math.round(annualGrossCents * 0.2); // 20% estimated deductible expenses
      const profitCents = annualGrossCents - estimatedExpensesCents;

      const tax = TaxEngine.calculateUsTaxes({
        netBusinessProfitCents: profitCents,
        filingStatus,
      });

      const withholding = TaxEngine.calculateWithholding({
        country: 'US',
        incomingPaymentCents: monthlyIncome * 100,
        mode: 'auto',
        annualProjectedRevenueCents: annualGrossCents,
        filingStatus,
      });

      const safeToSpendMonthlyCents = Math.round((annualGrossCents - tax.totalAnnualLiabilityCents) / 12);

      return {
        annualGrossCents,
        totalTaxLiabilityCents: tax.totalAnnualLiabilityCents,
        effectiveRateBps: tax.effectiveRateBps,
        withholdingRateBps: withholding.withholdingRateBps,
        quarterlyPaymentCents: tax.quarterlyEstimatedDueCents,
        safeToSpendMonthlyCents,
        currency: 'USD' as const,
      };
    } else {
      // India (₹)
      const monthlyPaise = monthlyIncome * 100 * 100; // in paise
      const annualGrossPaise = monthlyPaise * 12;

      const tax = TaxEngine.calculateIndiaTaxes({
        grossReceiptsPaise: annualGrossPaise,
        usePresumptive44Ada,
      });

      const withholding = TaxEngine.calculateWithholding({
        country: 'IN',
        incomingPaymentCents: monthlyPaise,
        mode: 'auto',
        annualProjectedRevenueCents: annualGrossPaise,
        usePresumptive44Ada,
      });

      const safeToSpendMonthlyCents = Math.round((annualGrossPaise - tax.totalAnnualLiabilityPaise) / 12);

      return {
        annualGrossCents: annualGrossPaise,
        totalTaxLiabilityCents: tax.totalAnnualLiabilityPaise,
        effectiveRateBps: tax.effectiveRateBps,
        withholdingRateBps: withholding.withholdingRateBps,
        quarterlyPaymentCents: Math.round(tax.totalAnnualLiabilityPaise / 4),
        safeToSpendMonthlyCents,
        currency: 'INR' as const,
      };
    }
  }, [country, monthlyIncome, filingStatus, usePresumptive44Ada]);

  const scrollToWaitlist = () => {
    const el = document.getElementById('waitlist-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lg space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/70">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <Calculator className="h-3.5 w-3.5" />
              Live Interactive Estimator
            </span>
            <Badge variant="vault" size="sm">
              2025 Tax Engine
            </Badge>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            See Your Automatic Set-Aside in Seconds
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            No spreadsheets or guesswork. See how SoloFi auto-protects your cash flow.
          </p>
        </div>

        {/* Country Selector */}
        <div className="flex items-center rounded-xl bg-secondary p-1 border border-border/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setCountry('US');
              setMonthlyIncome(8500);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              country === 'US'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🇺🇸 United States
          </button>
          <button
            type="button"
            onClick={() => {
              setCountry('IN');
              setMonthlyIncome(250000);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              country === 'IN'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🇮🇳 India (44ADA)
          </button>
        </div>
      </div>

      {/* Inputs & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          {/* Income Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Average Monthly Income
              </label>
              <span className="font-mono text-lg font-bold text-foreground">
                {country === 'US'
                  ? `$${monthlyIncome.toLocaleString()} / mo`
                  : `₹${(monthlyIncome / 1000).toFixed(0)}k / mo`}
              </span>
            </div>
            <input
              type="range"
              min={country === 'US' ? 2000 : 50000}
              max={country === 'US' ? 30000 : 600000}
              step={country === 'US' ? 500 : 10000}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-secondary rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
              <span>{country === 'US' ? '$2k/mo' : '₹50k/mo'}</span>
              <span>Projected Annual: {country === 'US' ? `$${(monthlyIncome * 12).toLocaleString()}` : `₹${((monthlyIncome * 12) / 100000).toFixed(1)} Lakhs`}</span>
              <span>{country === 'US' ? '$30k/mo' : '₹600k/mo'}</span>
            </div>
          </div>

          {/* Filing Status / Regime Toggles */}
          {country === 'US' ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Filing Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFilingStatus('single')}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    filingStatus === 'single'
                      ? 'border-emerald-500 bg-emerald-500/10 text-foreground font-semibold shadow-2xs'
                      : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="text-xs font-semibold">Single Filer</div>
                  <div className="text-[11px] text-muted-foreground">$15,000 std deduction</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFilingStatus('married_joint')}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    filingStatus === 'married_joint'
                      ? 'border-emerald-500 bg-emerald-500/10 text-foreground font-semibold shadow-2xs'
                      : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="text-xs font-semibold">Married Filing Jointly</div>
                  <div className="text-[11px] text-muted-foreground">$30,000 std deduction</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Tax Regime
              </label>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-foreground space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Presumptive Taxation u/s 44ADA (New Regime)
                </div>
                <p className="text-muted-foreground text-[11px]">
                  50% of gross revenue is treated as deemed profit with zero maintenance of books. Advance tax calculated quarterly.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Calculated Output Card */}
        <div className="lg:col-span-5 rounded-2xl border border-amber-500/30 bg-radial from-amber-500/10 via-transparent to-transparent p-6 space-y-6 relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-30 dark:opacity-15 pointer-events-none">
            <img src="/assets/3d-icons/3d-calculator-icon.png" alt="Calculator 3D" className="w-20 h-20 object-contain" />
          </div>
          <div className="space-y-1 relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              SoloFi Recommendation
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight font-mono text-foreground">
                {(calculation.withholdingRateBps / 100).toFixed(1)}%
              </span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Auto-Split Rate
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Every deposit automatically split into your locked Tax Vault.
            </p>
          </div>

          <div className="space-y-3 pt-3 border-t border-border/80 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Quarterly Estimated Payment:</span>
              <MoneyText cents={calculation.quarterlyPaymentCents} currency={calculation.currency} className="font-bold text-foreground" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Safe to Spend Every Month:</span>
              <MoneyText cents={calculation.safeToSpendMonthlyCents} currency={calculation.currency} className="font-bold text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Est. Total Annual Liability:</span>
              <MoneyText cents={calculation.totalTaxLiabilityCents} currency={calculation.currency} className="font-semibold text-foreground" />
            </div>
          </div>

          <Button onClick={scrollToWaitlist} size="lg" className="w-full gap-2 font-semibold">
            Lock In This Automated Rate
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
