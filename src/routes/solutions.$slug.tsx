import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getAllSolutions, getSolution } from "@/lib/content";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/solutions/$slug")({
  component: SolutionPage,
  loader: ({ params }) => {
    const solution = getSolution(params.slug);
    if (!solution) throw notFound();
    return { solution };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Solution not found — Shine Better" }, { name: "robots", content: "noindex" }] };
    const { solution } = loaderData;
    const url = `/solutions/${solution.slug}`;
    return {
      meta: [
        { title: `${solution.title} — Shine Better` },
        { name: "description", content: solution.description },
        { property: "og:title", content: solution.title },
        { property: "og:description", content: solution.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: solution.title },
        { name: "twitter:description", content: solution.description },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function SolutionPage() {
  const { solution } = Route.useLoaderData();
  const others = getAllSolutions().filter((s) => s.slug !== solution.slug);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="fixed inset-x-0 top-0 z-50 nav-shell subnav scrolled">
        <div className="container-x flex h-[64px] items-center justify-between">
          <Link to="/"><Logo /></Link>
          <Link to="/" className="btn btn-secondary btn-sm"><ArrowLeft className="h-4 w-4" /> Home</Link>
        </div>
      </header>

      <section className="container-x max-w-[880px] pt-[128px] pb-10 md:pt-[168px]">
        {solution.eyebrow && <span className="chip mb-4">{solution.eyebrow}</span>}
        <h1 className="font-display mt-3 text-[42px] font-semibold leading-[1.02] tracking-tight md:text-[72px]" style={{ letterSpacing: "-0.04em" }}>
          {solution.title}
        </h1>
        <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-[var(--muted)] md:text-[19px]">
          {solution.description}
        </p>
      </section>

      <article className="container-x max-w-[760px] pb-16">
        <div className="prose-clean" dangerouslySetInnerHTML={{ __html: solution.rendered.html }} />

        {solution.cta_label && solution.cta_href && (
          <div className="mt-12">
            <a href={solution.cta_href} className="btn btn-primary btn-lg"
              target={solution.cta_href.startsWith("/") ? undefined : "_blank"}
              rel={solution.cta_href.startsWith("/") ? undefined : "noopener noreferrer"}>
              {solution.cta_label} <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </article>

      {others.length > 0 && (
        <section className="container-x pb-24">
          <h2 className="font-display text-[24px] font-semibold md:text-[32px]" style={{ letterSpacing: "-0.03em" }}>Other solutions</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {others.slice(0, 3).map((s) => (
              <Link key={s.slug} to="/solutions/$slug" params={{ slug: s.slug }} className="card-clean flex flex-col p-5">
                <div className="font-display text-[18px] font-semibold leading-tight">{s.title}</div>
                <p className="mt-2 line-clamp-3 text-[13.5px] text-[var(--muted)]">{s.description}</p>
                <div className="mt-4 text-[12px] font-medium text-[var(--ink)]">Read more →</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
