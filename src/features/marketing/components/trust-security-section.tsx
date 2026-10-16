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
      badgeImg: '/assets/badges/fdic-member-badge.svg',
    },
    {
      title: 'End-to-End Encryption',
      description:
        'All sensitive customer data, account numbers, and tax identification records are protected with 256-bit AES encryption at rest and TLS 1.3 in transit.',
      icon: Lock,
      badge: 'Bank-Grade AES-256',
      badgeImg: '/assets/badges/encryption-256bit-badge.svg',
    },
    {
      title: 'PCI-DSS Compliant',
      description:
        'Level 1 PCI certified architecture. Card numbers and security codes are tokenized through secure hardware enclaves.',
      icon: ShieldCheck,
      badge: 'Level 1 Certified',
      badgeImg: '/assets/badges/pci-dss-badge.svg',
    },
    {
      title: 'SOC 2 Type II Audited',
      description:
        'Engineered following strict AICPA Trust Services Criteria for security, confidentiality, and data integrity.',
      icon: FileCheck2,
      badge: 'SOC 2 Certified',
      badgeImg: '/assets/badges/soc2-compliance-badge.svg',
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
              className="rounded-3xl border border-border bg-card p-6 space-y-5 flex flex-col justify-between shadow-xs hover:border-foreground/20 transition-all overflow-hidden"
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

              <div className="pt-2">
                <img
                  src={card.badgeImg}
                  alt={card.title}
                  className="h-14 w-auto object-contain rounded-lg border border-border/40 p-1 bg-secondary/30"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Prominent Partner Bank Model Callout Box with Secure Data Illustration */}
      <div className="rounded-3xl border border-border bg-secondary/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground overflow-hidden">
        <div className="flex items-center gap-4 max-w-xl">
          <img
            src="/assets/ui-icons/shield-check.png"
            alt="Shield Check"
            className="w-14 h-14 shrink-0 object-contain"
          />
          <div className="space-y-1">
            <p className="font-bold text-foreground text-sm sm:text-base">
              Simulated FDIC Pass-Through Coverage up to $250,000
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Customer deposits are held in pooled escrow custody by our simulated BaaS partner bank (Member FDIC). Real-time zero-sync double-entry accounting guarantees that your reported balances are never out of sync with depository reserves.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge variant="vault" size="sm">
            Regulated BaaS Adapter
          </Badge>
          <img
            src="/assets/badges/fdic-member-badge.svg"
            alt="FDIC"
            className="h-9 w-auto"
          />
        </div>
      </div>
    </div>
  );
}
