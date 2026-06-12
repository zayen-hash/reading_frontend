# Novel Translation Site — Full Build Spec (Public Sheets/Docs, No Auth)

## Stack
- Next.js 15 App Router, no `src/` directory (files at project root)
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui
- No database, no Google API credentials — all data fetched via public URLs
- Deploy target: Vercel

---

## Environment Variables

Create `.env.local`:

```env
# The main novels spreadsheet ID (from URL: docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit)
NOVELS_SHEET_ID=your_main_spreadsheet_id

# Site metadata
NEXT_PUBLIC_SITE_NAME="Your Site Name"
NEXT_PUBLIC_SITE_DESCRIPTION="Read translated novels"
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX

# For manual cache revalidation
REVALIDATE_SECRET=some_random_string
```

**Important:** The Sheets and Docs must be set to "Anyone with the link can view" in their share settings. No API key needed — we use the public CSV/export endpoints.

---

## How Public Fetching Works (No SDK, No Auth)

### Google Sheets → CSV endpoint
For any public sheet, you can fetch its data as CSV:
```
https://docs.google.com/spreadsheets/d/SHEET_ID/gviz/tq?tqx=out:csv&sheet=TAB_NAME
```
This returns raw CSV. Parse it with a simple CSV parser.

### Google Docs → HTML export endpoint
For any public Google Doc:
```
https://docs.google.com/document/d/DOC_ID/export?format=html
```
This returns a full HTML document. Strip the `<head>` and grab only the `<body>` content.

**Neither URL is ever sent to the client.** All fetches happen in Server Components. The browser only receives rendered HTML.

---

## npm packages to install

```bash
npm install @tailwindcss/typography
```

No `googleapis` package needed. CSV parsing is done manually (see below). No other extra dependencies.

Tailwind v4 typography plugin in `globals.css`:
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

---

## Google Sheets Structure

### Main Sheet (`NOVELS_SHEET_ID`)
Tab name: `novels`

| Col | Header | Description |
|-----|--------|-------------|
| A | `slug` | URL-safe ID e.g. `the-great-mage` |
| B | `title` | Display title |
| C | `author` | Original author name |
| D | `description` | Short synopsis |
| E | `cover_url` | Public image URL |
| F | `status` | `ongoing` or `completed` |
| G | `genre` | Comma-separated e.g. `Fantasy, Action` |
| H | `chapters_sheet_id` | Sheet ID of this novel's chapter index |
| I | `published` | `true` or `false` |

### Chapter Index Sheet (one per novel, ID stored in column H)
Tab name: `chapters`

| Col | Header | Description |
|-----|--------|-------------|
| A | `chapter_number` | Integer e.g. `1` |
| B | `title` | e.g. `Chapter 1: The Beginning` |
| C | `docs_id` | Google Doc ID |
| D | `published` | `true` or `false` |
| E | `published_at` | ISO date e.g. `2025-06-01` |

---

## TypeScript Types (`lib/types.ts`)

```typescript
export interface Novel {
  slug: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  status: 'ongoing' | 'completed';
  genre: string[];
  chapters_sheet_id: string;
  published: boolean;
}

export interface Chapter {
  chapter_number: number;
  title: string;
  docs_id: string;
  published: boolean;
  published_at: string;
}
```

---

## Data Fetching Library (`lib/sheets.ts`)

No SDK. Just `fetch` + CSV parsing.

