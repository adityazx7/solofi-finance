'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { waitlistFormSchema, type WaitlistFormInput } from '../schemas/waitlist-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Sparkles, CheckCircle2, Copy, Share2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successData, setSuccessData] = React.useState<{
    queuePosition: number;
    referralCode: string;
    referralLink: string;
    alreadyRegistered?: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WaitlistFormInput>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      role: 'freelancer',
      monthlyIncomeBand: '$5k-$10k',
    },
  });

  const selectedRole = watch('role');

  // Check URL params for referral code or UTM tags
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) setValue('referredByCode', ref);

      const utmSource = params.get('utm_source');
      if (utmSource) setValue('utmSource', utmSource);

      const utmMedium = params.get('utm_medium');
      if (utmMedium) setValue('utmMedium', utmMedium);

      const utmCampaign = params.get('utm_campaign');
      if (utmCampaign) setValue('utmCampaign', utmCampaign);
    }
  }, [setValue]);

  const onSubmit = async (data: WaitlistFormInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Error joining waitlist');
      }

      setSuccessData(json);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#F59E0B', '#3B82F6'],
      });
      toast.success(json.alreadyRegistered ? 'Welcome back!' : 'You are on the waitlist!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralLink = () => {
    if (!successData?.referralLink) return;
    navigator.clipboard.writeText(successData.referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  if (successData) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-card p-6 sm:p-8 text-center space-y-5 shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <div className="space-y-1">
          <Badge variant="vault" size="sm" className="mb-1">
            Waitlist Confirmed
          </Badge>
          <h3 className="text-2xl font-bold tracking-tight">You're #{successData.queuePosition} in Line</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {successData.message} Share your exclusive invite link to jump ahead 5 spots for every friend who joins.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-secondary/60 p-3 flex items-center justify-between gap-2 max-w-md mx-auto">
          <span className="font-mono text-xs truncate select-all text-muted-foreground">
            {successData.referralLink}
          </span>
          <Button size="sm" variant="default" onClick={copyReferralLink} className="gap-1.5 shrink-0">
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSuccessData(null)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Register another email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-border bg-card p-6 sm:p-8 text-left space-y-6 shadow-sm"
    >
      <div className="space-y-1">
        <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
          Join the Priority Access Waitlist
          <Sparkles className="h-4 w-4 text-emerald-500" />
        </h3>
        <p className="text-xs text-muted-foreground">
          Join 250+ independent builders eliminating tax surprise forever.
        </p>
      </div>

      {/* Role Picker Pills */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
          What describes your work best?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'freelancer', label: 'Freelancer' },
            { id: 'solopreneur', label: 'Solopreneur' },
            { id: 'micro_business', label: 'Micro-Business' },
            { id: 'startup_founder', label: 'Startup Founder' },
          ].map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setValue('role', role.id as any)}
              className={`rounded-xl px-3 py-2 text-xs font-medium border text-center transition-all ${
                selectedRole === role.id
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold shadow-2xs'
                  : 'border-border/70 bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
        {errors.role && <p className="text-xs text-rose-500">{errors.role.message}</p>}
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
          Your Email Address
        </label>
        <Input
          type="email"
          placeholder="elena@vancestudio.design"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      {/* Monthly Income Band */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
          Average Monthly Revenue
        </label>
        <select
          {...register('monthlyIncomeBand')}
          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <option value="Under $2k">Under $2,000 / month</option>
          <option value="$2k-$5k">$2,000 – $5,000 / month</option>
          <option value="$5k-$10k">$5,000 – $10,000 / month</option>
          <option value="$10k-$20k">$10,000 – $20,000 / month</option>
          <option value="$20k+">$20,000+ / month</option>
        </select>
        {errors.monthlyIncomeBand && (
          <p className="text-xs text-rose-500">{errors.monthlyIncomeBand.message}</p>
        )}
      </div>

      {/* Biggest Tax Worry (Optional) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            What is your biggest tax worry?
          </label>
          <span className="text-[10px] text-muted-foreground">Optional</span>
        </div>
        <Input
          placeholder="e.g. Forgetting quarterly estimated tax, or mixing personal spend"
          {...register('biggestTaxWorry')}
          error={errors.biggestTaxWorry?.message}
        />
      </div>

      <Button type="submit" size="lg" className="w-full gap-2" isLoading={isSubmitting}>
        Join the Priority Waitlist
        <ArrowRight className="h-4 w-4" />
      </Button>

      <p className="text-[11px] text-center text-muted-foreground">
        🔒 We respect your privacy. No spam. Prototype platform — no real money moves.
      </p>
    </form>
  );
}
