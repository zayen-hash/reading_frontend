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
