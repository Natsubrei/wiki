# Wiki

个人站点：博客用 Markdown，小工具用 HTML，都在浏览器里打开。

文章和工具放在网站外面的两个目录里。改文件，刷新页面，不必重新发布网站。

## 使用

```bash
npm install
npm run dev
```

```bash
cp .env.example .env
docker compose up -d --build
```

内容目录用环境变量指定，也可以在 Compose 里挂载：

```yaml
volumes:
  - ../wiki-content/posts:/app/posts
  - ../wiki-content/tools:/app/tools
```

| | 环境变量 | 默认 | 路径 |
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

站名在 `src/site.ts`。`SITE_URL` 写进 RSS 和规范链接。改网站代码或样式时才需要 `--build`。