```typescript
import type { Novel, Chapter } from './types';

// Parse a CSV string into rows of string arrays.
// Handles quoted fields with commas inside them.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols: string[] = [];
    let inQuote = false;
    let current = '';
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') { current += '"'; i++; }
        else inQuote = !inQuote;
      } else if (ch === ',' && !inQuote) {
        cols.push(current); current = '';
      } else {
        current += ch;
      }
    }
    cols.push(current);
    rows.push(cols);
  }
  return rows;
}

function sheetCsvUrl(sheetId: string, tabName: string): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
}

export async function getAllNovels(): Promise<Novel[]> {
  const url = sheetCsvUrl(process.env.NOVELS_SHEET_ID!, 'novels');
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch novels sheet: ${res.status}`);
  const text = await res.text();
  const [, ...rows] = parseCsv(text); // skip header row

  return rows
    .map((row) => ({
      slug: row[0]?.trim(),
      title: row[1]?.trim(),
      author: row[2]?.trim(),
      description: row[3]?.trim(),
      cover_url: row[4]?.trim(),
      status: (row[5]?.trim() ?? 'ongoing') as 'ongoing' | 'completed',
      genre: row[6]?.split(',').map((g) => g.trim()).filter(Boolean) ?? [],
      chapters_sheet_id: row[7]?.trim(),
      published: row[8]?.trim() === 'true',
    }))
    .filter((n) => n.slug && n.published);
}

export async function getNovelBySlug(slug: string): Promise<Novel | null> {
  const novels = await getAllNovels();
  return novels.find((n) => n.slug === slug) ?? null;
}

export async function getChapters(chaptersSheetId: string): Promise<Chapter[]> {
  const url = sheetCsvUrl(chaptersSheetId, 'chapters');
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch chapters sheet: ${res.status}`);
  const text = await res.text();
  const [, ...rows] = parseCsv(text);

  return rows
    .map((row) => ({
      chapter_number: parseInt(row[0]?.trim(), 10),
      title: row[1]?.trim(),
      docs_id: row[2]?.trim(),
      published: row[3]?.trim() === 'true',
      published_at: row[4]?.trim() ?? '',
    }))
    .filter((c) => c.docs_id && c.published && !isNaN(c.chapter_number))
    .sort((a, b) => a.chapter_number - b.chapter_number);
}
```

---

## Google Docs Fetching (`lib/docs.ts`)

```typescript
export async function getDocAsHtml(docsId: string): Promise<string> {
  const url = `https://docs.google.com/document/d/${docsId}/export?format=html`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch doc ${docsId}: ${res.status}`);

  const fullHtml = await res.text();

  // Extract only the <body> content — strip Google's <head> with styles/scripts
  const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : fullHtml;

  // Remove inline styles and class attributes Google injects
  // (Tailwind prose will handle typography instead)
  const cleaned = bodyContent
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/\sclass="[^"]*"/g, '')
    .replace(/\sid="[^"]*"/g, '')
    .replace(/<a\s[^>]*href="([^"]*)"[^>]*>/g, '<a href="$1">')  // clean link attrs
    .replace(/<span>/g, '')         // remove empty spans
    .replace(/<\/span>/g, '')
    .trim();

  return cleaned;
}
```

---

## Project File Structure

```
├── app/
│   ├── layout.tsx                  # Root layout with AdSense script
│   ├── page.tsx                    # Homepage: novel grid
│   ├── globals.css
│   ├── not-found.tsx               # Custom 404
│   ├── [slug]/
│   │   ├── page.tsx               # Novel detail + chapter list
│   │   └── [chapter]/
│   │       └── page.tsx           # Chapter reader
│   └── api/
│       └── revalidate/
│           └── route.ts           # Manual revalidation webhook
├── components/
│   ├── novel-card.tsx
│   ├── chapter-list.tsx
│   ├── chapter-reader.tsx
│   ├── ad-unit.tsx
│   ├── site-header.tsx
│   └── site-footer.tsx
└── lib/
    ├── sheets.ts                   # Sheets CSV fetching
    ├── docs.ts                     # Docs HTML fetching
    └── types.ts
```

---

## Page Implementations

### Homepage (`app/page.tsx`)

```typescript
import { getAllNovels } from '@/lib/sheets';
import { NovelCard } from '@/components/novel-card';

export const revalidate = 3600;

