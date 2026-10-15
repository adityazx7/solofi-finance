'use client';

import * as React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold tracking-tight shadow-xs">
              S
            </div>
            <span className="font-extrabold text-lg tracking-tight text-foreground">SoloFi</span>
            <span className="hidden sm:inline-block">
              <Badge variant="vault" size="sm">Prototype</Badge>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#estimator" className="hover:text-foreground transition-colors">Tax Estimator</a>
            <a href="#comparison" className="hover:text-foreground transition-colors">Comparison</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link href="/security" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Security
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden sm:flex">
            <Link href="/design">Design System</Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5 shadow-xs font-semibold">
            <a href="#waitlist-section">
              Join Waitlist
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
