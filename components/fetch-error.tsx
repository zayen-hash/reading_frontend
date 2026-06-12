import Link from 'next/link';

export function FetchError({
  message = 'Failed to load data. Please try again later.',
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">{message}</p>
        <Link href="/" className="text-sm underline underline-offset-4">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
