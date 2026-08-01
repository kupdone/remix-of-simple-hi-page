import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import GithubSlugger from "github-slugger";

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

function estimateReadingTime(md: string) {
  const plainText = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_~\-[\]()]/g, " ")
    .trim();
  const words = plainText ? plainText.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 220));
  return { minutes, text: `${minutes} min read` };
}

/**
 * Custom remark plugin: turn container directives (:::name) into styled HTML.
 * Supports: gallery, youtube, note, tip, warning, danger, button.
 */
function remarkCustomDirectives() {
  return (tree: Root) => {
    visit(tree, (node: any) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const data = node.data || (node.data = {});
        const attrs = node.attributes || {};
        const name = node.name;

        if (name === "youtube") {
          const id = attrs.id || attrs.v || "";
          data.hName = "div";
          data.hProperties = { className: ["md-youtube"] };
          node.children = [
            {
              type: "html",
              value: `<a class="md-youtube-local" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer">Watch video on YouTube</a>`,
            },
          ];
        } else if (name === "gallery") {
          data.hName = "div";
          data.hProperties = { className: ["md-gallery"] };
        } else if (["note", "tip", "warning", "danger"].includes(name)) {
          data.hName = "div";
          data.hProperties = {
            className: ["md-callout", `md-callout-${name}`],
          };
        } else if (name === "button") {
          data.hName = "a";
          data.hProperties = {
            href: attrs.href || "#",
            className: [
              "nb-btn",
              attrs.variant === "orange" ? "nb-btn-orange" : "nb-btn-white",
              "!inline-flex",
            ],
            ...(attrs.href?.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {}),
          };
        }
      }
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkDirective)
  .use(remarkCustomDirectives)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: "wrap",
    properties: { className: ["md-heading-link"] },
  })
  .use(rehypeHighlight, { detect: true, ignoreMissing: true })
  .use(rehypeStringify, { allowDangerousHtml: true });

function extractToc(md: string): TocItem[] {
  const toc: TocItem[] = [];
  const slugger = new GithubSlugger();
  const lines = md.split("\n");
  let inFence = false;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+)$/.exec(line);
    if (m) {
      const depth = m[1].length;
      const text = m[2].replace(/[*_`]/g, "").trim();
      toc.push({ depth, text, slug: slugger.slug(text) });
    }
  }
  return toc;
}

export function renderMarkdown(md: string): RenderedMarkdown {
  const file = processor.processSync(md);
  const rt = estimateReadingTime(md);
  return {
    html: String(file),
    toc: extractToc(md),
    readingMinutes: rt.minutes,
    readingText: rt.text,
  };
}
