/**
 * Dev-mode helpers. When no Google Sheets are configured,
 * fall back to bundled sample data so you can develop and test locally.
 */
import type { Novel, Chapter } from './types';
import { SAMPLE_NOVELS, SAMPLE_CHAPTERS, SAMPLE_DOC_HTML } from './sample-data';

export function isUsingSampleData(): boolean {
  return process.env.NODE_ENV === 'development' && !process.env.NOVELS_SHEET_ID;
}

export function getSampleNovels(): Novel[] {
  return SAMPLE_NOVELS.filter((n) => n.published);
}

export function getSampleNovelBySlug(slug: string): Novel | null {
  return SAMPLE_NOVELS.find((n) => n.slug === slug) ?? null;
}

export function getSampleChapters(chaptersSheetId: string): Chapter[] {
  const chapters = SAMPLE_CHAPTERS[chaptersSheetId] ?? [];
  return chapters
    .filter((c) => c.published)
    .sort((a, b) => a.chapter_number - b.chapter_number);
}

export function getSampleDocHtml(docsId: string): string {
  return (
    SAMPLE_DOC_HTML[docsId] ??
    `<h1>Sample Chapter</h1><p>This is a placeholder chapter. Content coming soon.</p>`
  );
}
