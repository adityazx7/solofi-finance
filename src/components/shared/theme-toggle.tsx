'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-9 w-24 items-center rounded-xl bg-secondary/60 p-1 border border-border/60" />
    );
  }

  return (
    <div className="flex items-center rounded-xl bg-secondary p-1 border border-border/80">
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
          theme === 'light'
            ? 'bg-card text-foreground shadow-2xs font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Light Mode"
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4 text-amber-500" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
          theme === 'dark'
            ? 'bg-card text-foreground shadow-2xs font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Dark Mode"
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4 text-indigo-400" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('system')}
        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
          theme === 'system'
            ? 'bg-card text-foreground shadow-2xs font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="System Preference"
        aria-label="System mode"
      >
        <Monitor className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  );
}
