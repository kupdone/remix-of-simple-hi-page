
## Scope

Polish the existing Shine Better site — no redesign. Change copy, restructure nav, wire up Markdown-driven Blog and Solution pages backed by files in the repo (GitHub-editable, no CMS), add a cookie banner, and tighten SEO. Keep the current neo-brutalist aesthetic; add subtle Memphis/collage accents sparingly.

---

## 1. Copy & Nav Updates (quick edits)

- Hero: `Make your work shine better online.` → `Make your business shine better online.`
- Rename every user-visible "Services" → "Solutions" (nav link, section heading, eyebrow, ARIA labels, anchor IDs like `#services` → `#solutions`).
- Nav items (desktop + mobile): **Home · Solutions · Blog · About · Let's Talk**
  - Home → `/`
  - Solutions → `/#solutions`
  - Blog → `/blog`
  - About → `/about` (new lightweight page, Markdown-driven like solution pages)
  - Let's Talk → contact anchor / mailto (keep current CTA target)

## 2. Solution Cards

Keep cards + demos as-is. Update CTA text + link behavior:

| Card | Button | Link |
|---|---|---|
| Web Development | Read More | `/solutions/web-development` |
| Graphic Design | Read More | `/solutions/graphic-design` |
| YouTube SEO | Read More | `/solutions/youtube-seo` |
| Local SEO | Read More | `/solutions/local-seo` |
| Marketing | Not Available | (disabled, no link, muted style) |

## 3. Markdown-powered Blog

**Authoring flow:** drop `.md` in `/content/blog/`, push to GitHub, post appears. Images live in `/public/blog/`.

**Frontmatter:**
```
title, description, date, author, category, cover, tags[]
```

**Build/runtime:**
- Use Vite's `import.meta.glob('/content/blog/*.md', { query: '?raw', eager: true })` so all posts bundle at build time — works on Cloudflare Workers with no filesystem access at runtime.
- Parse frontmatter with `gray-matter`, render Markdown via `unified` + `remark-parse` → `remark-gfm` → `remark-rehype` → `rehype-slug` → `rehype-autolink-headings` → `rehype-pretty-code` (syntax highlighting, Shiki) → `rehype-stringify`.
- Reading time via `reading-time`.
- Extract TOC from headings (h2/h3) during render.

**Routes:**
- `/blog` — list all posts (cover, title, description, date, category, tags, reading time). Category + tag filter chips.
- `/blog/$slug` — post page with: cover, title, meta, TOC (sticky on desktop), rendered content, prev/next, related posts (same category or shared tags), share links.
- `/blog/category/$category` and `/blog/tag/$tag` — filtered lists.

**Custom Markdown features** (implemented via remark directives + custom rehype handlers):
- Images: standard `![]()` — wrapped with lazy `<img loading="lazy" decoding="async">`.
- Galleries: `:::gallery` container with multiple images → responsive grid.
- YouTube: `:::youtube{id="..."}` → responsive iframe embed.
- Tables, code blocks (Shiki), blockquotes, GFM checklists — via `remark-gfm`.
- Callouts: `:::note`, `:::tip`, `:::warning`, `:::danger` → styled boxes.
- Buttons: `:::button{href="..." variant="orange"}Label:::` → styled `<a class="nb-btn">`.

**SEO per post:**
- `head()` with title, description, canonical, `og:title/description/image/type=article`, `twitter:card`, JSON-LD `Article` schema (headline, datePublished, author, image).

**Feeds & discovery:**
- Update `src/routes/sitemap[.]xml.ts` to include `/blog`, every post, `/about`, and every `/solutions/*` route from the same content globs.
- Add `/rss.xml` server route generating RSS 2.0 from the same posts.
- `robots.txt` already fine; add sitemap reference.

## 4. Solution Pages (Markdown too)

- Content in `/content/solutions/{slug}.md` with frontmatter: `title, description, eyebrow, cover, cta_label, cta_href`.
- Route: `/solutions/$slug` — renders same Markdown pipeline as blog inside a solution-page layout (hero + rendered body + CTA back to Let's Talk).
- `/about` uses the same pattern from `/content/pages/about.md`.

## 5. Cookie Banner

- New `<CookieBanner />` mounted in `__root.tsx`.
- Slide-up from bottom-right, rounded (24px), soft shadow, cream card matching `--nb-cream`, subtle Memphis dot pattern accent.
- Content: **We use cookies 🍪** + body copy + 3 buttons: **Accept** (orange), **Customize** (outline → opens small preferences panel with Essential [locked on] / Analytics toggles), **Nope** (ghost).
- Persist choice in `localStorage` key `sb-cookie-consent` = `{ status: 'accepted'|'declined'|'custom', analytics: bool, ts }`. Don't show again once set.
- Footer link **Cookie Preferences** clears the key and reopens the banner (dispatches a window event the banner listens for).

## 6. Performance & SEO polish

- Convert repo raster imagery to WebP where used in code (blog covers stay as authored; document `.webp` recommendation in `/public/blog/README.md`).
- Add `loading="lazy" decoding="async"` to non-LCP images; preload hero cover in `/` route head.
- Ensure each new route has: unique title/description, canonical (leaf-only), og tags, JSON-LD (`Article` for posts, `Service` for solution pages, `WebSite` on root, `BreadcrumbList` on deep routes).
- Sitemap regenerated from content globs (no static list drift).
- Keep existing `robots.txt`; add `Sitemap:` line.

## 7. Creative polish (subtle)

- Add small Memphis pattern SVG accents (dots, squiggles, zigzags) as decorative absolute-positioned elements behind the Blog hero and Solutions section header only. One or two per page max — no overuse.
- Reuse existing tokens (`--nb-orange`, `--nb-butter`, `--nb-cream`, `--nb-ink`). No new fonts.

---

## Technical notes

**New dependencies:** `gray-matter`, `unified`, `remark-parse`, `remark-gfm`, `remark-directive`, `remark-rehype`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`, `shiki`, `rehype-stringify`, `reading-time`, `github-slugger`.

**Content loading module** (`src/lib/content.ts`): shared helpers `getAllPosts()`, `getPost(slug)`, `getAllSolutions()`, `getSolution(slug)`, `getPage(slug)`. All use `import.meta.glob(..., { eager: true, query: '?raw', import: 'default' })` so content is bundled — safe in the Cloudflare Worker runtime.

**Markdown pipeline** (`src/lib/markdown.ts`): single `renderMarkdown(md)` → `{ html, toc, readingTime }`. Runs at module init (build-time bundle) so no per-request cost.

**Routes added:**
- `src/routes/blog.tsx` (rewritten as list)
- `src/routes/blog.$slug.tsx`
- `src/routes/blog.category.$category.tsx`
- `src/routes/blog.tag.$tag.tsx`
- `src/routes/solutions.$slug.tsx`
- `src/routes/about.tsx`
- `src/routes/rss[.]xml.ts`

**Seed content:** 2 sample posts, 4 solution markdown files, 1 about page — so the site renders immediately.

**Out of scope:** redesign, comments, search, newsletter, dark mode, i18n.

## Deliverable

Approve and I'll implement in one pass, then verify build + spot-check the new routes.