export default async function HomePage() {
  const novels = await getAllNovels();
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Novels</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {novels.map((novel) => (
          <NovelCard key={novel.slug} novel={novel} />
        ))}
      </div>
    </main>
  );
}
```

### Novel Detail Page (`app/[slug]/page.tsx`)

```typescript
import { getNovelBySlug, getAllNovels, getChapters } from '@/lib/sheets';
import { ChapterList } from '@/components/chapter-list';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export const revalidate = 3600;

export async function generateStaticParams() {
  const novels = await getAllNovels();
  return novels.map((n) => ({ slug: n.slug }));
}

export default async function NovelPage({ params }: { params: { slug: string } }) {
  const novel = await getNovelBySlug(params.slug);
  if (!novel) notFound();

  const chapters = await getChapters(novel.chapters_sheet_id);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {novel.cover_url && (
          <img
            src={novel.cover_url}
            alt={novel.title}
            className="w-48 h-72 object-cover rounded-lg shadow flex-shrink-0"
          />
        )}
        <div>
          <h1 className="text-4xl font-bold mb-2">{novel.title}</h1>
          <p className="text-muted-foreground mb-3">by {novel.author}</p>
          <div className="flex gap-2 flex-wrap mb-4">
            <Badge variant={novel.status === 'ongoing' ? 'default' : 'secondary'}>
              {novel.status}
            </Badge>
            {novel.genre.map((g) => (
              <Badge key={g} variant="outline">{g}</Badge>
            ))}
          </div>
          <p className="max-w-xl text-muted-foreground">{novel.description}</p>
        </div>
      </div>
      <ChapterList chapters={chapters} novelSlug={novel.slug} />
    </main>
  );
}
```

### Chapter Reader Page (`app/[slug]/[chapter]/page.tsx`)

```typescript
import { getNovelBySlug, getChapters } from '@/lib/sheets';
import { getDocAsHtml } from '@/lib/docs';
import { AdUnit } from '@/components/ad-unit';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 3600;

// Don't pre-render chapters at build time — render on first request then cache
export const dynamicParams = true;
export async function generateStaticParams() { return []; }

export default async function ChapterPage({
  params,
}: {
  params: { slug: string; chapter: string };
}) {
  const novel = await getNovelBySlug(params.slug);
  if (!novel) notFound();

  const chapters = await getChapters(novel.chapters_sheet_id);
  const chapterNum = parseInt(params.chapter, 10);
  const chapter = chapters.find((c) => c.chapter_number === chapterNum);
  if (!chapter) notFound();

  const html = await getDocAsHtml(chapter.docs_id);

  const prevChapter = chapters.find((c) => c.chapter_number === chapterNum - 1);
  const nextChapter = chapters.find((c) => c.chapter_number === chapterNum + 1);

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:underline">Home</Link>
        {' / '}
        <Link href={`/${novel.slug}`} className="hover:underline">{novel.title}</Link>
        {' / '}
        <span>{chapter.title}</span>
      </div>

      <h1 className="text-2xl font-bold mb-8">{chapter.title}</h1>

      {/* Top ad */}
      <AdUnit slot="YOUR_TOP_AD_SLOT_ID" />

      {/* Chapter content — Google Doc HTML rendered with Tailwind prose */}
      <article
        className="prose prose-lg dark:prose-invert max-w-none my-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Bottom ad */}
      <AdUnit slot="YOUR_BOTTOM_AD_SLOT_ID" />

      {/* Chapter navigation */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t">
        {prevChapter ? (
          <Link
            href={`/${novel.slug}/${prevChapter.chapter_number}`}
            className="text-sm underline underline-offset-4"
          >
            ← {prevChapter.title}
          </Link>
        ) : <span />}
        {nextChapter ? (
          <Link
            href={`/${novel.slug}/${nextChapter.chapter_number}`}
            className="text-sm underline underline-offset-4"
          >
            {nextChapter.title} →
          </Link>
        ) : <span />}
      </div>
    </main>
  );
}
```

---

## Components

### `components/novel-card.tsx`
```typescript
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { Novel } from '@/lib/types';

