import type { APIRoute } from 'astro';
import { listPosts } from '../lib/posts';
import { site } from '../site';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export const GET: APIRoute = async ({ site: origin }) => {
  const posts = await listPosts();
  const base = process.env.SITE_URL || origin?.toString() || 'http://localhost:8080';
  const items = posts
    .map((post) => {
      const link = new URL(`/blog/${post.slug}`, base).toString();
      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${escapeXml(link)}</link>
  <guid>${escapeXml(link)}</guid>
  <pubDate>${post.date.toUTCString()}</pubDate>
</item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(site.name)}</title>
  <description>${escapeXml(site.description)}</description>
  <link>${escapeXml(base)}</link>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
