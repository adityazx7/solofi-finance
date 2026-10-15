import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { users, businesses, taxProfiles, accounts, transactions, notifications } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { MockBaaSProvider } from '@/server/banking/mock-baas-provider';
import { seedDatabase } from '@/server/db/seed';
import { DEMO_PERSONAS } from '@/auth';

const baas = new MockBaaSProvider();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const personaId = searchParams.get('personaId') || 'user_elena_vance';

    // 1. Fetch user
    const userRes = await db.select().from(users).where(eq(users.id, personaId)).limit(1);
    let user = userRes[0];

    // Fallback if not found
    if (!user) {
      const fallback = await db.select().from(users).limit(1);
      user = fallback[0];
    }

    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 404 });
    }

    // 2. Fetch business
    const bizRes = await db.select().from(businesses).where(eq(businesses.userId, user.id)).limit(1);
    const business = bizRes[0];

    if (!business) {
      return NextResponse.json({ error: 'No business found for user' }, { status: 404 });
    }

    // 3. Fetch tax profile
    const profileRes = await db.select().from(taxProfiles).where(eq(taxProfiles.businessId, business.id)).limit(1);
    const taxProfile = profileRes[0] || null;

    // 4. Fetch accounts
    const accountList = await db.select().from(accounts).where(eq(accounts.businessId, business.id));

    // 5. Fetch count of transactions requiring review (confidence < 0.85 or isReviewed == 0)
    const allTxns = await db
      .select()
      .from(transactions)
      .where(eq(transactions.businessId, business.id))
      .orderBy(desc(transactions.postedAt))
      .limit(10);

    const unreviewedCount = allTxns.filter((t) => t.isReviewed === 0).length;

    // 6. Fetch unread notifications
    const userNotifs = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(5);

    return NextResponse.json({
      user,
      business,
      taxProfile,
      accounts: accountList,
      recentTransactions: allTxns,
      unreviewedCount,
      notifications: userNotifs,
      availablePersonas: DEMO_PERSONAS,
    });
  } catch (error) {
    console.error('Error in /api/demo/session GET:', error);
    return NextResponse.json({ error: 'Failed to fetch demo session' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, personaId, businessId } = body;

    if (action === 'simulate_payment') {
      const amountCents = body.amountCents || 420000; // Default $4,200
      const counterparty = body.counterparty || 'Acme Design Corp';

      const result = await baas.simulateIncomingPayment({
        businessId: businessId,
        amountCents: amountCents,
        counterparty: counterparty,
        rawDescription: `ACH CREDIT ${counterparty.toUpperCase()} — INVOICE PAYMENT`,
      });

      return NextResponse.json({ success: true, result });
    }

    if (action === 'reset_db') {
      await seedDatabase();
      return NextResponse.json({ success: true, message: 'Database reset to default seed state' });
    }

    if (action === 'toggle_vault_lock') {
      const accountId = body.accountId;
      const isLocked = body.isLocked ? 1 : 0;

      await db
        .update(accounts)
        .set({
          isLocked: isLocked,
          lockReason: isLocked ? 'Dedicated Tax Vault — locked to prevent shortfalls' : 'Unlocked by owner override',
        })
        .where(eq(accounts.id, accountId));

      return NextResponse.json({ success: true, isLocked: Boolean(isLocked) });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error in /api/demo/session POST:', error);
    return NextResponse.json({ error: (error as Error).message || 'Action failed' }, { status: 500 });
  }
}
