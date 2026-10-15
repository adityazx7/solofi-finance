'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDemoSessionStore } from '@/features/auth/store/demo-session-store';
import { DEMO_PERSONAS } from '@/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { MoneyText } from '@/components/ui/money-text';
import type { CurrencyCode } from '@/lib/money';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt as ReceiptIcon,
  UploadCloud,
  FileCheck,
  Tag,
  Sparkles,
  Keyboard,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface TransactionItem {
  id: string;
  businessId: string;
  accountId: string;
  accountName: string | null;
  amountCents: number;
  direction: 'inbound' | 'outbound';
  method: string;
  status: string;
  counterparty: string;
  rawDescription: string;
  mcc: string | null;
  categoryId: string | null;
  categoryName: string | null;
  categoryIcon: string | null;
  categoryColor: string | null;
  taxScheduleLine: string | null;
  confidenceScore: number;
  isReviewed: number;
  isBusiness: number;
  isDeductible: number;
  deductiblePercentage: number;
  notes: string | null;
  postedAt: number;
}

export default function TransactionsLedgerPage() {
  const { activePersonaId } = useDemoSessionStore();
  const activePersona = DEMO_PERSONAS.find((p) => p.id === activePersonaId) || DEMO_PERSONAS[0];
  const currency: CurrencyCode = (activePersona.currency as CurrencyCode) || 'USD';

  const [loading, setLoading] = useState(true);
  const [transactionsList, setTransactionsList] = useState<TransactionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'review'>('all');
  const [selectedTxn, setSelectedTxn] = useState<TransactionItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);

  // Fetch transactions
  const fetchTransactions = async () => {
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

      const res = await fetch(`/api/transactions?businessId=${bizId}`);
      const data = await res.json();
      if (data.transactions) {
        setTransactionsList(data.transactions);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
      toast.error('Failed to load transaction ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [activePersonaId]);

  // Filtered list
  const filteredTransactions = useMemo(() => {
    return transactionsList.filter((txn) => {
      if (activeTab === 'review' && txn.isReviewed === 1) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        txn.counterparty.toLowerCase().includes(q) ||
        txn.rawDescription.toLowerCase().includes(q) ||
        (txn.categoryName && txn.categoryName.toLowerCase().includes(q))
      );
    });
  }, [transactionsList, activeTab, searchQuery]);

  // Keyboard navigation hotkeys (J / K / B / P / D / Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (filteredTransactions.length === 0) return;

      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredTransactions.length - 1));
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = filteredTransactions[selectedIndex];
        if (item) {
          handleOpenDrawer(item);
        }
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        const item = filteredTransactions[selectedIndex];
        if (item) {
          handleQuickUpdate(item.id, { isBusiness: 1, isDeductible: 1 });
        }
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        const item = filteredTransactions[selectedIndex];
        if (item) {
          handleQuickUpdate(item.id, { isBusiness: 0, isDeductible: 0 });
        }
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        const item = filteredTransactions[selectedIndex];
        if (item) {
          handleQuickUpdate(item.id, { isDeductible: 1, deductiblePercentage: 100 });
        }
      } else if (e.key === '5') {
        e.preventDefault();
        const item = filteredTransactions[selectedIndex];
        if (item) {
          handleQuickUpdate(item.id, { isDeductible: 1, deductiblePercentage: 50 });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredTransactions, selectedIndex]);

  const handleOpenDrawer = (txn: TransactionItem) => {
    setSelectedTxn(txn);
    setDrawerOpen(true);
  };

  const handleQuickUpdate = async (id: string, updates: Partial<TransactionItem>) => {
    try {
      setTransactionsList((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates, isReviewed: 1 } : t))
      );

      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updates, isReviewed: 1 }),
      });

      if (res.ok) {
        toast.success('Transaction reconciled & locked to Schedule C');
      }
    } catch {
      toast.error('Failed to update transaction');
    }
  };

  const handleSimulateOcrReceipt = async () => {
    if (!selectedTxn) return;
    setIsUploadingReceipt(true);
    toast.loading('Analyzing receipt with simulated OCR...', { id: 'ocr-upload' });

    try {
      const res = await fetch(`/api/transactions/${selectedTxn.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: `receipt_${selectedTxn.counterparty.toLowerCase().replace(/\s+/g, '_')}.jpg`,
          ocrMerchant: selectedTxn.counterparty,
          ocrAmountCents: selectedTxn.amountCents,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Receipt Attached & 98% OCR Match Confirmed!', {
          id: 'ocr-upload',
          description: `Extracted: ${selectedTxn.counterparty} • Total verified`,
        });
        setSelectedTxn((prev) => (prev ? { ...prev, isReviewed: 1, confidenceScore: 0.98 } : null));
        fetchTransactions();
      }
    } catch {
      toast.error('Failed to process receipt', { id: 'ocr-upload' });
    } finally {
      setIsUploadingReceipt(false);
    }
  };

  const unreviewedCount = transactionsList.filter((t) => t.isReviewed === 0).length;

  return (
    <div className="space-y-6">
      {/* Top Header & Context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Transactions Ledger</h1>
            <Badge variant="outline" className="text-xs font-mono">
              Double-Entry Verified
            </Badge>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Continuous zero-sync bookkeeping • Every penny auto-categorized into IRS / ITD tax lines
          </p>
        </div>

        {/* Keyboard Shortcut Cheatsheet Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card-subtle)] border border-[var(--border)] text-[11px] text-[var(--muted-foreground)]">
          <Keyboard className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span>Hotkeys:</span>
          <kbd className="font-mono bg-[var(--card)] px-1 rounded border border-[var(--border)] text-[10px]">J/K</kbd> Nav
          <kbd className="font-mono bg-[var(--card)] px-1 rounded border border-[var(--border)] text-[10px]">B</kbd> Business
          <kbd className="font-mono bg-[var(--card)] px-1 rounded border border-[var(--border)] text-[10px]">P</kbd> Personal
          <kbd className="font-mono bg-[var(--card)] px-1 rounded border border-[var(--border)] text-[10px]">5</kbd> 50% Meals
          <kbd className="font-mono bg-[var(--card)] px-1 rounded border border-[var(--border)] text-[10px]">↵</kbd> Detail
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Segmented Control Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)] w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            All Ledger ({transactionsList.length})
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'review'
                ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            }`}
          >
            <span>Review Inbox</span>
            {unreviewedCount > 0 && (
              <Badge variant="warning" className="px-1.5 py-0 text-[10px] font-mono h-4">
                {unreviewedCount}
              </Badge>
            )}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Search merchant, notes, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Transaction Virtualized-Style High-Density Table */}
      <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--card-subtle)] text-[11px] font-semibold text-[var(--muted-foreground)]">
                <th className="py-2.5 px-4 w-28">Date</th>
                <th className="py-2.5 px-4">Merchant & Description</th>
                <th className="py-2.5 px-4 hidden sm:table-cell">Schedule C Category</th>
                <th className="py-2.5 px-4 hidden md:table-cell">Account</th>
                <th className="py-2.5 px-4 text-center">Confidence</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[var(--muted-foreground)]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[var(--primary)]" />
                    Loading double-entry ledger...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[var(--muted-foreground)]">
                    <CheckCircle2 className="w-6 h-6 text-[var(--primary)] mx-auto mb-2" />
                    <span>Review Inbox Zero! All transactions categorized.</span>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn, index) => {
                  const isInbound = txn.direction === 'inbound';
                  const isSelectedRow = index === selectedIndex;
                  const dateStr = new Date(txn.postedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr
                      key={txn.id}
                      onClick={() => {
                        setSelectedIndex(index);
                        handleOpenDrawer(txn);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelectedRow
                          ? 'bg-[var(--primary-subtle)]/40 ring-1 ring-inset ring-[var(--primary)]/30'
                          : 'hover:bg-[var(--card-subtle)]'
                      }`}
                    >
                      {/* Date */}
                      <td className="py-3 px-4 font-mono text-[11px] text-[var(--muted-foreground)] whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* Merchant */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isInbound
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            {isInbound ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                          </div>
                          <div className="truncate max-w-xs sm:max-w-md">
                            <p className="font-semibold text-xs text-[var(--foreground)] truncate">
                              {txn.counterparty}
                            </p>
                            <p className="text-[10px] text-[var(--muted-foreground)] truncate font-mono">
                              {txn.rawDescription}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category & Tax Line */}
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <div>
                          <span className="font-medium text-[11px] text-[var(--foreground)]">
                            {txn.categoryName || 'Uncategorized'}
                          </span>
                          <p className="text-[9px] text-[var(--muted-foreground)] truncate">
                            {txn.taxScheduleLine || 'Non-deductible'}
                          </p>
                        </div>
                      </td>

                      {/* Account */}
                      <td className="py-3 px-4 hidden md:table-cell font-mono text-[10px] text-[var(--muted-foreground)]">
                        {txn.accountName || 'Operating Checking'}
                      </td>

                      {/* Confidence Score */}
                      <td className="py-3 px-4 text-center">
                        {txn.isReviewed === 0 ? (
                          <Badge variant="warning" className="px-1.5 py-0 text-[9px] font-mono uppercase tracking-wider">
                            Review ({Math.round(txn.confidenceScore * 100)}%)
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="px-1.5 py-0 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                            Auto (98%)
                          </Badge>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right">
                        <MoneyText
                          cents={txn.amountCents}
                          currency={currency}
                          signType={isInbound ? 'income' : 'expense'}
                          showSign
                          className="font-semibold text-xs font-mono"
                        />
                      </td>

                      {/* Detail Chevron */}
                      <td className="py-3 px-4 text-center text-[var(--muted-foreground)]">
                        <ChevronRight className="w-4 h-4" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Detail Slide-Out Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="p-6 bg-[var(--card)] border-t border-[var(--border)] max-w-xl mx-auto">
          {selectedTxn && (
            <div className="space-y-6">
              <DrawerHeader className="p-0 text-left border-b border-[var(--border)] pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <DrawerTitle className="text-xl font-bold">{selectedTxn.counterparty}</DrawerTitle>
                    <DrawerDescription className="text-xs font-mono text-[var(--muted-foreground)] mt-0.5">
                      {selectedTxn.rawDescription}
                    </DrawerDescription>
                  </div>
                  <MoneyText
                    cents={selectedTxn.amountCents}
                    currency={currency}
                    signType={selectedTxn.direction === 'inbound' ? 'income' : 'expense'}
                    showSign
                    className="text-2xl font-bold font-mono"
                  />
                </div>
              </DrawerHeader>

              {/* Classification Controls */}
              <div className="space-y-4 text-xs">
                {/* Business vs Personal Toggle */}
                <div>
                  <label className="font-semibold text-[var(--muted-foreground)] block mb-1.5 uppercase tracking-wider text-[10px]">
                    Expense Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleQuickUpdate(selectedTxn.id, { isBusiness: 1, isDeductible: 1 })}
                      className={`p-2.5 rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all ${
                        selectedTxn.isBusiness === 1
                          ? 'border-[var(--primary)] bg-[var(--primary-subtle)] text-[var(--primary)]'
                          : 'border-[var(--border)] text-[var(--foreground)]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Business Expense (Deductible)</span>
                    </button>
                    <button
                      onClick={() => handleQuickUpdate(selectedTxn.id, { isBusiness: 0, isDeductible: 0 })}
                      className={`p-2.5 rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all ${
                        selectedTxn.isBusiness === 0
                          ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                          : 'border-[var(--border)] text-[var(--foreground)]'
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Personal / Non-Deductible</span>
                    </button>
                  </div>
                </div>

                {/* Deductibility Ratio */}
                {selectedTxn.isBusiness === 1 && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="font-semibold text-[var(--muted-foreground)] uppercase tracking-wider text-[10px]">
                        Tax Deductibility Ratio
                      </label>
                      <span className="font-mono font-semibold">{selectedTxn.deductiblePercentage}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[100, 50, 0].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => handleQuickUpdate(selectedTxn.id, { deductiblePercentage: pct })}
                          className={`py-1.5 px-3 rounded-lg border font-medium text-center transition-all ${
                            selectedTxn.deductiblePercentage === pct
                              ? 'border-[var(--primary)] bg-[var(--primary-subtle)] text-[var(--primary)] font-semibold'
                              : 'border-[var(--border)]'
                          }`}
                        >
                          {pct === 100 ? '100% (Standard)' : pct === 50 ? '50% (Meals/Coffee)' : '0% (Non-deductible)'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Simulated Receipt OCR Dropzone */}
                <div className="pt-2">
                  <label className="font-semibold text-[var(--muted-foreground)] block mb-1.5 uppercase tracking-wider text-[10px]">
                    Receipt & Audit Trail
                  </label>
                  <div
                    onClick={handleSimulateOcrReceipt}
                    className="p-4 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--primary)] bg-[var(--card-subtle)] text-center cursor-pointer transition-colors"
                  >
                    {isUploadingReceipt ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)] mb-1" />
                        <span className="font-semibold">Extracting merchant & sales tax with OCR...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <UploadCloud className="w-6 h-6 text-[var(--primary)] mb-1" />
                        <p className="font-semibold text-[var(--foreground)]">Drop Receipt or Click to Simulate OCR</p>
                        <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
                          Matches amount, parses merchant tax ID, and verifies deduction
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DrawerFooter className="p-0 pt-4 border-t border-[var(--border)] flex flex-row items-center justify-between gap-3">
                <span className="text-[10px] text-[var(--muted-foreground)]">
                  Transaction ID: <span className="font-mono">{selectedTxn.id}</span>
                </span>
                <DrawerClose asChild>
                  <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                    Done
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
