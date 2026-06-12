import Link from 'next/link';
import type { Chapter } from '@/lib/types';

export function ChapterList({
  chapters,
  novelSlug,
}: {
  chapters: Chapter[];
  novelSlug: string;
}) {
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
            <span className="text-xs text-muted-foreground shrink-0 ml-4">
              {ch.published_at}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
