import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
        secondary:
          'bg-secondary text-secondary-foreground border border-border/80',
        vault:
          'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25 font-semibold',
        success:
          'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20',
        warning:
          'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30',
        destructive:
          'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20',
        outline: 'border border-border text-foreground',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.2 text-[10px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'vault' && 'bg-amber-500',
            variant === 'success' && 'bg-emerald-500',
            variant === 'destructive' && 'bg-rose-500',
            (!variant || variant === 'default') && 'bg-emerald-600',
            variant === 'secondary' && 'bg-muted-foreground'
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
