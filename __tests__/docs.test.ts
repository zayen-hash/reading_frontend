import { describe, it, expect } from 'vitest';
import { getDocAsHtml } from '../lib/docs';

describe('getDocAsHtml', () => {
  it('extracts body content from a Google Docs export HTML', async () => {
    const mockHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Test</title><style>body { font: Arial; }</style></head>
<body class="doc-body" id="doc-1" style="font-size: 12px;">
<h1 style="font-weight: bold;" class="title" id="heading-1">Hello World</h1>
<p class="paragraph" style="color: black;">This is a <span>test</span> paragraph.</p>
<a href="https://example.com" class="link" style="color: blue;">Click here</a>
</body>
</html>`;

    // Mock fetch
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async (_input, _init) => {
      return new Response(mockHtml, { status: 200 });
    }) as typeof globalThis.fetch;

    try {
      const result = await getDocAsHtml('test-doc-id');
      // Should not contain style or class attributes
      expect(result).not.toContain('style=');
      expect(result).not.toContain('class=');
      expect(result).not.toContain('id=');
      // Should not contain span tags
      expect(result).not.toContain('<span>');
      expect(result).not.toContain('</span>');
      // Should contain the heading and paragraph content
      expect(result).toContain('<h1>Hello World</h1>');
      expect(result).toContain('This is a test paragraph.');
      // Should have cleaned anchor tags
      expect(result).toContain('<a href="https://example.com">Click here</a>');
      // Should not contain the head content
      expect(result).not.toContain('<head>');
      expect(result).not.toContain('<title>');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('throws on non-200 response', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response('Not Found', { status: 404 });

    try {
      await expect(getDocAsHtml('bad-id')).rejects.toThrow('Failed to fetch doc bad-id: 404');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('handles empty body gracefully', async () => {
    const mockHtml = '<html><head></head><body></body></html>';
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => new Response(mockHtml, { status: 200 });

    try {
      const result = await getDocAsHtml('empty-doc');
      expect(result).toBe('');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('builds the correct URL and passes revalidate option', async () => {
    const fetchCalls: [string, RequestInit | undefined][] = [];
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      fetchCalls.push([input.toString(), init]);
      return new Response('<html><head></head><body><p>Test</p></body></html>', { status: 200 });
    }) as typeof globalThis.fetch;

    try {
      await getDocAsHtml('my-doc-123');
      expect(fetchCalls[0][0]).toBe(
        'https://docs.google.com/document/d/my-doc-123/export?format=html',
      );
      // Should include revalidate in fetch options for ISR
      expect(fetchCalls[0][1]).toEqual({ next: { revalidate: 3600 } });
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
