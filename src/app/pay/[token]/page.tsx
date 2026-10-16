'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MoneyText } from '@/components/ui/money-text';
import type { CurrencyCode } from '@/lib/money';
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Building2,
  Lock,
  ArrowRight,
  Download,
  Printer,
  Sparkles,
  Zap,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface InvoicePayload {
  id: string;
  invoiceNumber: string;
  businessLegalName: string;
  businessTradeName: string | null;
  businessCountry: string;
  businessCurrency: string;
  clientName: string;
  clientCompany: string | null;
  clientEmail: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  currency: string;
  subtotalCents: number;
  taxAmountCents: number;
  totalAmountCents: number;
  notes: string | null;
  paymentTerms: string;
  shareToken: string;
  paidAt: number | null;
}

interface ItemPayload {
  id: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
  amountCents: number;
}

export default function PublicPayPortalPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<InvoicePayload | null>(null);
  const [items, setItems] = useState<ItemPayload[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ach'>('card');
  const [payerName, setPayerName] = useState('Acme Accounts Payable');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pay/${token}`);
      const data = await res.json();
      if (data.invoice) {
        setInvoice(data.invoice);
        setItems(data.items || []);
        setIsPaid(data.invoice.status === 'paid');
      } else {
        toast.error('Invoice not found');
      }
    } catch {
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchInvoice();
    }
  }, [token]);

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    toast.loading('Processing payment via simulated BaaS network...', { id: 'portal-pay' });

    try {
      const res = await fetch(`/api/pay/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payerName }),
      });

      const data = await res.json();
      if (data.success) {
        setIsPaid(true);
        toast.success('Payment Received! Receipt generated.', {
          id: 'portal-pay',
          description: 'Funds and automatic tax split recorded in double-entry ledger.',
        });
        fetchInvoice();
      } else {
        toast.info(data.message || 'Payment status updated', { id: 'portal-pay' });
      }
    } catch {
      toast.error('Payment failed', { id: 'portal-pay' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
        <div className="flex flex-col items-center text-xs text-[var(--muted-foreground)]">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)] mb-2" />
          <span>Loading secure invoice payment portal...</span>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
        <Card className="max-w-md p-6 text-center border-[var(--border)]">
          <h2 className="text-lg font-bold">Invoice Not Found</h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            This invoice payment link may be expired or invalid.
          </p>
          <Link href="/" className="mt-4 inline-block text-xs text-[var(--primary)] hover:underline">
            Return to SoloFi Home
          </Link>
        </Card>
      </div>
    );
  }

  const currency: CurrencyCode = (invoice.currency as CurrencyCode) || 'USD';

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-[var(--foreground)] py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Pay Portal Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              S
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight">{invoice.businessTradeName || invoice.businessLegalName}</span>
              <p className="text-[10px] text-[var(--muted-foreground)]">Powered by SoloFi BaaS Checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={isPaid ? 'success' : 'default'} className="font-mono text-xs px-2 py-0.5 uppercase tracking-wider">
              {isPaid ? 'Paid in Full' : 'Due on Receipt'}
            </Badge>
          </div>
        </div>

        {/* Invoice Bill Container */}
        <Card className="border-[var(--border)] bg-[var(--card)] shadow-md overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-[var(--border)] flex flex-col sm:flex-row justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-semibold block mb-1">
                From
              </span>
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                {invoice.businessTradeName || invoice.businessLegalName}
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">{invoice.businessLegalName}</p>
              <p className="text-xs text-[var(--muted-foreground)]">San Francisco, CA • United States</p>
            </div>

            <div className="sm:text-right">
              <span className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-semibold block mb-1">
                Invoice Details
              </span>
              <p className="font-mono text-base font-bold text-[var(--foreground)]">{invoice.invoiceNumber}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Issued: {invoice.issueDate}</p>
              <p className="text-xs text-[var(--muted-foreground)] font-semibold">Due: {invoice.dueDate}</p>
            </div>
          </div>

          {/* Billed To */}
          <div className="p-6 md:p-8 border-b border-[var(--border)] bg-[var(--card-subtle)]/30">
            <span className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] font-semibold block mb-1">
              Billed To
            </span>
            <p className="font-semibold text-sm text-[var(--foreground)]">{invoice.clientName}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{invoice.clientCompany || invoice.clientName}</p>
            <p className="text-xs text-[var(--muted-foreground)]">{invoice.clientEmail}</p>
          </div>

          {/* Line Items Table */}
          <div className="p-6 md:p-8">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[var(--border)] text-[11px] font-semibold text-[var(--muted-foreground)]">
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-center w-16">Qty</th>
                  <th className="pb-2 text-right w-28">Rate</th>
                  <th className="pb-2 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((item) => (
                  <tr key={item.id} className="py-3">
                    <td className="py-3 font-medium text-[var(--foreground)]">{item.description}</td>
                    <td className="py-3 text-center text-[var(--muted-foreground)] font-mono">{item.quantity}</td>
                    <td className="py-3 text-right text-[var(--muted-foreground)] font-mono">
                      <MoneyText cents={item.unitPriceCents} currency={currency} />
                    </td>
                    <td className="py-3 text-right font-semibold font-mono text-[var(--foreground)]">
                      <MoneyText cents={item.amountCents} currency={currency} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Section */}
            <div className="mt-6 pt-4 border-t border-[var(--border)] flex justify-between items-baseline">
              <span className="font-semibold text-sm text-[var(--muted-foreground)]">Total Amount Due</span>
              <MoneyText
                cents={invoice.totalAmountCents}
                currency={currency}
                className="text-3xl font-extrabold tracking-tight text-[var(--primary)]"
              />
            </div>
          </div>
        </Card>

        {/* Payment Checkout Card or Paid Confirmation */}
        {isPaid ? (
          <Card className="border-emerald-500/40 bg-emerald-500/5 p-8 text-center space-y-4">
            <div className="mx-auto w-24 h-24 flex items-center justify-center">
              <img
                src="/assets/illustrations/success-checkmark-illustration.png"
                alt="Payment Succeeded"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[var(--foreground)]">Payment Received with Thanks</h3>
              <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto mt-1">
                This invoice has been cleared. Safe harbor taxes have been automatically withheld and vaulted into {invoice.businessLegalName}'s tax reserve.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => window.print()} className="text-xs gap-1.5">
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="border-[var(--border)] bg-[var(--card)] shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[var(--primary)]" />
                <span className="font-semibold text-sm">Select Payment Method</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[var(--muted-foreground)]">
                <img
                  src="/assets/badges/encryption-256bit-badge.svg"
                  alt="256-bit"
                  className="h-5 w-auto"
                />
                <span>256-bit Encrypted</span>
              </div>
            </div>

            {/* Method Tabs */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[var(--primary)] bg-[var(--primary-subtle)] text-[var(--primary)] font-medium'
                    : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                }`}
              >
                <CreditCard className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold leading-none">Credit or Debit Card</p>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">Visa, Mastercard, Amex</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('ach')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  paymentMethod === 'ach'
                    ? 'border-[var(--primary)] bg-[var(--primary-subtle)] text-[var(--primary)] font-medium'
                    : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                }`}
              >
                <Building2 className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold leading-none">ACH Bank Transfer</p>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">Direct US Checking / Wire</p>
                </div>
              </button>
            </div>

            {/* Card Mock Fields */}
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="font-medium text-[var(--foreground)] block mb-1">Cardholder Name</label>
                <Input value={payerName} onChange={(e) => setPayerName(e.target.value)} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="font-medium text-[var(--foreground)] block mb-1">Card Number</label>
                  <Input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                </div>
                <div>
                  <label className="font-medium text-[var(--foreground)] block mb-1">Exp & CVC</label>
                  <Input defaultValue="11/28 891" />
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div className="pt-2">
              <Button
                size="lg"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="w-full gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-md font-medium text-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Secure Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay</span>
                    <MoneyText cents={invoice.totalAmountCents} currency={currency} className="font-bold text-white" />
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>

            {/* BaaS Tax Split Disclosure */}
            <div className="p-3 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Real-time BaaS integration: 28% estimated tax isolated into dedicated vault</span>
              </div>
              <Badge variant="outline" className="text-[9px] font-mono">
                Auto-Split
              </Badge>
            </div>
          </Card>
        )}

        {/* Footer */}
        <footer className="text-center text-[11px] text-[var(--muted-foreground)] py-4">
          SoloFi BaaS Payment Gateway • Client-facing checkout environment • FDIC Partner Model
        </footer>
      </div>
    </div>
  );
}
