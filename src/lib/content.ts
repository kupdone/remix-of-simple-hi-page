import siteContent from "virtual:site-content";

export interface TocItem {
  depth: number;
  text: string;
  slug: string;
}

export interface RenderedMarkdown {
  html: string;
  toc: TocItem[];
  readingMinutes: number;
  readingText: string;
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  cover: string;
  tags: string[];
}

export interface BlogPost extends BlogFrontmatter {
  slug: string;
  rendered: RenderedMarkdown;
}

export interface SolutionFrontmatter {
  title: string;
  description: string;
  eyebrow?: string;
  cover?: string;
  cta_label?: string;
  cta_href?: string;
  order?: number;
}

export interface Solution extends SolutionFrontmatter {
  slug: string;
  rendered: RenderedMarkdown;
}

export interface PageDoc {
  slug: string;
  title: string;
  description: string;
  rendered: RenderedMarkdown;
}

const posts: BlogPost[] = siteContent.blog
  .map(({ slug, data, rendered }) => {
    const fm = data as Partial<BlogFrontmatter>;
    return {
      slug,
      title: fm.title ?? "Untitled",
      description: fm.description ?? "",
      date: fm.date ?? "",
      author: fm.author ?? "Shine Better",
      category: fm.category ?? "General",
      cover: fm.cover ?? "",
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      rendered: rendered as RenderedMarkdown,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const solutions: Solution[] = siteContent.solutions
  .map(({ slug, data, rendered }) => {
    const fm = data as Partial<SolutionFrontmatter>;
    return {
      slug,
      title: fm.title ?? "Untitled",
      description: fm.description ?? "",
      eyebrow: fm.eyebrow,
      cover: fm.cover,
      cta_label: fm.cta_label ?? "Start a project",
      cta_href: fm.cta_href ?? "/#contact",
      order: fm.order ?? 999,
      rendered: rendered as RenderedMarkdown,
    };
  })
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

export function getAllPosts(): BlogPost[] {
  return posts;
}

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAdjacentPosts(slug: string) {
  const i = posts.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? posts[i - 1] : undefined,
    next: i >= 0 && i < posts.length - 1 ? posts[i + 1] : undefined,
  };
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0;
      if (p.category === post.category) score += 3;
      score += p.tags.filter((t) => post.tags.includes(t)).length;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

export function getAllCategories(): string[] {
  return [...new Set(posts.map((p) => p.category))].sort();
}

export function getAllTags(): string[] {
  return [...new Set(posts.flatMap((p) => p.tags))].sort();
}

export function getAllSolutions(): Solution[] {
  return solutions;
}

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((s) => s.slug === slug);
}

export function getPage(slug: string): PageDoc | undefined {
  const entry = siteContent.pages.find((p) => p.slug === slug);
  if (!entry) return undefined;
  return {
    slug,
    title: (entry.data.title as string) ?? slug,
    description: (entry.data.description as string) ?? "",
    rendered: entry.rendered as RenderedMarkdown,
  };
}

export interface LandingFaq {
  q: string;
  a: string;
}

export interface LandingPage {
  slug: string;
  title: string;
  description: string;
  kind: "niche" | "location";
  eyebrow: string;
  service: string;
  location: string;
  country: string;
  faq: LandingFaq[];
  rendered: RenderedMarkdown;
}

const landing: LandingPage[] = siteContent.landing
  .map((entry) => {
    const d = entry.data as Record<string, string | string[] | number | undefined>;
    const faqRaw = Array.isArray(d.faq) ? d.faq : [];
    return {
      slug: entry.slug,
      title: (d.title as string) ?? entry.slug,
      description: (d.description as string) ?? "",
      kind: (d.kind as "niche" | "location") ?? "niche",
      eyebrow: (d.eyebrow as string) ?? "",
      service: (d.service as string) ?? "web-development",
      location: (d.location as string) ?? "",
      country: (d.country as string) ?? "",
      faq: faqRaw
        .map((line) => {
          const i = line.indexOf("|");
          return i === -1 ? null : { q: line.slice(0, i).trim(), a: line.slice(i + 1).trim() };
        })
        .filter((x): x is LandingFaq => Boolean(x)),
      rendered: entry.rendered as RenderedMarkdown,
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

export function getAllLandingPages(): LandingPage[] {
  return landing;
}

export function getLandingPage(slug: string): LandingPage | undefined {
  return landing.find((l) => l.slug === slug);
}
