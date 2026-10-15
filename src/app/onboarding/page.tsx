'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MoneyText } from '@/components/ui/money-text';
import { TaxEngine } from '@/features/tax/lib/tax-engine';
import {
  Building2,
  MapPin,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  CreditCard,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

type EntityType = 'freelancer' | 'llc' | 's_corp' | 'sole_prop';
type CountryType = 'US' | 'IN';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [entityType, setEntityType] = useState<EntityType>('llc');
  const [businessName, setBusinessName] = useState('Studio Craft Design LLC');
  const [country, setCountry] = useState<CountryType>('US');
  const [stateRegion, setStateRegion] = useState('CA');
  const [annualRevenueCents, setAnnualRevenueCents] = useState(12000000); // $120,000
  const [expenseRatio, setExpenseRatio] = useState(20); // 20%
  const [filingStatus, setFilingStatus] = useState<'single' | 'married_joint'>('single');

  // KYC Mock Fields
  const [legalName, setLegalName] = useState('Alex Morgan');
  const [idLastFour, setIdLastFour] = useState('4891');
  const [isVerifyingKyc, setIsVerifyingKyc] = useState(false);
  const [kycProgress, setKycProgress] = useState<string[]>([]);
  const [isKycPassed, setIsKycPassed] = useState(false);

  // Generated Account State
  const [accountInfo, setAccountInfo] = useState<{
    routing: string;
    operatingAccount: string;
    taxVaultAccount: string;
    cardLastFour: string;
  } | null>(null);

  // Compute live tax projection
  const estimatedExpensesCents = Math.round((annualRevenueCents * expenseRatio) / 100);
  const projectedNetCents = annualRevenueCents - estimatedExpensesCents;
  
  const taxSummary = React.useMemo(() => {
    if (country === 'US') {
      const res = TaxEngine.calculateUsTaxes({
        netBusinessProfitCents: projectedNetCents,
        filingStatus: filingStatus as any,
      });
      return {
        totalTaxCents: res.totalAnnualLiabilityCents,
        quarterlyPaymentCents: res.quarterlyEstimatedDueCents,
        effectiveRateBps: res.effectiveRateBps,
      };
    } else {
      const res = TaxEngine.calculateIndiaTaxes({
        grossReceiptsPaise: annualRevenueCents,
        usePresumptive44Ada: true,
      });
      return {
        totalTaxCents: res.totalAnnualLiabilityPaise,
        quarterlyPaymentCents: Math.round(res.totalAnnualLiabilityPaise / 4),
        effectiveRateBps: res.effectiveRateBps,
      };
    }
  }, [country, filingStatus, projectedNetCents, annualRevenueCents]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const runSimulatedKyc = () => {
    setIsVerifyingKyc(true);
    setKycProgress([]);

    const steps = [
      'Verifying identity against national records...',
      'Screening against global sanctions & OFAC watchlists...',
      'Validating business registration with state registrar...',
      'Opening FDIC-insured partner bank depository account...',
      'Provisioning instant virtual Visa Commercial Card...',
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setKycProgress((prev) => [...prev, step]);
        if (index === steps.length - 1) {
          setIsVerifyingKyc(false);
          setIsKycPassed(true);
          setAccountInfo({
            routing: '121000358',
            operatingAccount: '4829 ' + Math.floor(1000 + Math.random() * 9000),
            taxVaultAccount: '9281 ' + Math.floor(1000 + Math.random() * 9000),
            cardLastFour: '7419',
          });
          toast.success('KYC Approved! Bank account provisioned.');
        }
      }, (index + 1) * 700);
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between p-4 md:p-8">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold text-base shadow-sm">
            S
          </div>
          <span className="font-semibold text-lg tracking-tight text-[var(--foreground)]">SoloFi</span>
          <Badge variant="outline" className="text-[10px] text-[var(--muted-foreground)]">
            Account Opening
          </Badge>
        </Link>
        <Link href="/login" className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          Already have an account? Sign in
        </Link>
      </header>

      {/* Wizard Container */}
      <main className="max-w-2xl mx-auto w-full my-auto py-6">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-medium text-[var(--muted-foreground)] mb-2">
            <span>Step {currentStep} of 5</span>
            <span className="text-[var(--foreground)] font-semibold">
              {currentStep === 1 && 'Entity Type'}
              {currentStep === 2 && 'Tax Jurisdiction'}
              {currentStep === 3 && 'Revenue & Safe-to-Spend'}
              {currentStep === 4 && 'Partner Bank KYC'}
              {currentStep === 5 && 'Account Provisioned'}
            </span>
          </div>
          <div className="w-full bg-[var(--border)] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[var(--primary)] h-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: ENTITY TYPE */}
        {currentStep === 1 && (
          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[var(--primary)]" />
                Select your business entity
              </CardTitle>
              <CardDescription>
                SoloFi tailors your Schedule C lines and tax withholding rules to your legal structure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'llc',
                    title: 'Single-Member LLC',
                    desc: 'Limited liability with passthrough tax treatment (Disregarded entity)',
                  },
                  {
                    id: 'freelancer',
                    title: 'Independent Freelancer',
                    desc: 'Sole proprietor filing 1099-NEC / Schedule C directly',
                  },
                  {
                    id: 's_corp',
                    title: 'S-Corporation',
                    desc: 'W-2 reasonable salary + passthrough shareholder distributions',
                  },
                  {
                    id: 'sole_prop',
                    title: 'Consultant / Professional',
                    desc: 'India Sec 44ADA / Presumptive 50% deemed profit',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setEntityType(item.id as EntityType)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      entityType === item.id
                        ? 'border-[var(--primary)] bg-[var(--primary-subtle)]/40 ring-1 ring-[var(--primary)]'
                        : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-[var(--foreground)]">{item.title}</span>
                      {entityType === item.id && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1.5">
                  Business Legal / Trade Name
                </label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Acme Design Studio LLC"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-[var(--border)] pt-4">
              <span className="text-xs text-[var(--muted-foreground)]">Takes ~2 minutes to set up</span>
              <Button onClick={handleNext} className="gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                Next: Jurisdiction <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 2: JURISDICTION */}
        {currentStep === 2 && (
          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[var(--primary)]" />
                Tax Residency & Filing Status
              </CardTitle>
              <CardDescription>
                Calculates your automated quarterly withholding using exact 2025 statutory brackets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1.5">Country</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setCountry('US')}
                    className={`p-3 rounded-lg border text-center cursor-pointer font-medium text-sm transition-all ${
                      country === 'US'
                        ? 'border-[var(--primary)] bg-[var(--primary-subtle)]/30 text-[var(--primary)]'
                        : 'border-[var(--border)] text-[var(--foreground)]'
                    }`}
                  >
                    🇺🇸 United States (IRS Federal + State)
                  </div>
                  <div
                    onClick={() => setCountry('IN')}
                    className={`p-3 rounded-lg border text-center cursor-pointer font-medium text-sm transition-all ${
                      country === 'IN'
                        ? 'border-[var(--primary)] bg-[var(--primary-subtle)]/30 text-[var(--primary)]'
                        : 'border-[var(--border)] text-[var(--foreground)]'
                    }`}
                  >
                    🇮🇳 India (Section 44ADA Presumptive)
                  </div>
                </div>
              </div>

              {country === 'US' ? (
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)] block mb-1.5">State Residency</label>
                  <select
                    value={stateRegion}
                    onChange={(e) => setStateRegion(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-[var(--input-border)] bg-[var(--background)] text-sm text-[var(--foreground)]"
                  >
                    <option value="CA">California (FTB 1%-13.3%)</option>
                    <option value="NY">New York (NYS + NYC)</option>
                    <option value="TX">Texas (No state income tax)</option>
                    <option value="WA">Washington (No state income tax)</option>
                    <option value="FL">Florida (No state income tax)</option>
                  </select>
                </div>
              ) : (
                <div className="p-3 bg-[var(--card-subtle)] border border-[var(--border)] rounded-lg text-xs space-y-1">
                  <p className="font-medium text-[var(--foreground)]">Section 44ADA Presumptive Taxation Applied</p>
                  <p className="text-[var(--muted-foreground)]">
                    50% of your gross professional receipts are deemed as profit under CBDT guidelines.
                  </p>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1.5">IRS Filing Status</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setFilingStatus('single')}
                    className={`p-3 rounded-lg border text-center cursor-pointer text-xs font-medium ${
                      filingStatus === 'single'
                        ? 'border-[var(--primary)] bg-[var(--primary-subtle)]/30 text-[var(--primary)]'
                        : 'border-[var(--border)]'
                    }`}
                  >
                    Single / Head of Household
                  </div>
                  <div
                    onClick={() => setFilingStatus('married_joint')}
                    className={`p-3 rounded-lg border text-center cursor-pointer text-xs font-medium ${
                      filingStatus === 'married_joint'
                        ? 'border-[var(--primary)] bg-[var(--primary-subtle)]/30 text-[var(--primary)]'
                        : 'border-[var(--border)]'
                    }`}
                  >
                    Married Filing Jointly
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-[var(--border)] pt-4">
              <Button variant="ghost" onClick={handleBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={handleNext} className="gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                Next: Revenue & Taxes <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 3: REVENUE ESTIMATE & TAX PREVIEW */}
        {currentStep === 3 && (
          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
                Revenue & Tax Withholding Forecast
              </CardTitle>
              <CardDescription>
                We use this to set your initial Tax Vault withholding percentage. You can adjust this anytime.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-xs font-medium text-[var(--foreground)]">Expected Annual Gross Revenue</label>
                  <span className="font-mono text-base font-semibold text-[var(--primary)]">
                    {country === 'US' ? `$${(annualRevenueCents / 100).toLocaleString()}` : `₹${(annualRevenueCents / 100).toLocaleString()}`}
                  </span>
                </div>
                <input
                  type="range"
                  min={3000000}
                  max={30000000}
                  step={500000}
                  value={annualRevenueCents}
                  onChange={(e) => setAnnualRevenueCents(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-xs font-medium text-[var(--foreground)]">Estimated Business Deductible Expenses</label>
                  <span className="font-mono text-xs font-semibold">{expenseRatio}% of revenue</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={expenseRatio}
                  onChange={(e) => setExpenseRatio(Number(e.target.value))}
                  className="w-full accent-[var(--primary)]"
                />
              </div>

              {/* Dynamic Projection Box */}
              <div className="p-4 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[var(--muted-foreground)]">Recommended Auto-Withholding</span>
                  <Badge variant="vault" className="text-xs font-mono font-bold">
                    {(taxSummary.effectiveRateBps / 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]">
                  <div>
                    <span className="text-[11px] text-[var(--muted-foreground)] block">Annual Tax Liability</span>
                    <MoneyText
                      cents={taxSummary.totalTaxCents}
                      currency={country === 'US' ? 'USD' : 'INR'}
                      className="text-base font-semibold text-[var(--vault-accent)]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-[var(--muted-foreground)] block">Quarterly Set-Aside</span>
                    <MoneyText
                      cents={taxSummary.quarterlyPaymentCents}
                      currency={country === 'US' ? 'USD' : 'INR'}
                      className="text-base font-semibold text-[var(--foreground)]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-[var(--border)] pt-4">
              <Button variant="ghost" onClick={handleBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={handleNext} className="gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                Next: Identity Verification <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* STEP 4: SIMULATED KYC */}
        {currentStep === 4 && (
          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />
                Simulated Partner Bank KYC
              </CardTitle>
              <CardDescription>
                Federal banking regulations require identity verification. In this prototype, verification is simulated instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)] block mb-1.5">Legal Owner Full Name</label>
                  <Input value={legalName} onChange={(e) => setLegalName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--foreground)] block mb-1.5">
                    {country === 'US' ? 'SSN / ITIN (Last 4 digits)' : 'PAN / Aadhaar (Last 4)'}
                  </label>
                  <Input value={idLastFour} onChange={(e) => setIdLastFour(e.target.value)} maxLength={4} />
                </div>
              </div>

              {/* Terminal checklist */}
              {isVerifyingKyc || kycProgress.length > 0 ? (
                <div className="p-4 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)] space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2 text-[var(--primary)] font-semibold mb-2">
                    {isVerifyingKyc && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Compliance Verification Status</span>
                  </div>
                  {kycProgress.map((msg, i) => (
                    <div key={i} className="flex items-center gap-2 text-[var(--foreground)] text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)] flex-shrink-0" />
                      <span>{msg}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-[var(--border)] text-center py-6">
                  <ShieldCheck className="w-8 h-8 text-[var(--muted-foreground)] mx-auto mb-2 opacity-60" />
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Click the button below to simulate BaaS identity screening and account creation.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-[var(--border)] pt-4">
              <Button variant="ghost" onClick={handleBack} disabled={isVerifyingKyc} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              {!isKycPassed ? (
                <Button
                  onClick={runSimulatedKyc}
                  disabled={isVerifyingKyc}
                  className="gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"
                >
                  {isVerifyingKyc ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" /> Verify & Provision
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext} className="gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
                  View Account Numbers <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        )}

        {/* STEP 5: ACCOUNT PROVISIONED & ENTER DASHBOARD */}
        {currentStep === 5 && (
          <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 rounded-full bg-[var(--primary-subtle)] text-[var(--primary)] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold">Your SoloFi Hub is Ready</CardTitle>
              <CardDescription>
                FDIC-insured business accounts and dedicated Tax Vault provisioned via mock BaaS partner.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Account Numbers Box */}
              <div className="p-4 rounded-xl bg-[var(--card-subtle)] border border-[var(--border)] space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center py-1 border-b border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)]">Partner Depository</span>
                  <span className="font-semibold text-[var(--foreground)]">Evolve Bank & Trust (Member FDIC)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)]">Routing Number (ACH/Wire)</span>
                  <span className="font-semibold text-[var(--primary)]">121000358</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)]">Operating Checking</span>
                  <span className="font-semibold text-[var(--foreground)]">{accountInfo?.operatingAccount || '4829 1048 2910'}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-[var(--vault-accent)]" />
                    <span className="text-[var(--muted-foreground)]">Dedicated Tax Vault</span>
                  </div>
                  <span className="font-semibold text-[var(--vault-accent)]">
                    {accountInfo?.taxVaultAccount || '9281 7263 5192'} (Locked)
                  </span>
                </div>
              </div>

              {/* Virtual Card Preview */}
              <div className="p-4 rounded-xl bg-gradient-to-tr from-[var(--surface-elevated)] to-[var(--card)] border border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--foreground)]">SoloFi Commercial Visa</p>
                    <p className="text-[11px] text-[var(--muted-foreground)] font-mono">•••• •••• •••• {accountInfo?.cardLastFour || '8492'}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] text-[var(--primary)] border-[var(--primary)]">
                  Active Virtual
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-4 flex flex-col gap-2">
              <Button
                size="lg"
                className="w-full gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-medium"
                onClick={() => {
                  toast.success('Entering SoloFi Dashboard...');
                  router.push('/dashboard');
                }}
              >
                <span>Launch SoloFi Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>

      {/* Trust Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center py-4 text-xs text-[var(--muted-foreground)]">
        Prototype disclaimer: Simulated BaaS provider. Account and routing numbers are mock data.
      </footer>
    </div>
  );
}