export function NovelCard({ novel }: { novel: Novel }) {
  return (
    <Link href={`/${novel.slug}`} className="group block">
      <div className="aspect-[2/3] overflow-hidden rounded-lg mb-2 bg-muted">
        {novel.cover_url ? (
          <img
            src={novel.cover_url}
            alt={novel.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs p-2 text-center">
            {novel.title}
          </div>
        )}
      </div>
      <p className="font-medium text-sm leading-tight line-clamp-2 mb-1">{novel.title}</p>
      <Badge variant="outline" className="text-xs">{novel.status}</Badge>
    </Link>
  );
}
```

### `components/chapter-list.tsx`
```typescript
import Link from 'next/link';
import type { Chapter } from '@/lib/types';

export function ChapterList({ chapters, novelSlug }: { chapters: Chapter[]; novelSlug: string }) {
  if (chapters.length === 0) {
    return <p className="text-muted-foreground">No chapters published yet.</p>;
  }
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Chapters ({chapters.length})</h2>
      <div className="divide-y rounded-lg border">
        {chapters.map((ch) => (
          <Link
            key={ch.chapter_number}
            href={`/${novelSlug}/${ch.chapter_number}`}
            className="flex justify-between items-center px-4 py-3 hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm">{ch.title}</span>
            <span className="text-xs text-muted-foreground shrink-0 ml-4">{ch.published_at}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

### `components/ad-unit.tsx`
```typescript
'use client';
import { useEffect } from 'react';

declare global {
  interface Window { adsbygoogle: unknown[]; }
}

export function AdUnit({ slot }: { slot: string }) {
  useEffect(() => {
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {}
  }, []);

  return (
    <div className="my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
```

### `app/layout.tsx`
```typescript
import type { Metadata } from 'next';
import Script from 'next/script';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import './globals.css';

export const metadata: Metadata = {
  title: { default: process.env.NEXT_PUBLIC_SITE_NAME!, template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME}` },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
```

### `components/site-header.tsx`
```typescript
import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-14 flex items-center">
        <Link href="/" className="font-bold text-lg">
          {process.env.NEXT_PUBLIC_SITE_NAME}
        </Link>
      </div>
    </header>
  );
}
```

### `components/site-footer.tsx`
```typescript
export function SiteFooter() {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        All translations are fan-made and not for profit.
      </div>
    </footer>
  );
}
```

---

## Manual Revalidation Route (`app/api/revalidate/route.ts`)

Call this after publishing a new chapter to instantly refresh the cache without redeploying.

```typescript
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  revalidatePath('/', 'layout'); // nukes all cached pages
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
```

Usage after publishing:
```bash
curl -X POST "https://your-site.vercel.app/api/revalidate?secret=YOUR_SECRET"
```

---

## Vercel Deployment Steps

1. Push project to GitHub
2. Go to vercel.com → New Project → Import repo
3. Framework Preset: **Next.js** (auto-detected)
4. Add Environment Variables (copy from `.env.local`):
   - `NOVELS_SHEET_ID`
   - `NEXT_PUBLIC_SITE_NAME`
   - `NEXT_PUBLIC_SITE_DESCRIPTION`
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
   - `REVALIDATE_SECRET`
5. Deploy

No build command changes needed. Vercel runs `next build` automatically.

---

## Rules for the AI Agent

- All Google Sheet/Doc fetches happen **server-side only** — in Server Components or `lib/` functions called from them. Never in `'use client'` components.
- The Doc ID and Sheet IDs must **never appear in client-rendered HTML or JS bundles**. They are server-only env vars or intermediate values.
- Use `fetch` with `{ next: { revalidate: 3600 } }` on every external fetch — this is how Next.js ISR caching works with `fetch`.
- Do **not** install `googleapis` — not needed.
- Do **not** use `pages/` directory — App Router only.
- Do **not** add `'use client'` to any page — pages are Server Components. Only `AdUnit` is a Client Component.
- Chapter pages use `dynamicParams = true` and empty `generateStaticParams` — they render on first request and get cached, not pre-built at deploy time (avoids build-time fetching every chapter doc).