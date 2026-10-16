'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useDemoSessionStore } from '@/features/auth/store/demo-session-store';
import { DEMO_PERSONAS } from '@/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoneyText } from '@/components/ui/money-text';
import { LiquidVaultVisualizer } from '@/components/ui/liquid-vault-visualizer';
import { ChartWrapper } from '@/components/ui/chart-wrapper';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import type { CurrencyCode } from '@/lib/money';
import {
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Zap,
  Receipt,
  FileText,
  AlertCircle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

interface AccountData {
  id: string;
  name: string;
  type: string;
  currency: string;
  balanceCents: number;
  availableCents: number;
  accountNumber: string;
  isLocked: number;
}

export default function DashboardOverviewPage() {
  const { activePersonaId, quarterOffset } = useDemoSessionStore();
  const activePersona = DEMO_PERSONAS.find((p) => p.id === activePersonaId) || DEMO_PERSONAS[0];

  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [unreviewedCount, setUnreviewedCount] = useState(1);
  const [recentTxns, setRecentTxns] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/demo/session?personaId=${activePersonaId}`);
        const data = await res.json();
        if (data.accounts) {
          setAccounts(data.accounts);
          setUnreviewedCount(data.unreviewedCount || 0);
          setRecentTxns(data.recentTransactions || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activePersonaId, quarterOffset]);

  const operatingAccount = accounts.find((a) => a.type === 'operating');
  const taxVaultAccount = accounts.find((a) => a.type === 'tax_vault');

  const operatingBalanceCents = operatingAccount?.balanceCents || 1845000;
  const taxVaultBalanceCents = taxVaultAccount?.balanceCents || 842000;
  const totalBalanceCents = operatingBalanceCents + taxVaultBalanceCents;

  const currency: CurrencyCode = (activePersona.currency as CurrencyCode) || 'USD';

  const [chartPeriod, setChartPeriod] = useState('90D');

  const cashFlowData = useMemo(() => {
    const isINR = currency === 'INR';
    const mult = isINR ? 40 : 1;

    if (chartPeriod === '30D') {
      return [
        { date: 'May 01', income: 4200 * mult, expenses: 840 * mult, taxVault: 1176 * mult },
        { date: 'May 08', income: 1500 * mult, expenses: 420 * mult, taxVault: 420 * mult },
        { date: 'May 15', income: 5800 * mult, expenses: 1200 * mult, taxVault: 1624 * mult },
        { date: 'May 22', income: 3200 * mult, expenses: 650 * mult, taxVault: 896 * mult },
        { date: 'May 29', income: 4900 * mult, expenses: 980 * mult, taxVault: 1372 * mult },
      ];
    } else if (chartPeriod === '90D') {
      return [
        { date: 'Mar', income: 11400 * mult, expenses: 2840 * mult, taxVault: 3192 * mult },
        { date: 'Apr', income: 14200 * mult, expenses: 3100 * mult, taxVault: 3976 * mult },
        { date: 'May', income: 18450 * mult, expenses: 3650 * mult, taxVault: 5166 * mult },
      ];
    } else {
      return [
        { date: 'Jan', income: 9800 * mult, expenses: 2100 * mult, taxVault: 2744 * mult },
        { date: 'Feb', income: 12400 * mult, expenses: 2650 * mult, taxVault: 3472 * mult },
        { date: 'Mar', income: 11400 * mult, expenses: 2840 * mult, taxVault: 3192 * mult },
        { date: 'Apr', income: 14200 * mult, expenses: 3100 * mult, taxVault: 3976 * mult },
        { date: 'May', income: 18450 * mult, expenses: 3650 * mult, taxVault: 5166 * mult },
      ];
    }
  }, [chartPeriod, currency]);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Notification Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Welcome back, {activePersona.name}
            </h1>
            <Badge variant="outline" className="font-mono text-xs">
              {activePersona.country === 'US' ? 'US Passthrough' : 'India 44ADA'}
            </Badge>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            {activePersona.businessName} • Connected to Mock BaaS depository
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/transactions">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-amber-500" />
              <span>Review Inbox</span>
              {unreviewedCount > 0 && (
                <Badge variant="warning" className="px-1.5 py-0 text-[10px] ml-1">
                  {unreviewedCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Link href="/invoices">
            <Button size="sm" className="text-xs gap-1.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
              <FileText className="w-3.5 h-3.5" />
              <span>New Invoice</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Financial Metrics Trio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Safe-to-Spend Hero Card */}
        <Card className="border-[var(--primary)]/40 bg-[var(--card)] relative overflow-hidden shadow-sm">
          <img
            src="/assets/3d-icons/3d-wallet-icon.png"
            alt=""
            aria-hidden="true"
            className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10 dark:opacity-15 pointer-events-none object-contain select-none"
          />
          <CardHeader className="pb-1 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--primary)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Safe-to-Spend
              </span>
              <Badge variant="default" className="text-[10px] font-mono">
                Operating
              </Badge>
            </div>
            <CardDescription className="text-[11px]">
              Spend freely with zero tax liability fear.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <MoneyText
              cents={operatingBalanceCents}
              currency={currency}
              className="text-3xl font-bold tracking-tight text-[var(--foreground)]"
            />
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)] mt-2 font-mono">
              <span>Acct •••• {operatingAccount?.accountNumber.slice(-4) || '4821'}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400">Available now</span>
            </div>
          </CardContent>
        </Card>

        {/* Locked Tax Vault Card */}
        <Card className="border-[var(--vault-accent)]/40 bg-[var(--card)] relative overflow-hidden shadow-sm">
          <img
            src="/assets/3d-safe-vault-icon-with-money-illustration-png.webp"
            alt=""
            aria-hidden="true"
            className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10 dark:opacity-15 pointer-events-none object-contain select-none"
          />
          <CardHeader className="pb-1 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--vault-accent)] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Locked Tax Vault
              </span>
              <Badge variant="vault" className="text-[10px] font-mono">
                Q2 2025
              </Badge>
            </div>
            <CardDescription className="text-[11px]">
              Auto-split from paid invoices. Locked for IRS / ITD.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <MoneyText
              cents={taxVaultBalanceCents}
              currency={currency}
              className="text-3xl font-bold tracking-tight text-[var(--vault-accent)]"
            />
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)] mt-2 font-mono">
              <Lock className="w-3 h-3 text-[var(--vault-accent)]" />
              <span>Est. Due Jun 15, 2025</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400">Safe Harbor Met</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Ledger Assets Card */}
        <Card className="border-[var(--border)] bg-[var(--card)] relative overflow-hidden shadow-sm">
          <img
            src="/assets/3d-icons/3d-chart-growth-icon.png"
            alt=""
            aria-hidden="true"
            className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10 dark:opacity-15 pointer-events-none object-contain select-none"
          />
          <CardHeader className="pb-1 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> Total Balance
              </span>
              <Badge variant="outline" className="text-[10px] font-mono">
                Combined
              </Badge>
            </div>
            <CardDescription className="text-[11px]">
              Operating checking + isolated tax reserves.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <MoneyText
              cents={totalBalanceCents}
              currency={currency}
              className="text-3xl font-bold tracking-tight text-[var(--foreground)]"
            />
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)] mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>FDIC pass-through protected</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cashflow & Withholding Trajectory Chart */}
      <ChartWrapper
        title="Cashflow & Tax Vault Velocity"
        description="Gross deposits vs operating expenses vs automated tax withholding"
        periodOptions={['30D', '90D', 'YTD']}
        selectedPeriod={chartPeriod}
        onPeriodChange={setChartPeriod}
      >
        <div className="h-64 w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="vaultGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#71717A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#71717A" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#71717A"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => (currency === 'INR' ? `₹${val / 1000}k` : `$${val / 1000}k`)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                }}
              />
              <Area type="monotone" dataKey="income" name="Gross Income" stroke="#10B981" strokeWidth={2} fill="url(#incomeGradient)" />
              <Area type="monotone" dataKey="taxVault" name="Tax Vault Split" stroke="#F59E0B" strokeWidth={2} fill="url(#vaultGradient)" />
              <Area type="monotone" dataKey="expenses" name="Operating Expenses" stroke="#71717A" strokeWidth={1.5} fill="url(#expenseGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>

      {/* Interactive Liquid Tax Vault Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LiquidVaultVisualizer
            currentCents={taxVaultBalanceCents}
            targetCents={1150000} // $11,500 target
            quarterLabel="Q2 2025 (Due Jun 15)"
            isLocked={true}
          />
        </div>

        {/* Recent Ledger Transactions */}
        <div className="lg:col-span-2">
          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm h-full flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-[var(--border)]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Recent Ledger Activity</CardTitle>
                  <CardDescription className="text-xs">
                    Continuous zero-sync transaction categorizer
                  </CardDescription>
                </div>
                <Link href="/transactions">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View Full Ledger
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 divide-y divide-[var(--border)]">
              {recentTxns.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--muted-foreground)]">
                  Loading activity ledger...
                </div>
              ) : (
                recentTxns.slice(0, 5).map((txn) => {
                  const isInbound = txn.direction === 'inbound';
                  return (
                    <div key={txn.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-[var(--card-subtle)] transition-colors">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isInbound
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {isInbound ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">{txn.counterparty}</p>
                          <p className="text-[10px] text-[var(--muted-foreground)] truncate max-w-xs">{txn.rawDescription}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <MoneyText
                          cents={txn.amountCents}
                          currency={currency}
                          signType={isInbound ? 'income' : 'expense'}
                          showSign
                          className="font-semibold text-xs"
                        />
                        <div className="flex items-center justify-end gap-1 text-[10px] text-[var(--muted-foreground)] mt-0.5">
                          {txn.isReviewed === 0 ? (
                            <Badge variant="warning" className="px-1 py-0 text-[9px] uppercase">Needs Review</Badge>
                          ) : (
                            <span>Auto-Categorized</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
