'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DEMO_PERSONAS } from '@/auth';
import { useDemoSessionStore } from '@/features/auth/store/demo-session-store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowRight, ShieldCheck, Sparkles, Building2, CheckCircle2, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { setActivePersonaId } = useDemoSessionStore();
  const [selectedPersona, setSelectedPersona] = useState(DEMO_PERSONAS[0].id);
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectPersona = (id: string) => {
    setSelectedPersona(id);
    setActivePersonaId(id);
  };

  const handleDemoSignIn = async (personaId: string) => {
    setIsSubmitting(true);
    setActivePersonaId(personaId);
    toast.success('Signed in as demo persona', {
      description: `Active hub: ${DEMO_PERSONAS.find((p) => p.id === personaId)?.name}`,
    });
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      toast.error('Please enter an email address');
      return;
    }
    setIsSubmitting(true);
    setActivePersonaId('user_elena_vance');
    toast.success('Welcome to SoloFi Sandbox', {
      description: `Session provisioned for ${emailInput}`,
    });
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between p-4 md:p-8">
      {/* Top Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold text-base shadow-sm">
            S
          </div>
          <span className="font-semibold text-lg tracking-tight text-[var(--foreground)]">SoloFi</span>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
            Mock BaaS Sandbox
          </Badge>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/onboarding">
            <Button variant="ghost" size="sm">
              New Account Wizard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm">
              Marketing Site
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto w-full my-auto py-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary-subtle)] text-[var(--primary)] text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Fintech Prototype</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Log in to your business hub
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">
            SoloFi is fully seeded with 4 realistic solopreneur profiles. Pick a persona below to enter with pre-calculated Tax Vaults, invoices, and double-entry transaction ledgers.
          </p>
        </div>

        {/* 1-Click Persona Quick Picker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {DEMO_PERSONAS.map((persona) => {
            const isSelected = selectedPersona === persona.id;
            return (
              <div
                key={persona.id}
                onClick={() => handleSelectPersona(persona.id)}
                className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary-subtle)]/30 ring-1 ring-[var(--primary)] shadow-sm'
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/40 hover:bg-[var(--card)]/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={persona.avatar}
                      alt={persona.name}
                      className="w-10 h-10 rounded-full object-cover border border-[var(--border)]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[var(--foreground)]">{persona.name}</span>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {persona.currency}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)]">{persona.businessName}</p>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />}
                </div>

                <div className="text-xs text-[var(--muted-foreground)] border-t border-[var(--border)] pt-2.5 mt-auto flex items-center justify-between">
                  <span>{persona.description}</span>
                  <Badge variant={persona.country === 'US' ? 'default' : 'vault'} className="text-[10px] px-1.5 py-0 h-4">
                    {persona.country}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="w-full sm:w-auto px-8 gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-md font-medium"
            disabled={isSubmitting}
            onClick={() => handleDemoSignIn(selectedPersona)}
          >
            <UserCheck className="w-4 h-4" />
            <span>Open Hub as {DEMO_PERSONAS.find((p) => p.id === selectedPersona)?.name}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Link href="/onboarding" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full gap-2">
              <Building2 className="w-4 h-4" />
              <span>Simulate New KYC Onboarding</span>
            </Button>
          </Link>
        </div>

        {/* Alternative Email Login Box */}
        <div className="mt-10 pt-8 border-t border-[var(--border)] max-w-md mx-auto">
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <label className="text-xs font-medium text-[var(--muted-foreground)] block text-center">
              Or sign in with any custom test email
            </label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="you@yourdomain.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="text-sm"
              />
              <Button type="submit" variant="secondary" size="default" disabled={isSubmitting}>
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer Trust Bar */}
      <footer className="max-w-4xl mx-auto w-full text-center py-4 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted-foreground)]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
          <span>Simulated BaaS Environment — No real money or bank credentials required</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/security" className="hover:underline">
            Security & Partner Bank
          </Link>
          <Link href="/design" className="hover:underline">
            Design System
          </Link>
          <Link href="/admin/waitlist" className="hover:underline">
            Waitlist Admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
