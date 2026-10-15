import { NextResponse } from 'next/server';
import { db } from '@/server/db/client';
import { waitlistEntries } from '@/server/db/schema';

export async function GET() {
  try {
    const entries = await db
      .select()
      .from(waitlistEntries)
      .orderBy(waitlistEntries.queuePosition);

    const headers = [
      'Queue Position',
      'Email',
      'Role',
      'Monthly Income Band',
      'Biggest Tax Worry',
      'Referral Code',
      'Referred By',
      'UTM Source',
      'Created Date',
    ];

    const rows = entries.map((entry) => [
      entry.queuePosition,
      `"${entry.email}"`,
      `"${entry.role}"`,
      `"${entry.monthlyIncomeBand}"`,
      `"${(entry.biggestTaxWorry || '').replace(/"/g, '""')}"`,
      entry.referralCode,
      entry.referredByCode || '',
      entry.utmSource || '',
      new Date(entry.createdAt).toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="solofi-waitlist-export.csv"',
      },
    });
  } catch (error) {
    console.error('Waitlist export error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
