'use client';

import React, { useState, useEffect } from 'react';
import { useDemoSessionStore } from '@/features/auth/store/demo-session-store';
import { DEMO_PERSONAS } from '@/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { LiquidVaultVisualizer } from '@/components/ui/liquid-vault-visualizer';
import { MoneyText } from '@/components/ui/money-text';
import type { CurrencyCode } from '@/lib/money';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

export default function TaxVaultHubPage() {
  const { activePersonaId, quarterOffset, advanceQuarter } = useDemoSessionStore();
  const activePersona = DEMO_PERSONAS.find((p) => p.id === activePersonaId) || DEMO_PERSONAS[0];
  const currency: CurrencyCode = (activePersona.currency as CurrencyCode) || 'USD';

  const [loading, setLoading] = useState(true);
  const [vaultAccount, setVaultAccount] = useState<any>(null);
  const [operatingAccount, setOperatingAccount] = useState<any>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [unlockInputText, setUnlockInputText] = useState('');
  const [isPayingTax, setIsPayingTax] = useState(false);
  const [payTaxModalOpen, setPayTaxModalOpen] = useState(false);

  // Load account data
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/demo/session?personaId=${activePersonaId}`);
      const data = await res.json();
      if (data.accounts) {
        const vAcc = data.accounts.find((a: any) => a.type === 'tax_vault');
        const oAcc = data.accounts.find((a: any) => a.type === 'operating');
        setVaultAccount(vAcc);
        setOperatingAccount(oAcc);
        setIsLocked(Boolean(vAcc?.isLocked ?? 1));
      }
    } catch (err) {
      console.error('Failed to load Tax Vault accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activePersonaId, quarterOffset]);

  const vaultBalanceCents = vaultAccount?.balanceCents || 842000;
  const targetCents = activePersona.country === 'IN' ? 60000000 : 1150000; // ₹6L vs $11.5k

  const quarters = [
    { name: 'Q1 (Jan - Mar)', due: 'Apr 15, 2025', target: targetCents * 0.9, actual: targetCents * 0.95, status: 'Paid in Full' },
    { name: 'Q2 (Apr - Jun)', due: 'Jun 15, 2025', target: targetCents, actual: vaultBalanceCents, status: 'Current (Locked)' },
    { name: 'Q3 (Jul - Sep)', due: 'Sep 15, 2025', target: targetCents * 1.05, actual: 0, status: 'Upcoming' },
    { name: 'Q4 (Oct - Dec)', due: 'Jan 15, 2026', target: targetCents * 1.1, actual: 0, status: 'Upcoming' },
  ];

  const handleUnlockVault = async () => {
    if (unlockInputText.trim().toUpperCase() !== 'I UNDERSTAND') {
      toast.error('Please type "I UNDERSTAND" exactly to confirm unlock');
      return;
    }

    try {
      const res = await fetch('/api/demo/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_vault_lock',
          accountId: vaultAccount?.id,
          isLocked: false,
        }),
      });

      if (res.ok) {
        setIsLocked(false);
        setUnlockModalOpen(false);
        setUnlockInputText('');
        toast.warning('Tax Vault Unlocked (Emergency Override)', {
          description: 'Funds can now be moved, but safe harbor protection is at risk.',
        });
      }
    } catch {
      toast.error('Failed to unlock vault');
    }
  };

  const handleRelockVault = async () => {
    try {
      await fetch('/api/demo/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_vault_lock',
          accountId: vaultAccount?.id,
          isLocked: true,
        }),
      });
      setIsLocked(true);
      toast.success('Tax Vault Re-Locked & Protected');
    } catch {
      toast.error('Failed to lock vault');
    }
  };

  const handleSimulatePayTax = async () => {
    setIsPayingTax(true);
    toast.loading('Initiating direct payment to IRS / ITD portal...', { id: 'tax-pay' });

    setTimeout(async () => {
      setIsPayingTax(false);
      setPayTaxModalOpen(false);
      toast.success('Quarterly Tax Payment Submitted!', {
        id: 'tax-pay',
        description: `EFTPS Confirmation #982104928 • Paid from Tax Vault`,
      });
      advanceQuarter();
      loadData();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Tax Vault</h1>
            <Badge variant={isLocked ? 'vault' : 'destructive'} className="font-mono text-xs flex items-center gap-1">
              {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span>{isLocked ? 'Protected (Locked)' : 'Override Active (Unlocked)'}</span>
            </Badge>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Auto-withheld at the moment of invoice payment • Isolated from day-to-day operating expenses
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isLocked ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUnlockModalOpen(true)}
              className="text-xs gap-1.5 border-rose-500/40 text-rose-500 hover:bg-rose-500/10"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Unlock Vault</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleRelockVault}
              className="text-xs gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Re-Lock Vault</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => setPayTaxModalOpen(true)}
            className="text-xs gap-1.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pay Estimated Tax</span>
          </Button>
        </div>
      </div>

      {/* Hero Visualizer & Safe Harbor Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Liquid Reservoir */}
        <div className="lg:col-span-1">
          <LiquidVaultVisualizer
            currentCents={vaultBalanceCents}
            targetCents={targetCents}
            quarterLabel="Q2 2025 (Due Jun 15)"
            isLocked={isLocked}
          />
        </div>

        {/* Right: Safe Harbor Compliance Meter */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                    IRS Safe Harbor Compliance Status
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {activePersona.country === 'US'
                      ? 'Pre-empt underpayment penalties by paying 100% of prior year or 90% of current year liability.'
                      : 'Advance tax instalments under Section 208/211 (15% Q1, 45% Q2, 75% Q3, 100% Q4).'}
                  </CardDescription>
                </div>
                <Badge variant="success" className="font-mono text-xs">
                  Penalty Free
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-[var(--foreground)]">Q2 Estimated Tax Progress</span>
                  <span className="font-mono font-semibold text-[var(--vault-accent)]">
                    {Math.round((vaultBalanceCents / targetCents) * 100)}% of Projected Due
                  </span>
                </div>
                <div className="w-full bg-[var(--border)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--vault-accent)] h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((vaultBalanceCents / targetCents) * 100))}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-[var(--card-subtle)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--muted-foreground)] block">Withholding Rate</span>
                  <span className="font-mono text-sm font-bold text-[var(--foreground)]">28.00%</span>
                  <p className="text-[9px] text-[var(--muted-foreground)] mt-0.5">Applied per incoming invoice</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--card-subtle)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--muted-foreground)] block">Next Due Date</span>
                  <span className="font-mono text-sm font-bold text-[var(--vault-accent)]">June 15, 2025</span>
                  <p className="text-[9px] text-[var(--muted-foreground)] mt-0.5">32 days remaining</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--card-subtle)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--muted-foreground)] block">Filing Method</span>
                  <span className="font-mono text-sm font-bold text-[var(--foreground)]">EFTPS Direct</span>
                  <p className="text-[9px] text-[var(--muted-foreground)] mt-0.5">Automated batch submission</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quarterly Tax Calendar */}
          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--primary)]" />
                2025 Statutory Tax Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-[var(--border)] text-xs">
              {quarters.map((q, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-[var(--card-subtle)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--card-subtle)] border border-[var(--border)] flex items-center justify-center font-mono font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-[var(--foreground)]">{q.name}</p>
                      <p className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Due {q.due}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div>
                      <MoneyText cents={q.actual} currency={currency} className="font-mono font-semibold text-xs" />
                      <p className="text-[9px] text-[var(--muted-foreground)]">
                        Target: <MoneyText cents={q.target} currency={currency} className="text-[9px]" />
                      </p>
                    </div>
                    <Badge
                      variant={q.status.includes('Paid') ? 'success' : q.status.includes('Current') ? 'vault' : 'outline'}
                      className="text-[9px] font-mono whitespace-nowrap"
                    >
                      {q.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Friction Unlock Warning Modal */}
      <Dialog open={unlockModalOpen} onOpenChange={setUnlockModalOpen}>
        <DialogContent className="max-w-md bg-[var(--card)] border border-[var(--border)]">
          <DialogHeader className="text-left">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-[var(--foreground)]">
              Unlock Tax Vault?
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--muted-foreground)] space-y-2 pt-2">
              <p>
                Your Tax Vault is locked to prevent accidental spending of tax liabilities. Withdrawing funds will leave you vulnerable to an unexpected Q2 tax bill and IRS / CBDT underpayment interest.
              </p>
              <p className="font-semibold text-[var(--foreground)]">
                To proceed, type <span className="font-mono text-rose-500">I UNDERSTAND</span> below:
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Input
              placeholder='Type "I UNDERSTAND"'
              value={unlockInputText}
              onChange={(e) => setUnlockInputText(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <DialogFooter className="flex justify-between gap-2 pt-2 border-t border-[var(--border)]">
            <Button variant="ghost" onClick={() => setUnlockModalOpen(false)}>
              Cancel & Keep Safe
            </Button>
            <Button
              variant="destructive"
              disabled={unlockInputText.trim().toUpperCase() !== 'I UNDERSTAND'}
              onClick={handleUnlockVault}
            >
              Override & Unlock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Simulated Pay Tax Modal */}
      <Dialog open={payTaxModalOpen} onOpenChange={setPayTaxModalOpen}>
        <DialogContent className="max-w-md bg-[var(--card)] border border-[var(--border)]">
          <DialogHeader className="text-left">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-subtle)] text-[var(--primary)] flex items-center justify-center mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-[var(--foreground)]">
              Submit Q2 Estimated Tax Payment
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--muted-foreground)] pt-1">
              Transfer funds directly from your locked Tax Vault to the revenue department via simulated EFTPS.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)] space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Debited Account:</span>
              <span className="font-semibold text-[var(--vault-accent)]">Tax Vault (••• 6351)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Recipient Authority:</span>
              <span className="font-semibold">{activePersona.country === 'US' ? 'IRS EFTPS Federal Depository' : 'Income Tax Department (Challan 280)'}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[var(--border)] font-bold text-sm">
              <span>Payment Amount:</span>
              <MoneyText cents={vaultBalanceCents} currency={currency} className="text-sm font-bold text-[var(--primary)]" />
            </div>
          </div>

          <DialogFooter className="flex justify-between gap-2 pt-2 border-t border-[var(--border)]">
            <Button variant="ghost" onClick={() => setPayTaxModalOpen(false)} disabled={isPayingTax}>
              Cancel
            </Button>
            <Button
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
              onClick={handleSimulatePayTax}
              disabled={isPayingTax}
            >
              {isPayingTax ? 'Submitting to EFTPS...' : 'Authorize EFTPS Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
