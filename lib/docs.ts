/**
 * Fetch a public Google Doc as cleaned HTML (body content only).
 * Strips Google's injected styles, classes, ids, and empty spans.
 */
export async function getDocAsHtml(docsId: string): Promise<string> {
  const url = `https://docs.google.com/document/d/${docsId}/export?format=html`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch doc ${docsId}: ${res.status}`);

  const fullHtml = await res.text();

  // Extract only the <body> content — strip Google's <head> with styles/scripts
  const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : fullHtml;

  // Remove inline styles and class attributes Google injects
  // (Tailwind prose will handle typography instead)
  const cleaned = bodyContent
    .replace(/\sstyle="[^"]*"/g, '')
    .replace(/\sclass="[^"]*"/g, '')
    .replace(/\sid="[^"]*"/g, '')
    .replace(/<a\s[^>]*href="([^"]*)"[^>]*>/g, '<a href="$1">')
    .replace(/<span>/g, '')
    .replace(/<\/span>/g, '')
    .trim();

  return cleaned;
}
