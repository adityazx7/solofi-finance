'use client';

import React, { useState, useMemo } from 'react';
import { useDemoSessionStore } from '@/features/auth/store/demo-session-store';
import { DEMO_PERSONAS } from '@/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoneyText } from '@/components/ui/money-text';
import { ChartWrapper } from '@/components/ui/chart-wrapper';
import type { CurrencyCode } from '@/lib/money';
import {
  TrendingUp,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Sliders,
  DollarSign,
  HeartPulse,
  Sparkles,
  Lock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

export default function ForecastPage() {
  const { activePersonaId } = useDemoSessionStore();
  const activePersona = DEMO_PERSONAS.find((p) => p.id === activePersonaId) || DEMO_PERSONAS[0];
  const currency: CurrencyCode = (activePersona.currency as CurrencyCode) || 'USD';

  // State for Salary Smoothing & Stress Test
  const isINR = currency === 'INR';
  const baseSalary = isINR ? 15000000 : 600000; // ₹1.5L vs $6k / mo
  const [targetSalaryCents, setTargetSalaryCents] = useState(baseSalary);
  const [stressRevenueDropPct, setStressRevenueDropPct] = useState(30); // 30% drop
  const [stressDurationMonths, setStressDurationMonths] = useState(3); // for 3 months

  // Operating cash and fixed burn calculations
  const operatingCashCents = isINR ? 125000000 : 1845000; // ₹12.5L vs $18,450
  const monthlyFixedBurnCents = isINR ? 18000000 : 280000; // ₹1.8L vs $2,800
  const monthlyOwnerDrawCents = targetSalaryCents;
  const totalMonthlyOutflow = monthlyFixedBurnCents + monthlyOwnerDrawCents;

  const runwayMonths = (operatingCashCents / totalMonthlyOutflow).toFixed(1);

  // 12-Month Projection trajectory data
  const projectionData = useMemo(() => {
    const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const mult = isINR ? 40 : 1;
    const baseMonthlyRevenue = (isINR ? 500000 : 12000) * mult;

    let baselineCash = operatingCashCents / 100;
    let stressedCash = operatingCashCents / 100;

    return months.map((m, i) => {
      // Baseline revenue
      const netMonthlyIncome = baseMonthlyRevenue * 0.72 - totalMonthlyOutflow / 100;
      baselineCash = Math.round(baselineCash + netMonthlyIncome);

      // Stressed revenue (revenue drops during stress months)
      const isStressedMonth = i < stressDurationMonths;
      const stressedRevenue = isStressedMonth
        ? baseMonthlyRevenue * (1 - stressRevenueDropPct / 100)
        : baseMonthlyRevenue;
      const netStressedIncome = stressedRevenue * 0.72 - totalMonthlyOutflow / 100;
      stressedCash = Math.round(stressedCash + netStressedIncome);

      return {
        month: m,
        baseline: baselineCash,
        stressed: stressedCash,
        bufferFloor: Math.round((totalMonthlyOutflow * 3) / 100), // 3-month survival floor
      };
    });
  }, [operatingCashCents, totalMonthlyOutflow, stressRevenueDropPct, stressDurationMonths, isINR]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Runway & Salary Smoothing</h1>
            <Badge variant="outline" className="font-mono text-xs">
              Calm Financial Plan
            </Badge>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Turn volatile client invoices into predictable monthly paychecks • Stress-test your cashflow
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="text-xs font-mono py-1 px-2">
            {runwayMonths} Months Runway
          </Badge>
        </div>
      </div>

      {/* Metrics Trio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Runway Hero */}
        <Card className="p-4 bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--primary)] flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5" /> Cash Runway
            </span>
            <Badge variant="default" className="text-[10px] font-mono">
              Safe
            </Badge>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] font-mono">
              {runwayMonths}
            </span>
            <span className="text-xs text-[var(--muted-foreground)] font-medium">Months</span>
          </div>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
            Operating balance ÷ monthly fixed expenses + owner draw
          </p>
        </Card>

        {/* Target Salary */}
        <Card className="p-4 bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--foreground)]">Monthly Owner Draw</span>
            <Badge variant="outline" className="text-[10px] font-mono">Smoothed</Badge>
          </div>
          <MoneyText
            cents={targetSalaryCents}
            currency={currency}
            className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] mt-2 block"
          />
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
            Predictable personal distribution regardless of payment spikes
          </p>
        </Card>

        {/* Tax Shield */}
        <Card className="p-4 bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--vault-accent)] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Tax Shielded
            </span>
            <Badge variant="vault" className="text-[10px] font-mono">Isolated</Badge>
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-[var(--vault-accent)] font-mono mt-2">
            100%
          </div>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
            Taxes do not diminish your emergency operating runway
          </p>
        </Card>
      </div>

      {/* Interactive Trajectory Chart */}
      <ChartWrapper
        title="12-Month Cashflow Trajectory & Stress Test"
        description="Simulate the impact of client payment delays or revenue slowdowns on your operating reserves"
      >
        <div className="h-72 w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#71717A"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => (isINR ? `₹${val / 1000}k` : `$${val / 1000}k`)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Line
                type="monotone"
                dataKey="baseline"
                name="Normal Cash Trajectory"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="stressed"
                name={`Stress Test (-${stressRevenueDropPct}% for ${stressDurationMonths}mo)`}
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="bufferFloor"
                name="3-Month Safety Floor"
                stroke="#EF4444"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>

      {/* Simulator Controls Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salary Smoothing Controls */}
        <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader className="pb-3 border-b border-[var(--border)]">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[var(--primary)]" />
              Configure Owner Salary Draw
            </CardTitle>
            <CardDescription className="text-xs">
              Smooth your personal pay into a consistent bi-weekly or monthly disbursement.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[var(--muted-foreground)]">Monthly Draw Amount</span>
                <span className="font-mono font-semibold text-[var(--primary)] text-sm">
                  {isINR ? `₹${(targetSalaryCents / 100).toLocaleString()}` : `$${(targetSalaryCents / 100).toLocaleString()}`}
                </span>
              </div>
              <input
                type="range"
                min={isINR ? 5000000 : 200000}
                max={isINR ? 40000000 : 1500000}
                step={isINR ? 1000000 : 50000}
                value={targetSalaryCents}
                onChange={(e) => setTargetSalaryCents(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stress-Test Scenario Parameters */}
        <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
          <CardHeader className="pb-3 border-b border-[var(--border)]">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              Scenario Simulator Parameters
            </CardTitle>
            <CardDescription className="text-xs">
              Model client churn or seasonal dips to confirm you never face a cash crunch.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[var(--muted-foreground)]">Simulated Income Drop</span>
                <span className="font-mono font-semibold text-amber-500">-{stressRevenueDropPct}% Drop</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={stressRevenueDropPct}
                onChange={(e) => setStressRevenueDropPct(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[var(--muted-foreground)]">Duration of Slowdown</span>
                <span className="font-mono font-semibold text-amber-500">{stressDurationMonths} Months</span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                step={1}
                value={stressDurationMonths}
                onChange={(e) => setStressDurationMonths(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
