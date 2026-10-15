'use client';

import React, { useState, useEffect } from 'react';
import { useDemoSessionStore } from '@/features/auth/store/demo-session-store';
import { DEMO_PERSONAS } from '@/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoneyText } from '@/components/ui/money-text';
import type { CurrencyCode } from '@/lib/money';
import {
  CreditCard,
  Lock,
  Unlock,
  ShieldCheck,
  Eye,
  EyeOff,
  Copy,
  Wifi,
  Sliders,
  CheckCircle2,
  Sparkles,
  Snowflake,
  ShoppingBag,
  Laptop,
  Coffee,
  Cloud,
} from 'lucide-react';
import { toast } from 'sonner';

export default function CardsPage() {
  const { activePersonaId } = useDemoSessionStore();
  const activePersona = DEMO_PERSONAS.find((p) => p.id === activePersonaId) || DEMO_PERSONAS[0];
  const currency: CurrencyCode = (activePersona.currency as CurrencyCode) || 'USD';

  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<any>(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [spendingLimitCents, setSpendingLimitCents] = useState(1000000); // $10,000 / mo
  const [monthlySpendCents, setMonthlySpendCents] = useState(248000); // $2,480 spent

  useEffect(() => {
    async function loadCard() {
      setLoading(true);
      try {
        const bizId =
          activePersona.id === 'user_arjun_mehta'
            ? 'biz_mehta_systems'
            : activePersona.id === 'user_chloe_lin'
            ? 'biz_chloe_studio'
            : activePersona.id === 'user_pioneer_labs'
            ? 'biz_pioneer_labs'
            : 'biz_vance_studio';

        const res = await fetch(`/api/cards?businessId=${bizId}`);
        const data = await res.json();
        if (data.cards && data.cards.length > 0) {
          const c = data.cards[0];
          setCard(c);
          setIsFrozen(c.status === 'frozen');
          setSpendingLimitCents(c.spendingLimitCents || 1000000);
          setMonthlySpendCents(data.monthlySpendCents || 248000);
        }
      } catch (err) {
        console.error('Failed to load card:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCard();
  }, [activePersonaId]);

  const handleToggleFreeze = async () => {
    const nextStatus = isFrozen ? 'active' : 'frozen';
    setIsFrozen(!isFrozen);

    try {
      if (card) {
        await fetch('/api/cards', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardId: card.id, status: nextStatus }),
        });
      }
      if (nextStatus === 'frozen') {
        toast.warning('Card Frozen', {
          description: 'All online and in-person card transactions are temporarily paused.',
        });
      } else {
        toast.success('Card Unfrozen & Active');
      }
    } catch {
      toast.error('Failed to update card status');
    }
  };

  const handleLimitChange = async (newLimitCents: number) => {
    setSpendingLimitCents(newLimitCents);
    try {
      if (card) {
        await fetch('/api/cards', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardId: card.id, spendingLimitCents: newLimitCents }),
        });
      }
    } catch {
      console.error('Failed to persist limit');
    }
  };

  const copyNumber = () => {
    navigator.clipboard.writeText('4000128492018492');
    toast.success('Virtual Card Number Copied');
  };

  const spendPct = Math.min(100, Math.round((monthlySpendCents / spendingLimitCents) * 100));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Virtual Commercial Cards</h1>
            <Badge variant={isFrozen ? 'destructive' : 'default'} className="font-mono text-xs">
              {isFrozen ? 'Card Frozen' : 'Visa Platinum Active'}
            </Badge>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            FDIC-insured business debit • Instant limits • Auto-categorized Schedule C bookkeeping
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs gap-1.5"
          >
            {showDetails ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showDetails ? 'Hide Numbers' : 'Reveal Numbers'}</span>
          </Button>

          <Button
            variant={isFrozen ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggleFreeze}
            className={`text-xs gap-1.5 ${
              isFrozen
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'border-rose-500/40 text-rose-500 hover:bg-rose-500/10'
            }`}
          >
            {isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Snowflake className="w-3.5 h-3.5" />}
            <span>{isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Card Render */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            {/* Card Graphic Container */}
            <div
              className={`relative w-full aspect-[1.586/1] rounded-2xl p-6 text-white overflow-hidden shadow-2xl transition-all duration-300 border border-white/10 ${
                isFrozen
                  ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-sky-950 grayscale'
                  : 'bg-gradient-to-br from-zinc-900 via-neutral-900 to-emerald-950'
              }`}
            >
              {/* Radial sheen */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Frozen Overlay */}
              {isFrozen && (
                <div className="absolute inset-0 bg-sky-950/60 backdrop-blur-xs flex flex-col items-center justify-center gap-1 z-20">
                  <Snowflake className="w-8 h-8 text-sky-300 animate-pulse" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-200">
                    Card Temporarily Frozen
                  </span>
                </div>
              )}

              {/* Top Row: SoloFi mark + Contactless Icon */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    S
                  </div>
                  <span className="font-semibold text-sm tracking-tight">SoloFi Commercial</span>
                </div>
                <Wifi className="w-5 h-5 text-white/70 rotate-90" />
              </div>

              {/* EMV Chip graphic */}
              <div className="my-6 relative z-10 flex items-center gap-3">
                <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-200 border border-amber-600/40 shadow-inner flex items-center justify-center">
                  <div className="w-full h-px bg-amber-700/30" />
                </div>
                <Badge variant="outline" className="text-[9px] uppercase tracking-wider text-white/60 border-white/20">
                  Business Debit
                </Badge>
              </div>

              {/* Card Number */}
              <div className="relative z-10 flex items-center justify-between my-2 font-mono text-base tracking-widest text-zinc-100">
                <span>{showDetails ? '4000 1284 9201 8492' : '•••• •••• •••• 8492'}</span>
                {showDetails && (
                  <button onClick={copyNumber} title="Copy full PAN" className="p-1 hover:text-emerald-400">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Footer: Name, Expiry, CVV & Visa Mark */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between relative z-10">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-white/50 block">Cardholder</span>
                  <span className="font-medium text-xs tracking-wide uppercase text-white/90">
                    {activePersona.name}
                  </span>
                </div>

                <div className="text-center">
                  <span className="text-[9px] uppercase tracking-wider text-white/50 block">Exp / CVV</span>
                  <span className="font-mono text-xs text-white/90">
                    11/28 {showDetails ? '• 742' : '• •••'}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-extrabold italic text-lg tracking-wider text-white">VISA</span>
                  <span className="block text-[8px] uppercase tracking-widest text-white/60 -mt-1 font-mono">Platinum</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Copy Info Pill */}
          <div className="p-3 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)] flex items-center justify-between text-xs">
            <span className="text-[var(--muted-foreground)]">Evolve Bank & Trust Depository</span>
            <span className="font-mono font-semibold text-[var(--foreground)]">Routing: 121000358</span>
          </div>
        </div>

        {/* Right Column: Controls, Limit Slider & Categories */}
        <div className="lg:col-span-7 space-y-6">
          {/* Spending Limit Card */}
          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Monthly Spending Limit</CardTitle>
                  <CardDescription className="text-xs">
                    Automated budget shield to preserve operating cashflow
                  </CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {spendPct}% Used
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--muted-foreground)]">Spent this cycle</span>
                <div className="text-right">
                  <MoneyText cents={monthlySpendCents} currency={currency} className="font-bold text-lg font-mono text-[var(--foreground)]" />
                  <span className="text-[10px] text-[var(--muted-foreground)] block">
                    of <MoneyText cents={spendingLimitCents} currency={currency} /> monthly cap
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[var(--border)] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    spendPct > 85 ? 'bg-rose-500' : 'bg-[var(--primary)]'
                  }`}
                  style={{ width: `${spendPct}%` }}
                />
              </div>

              {/* Slider Input */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-1.5 text-[11px] text-[var(--muted-foreground)]">
                  <span>Adjust Monthly Limit:</span>
                  <span className="font-mono font-semibold text-[var(--foreground)]">
                    {currency === 'INR' ? `₹${(spendingLimitCents / 100).toLocaleString()}` : `$${(spendingLimitCents / 100).toLocaleString()}`}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000} // $1,000
                  max={2500000} // $25,000
                  step={50000}
                  value={spendingLimitCents}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Spending Breakdown */}
          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <CardTitle className="text-sm font-semibold">Expense Categories (Schedule C)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-[var(--border)] text-xs">
              {[
                { name: 'Software & Cloud Tools', amount: 98000, icon: Laptop, color: 'text-blue-500' },
                { name: 'Hosting & Servers', amount: 84000, icon: Cloud, color: 'text-indigo-500' },
                { name: 'Meals & Coffee (50% Deductible)', amount: 42000, icon: Coffee, color: 'text-amber-500' },
                { name: 'Office & Tech Hardware', amount: 24000, icon: ShoppingBag, color: 'text-purple-500' },
              ].map((cat, i) => (
                <div key={i} className="p-3.5 flex items-center justify-between hover:bg-[var(--card-subtle)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--card-subtle)] border border-[var(--border)] flex items-center justify-center">
                      <cat.icon className={`w-4 h-4 ${cat.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-[var(--foreground)]">{cat.name}</p>
                      <p className="text-[10px] text-[var(--muted-foreground)]">Auto-Categorized via MCC</p>
                    </div>
                  </div>
                  <MoneyText cents={cat.amount} currency={currency} className="font-semibold text-xs font-mono" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
