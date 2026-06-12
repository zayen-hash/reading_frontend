'use client';

import '../app/globals.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center space-y-6 px-4">
            <h1 className="text-3xl font-semibold">App failed to load</h1>
            <p className="text-muted-foreground">
              A critical error occurred. Please try again or go home.
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground/60 font-mono">Ref: {error.digest}</p>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center rounded-2xl border border-transparent bg-primary text-primary-foreground text-sm font-medium h-8 px-3"
              >
                Try Again
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-border bg-background text-sm font-medium h-8 px-3"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
