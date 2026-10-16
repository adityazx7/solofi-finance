'use client';

import * as React from 'react';
import {
  Lock,
  Receipt,
  FileText,
  TrendingUp,
  Download,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MoneyText } from '@/components/ui/money-text';

export function FeatureBentoGrid() {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <Zap className="h-3.5 w-3.5" />
          The SoloFi Platform
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Every Financial Superpower, Built In
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          No third-party add-ons or broken sync connectors. Every tool speaks the same ledger in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Tile 1: Smart Tax Withholding (Large, 7 cols) */}
        <div className="md:col-span-7 rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-5 flex flex-col justify-between shadow-xs relative overflow-hidden group">
          <div className="absolute right-4 top-4 opacity-15 dark:opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none">
            <img src="/assets/3d-icons/3d-dollar-coin-icon.png" alt="Coin 3D" className="w-28 h-28 object-contain" />
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between">
              <Badge variant="vault" size="sm" dot>
                Hero Feature
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">SECA + Federal + State</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              Smart Tax Withholding
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
              Every invoice payment is split at the source. Choose auto-calculated bracket withholding, fixed rate, or tiered thresholds. Includes full support for US IRS and Indian Section 44ADA regimes.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-secondary/50 p-4 space-y-2 relative z-10 backdrop-blur-2xs">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground">Invoice #INV-2025-012 Received</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">+$4,200.00</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-border/80">
              <span className="text-muted-foreground">Auto-moved to Tax Vault (28%):</span>
              <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">-$1,176.00</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <span>Deposited into Operating:</span>
              <span className="font-mono">+$3,024.00</span>
            </div>
          </div>
        </div>

        {/* Tile 2: Native Expense Tracking & Auto-Categorizer (5 cols) */}
        <div className="md:col-span-5 rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-5 flex flex-col justify-between shadow-xs relative overflow-hidden group">
          <div className="absolute right-4 top-4 opacity-20 dark:opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
            <img src="/assets/3d-icons/3d-receipt-icon.png" alt="Receipt 3D" className="w-24 h-24 object-contain" />
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between">
              <Badge variant="default" size="sm">
                Zero Sync
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">MCC + Keyword AI</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">
              Native Bookkeeping
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              Every card swipe is classified instantly with Schedule C line numbers. Low-confidence items go to a 10-second Review Inbox.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/40 p-4 space-y-2 text-xs relative z-10">
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">FIGMA*MONTHLY</span>
              <Badge variant="success" size="sm">100% Deductible</Badge>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Category: Software & SaaS</span>
              <span className="font-mono">$15.00</span>
            </div>
          </div>
        </div>

        {/* Tile 3: The Tax Vault (4 cols) */}
        <div className="md:col-span-4 rounded-3xl border border-amber-500/25 bg-card p-6 space-y-4 flex flex-col justify-between shadow-xs relative overflow-hidden group">
          <div className="absolute right-3 top-3 opacity-25 dark:opacity-15 group-hover:opacity-35 transition-opacity pointer-events-none">
            <img src="/assets/3d-safe-vault-icon-with-money-illustration-png.webp" alt="Safe Vault" className="w-20 h-20 object-contain" />
          </div>

          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Lock className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Locked Bucket</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight">The Tax Vault</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A locked digital reservoir. Withdrawing requires deliberate friction to safeguard against penalties.
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex justify-between items-center relative z-10">
            <span className="text-xs text-muted-foreground">Q2 Vault Balance:</span>
            <MoneyText cents={842000} size="lg" className="font-bold text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        {/* Tile 4: 90-Day Runway & Salary Smoothing (4 cols) */}
        <div className="md:col-span-4 rounded-3xl border border-border bg-card p-6 space-y-4 flex flex-col justify-between shadow-xs relative overflow-hidden group">
          <div className="absolute right-3 top-3 opacity-20 dark:opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
            <img src="/assets/3d-icons/3d-chart-growth-icon.png" alt="Growth Chart" className="w-20 h-20 object-contain" />
          </div>

          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Predictive Cashflow</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight">Runway & Salary Smoothing</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Smooth lumpy freelance income into a predictable bi-weekly salary paid directly to your personal account.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/50 p-3 flex justify-between items-center relative z-10">
            <span className="text-xs text-muted-foreground">Steady Salary:</span>
            <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">$4,500 / mo</span>
          </div>
        </div>

        {/* Tile 5: One-Click Accountant Pack (4 cols) */}
        <div className="md:col-span-4 rounded-3xl border border-border bg-card p-6 space-y-4 flex flex-col justify-between shadow-xs relative overflow-hidden group">
          <div className="absolute right-3 top-3 opacity-20 dark:opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
            <img src="/assets/3d-icons/3d-calculator-icon.png" alt="Calculator" className="w-20 h-20 object-contain" />
          </div>

          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-2 text-indigo-500">
              <Download className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Accountant Ready</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight">Year-End Tax Pack</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Export an accountant-formatted bundle (CSV + PDF trial balance) categorized by tax lines with one click.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/50 p-3 flex justify-between items-center relative z-10">
            <span className="text-xs text-muted-foreground">Format:</span>
            <Badge variant="outline" size="sm">Schedule C CSV + PDF</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
