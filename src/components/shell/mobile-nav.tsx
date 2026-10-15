'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  PlusCircle,
  Lock,
  Menu,
  FileText,
} from 'lucide-react';

interface MobileNavProps {
  onOpenMenu?: () => void;
  unreviewedCount?: number;
}

export function MobileNav({ onOpenMenu, unreviewedCount = 1 }: MobileNavProps) {
  const pathname = usePathname();

  const tabs = [
    {
      title: 'Home',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Ledger',
      href: '/transactions',
      icon: Receipt,
      hasDot: unreviewedCount > 0,
    },
    {
      title: 'Invoices',
      href: '/invoices',
      icon: FileText,
      isCenter: true,
    },
    {
      title: 'Tax Vault',
      href: '/tax-vault',
      icon: Lock,
    },
    {
      title: 'Menu',
      href: '#',
      icon: Menu,
      onClick: onOpenMenu,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[var(--card)]/90 backdrop-blur-lg border-t border-[var(--border)] px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.href !== '#' && (pathname === tab.href || pathname.startsWith(tab.href + '/'));
          const Icon = tab.icon;

          if (tab.onClick) {
            return (
              <button
                key={tab.title}
                onClick={tab.onClick}
                className="flex flex-col items-center justify-center py-1 px-3 text-[10px] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span>{tab.title}</span>
              </button>
            );
          }

          if (tab.isCenter) {
            return (
              <Link
                key={tab.title}
                href={tab.href}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-[var(--foreground)] mt-0.5">{tab.title}</span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.title}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] relative transition-colors ${
                isActive
                  ? 'text-[var(--primary)] font-semibold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 mb-0.5 ${
                    isActive
                      ? 'text-[var(--primary)]'
                      : tab.title === 'Tax Vault'
                      ? 'text-[var(--vault-accent)]'
                      : 'text-[var(--muted-foreground)]'
                  }`}
                />
                {tab.hasDot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[var(--card)]" />
                )}
              </div>
              <span>{tab.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
