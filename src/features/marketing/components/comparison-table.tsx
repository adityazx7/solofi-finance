'use client';

import * as React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ComparisonTable() {
  const rows = [
    {
      feature: 'Automatic Tax Withholding on Deposit',
      solofi: true,
      quickbooks: false,
      spreadsheets: false,
      legacyBank: false,
    },
    {
      feature: 'Dedicated Locked Tax Vault Bucket',
      solofi: true,
      quickbooks: false,
      spreadsheets: false,
      legacyBank: false,
    },
    {
      feature: 'Native Real-Time Bookkeeping (Zero Sync)',
      solofi: true,
      quickbooks: false, // Broken sync connectors
      spreadsheets: false,
      legacyBank: false,
    },
    {
      feature: 'Live Safe-to-Spend Balance Calculation',
      solofi: true,
      quickbooks: false,
      spreadsheets: false,
      legacyBank: false,
    },
    {
      feature: 'US IRS + India 44ADA Multi-Regime Support',
      solofi: true,
      quickbooks: false,
      spreadsheets: 'manual',
      legacyBank: false,
    },
    {
      feature: 'One-Click Accountant Year-End Pack',
      solofi: true,
      quickbooks: true,
      spreadsheets: 'manual',
      legacyBank: false,
    },
    {
      feature: 'Monthly Software Subscription Fee',
      solofi: '$0 / $12',
      quickbooks: '$35 – $90 / mo',
      spreadsheets: '$0',
      legacyBank: '$15 / mo (fees)',
    },
    {
      feature: 'Zero Tax Anxiety Guarantee',
      solofi: true,
      quickbooks: false,
      spreadsheets: false,
      legacyBank: false,
    },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Why Solopreneurs Abandon Old Tools for SoloFi
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Traditional accounting software expects you to be a CPA. Legacy banks don't know what a 1099 is. SoloFi solves both.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-secondary/50">
              <th className="p-4 sm:p-5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Capability
              </th>
              <th className="p-4 sm:p-5 font-bold text-foreground text-xs uppercase tracking-wider bg-emerald-500/10 border-x border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  SoloFi Hub
                  <Badge variant="vault" size="sm">Native</Badge>
                </div>
              </th>
              <th className="p-4 sm:p-5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                QuickBooks Online
              </th>
              <th className="p-4 sm:p-5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Spreadsheets (Excel/Sheets)
              </th>
              <th className="p-4 sm:p-5 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Traditional Business Checking
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 sm:p-5 font-medium text-foreground text-xs sm:text-sm">
                  {row.feature}
                </td>

                {/* SoloFi Cell */}
                <td className="p-4 sm:p-5 bg-emerald-500/5 border-x border-emerald-500/20 font-semibold text-emerald-700 dark:text-emerald-400">
                  {typeof row.solofi === 'boolean' ? (
                    <div className="flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-xs">Yes (Native)</span>
                    </div>
                  ) : (
                    <span className="font-mono text-xs">{row.solofi}</span>
                  )}
                </td>

                {/* QuickBooks Cell */}
                <td className="p-4 sm:p-5 text-muted-foreground">
                  {typeof row.quickbooks === 'boolean' ? (
                    row.quickbooks ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <X className="h-4 w-4 text-rose-500" />
                    )
                  ) : (
                    <span className="font-mono text-xs text-rose-500 font-medium">{row.quickbooks}</span>
                  )}
                </td>

                {/* Spreadsheets Cell */}
                <td className="p-4 sm:p-5 text-muted-foreground">
                  {row.spreadsheets === 'manual' ? (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Manual formula</span>
                  ) : typeof row.spreadsheets === 'boolean' ? (
                    <X className="h-4 w-4 text-rose-500" />
                  ) : (
                    <span className="font-mono text-xs">{row.spreadsheets}</span>
                  )}
                </td>

                {/* Legacy Bank Cell */}
                <td className="p-4 sm:p-5 text-muted-foreground">
                  {typeof row.legacyBank === 'boolean' ? (
                    <X className="h-4 w-4 text-rose-500" />
                  ) : (
                    <span className="font-mono text-xs text-rose-500 font-medium">{row.legacyBank}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
