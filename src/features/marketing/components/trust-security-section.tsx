'use client';

import * as React from 'react';
import { ShieldCheck, Lock, Landmark, FileCheck2, KeyRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function TrustSecuritySection() {
  const cards = [
    {
      title: 'Partner Bank Model',
      description:
        'SoloFi is a financial technology company, not a bank. Banking services are simulated through FDIC-insured partner bank institutions.',
      icon: Landmark,
      badge: 'BaaS Architecture',
    },
    {
      title: 'End-to-End Encryption',
      description:
        'All sensitive customer data, account numbers, and tax identification records are protected with 256-bit AES encryption at rest and TLS 1.3 in transit.',
      icon: Lock,
      badge: 'Bank-Grade AES-256',
    },
    {
      title: 'Zero Synced Reconciliations',
      description:
        'No Plaid sync breaks or credential scraping. Because accounting is native to the ledger, your balances are never stale or miscalculated.',
      icon: ShieldCheck,
      badge: 'Native Ledger Core',
    },
    {
      title: 'SOC 2 Type II Roadmap',
      description:
        'Designed from inception following strict AICPA Trust Services Criteria for security, confidentiality, and availability.',
      icon: FileCheck2,
      badge: 'Roadmap (Prototype)',
    },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          Institutional Trust & Security
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Where Your Money Lives & How It Is Protected
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          The number one reason freelancers switch to SoloFi is peace of mind. We take institutional security seriously.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="rounded-3xl border border-border bg-card p-6 space-y-4 flex flex-col justify-between shadow-xs hover:border-foreground/20 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" size="sm">
                    {card.badge}
                  </Badge>
                </div>
                <h3 className="text-base font-bold tracking-tight text-foreground">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prominent Partner Bank Model Callout Box */}
      <div className="rounded-2xl border border-border bg-secondary/40 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background border border-border text-foreground font-bold">
            FDIC
          </div>
          <div>
            <p className="font-semibold text-foreground text-xs sm:text-sm">
              Simulated FDIC Pass-Through Coverage up to $250,000
            </p>
            <p className="text-[11px] text-muted-foreground">
              Customer deposits are held by our simulated BaaS partner bank (Member FDIC). Prototype platform — no real money moves.
            </p>
          </div>
        </div>

        <Badge variant="vault" size="sm" className="shrink-0 self-start sm:self-auto">
          Regulated BaaS Adapter
        </Badge>
      </div>
    </div>
  );
}
