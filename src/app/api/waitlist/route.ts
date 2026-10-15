import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { waitlistEntries, analyticsEvents } from '@/server/db/schema';
import { waitlistFormSchema } from '@/features/waitlist/schemas/waitlist-schema';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = waitlistFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, role, monthlyIncomeBand, biggestTaxWorry, referredByCode, utmSource, utmMedium, utmCampaign } =
      parsed.data;

    // Check if email already on waitlist
    const existing = await db
      .select()
      .from(waitlistEntries)
      .where(eq(waitlistEntries.email, email.toLowerCase().trim()))
      .limit(1);

    const baseUrl = req.nextUrl.origin || 'http://localhost:3000';

    if (existing[0]) {
      const entry = existing[0];
      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        queuePosition: entry.queuePosition,
        referralCode: entry.referralCode,
        referralLink: `${baseUrl}?ref=${entry.referralCode}`,
        message: "You're already on the waitlist! Here is your position and referral link.",
      });
    }

    // Get current total count for queue position
    const countRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(waitlistEntries);
    const nextQueuePosition = (countRes[0]?.count ?? 0) + 1;

    const referralCode = `SOLO${nanoid(6).toUpperCase()}`;
    const id = `wait_${nanoid(12)}`;

    await db.insert(waitlistEntries).values({
      id,
      email: email.toLowerCase().trim(),
      role,
      monthlyIncomeBand,
      biggestTaxWorry: biggestTaxWorry || null,
      referralCode,
      referredByCode: referredByCode || null,
      queuePosition: nextQueuePosition,
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      createdAt: Date.now(),
    });

    // Record Analytics Event
    await db.insert(analyticsEvents).values({
      id: `evt_${nanoid(12)}`,
      eventName: 'waitlist_signup',
      propertiesJson: JSON.stringify({
        role,
        monthlyIncomeBand,
        queuePosition: nextQueuePosition,
        hasReferral: Boolean(referredByCode),
      }),
      createdAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      queuePosition: nextQueuePosition,
      referralCode,
      referralLink: `${baseUrl}?ref=${referralCode}`,
      message: 'Welcome to the SoloFi waitlist!',
    });
  } catch (error) {
    console.error('Waitlist submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error processing waitlist request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const list = await db
      .select()
      .from(waitlistEntries)
      .orderBy(waitlistEntries.queuePosition);

    const total = list.length;
    const goal = 250;
    const progressPercent = Math.min(100, Math.round((total / goal) * 100));

    return NextResponse.json({
      total,
      goal,
      progressPercent,
      entries: list,
    });
  } catch (error) {
    console.error('Waitlist fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal error' },
      { status: 500 }
    );
  }
}
