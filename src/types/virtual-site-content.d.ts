declare module "virtual:site-content" {
  interface RenderedMarkdown {
    html: string;
    toc: { depth: number; text: string; slug: string }[];
    readingMinutes: number;
    readingText: string;
  }
  interface RawDoc {
    slug: string;
    data: Record<string, string | string[] | number | undefined>;
    rendered: RenderedMarkdown;
  }
  const content: { blog: RawDoc[]; solutions: RawDoc[]; pages: RawDoc[] };
  export default content;
}
