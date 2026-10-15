'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Money, type CurrencyCode } from '@/lib/money';

export interface MoneyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  cents: number;
  currency?: CurrencyCode;
  showSign?: boolean;
  signType?: 'income' | 'expense' | 'neutral';
  dimCents?: boolean;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg font-medium',
  xl: 'text-xl font-semibold',
  '2xl': 'text-2xl font-bold tracking-tight',
  '3xl': 'text-3xl font-extrabold tracking-tight',
  '4xl': 'text-4xl font-extrabold tracking-tight',
};

export function MoneyText({
  cents,
  currency = 'USD',
  showSign = false,
  signType,
  dimCents = true,
  size = 'base',
  className,
  ...props
}: MoneyTextProps) {
  const money = React.useMemo(() => Money.fromCents(cents, currency), [cents, currency]);
  const formatted = money.format();

  // Split into whole and decimal parts (e.g., "$4,250" and ".00")
  const match = formatted.match(/^(.*?)([\.,]\d{2})?$/);
  const wholePart = match ? match[1] : formatted;
  const decimalPart = match && match[2] ? match[2] : '';

  const isPositive = cents > 0;
  const isNegative = cents < 0;

  let signPrefix = '';
  if (showSign) {
    if (signType === 'income' || (isPositive && !signType)) {
      signPrefix = '+';
    } else if (signType === 'expense' || isNegative) {
      signPrefix = '-';
    }
  }

  const colorClass = React.useMemo(() => {
    if (signType === 'income') return 'text-emerald-600 dark:text-emerald-400';
    if (signType === 'expense') return 'text-foreground/90';
    return 'text-foreground';
  }, [signType]);

  return (
    <span
      className={cn(
        'font-mono tabular-nums tracking-tight inline-flex items-baseline',
        sizeClasses[size],
        colorClass,
        className
      )}
      {...props}
    >
      {signPrefix && <span className="mr-0.5 select-none opacity-80">{signPrefix}</span>}
      <span>{wholePart}</span>
      {dimCents && decimalPart && (
        <span className="text-[0.8em] font-normal opacity-60 ml-0.5">{decimalPart}</span>
      )}
    </span>
  );
}
