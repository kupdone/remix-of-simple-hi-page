import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { getAllPosts } from "@/lib/content";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [
      { title: "Blog — Shine Better" },
      { name: "description", content: "Notes on web development, SEO and building online — by Mahin Islam." },
      { property: "og:title", content: "Blog — Shine Better" },
      { property: "og:description", content: "Notes on web development, SEO and building online — by Mahin Islam." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Blog — Shine Better" },
      { name: "twitter:description", content: "Notes on web development, SEO and building online." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
});

function BlogPage() {
  const matches = useMatches();
  const isPostRoute = matches.some((m) => m.routeId === "/blog/$slug");
  const posts = getAllPosts();

  if (isPostRoute) return <Outlet />;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <TopBar />
      <section className="container-x pt-[128px] pb-10 md:pt-[168px]">
        <span className="chip mb-4">Blog</span>
        <h1 className="font-display mt-3 max-w-3xl text-[44px] font-semibold leading-[1.02] tracking-tight md:text-[72px]" style={{ letterSpacing: "-0.04em" }}>
          Notes from the studio.
        </h1>
        <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--muted)] md:text-[17px]">
          Short writeups on web development, SEO and building a better online
          presence — no fluff, no 3,000-word listicles.
        </p>
      </section>

      <section className="container-x pb-24">
        {posts.length === 0 ? (
          <div className="card-clean p-12 text-center text-[var(--muted)]">No posts yet — check back soon.</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="card-clean group flex flex-col overflow-hidden"
              >
                {p.cover && (
                  <div className="aspect-[16/10] w-full overflow-hidden border-b" style={{ borderColor: "var(--border)" }}>
                    <img
                      src={p.cover}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.currentTarget.style.display = "none"); }}
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px] text-[var(--muted)]">
                    <span className="chip">{p.category}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(p.date)}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.rendered.readingText}</span>
                  </div>
                  <h2 className="font-display text-[20px] font-semibold leading-tight text-[var(--ink)] md:text-[22px]">{p.title}</h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">{p.description}</p>
                  <div className="mt-auto pt-5 text-[13px] font-medium text-[var(--ink)]">
                    Read post <ArrowRight className="ml-1 inline h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 nav-shell subnav scrolled">
      <div className="container-x flex h-[64px] items-center justify-between">
        <Link to="/"><Logo /></Link>
        <Link to="/" className="btn btn-secondary btn-sm">← Home</Link>
      </div>
    </header>
  );
}

function formatDate(d: string) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
