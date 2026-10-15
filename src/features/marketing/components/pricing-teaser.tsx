'use client';

import * as React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function PricingTeaser() {
  const scrollToWaitlist = () => {
    const el = document.getElementById('waitlist-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          Simple, Transparent Pricing
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          No Hidden Banking Fees. No Accountant Overcharging.
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Start for free on the waitlist. Upgrade when your business grows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Tier 1: Free Starter */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-foreground">Solo Starter</span>
              <Badge variant="secondary" size="sm">Free Forever</Badge>
            </div>
            <div>
              <span className="text-4xl font-extrabold font-mono text-foreground">$0</span>
              <span className="text-xs text-muted-foreground ml-1.5">/ month</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Everything essential to stop tax surprises and track business spending cleanly.
            </p>
            <ul className="space-y-2.5 text-xs text-muted-foreground pt-2">
              {[
                'Smart Business Checking account',
                'Automatic Tax Vault withholding',
                'Native expense categorizer with MCC tags',
                'Up to 5 client invoices per month',
                'Simulated debit card with spending controls',
              ].map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-foreground">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button variant="outline" size="lg" onClick={scrollToWaitlist} className="w-full">
            Join the Free Waitlist
          </Button>
        </div>

        {/* Tier 2: Pro Hub */}
        <div className="rounded-3xl border border-emerald-500/30 bg-radial from-emerald-500/10 via-transparent to-transparent p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-foreground">Solo Pro</span>
              <Badge variant="vault" size="sm">Most Popular</Badge>
            </div>
            <div>
              <span className="text-4xl font-extrabold font-mono text-foreground">$12</span>
              <span className="text-xs text-muted-foreground ml-1.5">/ month (billed annually)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              For high-earning freelancers and micro-businesses seeking complete financial autonomy.
            </p>
            <ul className="space-y-2.5 text-xs text-muted-foreground pt-2">
              {[
                'Everything in Starter',
                'Unlimited branded invoicing + payment link portal',
                '90-day cashflow runway forecast',
                'Income-volatility salary smoothing',
                'US IRS + India 44ADA multi-regime support',
                'One-click Year-End Accountant Export Pack',
                'Read-only CPA invite link',
              ].map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-foreground">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button variant="default" size="lg" onClick={scrollToWaitlist} className="w-full shadow-xs">
            Join Priority Waitlist (Lock $12/mo)
          </Button>
        </div>
      </div>
    </div>
  );
}
