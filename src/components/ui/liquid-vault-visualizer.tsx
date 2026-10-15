'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MoneyText } from '@/components/ui/money-text';
import { Badge } from '@/components/ui/badge';

export interface LiquidVaultVisualizerProps {
  currentCents: number;
  targetCents: number;
  quarterLabel?: string;
  isLocked?: boolean;
  className?: string;
  onTopUp?: () => void;
}

export function LiquidVaultVisualizer({
  currentCents,
  targetCents,
  quarterLabel = 'Q2 2025 (Due Jun 15)',
  isLocked = true,
  className,
  onTopUp,
}: LiquidVaultVisualizerProps) {
  const percentage = Math.min(
    100,
    targetCents > 0 ? Math.round((currentCents / targetCents) * 100) : 100
  );

  const isOnTrack = percentage >= 100;
  const isClose = percentage >= 75 && percentage < 100;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-amber-500/25 bg-radial from-amber-500/5 via-transparent to-transparent p-6 shadow-xs backdrop-blur-xs',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            {isLocked ? <Lock className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5">
              Dedicated Tax Vault
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-amber-500/15 text-amber-700 dark:text-amber-300">
                Locked
              </span>
            </h4>
            <p className="text-xs text-muted-foreground">{quarterLabel}</p>
          </div>
        </div>

        <Badge variant={isOnTrack ? 'vault' : isClose ? 'warning' : 'destructive'} dot>
          {isOnTrack ? '100% Funded' : `${percentage}% of target`}
        </Badge>
      </div>

      {/* Main Metric Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
        <div className="md:col-span-7 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Current Set-Aside (Locked)
          </p>
          <div className="flex items-baseline gap-2">
            <MoneyText cents={currentCents} size="3xl" />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span>Quarterly Target:</span>
            <MoneyText cents={targetCents} size="sm" className="font-semibold text-foreground" />
            <span className="opacity-60">•</span>
            <span className={cn('font-medium', isOnTrack ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400')}>
              {isOnTrack
                ? 'Safe & On Track'
                : `$${((targetCents - currentCents) / 100).toLocaleString()} to safe harbor`}
            </span>
          </p>
        </div>

        {/* Visual Tank / Cylinder Reservoir */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative h-28 w-full max-w-[200px] rounded-2xl border-2 border-amber-500/30 bg-muted/40 p-1 overflow-hidden shadow-inner flex flex-col justify-end">
            {/* Liquid Fill Gauge */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${percentage}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full rounded-xl bg-linear-to-t from-amber-600/80 via-amber-500/80 to-amber-400/90 shadow-md"
            >
              {/* Dynamic Wave Surface */}
              <div className="absolute inset-x-0 -top-2 h-3 bg-amber-300/60 rounded-full blur-[1px] opacity-75" />
              {/* Shimmer particles */}
              <div className="absolute inset-0 bg-radial from-white/20 to-transparent opacity-60" />
            </motion.div>

            {/* Inner Content Centered */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold font-mono tracking-tight text-foreground bg-background/80 px-2 py-0.5 rounded-full shadow-2xs backdrop-blur-xs">
                {percentage}%
              </span>
            </div>
          </div>
          <span className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            Auto-withheld on invoice payment
          </span>
        </div>
      </div>
    </div>
  );
}
