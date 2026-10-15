import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/80 bg-secondary/30 text-muted-foreground text-xs">
      {/* Regulatory Prototype Warning Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-3 px-6 text-center text-xs font-semibold text-amber-800 dark:text-amber-300">
        ⚠️ Prototype Demonstration Platform — No real money moves. Banking and BaaS operations are simulated.
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              S
            </div>
            <span className="font-bold text-base text-foreground tracking-tight">SoloFi</span>
          </div>
          <p className="text-xs leading-relaxed max-w-xs">
            The automated financial hub for freelancers, solopreneurs, and micro-businesses. Banking with native bookkeeping and auto-tax withholding.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Product</h4>
          <ul className="space-y-1.5">
            <li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
            <li><a href="#features" className="hover:text-foreground">Feature Bento</a></li>
            <li><a href="#estimator" className="hover:text-foreground">Tax Estimator</a></li>
            <li><a href="#comparison" className="hover:text-foreground">Compare vs QuickBooks</a></li>
            <li><Link href="/design" className="hover:text-foreground">Design System (/design)</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Security & Legal</h4>
          <ul className="space-y-1.5">
            <li><Link href="/security" className="hover:text-foreground">Trust & Security Center</Link></li>
            <li><span className="hover:text-foreground cursor-pointer">Privacy Policy (Placeholder)</span></li>
            <li><span className="hover:text-foreground cursor-pointer">Terms of Service (Placeholder)</span></li>
            <li><span className="hover:text-foreground cursor-pointer">Partner Bank Disclosures</span></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Admin & Oversight</h4>
          <ul className="space-y-1.5">
            <li><Link href="/admin/waitlist" className="hover:text-foreground font-mono">/admin/waitlist (250 Goal Tracker)</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 py-6 px-6 text-center text-[11px] leading-relaxed max-w-5xl mx-auto space-y-2">
        <p>
          SoloFi is a financial technology company and is not a bank. Simulated banking services provided by our BaaS partner bank, Member FDIC. The SoloFi Visa® Debit Card is issued by our partner bank pursuant to a license from Visa U.S.A. Inc.
        </p>
        <p className="opacity-75">
          Tax estimates, liability calculations, and withholding percentages are for computational planning only and do not constitute certified tax advice. Consult a licensed CPA for formal filings.
        </p>
        <p className="pt-2">
          © {new Date().getFullYear()} SoloFi Technologies Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
