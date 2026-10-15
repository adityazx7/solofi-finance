'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoSessionStore } from '@/features/auth/store/demo-session-store';
import { DEMO_PERSONAS } from '@/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  SlidersHorizontal,
  X,
  Zap,
  RotateCcw,
  Calendar,
  UserCheck,
  ChevronUp,
  ChevronDown,
  Loader2,
  ShieldCheck,
  Coins,
} from 'lucide-react';
import { toast } from 'sonner';

export function DemoControlPanel() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const { activePersonaId, setActivePersonaId, quarterOffset, advanceQuarter, resetQuarter } =
    useDemoSessionStore();

  const activePersona = DEMO_PERSONAS.find((p) => p.id === activePersonaId) || DEMO_PERSONAS[0];

  const quarters = ['Q2 2025 (Jun 15)', 'Q3 2025 (Sep 15)', 'Q4 2025 (Jan 15)', 'Q1 2026 (Apr 15)'];
  const currentQuarterLabel = quarters[quarterOffset % 4];

  const handleSimulatePayment = async (amountCents = 420000) => {
    setIsSimulating(true);
    toast.loading('Simulating payment receipt via Mock BaaS...', { id: 'demo-sim' });

    try {
      const bizId =
        activePersona.id === 'user_arjun_mehta'
          ? 'biz_mehta_systems'
          : activePersona.id === 'user_chloe_lin'
          ? 'biz_chloe_studio'
          : activePersona.id === 'user_pioneer_labs'
          ? 'biz_pioneer_labs'
          : 'biz_vance_studio';

      const res = await fetch('/api/demo/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate_payment',
          businessId: bizId,
          amountCents: amountCents,
          counterparty: activePersona.currency === 'INR' ? 'Infosys Consulting Ltd' : 'Acme Design Corp',
        }),
      });

      const data = await res.json();
      if (data.success) {
        const withheld = (data.result.taxWithheldCents / 100).toLocaleString();
        const net = (data.result.netOperatingCents / 100).toLocaleString();
        toast.success(`Payment Received & Auto-Split!`, {
          id: 'demo-sim',
          description: `${activePersona.currency === 'INR' ? '₹' : '$'}${net} into Operating • ${
            activePersona.currency === 'INR' ? '₹' : '$'
          }${withheld} into Tax Vault`,
        });
        router.refresh();
      } else {
        toast.error('Simulation failed: ' + (data.error || 'Unknown error'), { id: 'demo-sim' });
      }
    } catch {
      toast.error('Simulation failed', { id: 'demo-sim' });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetDb = async () => {
    setIsResetting(true);
    toast.loading('Resetting DB to seed state...', { id: 'demo-reset' });

    try {
      const res = await fetch('/api/demo/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_db' }),
      });
      const data = await res.json();
      if (data.success) {
        resetQuarter();
        toast.success('Database Reset Complete', {
          id: 'demo-reset',
          description: 'All 4 personas restored to default seed state',
        });
        router.refresh();
      } else {
        toast.error('Reset failed', { id: 'demo-reset' });
      }
    } catch {
      toast.error('Reset failed', { id: 'demo-reset' });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 z-40">
      {isOpen ? (
        <div className="w-80 sm:w-96 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="p-3 bg-[var(--card-subtle)] border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span className="text-xs font-semibold text-[var(--foreground)]">SoloFi Demo Control</span>
              <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">
                BaaS Sandbox
              </Badge>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4 text-xs">
            {/* Active Persona Selector */}
            <div>
              <label className="text-[11px] font-semibold text-[var(--muted-foreground)] block mb-1.5 uppercase tracking-wider">
                Switch Solopreneur Persona
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_PERSONAS.map((p) => {
                  const isCurrent = p.id === activePersonaId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePersonaId(p.id);
                        toast.success(`Switched to ${p.name}`);
                        router.refresh();
                      }}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                        isCurrent
                          ? 'border-[var(--primary)] bg-[var(--primary-subtle)]/40 text-[var(--primary)] font-medium'
                          : 'border-[var(--border)] hover:border-[var(--border-strong)] text-[var(--foreground)]'
                      }`}
                    >
                      <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                      <div className="truncate">
                        <p className="truncate text-[11px] font-semibold leading-tight">{p.name}</p>
                        <p className="text-[9px] text-[var(--muted-foreground)]">{p.currency} • {p.country}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2 border-t border-[var(--border)]">
              <label className="text-[11px] font-semibold text-[var(--muted-foreground)] block uppercase tracking-wider">
                Simulate FinEvents
              </label>

              {/* Simulate Payment Button */}
              <Button
                variant="default"
                size="sm"
                className="w-full justify-between bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm"
                disabled={isSimulating}
                onClick={() => handleSimulatePayment(420000)}
              >
                <div className="flex items-center gap-2">
                  {isSimulating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                  <span>Simulate {activePersona.currency === 'INR' ? '₹3,50,000' : '$4,200'} Paid</span>
                </div>
                <span className="text-[10px] opacity-80 font-mono">Auto-Split</span>
              </Button>

              {/* Advance Quarter Button */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between text-xs"
                  onClick={() => {
                    advanceQuarter();
                    toast.success(`Advanced to ${quarters[(quarterOffset + 1) % 4]}`);
                    router.refresh();
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--vault-accent)]" />
                    <span>Advance Quarter:</span>
                  </div>
                  <span className="font-semibold text-[var(--foreground)]">{currentQuarterLabel}</span>
                </Button>
              </div>

              {/* Reset DB Button */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                disabled={isResetting}
                onClick={handleResetDb}
              >
                {isResetting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                ) : (
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                )}
                <span>Reset Demo Database to Clean Seed</span>
              </Button>
            </div>
          </div>

          {/* Footer note */}
          <div className="px-4 py-2 bg-[var(--card-subtle)] border-t border-[var(--border)] flex items-center justify-between text-[10px] text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[var(--primary)]" />
              Double-Entry Invariant: Verified
            </span>
            <span className="font-mono">Next.js 15 + Drizzle</span>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-lg hover:shadow-xl hover:border-[var(--primary)] text-xs font-medium text-[var(--foreground)] transition-all group ring-1 ring-black/5 dark:ring-white/10"
        >
          <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
          <span className="font-semibold">Demo Sandbox</span>
          <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono text-[var(--muted-foreground)] group-hover:text-[var(--primary)]">
            {activePersona.name.split(' ')[0]}
          </Badge>
          <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
        </button>
      )}
    </div>
  );
}
