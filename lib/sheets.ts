import type { Novel, Chapter } from './types';

function toLowerCase(str: string | undefined): string {
    return str?.toLowerCase() ?? '';
}

function toGoogleId(str: string | undefined): string | undefined {
    if (!str) return undefined;
    const match = str.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : str;
}

/**
 * Parse a CSV string into rows of string arrays.
 * Handles quoted fields with commas and escaped quotes inside them.
 */
export function parseCsv(text: string): string[][] {
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
                if (inQuote && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuote = !inQuote;
                }
            } else if (ch === ',' && !inQuote) {
                cols.push(current);
                current = '';
            } else {
                current += ch;
            }
        }
        cols.push(current);
        rows.push(cols);
    }
    return rows;
}

/**
 * Build the public CSV export URL for a Google Sheet tab.
 */
export function sheetCsvUrl(sheetId: string, tabName: string): string {
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
}

/**
 * Fetch and parse all published novels from the main sheet.
 * Returns an empty array when NOVELS_SHEET_ID is not configured.
 */
export async function getAllNovels(sheetId?: string): Promise<Novel[]> {
    let id = sheetId ?? process.env.NOVELS_SHEET_ID;
    id = toGoogleId(id);
    if (!id) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('NOVELS_SHEET_ID is not set — using sample data instead');
        }
        return [];
    }
    const url = sheetCsvUrl(id, 'novels');
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Failed to fetch novels sheet: ${res.status}`);
    const text = await res.text();
    const [, ...rows] = parseCsv(text);

    return rows
        .map((row) => ({
            slug: row[0]?.trim() ?? '',
            title: row[1]?.trim() ?? '',
            author: row[2]?.trim() ?? '',
            description: row[3]?.trim() ?? '',
            cover_url: row[4]?.trim() ?? '',
            status: (row[5]?.trim() ?? 'ongoing') as 'ongoing' | 'completed',
            genre: row[6]?.split(',').map((g) => g.trim()).filter(Boolean) ?? [],
            chapters_sheet_id: toGoogleId(row[7]?.trim()) ?? '',
            published: toLowerCase(row[8]) === 'true',
        }))
        .filter((n) => n.slug && n.published);
}

/**
 * Fetch a single novel by its slug.
 */
export async function getNovelBySlug(slug: string, sheetId?: string): Promise<Novel | null> {
    const novels = await getAllNovels(sheetId);
    return novels.find((n) => n.slug === slug) ?? null;
}

/**
 * Fetch and parse chapters from a novel's chapter index sheet.
 */
export async function getChapters(chaptersSheetId: string): Promise<Chapter[]> {
    const url = sheetCsvUrl(chaptersSheetId, 'chapters');
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Failed to fetch chapters sheet: ${res.status}`);
    const text = await res.text();
    const [, ...rows] = parseCsv(text);

    return rows
        .map((row) => ({
            chapter_number: parseInt(row[0]?.trim(), 10),
            title: row[1]?.trim() ?? '',
            docs_id: toGoogleId(row[2]?.trim()) ?? '',
            published: toLowerCase(row[3]) === 'true',
            published_at: row[4]?.trim() ?? '',
        }))
        .filter((c) => c.docs_id && c.published && !isNaN(c.chapter_number))
        .sort((a, b) => a.chapter_number - b.chapter_number);
}
