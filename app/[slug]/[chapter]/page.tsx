import { getNovelBySlug, getChapters } from '@/lib/sheets';
import { getDocAsHtml } from '@/lib/docs';
import {
  getSampleNovelBySlug,
  getSampleChapters,
  getSampleDocHtml,
  isUsingSampleData,
} from '@/lib/dev-data';
import { AdUnit } from '@/components/ad-unit';
import { FetchError } from '@/components/fetch-error';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Novel, Chapter } from '@/lib/types';

export const revalidate = 3600;

// Don't pre-render chapters — render on first request then cache
export const dynamicParams = true;

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter: chapterParam } = await params;

  const chapterNum = parseInt(chapterParam, 10);
  if (isNaN(chapterNum)) notFound();

  let novel: Novel | null | undefined;
  let chapters: Chapter[] = [];
  let chapter: Chapter | undefined;
  let html: string;

  // Fetch novel
  try {
    novel = isUsingSampleData()
      ? getSampleNovelBySlug(slug)
      : await getNovelBySlug(slug);
  } catch {
    return (
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <FetchError message="Failed to load this chapter. Please try again later." />
      </main>
    );
  }
  if (!novel) notFound();

  // Fetch chapters
  try {
    chapters = isUsingSampleData()
      ? getSampleChapters(novel.chapters_sheet_id)
      : await getChapters(novel.chapters_sheet_id);
  } catch {
    return (
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <FetchError message="Failed to load chapter list. Please try again later." />
      </main>
    );
  }

  chapter = chapters.find((c) => c.chapter_number === chapterNum);
  if (!chapter) notFound();

  // Fetch chapter content
  try {
    html = isUsingSampleData()
      ? getSampleDocHtml(chapter.docs_id)
      : await getDocAsHtml(chapter.docs_id);
  } catch {
    return (
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <FetchError message="Failed to load chapter content. Please try again later." />
      </main>
    );
  }

  const prevChapter = chapters.find((c) => c.chapter_number === chapterNum - 1);
  const nextChapter = chapters.find((c) => c.chapter_number === chapterNum + 1);

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        {' / '}
        <Link href={`/${novel.slug}`} className="hover:underline">
          {novel.title}
        </Link>
        {' / '}
        <span>{chapter.title}</span>
      </div>

      <h1 className="text-2xl font-bold mb-8">{chapter.title}</h1>

      {/* Top ad */}
      <AdUnit slot="TOP_AD_SLOT" />

      {/* Chapter content */}
      <article
        className="prose prose-lg dark:prose-invert max-w-none my-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Bottom ad */}
      <AdUnit slot="BOTTOM_AD_SLOT" />

      {/* Chapter navigation */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t">
        {prevChapter ? (
          <Link
            href={`/${novel.slug}/${prevChapter.chapter_number}`}
            className="text-sm underline underline-offset-4"
          >
            ← {prevChapter.title}
          </Link>
        ) : (
          <span />
        )}
        {nextChapter ? (
          <Link
            href={`/${novel.slug}/${nextChapter.chapter_number}`}
            className="text-sm underline underline-offset-4"
          >
            {nextChapter.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
