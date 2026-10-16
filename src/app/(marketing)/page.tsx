import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Quote, Star, CheckCircle2, Smartphone, Download } from 'lucide-react';
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
  const PARTNER_LOGOS = [
    { name: 'Stripe', file: 'stripe.svg' },
    { name: 'Upwork', file: 'upwork.svg' },
    { name: 'Figma', file: 'figma.svg' },
    { name: 'Shopify', file: 'shopify.svg' },
    { name: 'Notion', file: 'notion.svg' },
    { name: 'Slack', file: 'slack.svg' },
    { name: 'AWS', file: 'aws.svg' },
    { name: 'Fiverr', file: 'fiverr.svg' },
    { name: 'Adobe', file: 'adobe.svg' },
    { name: 'Uber', file: 'uber.svg' },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-x-hidden">
      {/* 1. Hero Section with Main Background Image */}
      <section className="relative pt-12 sm:pt-20 px-6 max-w-7xl mx-auto">
        {/* Main Background Image Container */}
        <div 
          className="absolute inset-0 -z-10 rounded-3xl overflow-hidden pointer-events-none opacity-40 dark:opacity-20 transition-opacity"
          style={{
            backgroundImage: `url('/assets/main-background.png')`,
            backgroundPosition: 'right 25% center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Subtle gradient vignette to blend seamlessly */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 backdrop-blur-xs">
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
            <Button asChild variant="outline" size="lg" className="font-medium bg-background/80 backdrop-blur-xs">
              <Link href="/login">
                Launch Live Demo
              </Link>
            </Button>
          </div>

          {/* Social Proof Star Ratings & Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="flex text-amber-500">★★★★★</span>
              <span className="font-semibold text-foreground">4.9/5</span>
              <span>by 450+ independent builders</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Simulated BaaS Partner: Lead Bank, Member FDIC</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Split Simulator */}
        <div className="relative z-10 pt-12 sm:pt-16 max-w-4xl mx-auto">
          <HeroTaxSplitSimulator />
        </div>

        {/* Integration Partner Logos Strip */}
        <div className="pt-16 max-w-5xl mx-auto text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Designed for solopreneurs receiving payouts from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75 grayscale hover:grayscale-0 transition-all">
            {PARTNER_LOGOS.map((p) => (
              <div key={p.name} className="flex items-center gap-2 hover:scale-105 transition-transform" title={p.name}>
                <img
                  src={`/assets/logos/${p.file}`}
                  alt={p.name}
                  className="h-6 w-auto object-contain dark:invert"
                />
                <span className="text-xs font-bold text-foreground tracking-tight">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Rating Badges Strip */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-xs p-6 sm:p-8 flex flex-wrap items-center justify-around gap-6 shadow-xs">
          <img
            src="/assets/badges/product-hunt-badge.svg"
            alt="Product Hunt Featured"
            className="h-10 w-auto hover:opacity-90 transition-opacity cursor-pointer"
          />
          <img
            src="/assets/badges/g2-rating-badge.svg"
            alt="G2 Leader 2026"
            className="h-10 w-auto hover:opacity-90 transition-opacity cursor-pointer"
          />
          <img
            src="/assets/badges/trustpilot-stars.svg"
            alt="Trustpilot 4.9 Stars"
            className="h-10 w-auto hover:opacity-90 transition-opacity cursor-pointer"
          />
          <img
            src="/assets/badges/fdic-member-badge.svg"
            alt="FDIC Insured Deposits"
            className="h-10 w-auto hover:opacity-90 transition-opacity"
          />
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

      {/* 7. Social Proof with Real Local Headshots */}
      <section className="px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="vault" size="sm">Evidence & Social Proof</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Loved by Independent Workers Worldwide
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Sources: Upwork Freelance Forward & Freelancers Union national surveys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Elena Vance */}
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <Quote className="h-6 w-6 text-emerald-500 opacity-60" />
              <p className="text-sm text-foreground leading-relaxed italic">
                "I used to dread April every single year. SoloFi took the entire tax guessing game out of my life. The Tax Vault splits every check before I can touch it."
              </p>
            </div>
            <div className="pt-3 border-t border-border/80 flex items-center gap-3">
              <img
                src="/assets/designer headshot.jpg"
                alt="Elena Vance"
                className="h-11 w-11 rounded-full object-cover border-2 border-emerald-500/40"
              />
              <div>
                <div className="font-semibold text-xs text-foreground">Elena Vance</div>
                <div className="text-[11px] text-muted-foreground">Brand Designer • $140k/yr • Vance Studio</div>
              </div>
            </div>
          </div>

          {/* Card 2: Arjun Mehta */}
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <Quote className="h-6 w-6 text-amber-500 opacity-60" />
              <p className="text-sm text-foreground leading-relaxed italic">
                "Indian tech contractors working with US clients have zero tools built for Section 44ADA. SoloFi calculating my 50% deemed profit and advance tax is unmatched."
              </p>
            </div>
            <div className="pt-3 border-t border-border/80 flex items-center gap-3">
              <img
                src="/assets/depositphotos_74390343-Smiling-software-developer.jpg"
                alt="Arjun Mehta"
                className="h-11 w-11 rounded-full object-cover border-2 border-amber-500/40"
              />
              <div>
                <div className="font-semibold text-xs text-foreground">Arjun Mehta</div>
                <div className="text-[11px] text-muted-foreground">Full-Stack Contractor • ₹60L/yr • Mehta Systems</div>
              </div>
            </div>
          </div>

          {/* Card 3: Chloe Lin & David Chen */}
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <Quote className="h-6 w-6 text-indigo-500 opacity-60" />
              <p className="text-sm text-foreground leading-relaxed italic">
                "QuickBooks broke its bank sync every 30 days. SoloFi being an actual bank account that categorizes natively saved me $80/mo in software subscriptions."
              </p>
            </div>
            <div className="pt-3 border-t border-border/80 flex items-center gap-3">
              <img
                src="/assets/female enterprenur.jpg"
                alt="Chloe Lin"
                className="h-11 w-11 rounded-full object-cover border-2 border-indigo-500/40"
              />
              <div>
                <div className="font-semibold text-xs text-foreground">Chloe Lin</div>
                <div className="text-[11px] text-muted-foreground">Creator & Educator • $95k/yr • Chloe Lin Media</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Trust & Security Section */}
      <section className="px-6 max-w-7xl mx-auto">
        <TrustSecuritySection />
      </section>

      {/* 9. Mobile App Showcase & Store Badges */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-border bg-radial from-card via-card to-secondary/30 p-8 sm:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
          <div className="space-y-5 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Smartphone className="h-3.5 w-3.5" />
              Native Mobile PWA Experience
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Banking Built for the Palm of Your Hand
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Track your Safe-to-Spend balance on the go. Instant push notifications the second tax is auto-transferred into your vault upon client invoice payment.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <img
                src="/assets/badges/app-store-download-badge.svg"
                alt="Download on App Store"
                className="h-11 w-auto cursor-pointer hover:opacity-90 transition-opacity"
              />
              <img
                src="/assets/badges/google-play-badge.svg"
                alt="Get it on Google Play"
                className="h-11 w-auto cursor-pointer hover:opacity-90 transition-opacity"
              />
            </div>
          </div>

          <div className="w-full md:w-auto flex justify-center">
            <img
              src="/assets/mockups/iphone-floating-angle-mockup.png"
              alt="SoloFi Mobile App Interface"
              className="w-72 sm:w-80 h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* 10. Pricing Teaser */}
      <section id="pricing" className="px-6 max-w-7xl mx-auto scroll-mt-24">
        <PricingTeaser />
      </section>

      {/* 11. FAQ Accordion */}
      <section className="px-6 max-w-7xl mx-auto">
        <FaqAccordion />
      </section>

      {/* 12. Priority Waitlist Section */}
      <section id="waitlist-section" className="px-6 max-w-3xl mx-auto scroll-mt-24">
        <WaitlistForm />
      </section>
    </div>
  );
}
