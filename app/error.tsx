'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (error.digest) console.error('digest:', error.digest);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground">
          We ran into a problem loading this page. This is likely temporary — try again.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/60 font-mono">Ref: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
