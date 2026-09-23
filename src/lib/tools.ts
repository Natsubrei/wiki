import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const TOOLS_DIR = path.resolve(process.env.TOOLS_DIR || './tools');

export type Tool = {
  slug: string;
  title: string;
  description: string;
  wide: boolean;
  html: string;
  scripts: string[];
};

function toolFile(slug: string): string | null {
  if (!slug || /[\\/]/.test(slug) || slug.includes('..')) return null;
  const root = path.resolve(TOOLS_DIR);
  const file = path.resolve(root, `${slug}.html`);
  if (path.dirname(file) !== root) return null;
  return file;
}

function splitScripts(body: string): { html: string; scripts: string[] } {
  const scripts: string[] = [];
  const html = body.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, code) => {
    if (/\bsrc\s*=/.test(String(attrs))) return full;
    scripts.push(String(code));
    return '';
  });
  return { html, scripts };
}

async function readTool(slug: string): Promise<Tool | null> {
  const file = toolFile(slug);
  if (!file) return null;
  let raw: string;
  try {
    raw = await fs.readFile(file, 'utf8');
  } catch {
    return null;
  }
  const parsed = matter(raw);
  const { html, scripts } = splitScripts(parsed.content.trim());
  return {
    slug,
    title: String(parsed.data.title ?? slug),
    description: String(parsed.data.description ?? ''),
    wide: Boolean(parsed.data.wide),
    html,
    scripts,
  };
}

export async function listTools(): Promise<Tool[]> {
  let names: string[];
  try {
    names = await fs.readdir(TOOLS_DIR);
  } catch {
    return [];
  }
  const tools = (
    await Promise.all(
      names.filter((name) => name.endsWith('.html')).map((name) => readTool(name.slice(0, -5))),
    )
  ).filter((tool): tool is Tool => tool !== null);
  tools.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
  return tools;
}

export async function getTool(slug: string): Promise<Tool | null> {
  return readTool(slug);
}
