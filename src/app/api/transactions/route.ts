import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { transactions, categories, accounts } from '@/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId') || 'biz_vance_studio';
    const reviewOnly = searchParams.get('reviewOnly') === 'true';

    let query = db
      .select({
        id: transactions.id,
        businessId: transactions.businessId,
        accountId: transactions.accountId,
        accountName: accounts.name,
        amountCents: transactions.amountCents,
        direction: transactions.direction,
        method: transactions.method,
        status: transactions.status,
        counterparty: transactions.counterparty,
        rawDescription: transactions.rawDescription,
        mcc: transactions.mcc,
        categoryId: transactions.categoryId,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        categoryColor: categories.color,
        taxScheduleLine: categories.taxScheduleLine,
        confidenceScore: transactions.confidenceScore,
        isReviewed: transactions.isReviewed,
        isBusiness: transactions.isBusiness,
        isDeductible: transactions.isDeductible,
        deductiblePercentage: transactions.deductiblePercentage,
        notes: transactions.notes,
        postedAt: transactions.postedAt,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .leftJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(eq(transactions.businessId, businessId))
      .orderBy(desc(transactions.postedAt));

    const allTxns = await query;
    const filtered = reviewOnly ? allTxns.filter((t) => t.isReviewed === 0) : allTxns;

    return NextResponse.json({
      transactions: filtered,
      totalCount: filtered.length,
      unreviewedCount: allTxns.filter((t) => t.isReviewed === 0).length,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
