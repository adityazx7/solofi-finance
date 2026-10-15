'use client';

import * as React from 'react';
import {
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Search,
  DollarSign,
  Receipt,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { MoneyText } from '@/components/ui/money-text';
import { LiquidVaultVisualizer } from '@/components/ui/liquid-vault-visualizer';
import { ChartWrapper } from '@/components/ui/chart-wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

const mockChartData = [
  { month: 'Nov', income: 8400, expenses: 3200 },
  { month: 'Dec', income: 11200, expenses: 4100 },
  { month: 'Jan', income: 9500, expenses: 3800 },
  { month: 'Feb', income: 14200, expenses: 4500 },
  { month: 'Mar', income: 12800, expenses: 3900 },
  { month: 'Apr', income: 16400, expenses: 5100 },
];

export default function DesignShowcasePage() {
  const [vaultCurrent, setVaultCurrent] = React.useState(842000); // $8,420.00
  const [vaultTarget, setVaultTarget] = React.useState(1150000); // $11,500.00
  const [selectedPeriod, setSelectedPeriod] = React.useState('90D');

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold tracking-tight shadow-xs">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">SoloFi</span>
                <span className="text-[11px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/20">
                  Design System
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Component Primitives & Tokens (Phase 1)</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:inline">Theme:</span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10 space-y-16">
        {/* Intro */}
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            Fintech Foundations
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Design System & Aesthetic Primitives
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
            SoloFi embodies "calm confidence" — warm editorial paper, deep ink dark mode, restrained botanical emeralds, and a signature amber Tax Vault. Every number uses exact integer cents with vertical tabular alignment.
          </p>
        </section>

        {/* 1. Signature Hero: The Tax Vault Visualizer */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-tight">1. Signature Element — The Tax Vault</h2>
              <p className="text-xs text-muted-foreground">
                Visual liquid reservoir that fills in real-time as invoices are paid.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs self-start sm:self-auto">
              <span className="text-muted-foreground">Adjust set-aside level:</span>
              <input
                type="range"
                min="0"
                max="1200000"
                step="50000"
                value={vaultCurrent}
                onChange={(e) => setVaultCurrent(Number(e.target.value))}
                className="w-32 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LiquidVaultVisualizer
              currentCents={vaultCurrent}
              targetCents={vaultTarget}
              quarterLabel="Q2 Estimated Tax (Due June 15)"
            />

            <Card className="flex flex-col justify-between p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Core Emotional Guarantee
                  </span>
                  <Badge variant="vault" dot>
                    Zero Tax Surprise
                  </Badge>
                </div>
                <h3 className="text-xl font-bold tracking-tight">Safe-to-Spend Balance</h3>
                <p className="text-sm text-muted-foreground">
                  The primary operating balance solopreneurs can spend with 100% peace of mind, knowing their tax liability is already quarantined.
                </p>
              </div>

              <div className="pt-4 border-t border-border/80 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block">Available Right Now</span>
                  <MoneyText cents={1485000} size="3xl" className="text-emerald-600 dark:text-emerald-400 font-bold" />
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Transfer
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* 2. Typography & Numerals */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">2. Typography & Financial Numerals</h2>
            <p className="text-xs text-muted-foreground">
              Geist Sans for crisp editorial layout + Geist Mono with tabular-nums and dimmed decimals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Net Worth
              </span>
              <div>
                <MoneyText cents={5248050} size="4xl" />
              </div>
              <p className="text-xs text-muted-foreground">Dimmed `.50` decimal precision</p>
            </Card>

            <Card className="p-6 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Incoming Invoice Payment
              </span>
              <div>
                <MoneyText cents={420000} size="3xl" showSign signType="income" />
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <ArrowDownLeft className="h-3.5 w-3.5" />
                Auto-withholding 28% ($1,176.00)
              </p>
            </Card>

            <Card className="p-6 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Multi-Currency (India FY25)
              </span>
              <div>
                <MoneyText cents={35000000} currency="INR" size="3xl" />
              </div>
              <p className="text-xs text-muted-foreground">Presumptive u/s 44ADA (50% deemed)</p>
            </Card>
          </div>
        </section>

        {/* 3. Buttons & Action Primitives */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">3. Buttons & Interactive States</h2>
            <p className="text-xs text-muted-foreground">
              Micro-elevation, active 0.98 scale, subtle focus rings, and dedicated Tax Vault action styling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="default">Primary Action (Emerald)</Button>
            <Button variant="vault">Top Up Tax Vault (Amber)</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="outline">Outline Action</Button>
            <Button variant="ghost">Ghost Action</Button>
            <Button variant="destructive">Destructive Action</Button>
            <Button variant="default" isLoading>Processing</Button>
            <Button variant="default" size="sm">Small</Button>
            <Button variant="default" size="lg">Large Hero CTA</Button>
          </div>
        </section>

        {/* 4. Badges & Status Indicators */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">4. Badges & Semantic Status</h2>
            <p className="text-xs text-muted-foreground">
              Light tint pills with high-contrast text and optional status dot.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="default" dot>Operating Checking</Badge>
            <Badge variant="vault" dot>Tax Vault Locked</Badge>
            <Badge variant="success" dot>Invoice Paid</Badge>
            <Badge variant="warning" dot>Quarterly Deadline Soon</Badge>
            <Badge variant="destructive" dot>Review Required</Badge>
            <Badge variant="secondary">Personal Expense</Badge>
            <Badge variant="outline">Schedule C Line 18</Badge>
          </div>
        </section>

        {/* 5. Inputs & Form Fields */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">5. Inputs & Filter Controls</h2>
            <p className="text-xs text-muted-foreground">
              Integrated search, currency prefix, and validation error presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              placeholder="Search transactions or merchants..."
              leadingIcon={<Search className="h-4 w-4" />}
            />
            <Input
              placeholder="Invoice amount"
              leadingIcon={<DollarSign className="h-4 w-4" />}
              defaultValue="4,200.00"
              trailingElement={<span className="text-xs text-muted-foreground font-mono">USD</span>}
            />
            <Input
              placeholder="Tax ID / EIN"
              defaultValue="XX-XXXXXXX"
              error="Valid 9-digit EIN required for 1099 reporting"
            />
          </div>
        </section>

        {/* 6. Tabs, Dialogs & Modals */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">6. Sheets, Dialogs & Tabs</h2>
            <p className="text-xs text-muted-foreground">
              Friction modals for Tax Vault release and slide-up mobile drawers for receipt OCR.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Lock className="h-4 w-4 text-amber-500" />
                  Open Tax Vault Friction Dialog
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-5 w-5" />
                    Withdrawal from Tax Vault
                  </DialogTitle>
                  <DialogDescription className="pt-2">
                    This vault holds <strong className="text-foreground">$8,420.00</strong> set aside for your Q2 estimated tax due on June 15. Withdrawing these funds may trigger underpayment penalties from the IRS.
                  </DialogDescription>
                </DialogHeader>
                <div className="rounded-xl bg-amber-500/10 p-4 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200">
                  ⚠️ Estimated penalty for underwithholding: ~$142.50 + 8% statutory interest.
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="secondary">Cancel & Keep Locked</Button>
                  <Button variant="destructive">I Understand, Withdraw Anyway</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <Receipt className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Open Mobile Receipt Sheet
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Transaction Details & Receipt</DrawerTitle>
                  <DrawerDescription>
                    SQ *BLUE BOTTLE COFFEE — $18.40 • Apr 12, 2025
                  </DrawerDescription>
                </DrawerHeader>
                <div className="space-y-4 py-2">
                  <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                    Drag and drop receipt image or PDF here for automated OCR parsing
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Tax Status:</span>
                    <Badge variant="success">50% Business Meal Deductible</Badge>
                  </div>
                </div>
                <DrawerFooter>
                  <Button variant="default">Save Details</Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </section>

        {/* 7. Virtual Data Table Preview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight">7. Financial Ledger Table</h2>
              <p className="text-xs text-muted-foreground">
                High-density ledger with status chips, category tags, and clean currency alignment.
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>

          <Card className="overflow-hidden border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Counterparty / Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Deductible</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-xs text-muted-foreground">Apr 14</TableCell>
                  <TableCell>
                    <div className="font-medium">Acme Design Co.</div>
                    <div className="text-xs text-muted-foreground">Invoice #INV-2025-012</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">Client Revenue</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">—</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <MoneyText cents={420000} showSign signType="income" className="font-semibold" />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-mono text-xs text-muted-foreground">Apr 13</TableCell>
                  <TableCell>
                    <div className="font-medium">Figma Inc.</div>
                    <div className="text-xs text-muted-foreground">Monthly Professional Subscription</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Software & SaaS</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" size="sm">100% Tax Deductible</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <MoneyText cents={1500} showSign signType="expense" />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-mono text-xs text-muted-foreground">Apr 12</TableCell>
                  <TableCell>
                    <div className="font-medium">Tax Vault Auto-Withhold</div>
                    <div className="text-xs text-muted-foreground">28% set aside from Invoice #INV-2025-012</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="vault">Tax Vault Transfer</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Locked in Vault</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      $1,176.00
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* 8. Recharts Area Chart Wrapper */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">8. Data Visualization (Recharts Wrapper)</h2>
            <p className="text-xs text-muted-foreground">
              Layered gradient area chart with period toggles and accessible tooltip formatting.
            </p>
          </div>

          <ChartWrapper
            title="Cash Flow & Spending"
            description="Comparison of monthly operating income vs tax-deductible outflows"
            periodOptions={['30D', '90D', 'YTD', '1Y']}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          >
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val / 1000}k`}
                  />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-xl border border-border bg-card p-3 shadow-md text-xs space-y-1">
                            <p className="font-semibold">{payload[0].payload.month}</p>
                            <p className="text-emerald-600 dark:text-emerald-400">
                              Income: ${payload[0].value?.toLocaleString()}
                            </p>
                            <p className="text-muted-foreground">
                              Expenses: ${payload[1].value?.toLocaleString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#incomeGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#94A3B8"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#expenseGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartWrapper>
        </section>

        {/* 9. Skeletons & Layout Shimmer */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">9. Layout Shimmer Skeletons</h2>
            <p className="text-xs text-muted-foreground">
              Zero spinners on first paint — skeletons match exact card bounds and geometries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-3 w-32" />
            </Card>
            <Card className="p-6 space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-3 w-48" />
            </Card>
            <Card className="p-6 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-44" />
              <Skeleton className="h-3 w-28" />
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
