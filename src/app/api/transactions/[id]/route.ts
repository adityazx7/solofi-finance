import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { transactions, receipts } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updates: Record<string, any> = {};

    if (body.isReviewed !== undefined) updates.isReviewed = body.isReviewed ? 1 : 0;
    if (body.isBusiness !== undefined) updates.isBusiness = body.isBusiness ? 1 : 0;
    if (body.isDeductible !== undefined) updates.isDeductible = body.isDeductible ? 1 : 0;
    if (body.deductiblePercentage !== undefined) updates.deductiblePercentage = body.deductiblePercentage;
    if (body.categoryId !== undefined) updates.categoryId = body.categoryId;
    if (body.notes !== undefined) updates.notes = body.notes;

    await db.update(transactions).set(updates).where(eq(transactions.id, id));

    const updated = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);

    return NextResponse.json({ success: true, transaction: updated[0] });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Simulated OCR Receipt upload
    const receiptId = `rcpt_${nanoid(12)}`;
    const newReceipt = {
      id: receiptId,
      transactionId: id,
      fileName: body.fileName || 'receipt.pdf',
      fileUrl: body.fileUrl || 'https://images.unsplash.com/photo-1554415707-9e4c01928573?w=600',
      mimeType: body.mimeType || 'image/jpeg',
      fileSize: body.fileSize || 248102,
      ocrMerchant: body.ocrMerchant || 'Blue Bottle Coffee',
      ocrAmountCents: body.ocrAmountCents || 1840,
      ocrDate: body.ocrDate || new Date().toISOString().split('T')[0],
      ocrConfidence: 0.96,
      uploadedAt: Date.now(),
    };

    await db.insert(receipts).values(newReceipt);

    // Also mark transaction as reviewed and set high confidence
    await db
      .update(transactions)
      .set({ isReviewed: 1, confidenceScore: 0.98 })
      .where(eq(transactions.id, id));

    return NextResponse.json({ success: true, receipt: newReceipt });
  } catch (error) {
    console.error('Error attaching receipt:', error);
    return NextResponse.json({ error: 'Failed to attach receipt' }, { status: 500 });
  }
}
