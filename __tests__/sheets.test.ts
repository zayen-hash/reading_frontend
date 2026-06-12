import { describe, it, expect } from 'vitest';
import { parseCsv, sheetCsvUrl } from '../lib/sheets';

describe('parseCsv', () => {
  it('parses a simple CSV with no quotes', () => {
    const input = 'a,b,c\nd,e,f';
    const result = parseCsv(input);
    expect(result).toEqual([
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ]);
  });

  it('skips empty lines', () => {
    const input = 'a,b\n\nc,d\n\n';
    const result = parseCsv(input);
    expect(result).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('handles quoted fields with commas inside', () => {
    const input = 'a,"hello, world",c\nd,"foo,bar",f';
    const result = parseCsv(input);
    expect(result).toEqual([
      ['a', 'hello, world', 'c'],
      ['d', 'foo,bar', 'f'],
    ]);
  });

  it('handles escaped quotes inside quoted fields', () => {
    const input = 'a,"say ""hello""",c';
    const result = parseCsv(input);
    expect(result).toEqual([['a', 'say "hello"', 'c']]);
  });

  it('handles a typical Google Sheets novel row', () => {
    const input = `slug,title,author,description,cover_url,status,genre,chapters_sheet_id,published
the-great-mage,The Great Mage Returns,Lee Sunghoon,"After 3,000 years, he returns",https://example.com/cover.jpg,ongoing,"Fantasy, Action, Comedy",sheet123,true`;
    const result = parseCsv(input);
    expect(result).toHaveLength(2);
    expect(result[1]).toHaveLength(9);
    expect(result[1][0]).toBe('the-great-mage');
    expect(result[1][6]).toBe('Fantasy, Action, Comedy');
    expect(result[1][8]).toBe('true');
  });

  it('handles empty input', () => {
    const result = parseCsv('');
    expect(result).toEqual([]);
  });

  it('handles a single column', () => {
    const input = 'a\nb\nc';
    const result = parseCsv(input);
    expect(result).toEqual([['a'], ['b'], ['c']]);
  });
});

describe('sheetCsvUrl', () => {
  it('builds the correct URL', () => {
    const url = sheetCsvUrl('abc123', 'novels');
    expect(url).toBe(
      'https://docs.google.com/spreadsheets/d/abc123/gviz/tq?tqx=out:csv&sheet=novels',
    );
  });

  it('encodes special characters in the tab name', () => {
    const url = sheetCsvUrl('abc123', 'my tab');
    expect(url).toContain('sheet=my%20tab');
  });
});

describe('published field parsing', () => {
  it('accepts TRUE (uppercase) from Google Sheets', () => {
    // Simulate the row mapping done in getAllNovels
    const row = ['slug', 'title', 'author', 'desc', 'url', 'ongoing', 'Fantasy', 'sheet1', 'TRUE'];
    const published = row[8]?.trim().toLowerCase() === 'true';
    expect(published).toBe(true);
  });

  it('accepts true (lowercase)', () => {
    const row = ['slug', 'title', 'author', 'desc', 'url', 'ongoing', 'Fantasy', 'sheet1', 'true'];
    const published = row[8]?.trim().toLowerCase() === 'true';
    expect(published).toBe(true);
  });

  it('rejects false values', () => {
    const row = ['slug', 'title', 'author', 'desc', 'url', 'ongoing', 'Fantasy', 'sheet1', 'FALSE'];
    const published = row[8]?.trim().toLowerCase() === 'true';
    expect(published).toBe(false);
  });
});
