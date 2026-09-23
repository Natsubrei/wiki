import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const POSTS_DIR = path.resolve(process.env.POSTS_DIR || './posts');

export type Post = {
  slug: string;
  title: string;
  date: Date;
  body: string;
  html: string;
};

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
  }),
);

function parseDate(value: unknown): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return new Date(0);
}

function postFile(slug: string): string | null {
  if (!slug || /[\\/]/.test(slug) || slug.includes('..')) return null;
  const root = path.resolve(POSTS_DIR);
  const file = path.resolve(root, `${slug}.md`);
  if (path.dirname(file) !== root) return null;
  return file;
}

async function readPost(slug: string): Promise<Post | null> {
  const file = postFile(slug);
  if (!file) return null;
  let raw: string;
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch {
    return null;
  }
  const parsed = matter(raw);
  const html = await marked.parse(parsed.content);
  return {
    slug,
    title: String(parsed.data.title ?? slug),
    date: parseDate(parsed.data.date),
    body: parsed.content,
    html: typeof html === 'string' ? html : String(html),
  };
}

export async function listPosts(): Promise<Post[]> {
  let names: string[];
  try {
    names = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }
  const posts = (
    await Promise.all(
      names.filter((name) => name.endsWith('.md')).map((name) => readPost(name.slice(0, -3))),
    )
  ).filter((post): post is Post => post !== null);
  posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  return posts;
}

export async function getPost(slug: string): Promise<Post | null> {
  return readPost(slug);
}
