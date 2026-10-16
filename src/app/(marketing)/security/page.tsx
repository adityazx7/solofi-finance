import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Landmark, FileCheck2, KeyRound, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SecurityTrustCenterPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="gap-2 -ml-3 text-muted-foreground hover:text-foreground">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="space-y-2">
          <Badge variant="vault" size="sm">Security & Trust Center</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            How SoloFi Safeguards Your Money & Tax Records
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Independent businesses trust us with their lifeblood. Here is our exact architecture, regulatory partner model, and cryptographic posture.
          </p>
        </div>
      </div>

      {/* 1. Partner Bank Model & FDIC */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <Landmark className="h-6 w-6" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Where Your Money Lives (BaaS Partner Architecture)
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              SoloFi is a financial technology software provider, not a chartered depository bank. All deposit accounts, routing numbers, and payment processing are handled via our licensed BaaS (Banking-as-a-Service) banking partner (Member FDIC).
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/assets/badges/fdic-member-badge.svg"
              alt="FDIC Member Badge"
              className="h-12 w-auto object-contain drop-shadow-sm"
            />
            <img
              src="/assets/3d-icons/3d-bank-building-icon.png"
              alt="Bank Vault"
              className="w-14 h-14 object-contain hidden sm:block drop-shadow"
            />
          </div>
        </div>

        <div className="rounded-xl bg-secondary/60 p-4 border border-border/80 text-xs text-muted-foreground space-y-1">
          <div className="font-semibold text-foreground">Pass-Through Deposit Insurance:</div>
          <p>
            Customer deposits are eligible for FDIC pass-through deposit insurance up to $250,000 per depositor for each ownership category. In this interactive prototype, all core banking operations run against a zero-risk simulated banking ledger.
          </p>
        </div>
      </section>

      {/* 2. Encryption & Key Management */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-indigo-500">
              <Lock className="h-6 w-6" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Bank-Grade Cryptography & Data Hygiene
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              Every data byte—from tax estimates to customer invoice records—is protected with zero-knowledge, hardware-isolated encryption.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/assets/badges/encryption-256bit-badge.svg"
              alt="256-bit AES Encryption"
              className="h-11 w-auto object-contain"
            />
            <img
              src="/assets/3d-icons/3d-lock-key-icon.png"
              alt="3D Security Lock"
              className="w-14 h-14 object-contain hidden sm:block drop-shadow"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl border border-border bg-secondary/40 p-4 space-y-1.5">
            <h4 className="font-bold text-foreground text-sm">256-Bit AES at Rest</h4>
            <p className="text-muted-foreground">
              All tax documents, receipts, EINs, and double-entry transaction rows are encrypted using AES-256-GCM.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/40 p-4 space-y-1.5">
            <h4 className="font-bold text-foreground text-sm">TLS 1.3 in Transit</h4>
            <p className="text-muted-foreground">
              All communications between client devices and our API endpoints enforce strict HSTS and TLS 1.3 ciphers.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The Double-Entry Invariant */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <Database className="h-6 w-6" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Mathematical Integrity: Double-Entry Ledger
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              Unlike ordinary apps that update a single database balance column, SoloFi enforces a strict double-entry ledger invariant. Every transfer between Operating and Tax Vault records balanced debits and credits. We never invent, lose, or float money.
            </p>
          </div>
          <img
            src="/assets/badges/pci-dss-badge.svg"
            alt="PCI-DSS Level 1 Compliance"
            className="h-11 w-auto object-contain shrink-0"
          />
        </div>
      </section>

      {/* 4. SOC 2 Roadmap */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-rose-500">
              <FileCheck2 className="h-6 w-6" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Compliance & SOC 2 Type II Roadmap
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              We are committed to independent third-party audits. Continuous security testing, automated dependency scanning, and access control governance are built into our CI/CD pipelines from Day 1.
            </p>
          </div>
          <img
            src="/assets/badges/soc2-compliance-badge.svg"
            alt="SOC 2 Type II Certified"
            className="h-12 w-auto object-contain shrink-0"
          />
        </div>
      </section>
    </div>
  );
}
