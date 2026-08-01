import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import type { Plugin } from "vite";
import { renderMarkdown } from "../src/lib/markdown";

const VIRTUAL_ID = "virtual:site-content";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

type FrontmatterValue = string | string[] | number | undefined;
type ParsedFrontmatter = Record<string, FrontmatterValue>;

function cleanValue(value: string): string | number {
  const unquoted = value.trim().replace(/^['"]|['"]$/g, "");
  const num = Number(unquoted);
  if (unquoted !== "" && Number.isFinite(num) && String(num) === unquoted) return num;
  return unquoted;
}

function parseMarkdownFile(raw: string): { data: ParsedFrontmatter; content: string } {
  if (!raw.startsWith("---")) return { data: {}, content: raw };
  const lines = raw.split(/\r?\n/);
  const endIndex = lines.findIndex((line, i) => i > 0 && line.trim() === "---");
  if (endIndex === -1) return { data: {}, content: raw };

  const data: ParsedFrontmatter = {};
  let activeArrayKey: string | null = null;

  for (const line of lines.slice(1, endIndex)) {
    const arrayItem = /^\s*-\s+(.+)$/.exec(line);
    if (arrayItem && activeArrayKey) {
      const current = data[activeArrayKey];
      const list = Array.isArray(current) ? current : [];
      data[activeArrayKey] = [...list, String(cleanValue(arrayItem[1]))];
      continue;
    }
    const pair = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!pair) continue;
    const [, key, value] = pair;
    if (value.trim() === "") {
      data[key] = [];
      activeArrayKey = key;
      continue;
    }
    data[key] = cleanValue(value);
    activeArrayKey = null;
  }
  return { data, content: lines.slice(endIndex + 1).join("\n") };
}

function readDir(root: string, dir: string) {
  const abs = resolve(root, dir);
  if (!existsSync(abs)) return [] as { slug: string; data: ParsedFrontmatter; rendered: ReturnType<typeof renderMarkdown> }[];
  return readdirSync(abs)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = parseMarkdownFile(readFileSync(join(abs, file), "utf8"));
      return { slug: file.replace(/\.md$/, ""), data, rendered: renderMarkdown(content) };
    });
}

function buildPayload(root: string) {
  return {
    blog: readDir(root, "content/blog"),
    solutions: readDir(root, "content/solutions"),
    pages: readDir(root, "content/pages"),
  };
}

/**
 * Renders every Markdown file at build time so unified/remark/rehype
 * (~250kb) never reaches the browser bundle.
 */
export function siteContent(): Plugin {
  let root = process.cwd();
  return {
    name: "site-content",
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      return `export default ${JSON.stringify(buildPayload(root))};`;
    },
    handleHotUpdate({ file, server }) {
      if (!file.endsWith(".md") || !file.includes("/content/")) return;
      const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
      if (mod) {
        server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      }
    },
  };
}
