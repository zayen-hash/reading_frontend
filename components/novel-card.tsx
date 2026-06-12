import Link from 'next/link';
import type { Novel } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export function NovelCard({ novel }: { novel: Novel }) {
  return (
    <Link href={`/${novel.slug}`} className="group block">
      <div className="aspect-2/3 overflow-hidden rounded-lg mb-2 bg-muted">
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
