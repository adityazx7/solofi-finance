import * as React from 'react';
import { MarketingHeader } from '@/features/marketing/components/marketing-header';
import { MarketingFooter } from '@/features/marketing/components/marketing-footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MarketingHeader />
      <div className="flex-1">{children}</div>
      <MarketingFooter />
    </div>
  );
}
