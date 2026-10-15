'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export interface ChartWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  periodOptions?: string[];
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  headerAction?: React.ReactNode;
}

export function ChartWrapper({
  title,
  description,
  periodOptions,
  selectedPeriod,
  onPeriodChange,
  headerAction,
  children,
  className,
  ...props
}: ChartWrapperProps) {
  return (
    <Card className={cn('overflow-hidden', className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-6 space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description && <CardDescription className="text-xs mt-0.5">{description}</CardDescription>}
        </div>

        <div className="flex items-center gap-2">
          {periodOptions && onPeriodChange && (
            <div className="flex items-center rounded-lg bg-secondary p-0.5 border border-border/40 text-xs">
              {periodOptions.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => onPeriodChange(period)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                    selectedPeriod === period
                      ? 'bg-card text-foreground shadow-2xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
          {headerAction}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-2">{children}</CardContent>
    </Card>
  );
}
