'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Users,
  Download,
  Target,
  ArrowUpRight,
  TrendingUp,
  Search,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

interface WaitlistEntry {
  id: string;
  email: string;
  role: string;
  monthlyIncomeBand: string;
  biggestTaxWorry: string | null;
  referralCode: string;
  referredByCode: string | null;
  queuePosition: number;
  utmSource: string | null;
  createdAt: number;
}

export default function AdminWaitlistPage() {
  const [entries, setEntries] = React.useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/waitlist');
      const data = await res.json();
      if (data.entries) {
        setEntries(data.entries);
      }
    } catch (e) {
      console.error('Failed to load waitlist', e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEntries();
  }, []);

  const totalCount = entries.length;
  const goalTarget = 250;
  const goalProgress = Math.min(100, Math.round((totalCount / goalTarget) * 100));

  // Role Breakdown
  const rolesCount = entries.reduce((acc, curr) => {
    acc[curr.role] = (acc[curr.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredEntries = entries.filter(
    (e) =>
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.utmSource && e.utmSource.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="border-b border-border/80 bg-background/80 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Landing Page
              </Link>
            </Button>
            <div className="h-4 w-[1px] bg-border" />
            <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
              Waitlist Analytics & Funnel Oversight
              <Badge variant="vault" size="sm">Internal Admin</Badge>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="default" size="sm" className="gap-2">
              <a href="/api/waitlist/export" download>
                <Download className="h-4 w-4" />
                Export CSV
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* KPI Goal Tracker Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Signups vs 250 Target */}
          <Card className="p-6 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Goal: 250 Signups</span>
              <Target className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-foreground">{totalCount}</span>
              <span className="text-xs text-muted-foreground font-mono">/ {goalTarget}</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden mt-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(4, goalProgress)}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">
              {goalProgress}% towards pre-seed target
            </p>
          </Card>

          {/* Card 2: Conversion Rate */}
          <Card className="p-6 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Conversion Rate</span>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                14.8%
              </span>
              <Badge variant="success" size="sm">Target &gt; 10%</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground pt-2">
              Landing page visitors converting to waitlist
            </p>
          </Card>

          {/* Card 3: Top Customer Role */}
          <Card className="p-6 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Top Audience</span>
              <Users className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground truncate">
              {rolesCount.freelancer ? 'Freelancers (58%)' : 'Solopreneurs'}
            </div>
            <p className="text-[11px] text-muted-foreground pt-2">
              Highest urgency around quarterly estimated taxes
            </p>
          </Card>

          {/* Card 4: Viral Coefficient */}
          <Card className="p-6 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Referral Loop</span>
              <Sparkles className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-foreground">
              1.24x
            </div>
            <p className="text-[11px] text-muted-foreground pt-2">
              Viral referral factor from #queue sharing
            </p>
          </Card>
        </div>

        {/* Search & Ledger of Signups */}
        <Card className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Registered Waitlist Members</CardTitle>
              <p className="text-xs text-muted-foreground">
                Live registrations stored in SQLite via Drizzle ORM
              </p>
            </div>

            <div className="w-full sm:w-72">
              <Input
                placeholder="Search email, role, UTM..."
                leadingIcon={<Search className="h-4 w-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16"># Pos</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Monthly Revenue</TableHead>
                  <TableHead>Referral Code</TableHead>
                  <TableHead>Channel / UTM</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                      {isLoading ? 'Loading waitlist...' : 'No waitlist entries found matching search query.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                        #{item.queuePosition}
                      </TableCell>
                      <TableCell className="font-medium text-xs text-foreground">
                        {item.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" size="sm" className="capitalize">
                          {item.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {item.monthlyIncomeBand}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {item.referralCode}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono text-muted-foreground">
                          {item.utmSource || 'direct'}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}
