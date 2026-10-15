import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { invoices, businesses, clients, invoiceItems, notifications } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { MockBaaSProvider } from '@/server/banking/mock-baas-provider';
import { nanoid } from 'nanoid';

const baas = new MockBaaSProvider();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const invRes = await db
      .select({
        id: invoices.id,
        businessId: invoices.businessId,
        businessLegalName: businesses.legalName,
        businessTradeName: businesses.tradeName,
        businessCountry: businesses.country,
        businessCurrency: businesses.currency,
        clientName: clients.name,
        clientCompany: clients.company,
        clientEmail: clients.email,
        invoiceNumber: invoices.invoiceNumber,
        status: invoices.status,
        issueDate: invoices.issueDate,
        dueDate: invoices.dueDate,
        currency: invoices.currency,
        subtotalCents: invoices.subtotalCents,
        taxAmountCents: invoices.taxAmountCents,
        totalAmountCents: invoices.totalAmountCents,
        notes: invoices.notes,
        paymentTerms: invoices.paymentTerms,
        shareToken: invoices.shareToken,
        paidAt: invoices.paidAt,
      })
      .from(invoices)
      .leftJoin(businesses, eq(invoices.businessId, businesses.id))
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .where(eq(invoices.shareToken, token))
      .limit(1);

    if (invRes.length === 0) {
      return NextResponse.json({ error: 'Invoice not found or expired' }, { status: 404 });
    }

    const invoice = invRes[0];

    // Get line items
    const items = await db
      .select()
      .from(invoiceItems)
      .where(eq(invoiceItems.invoiceId, invoice.id));

    return NextResponse.json({ invoice, items });
  } catch (error) {
    console.error('Error fetching public invoice by token:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await request.json().catch(() => ({}));

    // 1. Fetch invoice
    const invRes = await db
      .select()
      .from(invoices)
      .where(eq(invoices.shareToken, token))
      .limit(1);

    if (invRes.length === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const invoice = invRes[0];

    if (invoice.status === 'paid') {
      return NextResponse.json({ message: 'Invoice already paid', status: 'paid' });
    }

    const timestamp = Date.now();

    // 2. Mark invoice as paid
    await db
      .update(invoices)
      .set({ status: 'paid', paidAt: timestamp })
      .where(eq(invoices.id, invoice.id));

    // 3. Trigger Mock BaaS incoming deposit which executes double-entry Tax Vault auto-split!
    const clientName = body.payerName || 'Client';
    const splitResult = await baas.simulateIncomingPayment({
      businessId: invoice.businessId,
      amountCents: invoice.totalAmountCents,
      counterparty: clientName,
      rawDescription: `ACH CREDIT ${clientName.toUpperCase()} — INVOICE ${invoice.invoiceNumber}`,
    });

    // 4. Create in-app notification for the freelancer
    const notifId = `notif_${nanoid(10)}`;
    const taxWithheldStr = (splitResult.taxWithheldCents / 100).toFixed(2);
    await db.insert(notifications).values({
      id: notifId,
      userId: 'user_elena_vance', // mapped or dynamic
      title: `Invoice ${invoice.invoiceNumber} Paid!`,
      message: `Received ${(invoice.totalAmountCents / 100).toLocaleString()} ${invoice.currency}. $${taxWithheldStr} automatically withheld into your locked Tax Vault.`,
      type: 'payment',
      isRead: 0,
      linkUrl: '/tax-vault',
      createdAt: timestamp,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      splitResult,
      paidAt: timestamp,
    });
  } catch (error) {
    console.error('Error processing invoice payment:', error);
    return NextResponse.json({ error: (error as Error).message || 'Payment failed' }, { status: 500 });
  }
}
