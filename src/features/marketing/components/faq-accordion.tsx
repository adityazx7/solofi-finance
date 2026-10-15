'use client';

import * as React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      q: 'Is SoloFi a bank?',
      a: 'SoloFi is a financial technology platform, not an insured bank. Banking services are simulated through a regulated partner bank (Member FDIC) via modern BaaS (Banking-as-a-Service) adapters. In this prototype, all balances and payments are fully functional against a local mock bank core.',
    },
    {
      q: 'How does automatic tax withholding work without me manually calculating it?',
      a: 'When an invoice is paid or deposit arrives, SoloFi runs your business profile through our pure Tax Engine. For US users, it incorporates Schedule C SECA self-employment tax (15.3%), progressive federal tax brackets, and standard deductions. For Indian users, it calculates Section 44ADA presumptive taxation and advance tax instalments.',
    },
    {
      q: 'Can I withdraw money from my Tax Vault if I have an emergency?',
      a: 'Yes. It is your money. However, withdrawing from the Tax Vault triggers a deliberate friction step in the UI that explains the projected tax shortfall and estimated IRS underpayment interest penalty so you never get surprised.',
    },
    {
      q: 'Does SoloFi replace my certified CPA or accountant?',
      a: 'SoloFi makes your relationship with your accountant 10x better. Instead of handing them a messy shoebox of receipts or broken QuickBooks exports, you can invite them with a read-only accountant view or download a complete, reconciled Schedule C trial balance with one click.',
    },
    {
      q: 'How does SoloFi compare to traditional business checking accounts?',
      a: 'Traditional banks just show one lump balance and let you accidentally spend your tax money. SoloFi gives you a Safe-to-Spend balance that is already cleared of all tax liabilities and upcoming recurring expenses.',
    },
    {
      q: 'How much does SoloFi cost?',
      a: 'SoloFi offers a Free Tier with smart checking and basic auto-withholding, and a Pro Tier ($12/month) with advanced cashflow runway forecasting, salary smoothing, and multi-currency international invoicing.',
    },
  ];

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <HelpCircle className="h-3.5 w-3.5" />
          Clear Answers
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
        <p className="text-sm text-muted-foreground">
          Everything you need to know about the automated hub for solopreneurs.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-foreground"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                    isOpen && 'rotate-180 text-foreground'
                  )}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 mt-1">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
