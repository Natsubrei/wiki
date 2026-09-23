# Wiki

个人 wiki：Markdown 博客和浏览器小工具。

## 使用

```bash
npm install
npm run dev
```

```bash
cp .env.example .env
docker compose up -d --build
```

用环境变量指向内容目录，或在 Compose 里挂载：

```yaml
volumes:
  - ../wiki-content/posts:/app/posts
  - ../wiki-content/tools:/app/tools
```

| | 环境变量 | 默认 | 地址 |
| --- | --- | --- | --- |
| 文章 | `POSTS_DIR` | `./posts` | `/blog/<slug>` |
| 工具 | `TOOLS_DIR` | `./tools` | `/tools/<slug>` |

## 文章

`POSTS_DIR/<slug>.md`：

```markdown
---
title: 标题
date: 2026-09-23
---

正文。
```

## 工具

`TOOLS_DIR/<slug>.html`。脚本只在访问者浏览器里执行。

```html
---
title: 名称
description: 一句话
---
<div class="tool">...</div>
<script>
</script>
```

## 站点

站名在 `src/site.ts`。`SITE_URL` 写进 RSS 和规范链接。改网站本身时才需要 `--build`。

## License

MIT
