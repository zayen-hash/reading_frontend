import Link from 'next/link';

export function SiteHeader() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Novel Translations';

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-14 flex items-center">
        <Link href="/" className="font-bold text-lg">
          {siteName}
        </Link>
      </div>
    </header>
  );
}
