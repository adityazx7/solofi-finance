import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Quote, Star, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeroTaxSplitSimulator } from '@/features/marketing/components/hero-tax-split-simulator';
import { TaxSurpriseTimeline } from '@/features/marketing/components/tax-surprise-timeline';
import { HowItWorks } from '@/features/marketing/components/how-it-works';
import { FeatureBentoGrid } from '@/features/marketing/components/feature-bento-grid';
import { InteractiveTaxEstimator } from '@/features/marketing/components/interactive-tax-estimator';
import { ComparisonTable } from '@/features/marketing/components/comparison-table';
import { TrustSecuritySection } from '@/features/marketing/components/trust-security-section';
import { PricingTeaser } from '@/features/marketing/components/pricing-teaser';
import { FaqAccordion } from '@/features/marketing/components/faq-accordion';
import { WaitlistForm } from '@/features/waitlist/components/waitlist-form';

export default function MarketingPage() {
  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            The Automated Financial Hub for Freelancers & Solopreneurs
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-foreground">
            Never get surprised by taxes again.
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The smart business account with built-in bookkeeping and automatic tax withholding. The moment an invoice is paid, your tax is calculated and locked in a dedicated vault.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button asChild size="lg" className="font-semibold shadow-md gap-2">
              <a href="#waitlist-section">
                Join the Priority Waitlist
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-medium">
              <Link href="/design">
                Explore Design System
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2 pt-1">
            <span className="flex text-amber-500">★★★★★</span>
            <span>Zero QuickBooks sync lag • Backed by BaaS partner bank (Member FDIC)</span>
          </p>
        </div>

        {/* Hero Interactive Split Simulator */}
        <div className="pt-12 sm:pt-16 max-w-4xl mx-auto">
          <HeroTaxSplitSimulator />
        </div>
      </section>

      {/* 2. The Problem: The Tax Surprise Story */}
      <section className="px-6 max-w-7xl mx-auto">
        <TaxSurpriseTimeline />
      </section>

      {/* 3. How It Works (3 Steps) */}
      <section id="how-it-works" className="px-6 max-w-7xl mx-auto scroll-mt-24">
        <HowItWorks />
      </section>

      {/* 4. Feature Bento Grid */}
      <section id="features" className="px-6 max-w-7xl mx-auto scroll-mt-24">
        <FeatureBentoGrid />
      </section>

      {/* 5. Live Interactive Tax Estimator */}
      <section id="estimator" className="px-6 max-w-7xl mx-auto scroll-mt-24">
        <InteractiveTaxEstimator />
      </section>

      {/* 6. Comparison Table (SoloFi vs QuickBooks vs Spreadsheets) */}
      <section id="comparison" className="px-6 max-w-7xl mx-auto scroll-mt-24">
        <ComparisonTable />
      </section>

      {/* 7. Social Proof & Freelancer Anxiety Evidence */}
      <section className="px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="vault" size="sm">Evidence & Social Proof</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Backed by Independent Workers Worldwide
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Sources: Upwork Freelance Forward & Freelancers Union national surveys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <Quote className="h-6 w-6 text-emerald-500 opacity-60" />
              <p className="text-sm text-foreground leading-relaxed italic">
                "I used to dread April every single year. SoloFi took the entire tax guessing game out of my life. The Tax Vault splits every check before I can touch it."
              </p>
            </div>
            <div className="pt-3 border-t border-border/80 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                EV
              </div>
              <div>
                <div className="font-semibold text-xs text-foreground">Elena Vance</div>
                <div className="text-[11px] text-muted-foreground">Brand Designer • $140k/yr (Illustrative)</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <Quote className="h-6 w-6 text-amber-500 opacity-60" />
              <p className="text-sm text-foreground leading-relaxed italic">
                "Indian tech contractors working with US clients have zero tools built for Section 44ADA. SoloFi calculating my 50% deemed profit and advance tax is unmatched."
              </p>
            </div>
            <div className="pt-3 border-t border-border/80 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                AM
              </div>
              <div>
                <div className="font-semibold text-xs text-foreground">Arjun Mehta</div>
                <div className="text-[11px] text-muted-foreground">Full-Stack Contractor • ₹60L/yr (Illustrative)</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <Quote className="h-6 w-6 text-indigo-500 opacity-60" />
              <p className="text-sm text-foreground leading-relaxed italic">
                "QuickBooks broke its bank sync every 30 days. SoloFi being an actual bank account that categorizes natively saved me $80/mo in software subscriptions."
              </p>
            </div>
            <div className="pt-3 border-t border-border/80 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                PL
              </div>
              <div>
                <div className="font-semibold text-xs text-foreground">Marcus Thorne</div>
                <div className="text-[11px] text-muted-foreground">Micro-SaaS Founder • Pioneer Labs (Illustrative)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Trust & Security Section */}
      <section className="px-6 max-w-7xl mx-auto">
        <TrustSecuritySection />
      </section>

      {/* 9. Pricing Teaser */}
      <section id="pricing" className="px-6 max-w-7xl mx-auto scroll-mt-24">
        <PricingTeaser />
      </section>

      {/* 10. FAQ Accordion */}
      <section className="px-6 max-w-7xl mx-auto">
        <FaqAccordion />
      </section>

      {/* 11. Priority Waitlist Section */}
      <section id="waitlist-section" className="px-6 max-w-3xl mx-auto scroll-mt-24">
        <WaitlistForm />
      </section>
    </div>
  );
}
