'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemoSessionStore } from '@/features/auth/store/demo-session-store';
import { DEMO_PERSONAS } from '@/auth';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Receipt,
  Lock,
  FileText,
  CreditCard,
  TrendingUp,
  Settings,
  ShieldCheck,
  Building2,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface AppSidebarProps {
  unreviewedCount?: number;
}

export function AppSidebar({ unreviewedCount = 1 }: AppSidebarProps) {
  const pathname = usePathname();
  const { activePersonaId } = useDemoSessionStore();
  const activePersona = DEMO_PERSONAS.find((p) => p.id === activePersonaId) || DEMO_PERSONAS[0];

  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Transactions',
      href: '/transactions',
      icon: Receipt,
      badge: unreviewedCount > 0 ? `${unreviewedCount} to review` : undefined,
      badgeVariant: 'warning' as const,
    },
    {
      title: 'Tax Vault',
      href: '/tax-vault',
      icon: Lock,
      badge: 'Auto-Split',
      badgeVariant: 'vault' as const,
    },
    {
      title: 'Invoices & Pay',
      href: '/invoices',
      icon: FileText,
    },
    {
      title: 'Cards',
      href: '/cards',
      icon: CreditCard,
    },
    {
      title: 'Forecast & Runway',
      href: '/forecast',
      icon: TrendingUp,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-[var(--border)] bg-[var(--card)] h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[var(--border)]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
            S
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-base tracking-tight text-[var(--foreground)]">SoloFi</span>
              <Badge variant="outline" className="text-[9px] uppercase tracking-wider text-[var(--primary)] border-[var(--primary)]/30">
                PRO
              </Badge>
            </div>
            <p className="text-[10px] text-[var(--muted-foreground)] font-mono truncate">{activePersona.businessName}</p>
          </div>
        </Link>

        {/* Partner Bank Disclosure */}
        <div className="mt-3 px-2 py-1.5 rounded-lg bg-[var(--card-subtle)] border border-[var(--border)] flex items-center gap-1.5 text-[10px] text-[var(--muted-foreground)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)] flex-shrink-0" />
          <span className="truncate">
            {activePersona.country === 'IN' ? 'Partner: HDFC Bank / RBI' : 'Partner: Evolve Bank / FDIC'}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider px-3 mb-2">
          Financial Hub
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--primary-subtle)] text-[var(--primary)] font-semibold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card-subtle)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-[var(--primary)]'
                      : item.title === 'Tax Vault'
                      ? 'text-[var(--vault-accent)]'
                      : 'text-[var(--muted-foreground)]'
                  }`}
                />
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <Badge
                  variant={item.badgeVariant || 'default'}
                  className="text-[9px] px-1.5 py-0 h-4 uppercase tracking-wider font-mono"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Safe-to-Spend Mini Bar */}
      <div className="p-3 mx-3 mb-2 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)]">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-[var(--muted-foreground)] font-medium">Safe-to-Spend</span>
          <span className="font-mono font-semibold text-[var(--primary)]">
            {activePersona.currency === 'INR' ? '₹8,00,000' : '$10,030'}
          </span>
        </div>
        <div className="w-full bg-[var(--border)] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[var(--primary)] h-full w-[68%]" />
        </div>
        <p className="text-[9px] text-[var(--muted-foreground)] mt-1.5 flex items-center gap-1">
          <Lock className="w-2.5 h-2.5 text-[var(--vault-accent)]" />
          <span>Taxes auto-isolated in vault</span>
        </p>
      </div>

      {/* User Footer / Persona Switcher Link */}
      <div className="p-3 border-t border-[var(--border)] flex items-center justify-between">
        <Link href="/login" className="flex items-center gap-2.5 overflow-hidden group">
          <img
            src={activePersona.avatar}
            alt={activePersona.name}
            className="w-8 h-8 rounded-full object-cover border border-[var(--border)] flex-shrink-0"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-[var(--foreground)] truncate group-hover:text-[var(--primary)]">
              {activePersona.name}
            </p>
            <p className="text-[10px] text-[var(--muted-foreground)] truncate">{activePersona.role}</p>
          </div>
        </Link>
        <Link
          href="/login"
          title="Switch persona or sign out"
          className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--card-subtle)]"
        >
          <LogOut className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
}
