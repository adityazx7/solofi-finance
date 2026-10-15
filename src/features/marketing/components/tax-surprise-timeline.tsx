'use client';

import * as React from 'react';
import { AlertCircle, CheckCircle2, FileSpreadsheet, Lock, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function TaxSurpriseTimeline() {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-500">
          <AlertCircle className="h-3.5 w-3.5" />
          The Self-Employment Epidemic
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          The "Tax Surprise" is Killing Solopreneur Dreams
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Over <strong>70% of independent workers report severe anxiety</strong> about cash flow and unexpected quarterly tax bills. Here is why the old model fails, and how SoloFi fixes it forever.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The Old Broken Way */}
        <div className="rounded-3xl border border-rose-500/20 bg-card p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <span className="font-semibold text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              The Fragmented Way (Spreadsheets + QuickBooks)
            </span>
            <Badge variant="destructive" size="sm">
              70% High Anxiety
            </Badge>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-rose-500/20">
            <div className="flex gap-4 relative">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 font-mono text-xs font-bold border border-rose-500/30">
                1
              </div>
              <div className="space-y-1 pt-0.5">
                <h4 className="text-sm font-bold text-foreground">Money Gets Mixed</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Client invoice of $8,000 hits your generic checking account. You see $8,000 in your balance and mentally assume it is yours to spend.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 font-mono text-xs font-bold border border-rose-500/30">
                2
              </div>
              <div className="space-y-1 pt-0.5">
                <h4 className="text-sm font-bold text-foreground">Sync Breaks & Receipts Get Lost</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  QuickBooks bank sync disconnects after 3 months. You forget to classify expenses. Year-end spreadsheets pile up with missing receipts.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 font-mono text-xs font-bold border border-rose-500/30">
                3
              </div>
              <div className="space-y-1 pt-0.5">
                <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">The "Tax Surprise" Crush</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  April rolls around: your accountant hits you with an unexpected $14,200 tax bill. You don't have the cash on hand. Severe panic and IRS penalty interest follow.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The SoloFi Way */}
        <div className="rounded-3xl border border-emerald-500/30 bg-radial from-emerald-500/10 via-transparent to-transparent p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              The SoloFi Way (Automated Financial Hub)
            </span>
            <Badge variant="success" size="sm" dot>
              Zero Tax Surprise
            </Badge>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-emerald-500/20">
            <div className="flex gap-4 relative">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 font-mono text-xs font-bold border border-emerald-500/30">
                1
              </div>
              <div className="space-y-1 pt-0.5">
                <h4 className="text-sm font-bold text-foreground">Income in → Instant Auto-Split</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The exact second a client payment arrives, SoloFi's native tax engine calculates your bracket and locks your tax portion into the Tax Vault.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 font-mono text-xs font-bold border border-emerald-500/30">
                2
              </div>
              <div className="space-y-1 pt-0.5">
                <h4 className="text-sm font-bold text-foreground">Zero Sync Bookkeeping</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Because SoloFi is your actual business account, every transaction is categorized natively at point-of-sale with IRS Schedule C tax deduction tags.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 font-mono text-xs font-bold border border-emerald-500/30">
                3
              </div>
              <div className="space-y-1 pt-0.5">
                <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Total Calm Confidence</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  When quarterly estimated taxes arrive, 100% of the funds are already waiting in your Tax Vault. One tap to remit to IRS or tax authority. Zero surprise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
