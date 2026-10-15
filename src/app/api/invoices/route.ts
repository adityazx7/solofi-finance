import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { invoices, clients, invoiceItems } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId') || 'biz_vance_studio';

    const invoiceList = await db
      .select({
        id: invoices.id,
        businessId: invoices.businessId,
        clientId: invoices.clientId,
        clientName: clients.name,
        clientEmail: clients.email,
        clientCompany: clients.company,
        invoiceNumber: invoices.invoiceNumber,
        status: invoices.status,
        issueDate: invoices.issueDate,
        dueDate: invoices.dueDate,
        currency: invoices.currency,
        subtotalCents: invoices.subtotalCents,
        taxRateBps: invoices.taxRateBps,
        taxAmountCents: invoices.taxAmountCents,
        totalAmountCents: invoices.totalAmountCents,
        notes: invoices.notes,
        paymentTerms: invoices.paymentTerms,
        shareToken: invoices.shareToken,
        paidAt: invoices.paidAt,
        createdAt: invoices.createdAt,
      })
      .from(invoices)
      .leftJoin(clients, eq(invoices.clientId, clients.id))
      .where(eq(invoices.businessId, businessId))
      .orderBy(desc(invoices.createdAt));

    return NextResponse.json({ invoices: invoiceList });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      businessId,
      clientName,
      clientEmail,
      clientCompany,
      invoiceNumber,
      dueDate,
      currency,
      items,
      paymentTerms,
      notes,
    } = body;

    // 1. Create or link client
    const clientId = `client_${nanoid(10)}`;
    await db.insert(clients).values({
      id: clientId,
      businessId: businessId || 'biz_vance_studio',
      name: clientName || 'Acme Client Corp',
      email: clientEmail || 'billing@acme.com',
      company: clientCompany || clientName || 'Acme Corp',
      currency: currency || 'USD',
      defaultPaymentTermsDays: 14,
      createdAt: Date.now(),
    });

    // 2. Compute totals from items
    const parsedItems = items && items.length > 0 ? items : [
      { description: 'Consulting & Design Services', quantity: 1, unitPriceCents: 350000, amountCents: 350000 },
    ];

    const subtotalCents = parsedItems.reduce((acc: number, item: any) => acc + (item.amountCents || 0), 0);
    const totalAmountCents = subtotalCents;

    const invoiceId = `inv_${nanoid(10)}`;
    const shareToken = `pay_${nanoid(16)}`;
    const issueDate = new Date().toISOString().split('T')[0];

    const newInvoice = {
      id: invoiceId,
      businessId: businessId || 'biz_vance_studio',
      clientId: clientId,
      invoiceNumber: invoiceNumber || `INV-${Date.now().toString().slice(-4)}`,
      status: 'sent',
      issueDate: issueDate,
      dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      currency: currency || 'USD',
      subtotalCents: subtotalCents,
      taxRateBps: 0,
      taxAmountCents: 0,
      totalAmountCents: totalAmountCents,
      notes: notes || 'Thank you for your business. Payment is due within agreed terms.',
      paymentTerms: paymentTerms || 'Net 14',
      shareToken: shareToken,
      paidAt: null,
      createdAt: Date.now(),
    };

    await db.insert(invoices).values(newInvoice);

    // Insert items
    for (const item of parsedItems) {
      await db.insert(invoiceItems).values({
        id: `item_${nanoid(10)}`,
        invoiceId: invoiceId,
        description: item.description,
        quantity: item.quantity || 1,
        unitPriceCents: item.unitPriceCents || item.amountCents,
        amountCents: item.amountCents,
      });
    }

    return NextResponse.json({ success: true, invoice: newInvoice, shareUrl: `/pay/${shareToken}` });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
