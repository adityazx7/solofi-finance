'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Sparkles, ArrowDownRight, ArrowUpRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoneyText } from '@/components/ui/money-text';
import { toast } from 'sonner';

export function HeroTaxSplitSimulator() {
  const [hasSimulated, setHasSimulated] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Balances
  const initialOperating = 1240000; // $12,400.00
  const initialVault = 724400;      // $7,244.00
  const invoiceAmount = 420000;     // $4,200.00
  const withholdingRateBps = 2800;  // 28%
  const taxWithheld = Math.round((invoiceAmount * withholdingRateBps) / 10000); // $1,176.00
  const netDeposit = invoiceAmount - taxWithheld; // $3,024.00

  const [operatingCents, setOperatingCents] = React.useState(initialOperating);
  const [vaultCents, setVaultCents] = React.useState(initialVault);

  const handleSimulate = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      setOperatingCents(initialOperating + netDeposit);
      setVaultCents(initialVault + taxWithheld);
      setHasSimulated(true);
      setIsAnimating(false);

      toast.success(
        'Invoice paid! $1,176.00 auto-quarantined in Tax Vault. Safe to spend: $' +
          ((initialOperating + netDeposit) / 100).toLocaleString()
      );
    }, 900);
  };

  const handleReset = () => {
    setOperatingCents(initialOperating);
    setVaultCents(initialVault);
    setHasSimulated(false);
  };

  return (
    <div className="relative w-full rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl overflow-hidden">
      {/* Decorative subtle ambient glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Simulator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-3 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Live Interactive Prototype
            </span>
            <Badge variant="vault" size="sm">
              Zero Sync BaaS
            </Badge>
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            The Automatic Tax Vault in Action
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {hasSimulated ? (
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          ) : (
            <Button
              variant="vault"
              size="sm"
              onClick={handleSimulate}
              isLoading={isAnimating}
              className="gap-2 text-xs font-semibold shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Simulate $4,200 Invoice Paid
            </Button>
          )}
        </div>
      </div>

      {/* Dual Account Cards (Operating vs Tax Vault) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        {/* Account 1: Safe-to-Spend Operating Checking */}
        <div className="rounded-2xl border border-border/80 bg-secondary/40 p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Operating Checking (Safe to Spend)
            </span>
            <Badge variant="success" size="sm" dot>
              Available
            </Badge>
          </div>

          <div>
            <MoneyText cents={operatingCents} size="3xl" className="text-foreground font-bold" />
            <p className="text-xs text-muted-foreground mt-0.5">Guilt-free business operating cash</p>
          </div>

          {hasSimulated && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-emerald-500/10 p-2.5 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2"
            >
              <ArrowDownRight className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                Net deposit received: <strong>+$3,024.00</strong> (72%)
              </span>
            </motion.div>
          )}
        </div>

        {/* Account 2: The Hero Tax Vault */}
        <div className="rounded-2xl border border-amber-500/30 bg-radial from-amber-500/10 via-transparent to-transparent p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-amber-500" />
              Dedicated Tax Vault (Locked)
            </span>
            <Badge variant="vault" size="sm" dot>
              Q2 Safe Harbor
            </Badge>
          </div>

          <div>
            <MoneyText
              cents={vaultCents}
              size="3xl"
              className="text-amber-600 dark:text-amber-400 font-bold"
            />
            <p className="text-xs text-muted-foreground mt-0.5">Automatically quarantined for IRS/CBDT</p>
          </div>

          {hasSimulated && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-amber-500/15 p-2.5 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2"
            >
              <ArrowUpRight className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                Auto-withheld 28%: <strong>+$1,176.00</strong>
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Real-Time Split Micro-Animation Banner */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center space-y-2"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
              <Sparkles className="h-4 w-4 animate-spin" />
              Calculating 2025 SECA & Progressive Bracket Split...
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8 }}
                className="h-full bg-linear-to-r from-emerald-500 to-amber-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanatory Caption */}
      <div className="mt-6 pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-2">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          No QuickBooks reconciliation • Zero sync lag • FDIC-insured partner bank
        </span>
        <span className="font-mono text-[11px] opacity-75">
          Formula: TaxEngine(SECA + Bracket 22%) = 28% Split
        </span>
      </div>
    </div>
  );
}
