import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
import { getAdjacentPosts, getPost, getRelatedPosts } from "@/lib/content";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Post not found — Shine Better" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const url = `/blog/${post.slug}`;
    return {
      meta: [
        { title: `${post.title} — Shine Better` },
        { name: "description", content: post.description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.description },
        { name: "article:published_time", content: post.date },
        { name: "author", content: post.author },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            author: { "@type": "Person", name: post.author },
            datePublished: post.date,
            image: post.cover || undefined,
            keywords: post.tags.join(", "),
          }),
        },
      ],
    };
  },
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const { prev, next } = getAdjacentPosts(post.slug);
  const related = getRelatedPosts(post, 3);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="fixed inset-x-0 top-0 z-50 nav-shell subnav scrolled">
        <div className="container-x flex h-[64px] items-center justify-between">
          <Link to="/"><Logo /></Link>
          <Link to="/blog" className="btn btn-secondary btn-sm">
            <ArrowLeft className="h-4 w-4" /> All posts
          </Link>
        </div>
      </header>

      <article className="container-x max-w-[760px] pt-[120px] pb-16">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--muted)]">
          <span className="chip">{post.category}</span>
          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(post.date)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.rendered.readingText}</span>
          <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
        </div>

        <h1 className="font-display text-[36px] font-semibold leading-[1.05] tracking-tight md:text-[56px]" style={{ letterSpacing: "-0.035em" }}>
          {post.title}
        </h1>
        <p className="mt-5 max-w-[65ch] text-[16.5px] leading-relaxed text-[var(--muted)] md:text-[18px]">
          {post.description}
        </p>

        {post.cover && (
          <div className="mt-10 overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border)" }}>
            <img src={post.cover} alt={post.title} loading="lazy" decoding="async" className="h-auto w-full" onError={(e) => { (e.currentTarget.style.display = "none"); }} />
          </div>
        )}

        {post.rendered.toc.length >= 2 && (
          <nav className="mt-10 rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }} aria-label="Table of contents">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">On this page</div>
            <ul className="space-y-1">
              {post.rendered.toc.map((i: { depth: number; text: string; slug: string }) => (
                <li key={i.slug} className="text-[13.5px]" style={{ paddingLeft: (i.depth - 2) * 14 }}>
                  <a href={`#${i.slug}`} className="text-[var(--ink-2)] hover:text-[var(--ink)] hover:underline">{i.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="prose-clean mt-10" dangerouslySetInnerHTML={{ __html: post.rendered.html }} />

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((t: string) => <span key={t} className="chip">#{t}</span>)}
          </div>
        )}
      </article>

      {(prev || next) && (
        <section className="container-x max-w-[900px] pb-12">
          <div className="grid gap-4 md:grid-cols-2">
            {prev && (
              <Link to="/blog/$slug" params={{ slug: prev.slug }} className="card-clean p-5">
                <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
                  <ArrowLeft className="mr-1 inline h-3 w-3" /> Previous
                </div>
                <div className="font-display mt-1 text-[18px] font-semibold">{prev.title}</div>
              </Link>
            )}
            {next && (
              <Link to="/blog/$slug" params={{ slug: next.slug }} className="card-clean p-5 md:col-start-2 md:text-right">
                <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
                  Next <ArrowRight className="ml-1 inline h-3 w-3" />
                </div>
                <div className="font-display mt-1 text-[18px] font-semibold">{next.title}</div>
              </Link>
            )}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container-x pb-24">
          <h2 className="font-display text-[26px] font-semibold md:text-[36px]" style={{ letterSpacing: "-0.03em" }}>Related reads</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} to="/blog/$slug" params={{ slug: r.slug }} className="card-clean flex flex-col p-5">
                <span className="chip self-start">{r.category}</span>
                <div className="font-display mt-3 text-[18px] font-semibold leading-tight">{r.title}</div>
                <p className="mt-2 line-clamp-3 text-[13.5px] text-[var(--muted)]">{r.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function formatDate(d: string) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
