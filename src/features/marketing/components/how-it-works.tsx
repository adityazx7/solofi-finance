'use client';

import * as React from 'react';
import { ArrowRight, CheckCircle2, DollarSign, Lock, Sparkles, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MoneyText } from '@/components/ui/money-text';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Get Paid Normally',
      description:
        'Issue clean invoices or provide your SoloFi routing and account numbers to clients, Stripe, or payroll platforms.',
      badge: 'Step 1: Inflow',
      icon: DollarSign,
      visual: (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-2 text-left">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Invoice #INV-2025-014</span>
            <Badge variant="success" size="sm">Paid</Badge>
          </div>
          <MoneyText cents={520000} size="2xl" showSign signType="income" className="font-bold" />
          <p className="text-[11px] text-muted-foreground">Wire deposit from Acme Studio</p>
        </div>
      ),
    },
    {
      number: '02',
      title: 'SoloFi Locks Away Taxes',
      description:
        'The pure tax engine calculates your exact bracket in milliseconds and auto-moves the tax amount into your dedicated Tax Vault.',
      badge: 'Step 2: Auto-Withhold',
      icon: Lock,
      visual: (
        <div className="rounded-2xl border border-amber-500/30 bg-radial from-amber-500/10 via-transparent to-transparent p-4 space-y-2 text-left">
          <div className="flex justify-between items-center text-xs">
            <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Tax Vault Split (28%)
            </span>
            <Badge variant="vault" size="sm">Auto-Quarantine</Badge>
          </div>
          <span className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400 block">
            +$1,456.00
          </span>
          <p className="text-[11px] text-muted-foreground">Reserved for Q2 IRS quarterly deadline</p>
        </div>
      ),
    },
    {
      number: '03',
      title: 'Spend & Save with Confidence',
      description:
        'Your Safe-to-Spend balance is 100% guilt-free. Pay for business tools, pay your own salary, or allocate to savings goals without touching tax money.',
      badge: 'Step 3: Peace of Mind',
      icon: Wallet,
      visual: (
        <div className="rounded-2xl border border-emerald-500/30 bg-card p-4 space-y-2 text-left">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Safe-to-Spend Balance</span>
            <Badge variant="success" size="sm">Guilt-Free</Badge>
          </div>
          <MoneyText cents={1845000} size="2xl" className="text-emerald-600 dark:text-emerald-400 font-bold" />
          <p className="text-[11px] text-muted-foreground">You can spend this without anxiety</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          Architectural Simplicity
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          How SoloFi Works in 3 Effortless Steps
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Because banking and bookkeeping are collapsed into one system, there are zero integrations to break and zero reconciliation tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-xs hover:border-foreground/20 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-extrabold text-muted-foreground/50">
                    {step.number}
                  </span>
                  <Badge variant="secondary" size="sm">
                    {step.badge}
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/80">
                {step.visual}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
