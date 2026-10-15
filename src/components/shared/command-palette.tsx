'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { useDemoSessionStore } from '@/features/auth/store/demo-session-store';
import { DEMO_PERSONAS } from '@/auth';
import {
  LayoutDashboard,
  Receipt,
  Lock,
  FileText,
  CreditCard,
  TrendingUp,
  Settings,
  Sparkles,
  Zap,
  RotateCcw,
  Calendar,
  User,
  Shield,
  Palette,
} from 'lucide-react';
import { toast } from 'sonner';

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({ open: externalOpen, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const { activePersonaId, setActivePersonaId, advanceQuarter, resetQuarter } = useDemoSessionStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, setIsOpen]);

  const runCommand = (command: () => void) => {
    setIsOpen(false);
    command();
  };

  const handleSimulatePayment = async () => {
    toast.loading('Simulating $4,200 incoming invoice payment...', { id: 'cmd-sim' });
    try {
      const activePersona = DEMO_PERSONAS.find((p) => p.id === activePersonaId) || DEMO_PERSONAS[0];
      const res = await fetch('/api/demo/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate_payment',
          businessId: activePersonaId === 'user_arjun_mehta' ? 'biz_mehta_systems' : 'biz_vance_studio',
          amountCents: 420000,
          counterparty: 'Acme Design Corp',
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Payment Received & Split!', {
          id: 'cmd-sim',
          description: `$3,024 to Operating • $1,176 to Tax Vault`,
        });
        router.refresh();
      } else {
        toast.error('Simulation failed', { id: 'cmd-sim' });
      }
    } catch {
      toast.error('Simulation failed', { id: 'cmd-sim' });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-xl bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
        <Command label="SoloFi Global Search" className="flex flex-col">
          <div className="flex items-center border-b border-[var(--border)] px-4">
            <Sparkles className="w-4 h-4 text-[var(--primary)] mr-2 flex-shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Type a command, search pages, or trigger simulation (⌘K)..."
              className="w-full h-12 bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            />
            <kbd className="hidden sm:inline-flex text-[10px] bg-[var(--card-subtle)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--muted-foreground)] font-mono">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="py-6 text-center text-xs text-[var(--muted-foreground)]">
              No results found.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading={<span className="text-[11px] font-semibold text-[var(--muted-foreground)] px-2">Quick FinActions</span>}>
              <Command.Item
                onSelect={() => runCommand(handleSimulatePayment)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer text-[var(--foreground)] hover:bg-[var(--card-subtle)] aria-selected:bg-[var(--card-subtle)]"
              >
                <Zap className="w-4 h-4 text-[var(--primary)]" />
                <span>Simulate $4,200 Invoice Paid (Auto-Split into Vault)</span>
                <span className="ml-auto text-[10px] text-[var(--primary)] font-mono">Demo Hero</span>
              </Command.Item>

              <Command.Item
                onSelect={() =>
                  runCommand(() => {
                    advanceQuarter();
                    toast.success('Advanced to next quarter');
                    router.refresh();
                  })
                }
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer text-[var(--foreground)] hover:bg-[var(--card-subtle)] aria-selected:bg-[var(--card-subtle)]"
              >
                <Calendar className="w-4 h-4 text-[var(--vault-accent)]" />
                <span>Advance Financial Quarter (Next Tax Deadline)</span>
              </Command.Item>

              <Command.Item
                onSelect={() =>
                  runCommand(async () => {
                    toast.loading('Resetting DB to clean seed...', { id: 'db-reset' });
                    await fetch('/api/demo/session', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ action: 'reset_db' }),
                    });
                    resetQuarter();
                    toast.success('Database reset to clean state', { id: 'db-reset' });
                    router.refresh();
                  })
                }
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer text-[var(--foreground)] hover:bg-[var(--card-subtle)] aria-selected:bg-[var(--card-subtle)]"
              >
                <RotateCcw className="w-4 h-4 text-rose-500" />
                <span>Reset Demo Database (Seed state)</span>
              </Command.Item>
            </Command.Group>

            {/* Navigation Group */}
            <Command.Group heading={<span className="text-[11px] font-semibold text-[var(--muted-foreground)] px-2">Navigation</span>}>
              <Command.Item
                onSelect={() => runCommand(() => router.push('/dashboard'))}
                className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg cursor-pointer text-[var(--foreground)] hover:bg-[var(--card-subtle)] aria-selected:bg-[var(--card-subtle)]"
              >
                <LayoutDashboard className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span>Dashboard Overview</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/transactions'))}
                className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg cursor-pointer text-[var(--foreground)] hover:bg-[var(--card-subtle)] aria-selected:bg-[var(--card-subtle)]"
              >
                <Receipt className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span>Transactions & Review Inbox</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/tax-vault'))}
                className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg cursor-pointer text-[var(--foreground)] hover:bg-[var(--card-subtle)] aria-selected:bg-[var(--card-subtle)]"
              >
                <Lock className="w-4 h-4 text-[var(--vault-accent)]" />
                <span>Tax Vault & Quarterly Deadlines</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/invoices'))}
                className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg cursor-pointer text-[var(--foreground)] hover:bg-[var(--card-subtle)] aria-selected:bg-[var(--card-subtle)]"
              >
                <FileText className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span>Invoicing & Pay Links</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/cards'))}
                className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg cursor-pointer text-[var(--foreground)] hover:bg-[var(--card-subtle)] aria-selected:bg-[var(--card-subtle)]"
              >
                <CreditCard className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span>Virtual Visa Commercial Cards</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/forecast'))}
                className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg cursor-pointer text-[var(--foreground)] hover:bg-[var(--card-subtle)] aria-selected:bg-[var(--card-subtle)]"
              >
                <TrendingUp className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span>Runway & Safe-to-Spend Forecast</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => router.push('/settings'))}
                className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg cursor-pointer text-[var(--foreground)] hover:bg-[var(--card-subtle)] aria-selected:bg-[var(--card-subtle)]"
              >
                <Settings className="w-4 h-4 text-[var(--muted-foreground)]" />
                <span>Tax & Account Settings</span>
              </Command.Item>
            </Command.Group>

            {/* Switch Personas */}
            <Command.Group heading={<span className="text-[11px] font-semibold text-[var(--muted-foreground)] px-2">Switch Solopreneur Persona</span>}>
              {DEMO_PERSONAS.map((p) => (
                <Command.Item
                  key={p.id}
                  onSelect={() =>
                    runCommand(() => {
                      setActivePersonaId(p.id);
                      toast.success(`Switched active persona to ${p.name}`);
                      router.refresh();
                    })
                  }
                  className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg cursor-pointer text-[var(--foreground)] hover:bg-[var(--card-subtle)] aria-selected:bg-[var(--card-subtle)]"
                >
                  <User className="w-4 h-4 text-[var(--primary)]" />
                  <span>{p.name}</span>
                  <span className="text-[10px] text-[var(--muted-foreground)] ml-auto">{p.role} ({p.currency})</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2 bg-[var(--card-subtle)] text-[10px] text-[var(--muted-foreground)]">
            <div className="flex items-center gap-3">
              <span>Navigate <kbd className="font-mono bg-[var(--card)] px-1 py-0.5 rounded border border-[var(--border)]">↑↓</kbd></span>
              <span>Select <kbd className="font-mono bg-[var(--card)] px-1 py-0.5 rounded border border-[var(--border)]">↵</kbd></span>
            </div>
            <span>SoloFi Global Command</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
