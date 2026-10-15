'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDemoSessionStore } from '@/features/auth/store/demo-session-store';
import { DEMO_PERSONAS } from '@/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MoneyText } from '@/components/ui/money-text';
import type { CurrencyCode } from '@/lib/money';
import {
  FileText,
  PlusCircle,
  ExternalLink,
  Copy,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Send,
  Trash2,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string | null;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  currency: string;
  subtotalCents: number;
  taxAmountCents: number;
  totalAmountCents: number;
  shareToken: string;
  paidAt: number | null;
}

export default function InvoicingHubPage() {
  const { activePersonaId } = useDemoSessionStore();
  const activePersona = DEMO_PERSONAS.find((p) => p.id === activePersonaId) || DEMO_PERSONAS[0];
  const currency: CurrencyCode = (activePersona.currency as CurrencyCode) || 'USD';

  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'sent' | 'paid'>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Invoice Form State
  const [clientName, setClientName] = useState('Linear Labs Inc');
  const [clientEmail, setClientEmail] = useState('finance@linear.app');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2025-014');
  const [paymentTerms, setPaymentTerms] = useState('Net 14');
  const [lineItems, setLineItems] = useState([
    { description: 'Design System & Component Tokens', quantity: 1, unitPriceCents: 450000, amountCents: 450000 },
  ]);

  const fetchInvoices = async () => {
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

      const res = await fetch(`/api/invoices?businessId=${bizId}`);
      const data = await res.json();
      if (data.invoices) {
        setInvoices(data.invoices);
      }
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [activePersonaId]);

  const handleCreateInvoice = async () => {
    try {
      const bizId =
        activePersona.id === 'user_arjun_mehta'
          ? 'biz_mehta_systems'
          : activePersona.id === 'user_chloe_lin'
          ? 'biz_chloe_studio'
          : activePersona.id === 'user_pioneer_labs'
          ? 'biz_pioneer_labs'
          : 'biz_vance_studio';

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: bizId,
          clientName,
          clientEmail,
          clientCompany: clientName,
          invoiceNumber,
          paymentTerms,
          currency: activePersona.currency || 'USD',
          items: lineItems,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Invoice ${invoiceNumber} Created!`, {
          description: `Pay link generated: ${window.location.origin}${data.shareUrl}`,
        });
        setCreateModalOpen(false);
        fetchInvoices();
      }
    } catch {
      toast.error('Failed to create invoice');
    }
  };

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}/pay/${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Public Pay Link Copied to Clipboard!', {
      description: url,
    });
  };

  const handleSimulateInvoicePayment = async (token: string, invNum: string) => {
    toast.loading(`Simulating client payment for ${invNum}...`, { id: 'sim-pay' });
    try {
      const res = await fetch(`/api/pay/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payerName: 'Acme Accounting' }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Invoice ${invNum} Paid!`, {
          id: 'sim-pay',
          description: `Tax Vault automatically locked ${(data.splitResult.taxWithheldCents / 100).toFixed(0)} set-aside.`,
        });
        fetchInvoices();
      } else {
        toast.info(data.message || 'Payment simulation finished', { id: 'sim-pay' });
      }
    } catch {
      toast.error('Simulation failed', { id: 'sim-pay' });
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (activeFilter === 'sent') return inv.status === 'sent';
    if (activeFilter === 'paid') return inv.status === 'paid';
    return true;
  });

  const totalOutstandingCents = invoices
    .filter((inv) => inv.status === 'sent')
    .reduce((acc, inv) => acc + inv.totalAmountCents, 0);

  const totalPaidCents = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((acc, inv) => acc + inv.totalAmountCents, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Invoices & Pay Links</h1>
            <Badge variant="outline" className="font-mono text-xs">
              Auto-Split Enabled
            </Badge>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Every paid invoice automatically calculates estimated taxes and isolates them into your Tax Vault
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setCreateModalOpen(true)}
          className="gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Invoice</span>
        </Button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <span className="text-xs font-medium text-[var(--muted-foreground)]">Awaiting Payment</span>
          <MoneyText
            cents={totalOutstandingCents}
            currency={currency}
            className="text-2xl font-bold tracking-tight mt-1 text-[var(--foreground)] block"
          />
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-500" />
            <span>{invoices.filter((i) => i.status === 'sent').length} unpaid invoices</span>
          </p>
        </Card>

        <Card className="p-4 bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <span className="text-xs font-medium text-[var(--muted-foreground)]">Collected & Split</span>
          <MoneyText
            cents={totalPaidCents}
            currency={currency}
            className="text-2xl font-bold tracking-tight mt-1 text-emerald-600 dark:text-emerald-400 block"
          />
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[var(--primary)]" />
            <span>Taxes silently isolated in Vault</span>
          </p>
        </Card>

        <Card className="p-4 bg-[var(--card)] border border-[var(--border)] shadow-sm">
          <span className="text-xs font-medium text-[var(--muted-foreground)]">Active Tax Auto-Split</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tracking-tight text-[var(--vault-accent)] font-mono">28.00%</span>
            <Badge variant="vault" className="text-[10px] font-mono">Auto</Badge>
          </div>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1 flex items-center gap-1">
            <Lock className="w-3 h-3 text-[var(--vault-accent)]" />
            <span>Instant double-entry transfer</span>
          </p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center p-1 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)] w-fit">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          All ({invoices.length})
        </button>
        <button
          onClick={() => setActiveFilter('sent')}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeFilter === 'sent'
              ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          Awaiting Payment
        </button>
        <button
          onClick={() => setActiveFilter('paid')}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeFilter === 'paid'
              ? 'bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          Paid & Vaulted
        </button>
      </div>

      {/* Invoice List */}
      <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
        <div className="divide-y divide-[var(--border)]">
          {loading ? (
            <div className="p-12 text-center text-xs text-[var(--muted-foreground)]">
              Loading invoices...
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--muted-foreground)]">
              No invoices found. Click "New Invoice" to create one with a live pay link.
            </div>
          ) : (
            filteredInvoices.map((inv) => {
              const isPaid = inv.status === 'paid';
              return (
                <div
                  key={inv.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--card-subtle)] transition-colors text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isPaid
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[var(--foreground)]">{inv.invoiceNumber}</span>
                        <Badge
                          variant={isPaid ? 'success' : 'default'}
                          className="text-[10px] font-mono px-1.5 py-0 uppercase"
                        >
                          {isPaid ? 'Paid' : 'Sent'}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--foreground)] mt-0.5 font-medium">{inv.clientName}</p>
                      <p className="text-[10px] text-[var(--muted-foreground)] font-mono">
                        Due {inv.dueDate} • {inv.clientEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right">
                      <MoneyText cents={inv.totalAmountCents} currency={currency} className="font-bold text-sm block" />
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        {isPaid ? 'Auto-split into Vault' : 'Estimated 28% set-aside'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        title="Copy Public Pay Link"
                        onClick={() => handleCopyLink(inv.shareToken)}
                        className="text-xs h-8 px-2.5 gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Pay Link</span>
                      </Button>

                      <Link href={`/pay/${inv.shareToken}`} target="_blank">
                        <Button variant="ghost" size="sm" title="View Public Portal" className="h-8 px-2">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </Link>

                      {!isPaid && (
                        <Button
                          size="sm"
                          onClick={() => handleSimulateInvoicePayment(inv.shareToken, inv.invoiceNumber)}
                          className="text-xs h-8 gap-1.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Simulate Paid</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* New Invoice Modal with Live Preview */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-2xl bg-[var(--card)] border border-[var(--border)]">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-bold text-[var(--foreground)]">Create New Invoice</DialogTitle>
            <DialogDescription className="text-xs text-[var(--muted-foreground)]">
              Generates a hosted payment link at <span className="font-mono">/pay/[token]</span> with auto-tax withholding upon receipt.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-[var(--foreground)] block mb-1">Client / Company Name</label>
                <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
              </div>
              <div>
                <label className="font-medium text-[var(--foreground)] block mb-1">Client Email Address</label>
                <Input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} type="email" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-[var(--foreground)] block mb-1">Invoice Number</label>
                <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
              </div>
              <div>
                <label className="font-medium text-[var(--foreground)] block mb-1">Payment Terms</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-[var(--input-border)] bg-[var(--background)] text-xs text-[var(--foreground)]"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 14">Net 14 Days</option>
                  <option value="Net 30">Net 30 Days</option>
                </select>
              </div>
            </div>

            {/* Line Item */}
            <div>
              <label className="font-medium text-[var(--foreground)] block mb-1">Service / Deliverable Description</label>
              <Input
                value={lineItems[0].description}
                onChange={(e) => setLineItems([{ ...lineItems[0], description: e.target.value }])}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-[var(--foreground)] block mb-1">Fee Amount ({currency})</label>
                <Input
                  type="number"
                  value={lineItems[0].unitPriceCents / 100}
                  onChange={(e) => {
                    const cents = Math.round(Number(e.target.value) * 100);
                    setLineItems([{ ...lineItems[0], unitPriceCents: cents, amountCents: cents }]);
                  }}
                />
              </div>

              {/* Tax Vault Withholding Preview */}
              <div className="p-3 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[var(--muted-foreground)] block">Tax Auto-Split (28%)</span>
                  <MoneyText
                    cents={Math.round(lineItems[0].amountCents * 0.28)}
                    currency={currency}
                    className="font-bold text-sm text-[var(--vault-accent)]"
                  />
                </div>
                <Badge variant="vault" className="text-[10px] font-mono">
                  Locked Vault
                </Badge>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between gap-2 pt-2 border-t border-[var(--border)]">
            <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateInvoice} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
              Generate & Publish Pay Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
