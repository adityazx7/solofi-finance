import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { cards, transactions } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId') || 'biz_vance_studio';

    let cardList = await db
      .select()
      .from(cards)
      .where(eq(cards.businessId, businessId));

    // Fallback if none exist for this business
    if (cardList.length === 0) {
      cardList = await db.select().from(cards).limit(1);
    }

    // Calculate simulated spend this month
    const cardTxns = await db
      .select()
      .from(transactions)
      .where(eq(transactions.businessId, businessId))
      .orderBy(desc(transactions.postedAt));

    const monthlySpendCents = cardTxns
      .filter((t) => t.direction === 'outbound')
      .reduce((acc, t) => acc + t.amountCents, 0);

    return NextResponse.json({
      cards: cardList,
      monthlySpendCents: monthlySpendCents || 124500,
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId, status, spendingLimitCents } = body;

    const updates: Record<string, any> = {};
    if (status !== undefined) updates.status = status;
    if (spendingLimitCents !== undefined) updates.spendingLimitCents = spendingLimitCents;

    await db.update(cards).set(updates).where(eq(cards.id, cardId));

    const updated = await db.select().from(cards).where(eq(cards.id, cardId)).limit(1);

    return NextResponse.json({ success: true, card: updated[0] });
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}
