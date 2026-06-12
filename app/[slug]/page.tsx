import { getNovelBySlug, getAllNovels, getChapters } from '@/lib/sheets';
import {
  getSampleNovels,
  getSampleNovelBySlug,
  getSampleChapters,
  isUsingSampleData,
} from '@/lib/dev-data';
import { ChapterList } from '@/components/chapter-list';
import { FetchError } from '@/components/fetch-error';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';
import type { Novel, Chapter } from '@/lib/types';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    if (isUsingSampleData()) {
      return getSampleNovels().map((n) => ({ slug: n.slug }));
    }
    const novels = await getAllNovels();
    return novels.map((n) => ({ slug: n.slug }));
  } catch {
    return [];
  }
}

export default async function NovelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let novel: Novel | null | undefined;
  let chapters: Chapter[] = [];
  let fetchError = false;

  try {
    novel = isUsingSampleData()
      ? getSampleNovelBySlug(slug)
      : await getNovelBySlug(slug);
  } catch {
    fetchError = true;
  }

  if (fetchError || !novel) {
    if (!fetchError && !novel) notFound();
    return (
      <main className="container mx-auto px-4 py-8">
        <FetchError message="Failed to load novel data. Please try again later." />
      </main>
    );
  }

  try {
    chapters = isUsingSampleData()
      ? getSampleChapters(novel.chapters_sheet_id)
      : await getChapters(novel.chapters_sheet_id);
  } catch {
    chapters = [];
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        {novel.cover_url && (
          <img
            src={novel.cover_url}
            alt={novel.title}
            className="w-48 h-72 object-cover rounded-lg shadow shrink-0"
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
              <Badge key={g} variant="outline">
                {g}
              </Badge>
            ))}
          </div>
          <p className="max-w-xl text-muted-foreground">{novel.description}</p>
        </div>
      </div>
      <ChapterList chapters={chapters} novelSlug={novel.slug} />
    </main>
  );
}
