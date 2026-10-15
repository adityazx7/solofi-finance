'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemoSessionStore } from '@/features/auth/store/demo-session-store';
import { DEMO_PERSONAS } from '@/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import {
  Search,
  Bell,
  Zap,
  Sparkles,
  Lock,
  CheckCircle2,
  Menu,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface AppHeaderProps {
  onOpenCommandPalette: () => void;
  onOpenMobileMenu?: () => void;
}

export function AppHeader({ onOpenCommandPalette, onOpenMobileMenu }: AppHeaderProps) {
  const router = useRouter();
  const { activePersonaId } = useDemoSessionStore();
  const activePersona = DEMO_PERSONAS.find((p) => p.id === activePersonaId) || DEMO_PERSONAS[0];

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifications = [
    {
      id: 'notif_1',
      title: 'Tax Vault Protected',
      time: '12m ago',
      desc: '$1,176 auto-transferred from Acme invoice into locked Q2 Vault',
      type: 'vault',
    },
    {
      id: 'notif_2',
      title: 'Transaction Needs Review',
      time: '2h ago',
      desc: 'Corner Mart #402 ($42.50) marked with 60% confidence',
      type: 'review',
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md px-4 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card-subtle)]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-[var(--foreground)] hidden sm:inline">
            {activePersona.businessName}
          </span>
          <Badge variant="outline" className="text-[10px] uppercase font-mono hidden lg:inline-flex">
            {activePersona.country === 'US' ? 'IRS Schedule C' : 'ITD Sec 44ADA'}
          </Badge>
        </div>
      </div>

      {/* Center: ⌘K Search Bar Trigger */}
      <div className="flex-1 max-w-md mx-2">
        <button
          onClick={onOpenCommandPalette}
          className="w-full h-8 px-3 rounded-lg bg-[var(--card-subtle)] border border-[var(--border)] hover:border-[var(--primary)] text-xs text-[var(--muted-foreground)] flex items-center justify-between transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
            <span className="truncate">Search transactions, invoices, or commands...</span>
          </div>
          <kbd className="hidden sm:inline-flex text-[10px] font-mono bg-[var(--card)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--muted-foreground)]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Quick Simulate Payment Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            toast.loading('Simulating $4,200 payment receipt...', { id: 'hdr-sim' });
            try {
              const res = await fetch('/api/demo/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'simulate_payment',
                  businessId: activePersona.id === 'user_arjun_mehta' ? 'biz_mehta_systems' : 'biz_vance_studio',
                  amountCents: 420000,
                  counterparty: activePersona.currency === 'INR' ? 'Infosys Consulting' : 'Acme Design Corp',
                }),
              });
              const data = await res.json();
              if (data.success) {
                toast.success('Simulated Payment Received & Split!', {
                  id: 'hdr-sim',
                  description: 'Tax Vault auto-withheld 28%',
                });
                router.refresh();
              }
            } catch {
              toast.error('Simulation failed', { id: 'hdr-sim' });
            }
          }}
          className="hidden sm:flex text-xs h-8 gap-1.5 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-subtle)] font-medium"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Simulate Payment</span>
        </Button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card-subtle)] relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[var(--card)]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] mb-2">
                <span className="font-semibold text-xs text-[var(--foreground)]">Notifications</span>
                <button
                  onClick={() => {
                    setUnreadCount(0);
                    toast.success('All marked as read');
                  }}
                  className="text-[10px] text-[var(--primary)] hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-[var(--card-subtle)] border border-[var(--border)] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[11px] text-[var(--foreground)]">{n.title}</span>
                      <span className="text-[9px] text-[var(--muted-foreground)]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[var(--muted-foreground)]">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Avatar with Link to Login / Persona Picker */}
        <Link href="/login" title="Switch persona">
          <img
            src={activePersona.avatar}
            alt={activePersona.name}
            className="w-7 h-7 rounded-full object-cover border border-[var(--border)] hover:ring-2 hover:ring-[var(--primary)] transition-all"
          />
        </Link>
      </div>
    </header>
  );
}
