import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="relative mx-auto w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
          <img
            src="/assets/illustrations/404-error-illustration.png"
            alt="Page not found"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
            Error 404 — Record Missing
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            This financial route doesn't exist
          </h1>
          <p className="text-sm text-muted-foreground">
            The page or account ledger view you requested could not be located.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button asChild variant="default" className="w-full sm:w-auto gap-2">
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Marketing Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
