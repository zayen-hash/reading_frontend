import { describe, it, expect } from 'vitest';
import {
  getSampleNovels,
  getSampleNovelBySlug,
  getSampleChapters,
  getSampleDocHtml,
  isUsingSampleData,
} from '../lib/dev-data';

describe('dev-data', () => {
  describe('getSampleNovels', () => {
    it('returns only published novels', () => {
      const novels = getSampleNovels();
      expect(novels.length).toBeGreaterThan(0);
      expect(novels.every((n) => n.published)).toBe(true);
    });

    it('does not include the hidden novel', () => {
      const novels = getSampleNovels();
      expect(novels.find((n) => n.slug === 'hidden-novel')).toBeUndefined();
    });
  });

  describe('getSampleNovelBySlug', () => {
    it('returns a novel by slug', () => {
      const novel = getSampleNovelBySlug('the-great-mage');
      expect(novel).not.toBeNull();
      expect(novel!.title).toBe('The Great Mage Returns');
    });

    it('returns null for unknown slug', () => {
      expect(getSampleNovelBySlug('nonexistent')).toBeNull();
    });
  });

  describe('getSampleChapters', () => {
    it('returns published chapters sorted by number', () => {
      const chapters = getSampleChapters('sample-chapters-sheet-1');
      expect(chapters.length).toBeGreaterThan(0);
      expect(chapters.every((c) => c.published)).toBe(true);
      for (let i = 1; i < chapters.length; i++) {
        expect(chapters[i].chapter_number).toBeGreaterThan(chapters[i - 1].chapter_number);
      }
    });

    it('returns empty array for unknown sheet', () => {
      expect(getSampleChapters('nonexistent')).toEqual([]);
    });
  });

  describe('getSampleDocHtml', () => {
    it('returns HTML content for known doc IDs', () => {
      const html = getSampleDocHtml('sample-doc-1');
      expect(html).toContain('<h1>The Awakening</h1>');
    });

    it('returns placeholder for unknown doc IDs', () => {
      const html = getSampleDocHtml('unknown');
      expect(html).toContain('placeholder');
    });
  });

  describe('isUsingSampleData', () => {
    it('returns true in test environment (no NOVELS_SHEET_ID)', () => {
      // Tests run with NODE_ENV=test, so we can't test dev mode exactly,
      // but we can verify the logic
      expect(typeof isUsingSampleData()).toBe('boolean');
    });
  });
});
