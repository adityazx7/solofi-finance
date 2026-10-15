import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  trailingElement?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leadingIcon, trailingElement, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leadingIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
            {leadingIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground shadow-2xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
            leadingIcon && 'pl-10',
            trailingElement && 'pr-12',
            error && 'border-rose-500 focus-visible:ring-rose-500/30 focus-visible:border-rose-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {trailingElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {trailingElement}
          </div>
        )}
        {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
