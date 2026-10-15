'use client';

import React, { useState } from 'react';
import { useDemoSessionStore } from '@/features/auth/store/demo-session-store';
import { DEMO_PERSONAS } from '@/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Settings,
  ShieldCheck,
  Building2,
  Lock,
  Sparkles,
  Save,
  CheckCircle2,
  DollarSign,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { activePersonaId } = useDemoSessionStore();
  const activePersona = DEMO_PERSONAS.find((p) => p.id === activePersonaId) || DEMO_PERSONAS[0];

  const [withholdingMode, setWithholdingMode] = useState<'auto' | 'fixed'>('auto');
  const [fixedRatePct, setFixedRatePct] = useState(28);
  const [roundUpCents, setRoundUpCents] = useState(10000); // $100 round-up
  const [stateRegion, setStateRegion] = useState(activePersona.country === 'US' ? 'CA' : 'KA');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Tax Configuration & Withholding Profile Saved', {
        description: `Withholding set to ${withholdingMode === 'auto' ? 'Dynamic Auto-Split' : `${fixedRatePct}% Fixed`}`,
      });
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Tax & Account Settings</h1>
            <Badge variant="outline" className="font-mono text-xs">
              {activePersona.country} Ruleset Active
            </Badge>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Configure automated withholding logic, banking partner preferences, and entity profile
          </p>
        </div>

        <Button
          size="sm"
          disabled={isSaving}
          onClick={handleSave}
          className="gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </Button>
      </div>

      {/* Tax Withholding Configuration Card */}
      <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
        <CardHeader className="pb-3 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4 text-[var(--vault-accent)]" />
                Tax Vault Withholding Engine
              </CardTitle>
              <CardDescription className="text-xs">
                Dictates the calculation executed whenever an incoming invoice is cleared.
              </CardDescription>
            </div>
            <Badge variant="vault" className="text-xs font-mono">
              Q2 2025
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6 text-xs">
          {/* Mode Selector */}
          <div>
            <label className="font-semibold text-[var(--foreground)] block mb-2 uppercase tracking-wider text-[10px]">
              Withholding Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setWithholdingMode('auto')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  withholdingMode === 'auto'
                    ? 'border-[var(--primary)] bg-[var(--primary-subtle)] ring-1 ring-[var(--primary)]'
                    : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-[var(--foreground)] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                    Dynamic Auto-Withholding (Recommended)
                  </span>
                  {withholdingMode === 'auto' && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                </div>
                <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                  SoloFi dynamically recalculates your effective tax bracket based on cumulative year-to-date income and Schedule C deductible expenses.
                </p>
              </div>

              <div
                onClick={() => setWithholdingMode('fixed')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  withholdingMode === 'fixed'
                    ? 'border-[var(--primary)] bg-[var(--primary-subtle)] ring-1 ring-[var(--primary)]'
                    : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-[var(--foreground)]">
                    Fixed Flat Rate Withholding
                  </span>
                  {withholdingMode === 'fixed' && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                </div>
                <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                  Isolate an exact percentage from every incoming deposit into your Tax Vault bucket.
                </p>
              </div>
            </div>
          </div>

          {/* Fixed Rate Slider */}
          {withholdingMode === 'fixed' && (
            <div className="p-4 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)] space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[var(--foreground)] font-medium">Fixed Withholding Percentage</span>
                <span className="font-mono text-base font-bold text-[var(--vault-accent)]">{fixedRatePct}%</span>
              </div>
              <input
                type="range"
                min={15}
                max={45}
                step={1}
                value={fixedRatePct}
                onChange={(e) => setFixedRatePct(Number(e.target.value))}
                className="w-full accent-[var(--vault-accent)]"
              />
            </div>
          )}

          {/* Round-Up Buffer Increment */}
          <div>
            <label className="font-semibold text-[var(--foreground)] block mb-1 uppercase tracking-wider text-[10px]">
              Tax Vault Round-Up Buffer
            </label>
            <p className="text-[11px] text-[var(--muted-foreground)] mb-2">
              Automatically round up withholding to the nearest interval to build an extra cushion for state taxes or CPA filing fees.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Exact ($0)', val: 0 },
                { label: '$25 Round-Up', val: 2500 },
                { label: '$50 Round-Up', val: 5000 },
                { label: '$100 Round-Up', val: 10000 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setRoundUpCents(opt.val)}
                  className={`py-2 px-3 rounded-lg border text-center transition-all ${
                    roundUpCents === opt.val
                      ? 'border-[var(--primary)] bg-[var(--primary-subtle)] text-[var(--primary)] font-semibold'
                      : 'border-[var(--border)] text-[var(--foreground)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner Depository Banking Details */}
      <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
        <CardHeader className="pb-3 border-b border-[var(--border)]">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[var(--primary)]" />
            Partner Depository Account Numbers
          </CardTitle>
          <CardDescription className="text-xs">
            Direct deposit numbers provided via our mock BaaS integration.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-3 font-mono text-xs">
          <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
            <span className="text-[var(--muted-foreground)]">Partner Depository</span>
            <span className="font-semibold text-[var(--foreground)]">Evolve Bank & Trust (Member FDIC)</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
            <span className="text-[var(--muted-foreground)]">ACH / Wire Routing Number</span>
            <span className="font-semibold text-[var(--primary)]">121000358</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
            <span className="text-[var(--muted-foreground)]">Operating Checking Account</span>
            <span className="font-semibold text-[var(--foreground)]">4829 1048 2910</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-[var(--muted-foreground)]">Tax Vault Account (Locked)</span>
            <span className="font-semibold text-[var(--vault-accent)]">9281 7263 5192</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
