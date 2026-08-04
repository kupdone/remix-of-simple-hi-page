import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { getAllLandingPages, getLandingPage, getSolution, type LandingFaq } from "@/lib/content";
import { Logo } from "@/components/Logo";
import { WordmarkBand } from "@/components/WordmarkBand";

const SITE = "https://shinebetter.online";

export const Route = createFileRoute("/$slug")({
  component: LandingRoute,
  loader: ({ params }) => {
    const page = getLandingPage(params.slug);
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Page not found — Shine Better" }, { name: "robots", content: "noindex" }] };
    }
    const { page } = loaderData;
    const url = `/${params.slug}`;
    const abs = `${SITE}${url}`;
    return {
      meta: [
        { title: `${page.title} — Shine Better` },
        { name: "description", content: page.description },
        { property: "og:title", content: page.title },
        { property: "og:description", content: page.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: page.title },
        { name: "twitter:description", content: page.description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                name: page.title,
                description: page.description,
                serviceType: "Website design and development",
                provider: {
                  "@type": "ProfessionalService",
                  name: "Shine Better",
                  url: SITE,
                  founder: { "@type": "Person", name: "Mahin Islam" },
                },
                ...(page.location
                  ? { areaServed: { "@type": "Place", name: page.location } }
                  : {}),
                url: abs,
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: SITE },
                  { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
                  { "@type": "ListItem", position: 3, name: page.title, item: abs },
                ],
              },
              ...(page.faq.length
                ? [
                    {
                      "@type": "FAQPage",
                      mainEntity: page.faq.map((f) => ({
                        "@type": "Question",
                        name: f.q,
                        acceptedAnswer: { "@type": "Answer", text: f.a },
                      })),
                    },
                  ]
                : []),
            ],
          }),
        },
      ],
    };
  },
});

function LandingRoute() {
  const { page } = Route.useLoaderData();
  const solution = getSolution(page.service);
  const siblings = getAllLandingPages()
    .filter((p) => p.slug !== page.slug && p.kind === page.kind)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="fixed inset-x-0 top-0 z-50 nav-shell subnav scrolled">
        <div className="container-x flex h-[64px] items-center justify-between">
          <Link to="/"><Logo /></Link>
          <div className="flex items-center gap-2">
            <Link to="/services" className="btn btn-secondary btn-sm hidden sm:inline-flex">
              <ArrowLeft className="h-4 w-4" /> All services
            </Link>
            <Link to="/" hash="contact" className="btn btn-primary btn-sm">Let's talk</Link>
          </div>
        </div>
      </header>

      <section className="container-x max-w-[880px] pt-[128px] pb-8 md:pt-[168px]">
        <nav aria-label="Breadcrumb" className="mb-5 text-[12.5px] text-[var(--muted)]">
          <Link to="/" className="hover:text-[var(--ink)]">Home</Link>
          <span className="px-2">/</span>
          <Link to="/services" className="hover:text-[var(--ink)]">Services</Link>
          <span className="px-2">/</span>
          <span className="text-[var(--ink)]">{page.title}</span>
        </nav>
        {page.eyebrow && <span className="chip mb-4">{page.eyebrow}</span>}
        <h1
          className="font-display mt-3 text-[38px] font-semibold leading-[1.03] tracking-tight md:text-[64px]"
          style={{ letterSpacing: "-0.04em" }}
        >
          {page.title}
        </h1>
        <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-[var(--muted)] md:text-[19px]">
          {page.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" hash="contact" className="btn btn-primary btn-lg">
            Get a fixed quote <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link to="/insights" className="btn btn-secondary btn-lg">Free website audit</Link>
        </div>
      </section>

      <article className="container-x max-w-[760px] pb-12">
        <div className="prose-clean" dangerouslySetInnerHTML={{ __html: page.rendered.html }} />
      </article>

      {page.faq.length > 0 && (
        <section className="container-x max-w-[760px] pb-16">
          <h2 className="font-display text-[26px] font-semibold md:text-[34px]" style={{ letterSpacing: "-0.03em" }}>
            Questions people ask
          </h2>
          <div className="mt-6 space-y-3">
            {page.faq.map((f: LandingFaq) => (
              <details key={f.q} className="card-clean p-5">
                <summary className="cursor-pointer text-[15.5px] font-medium">{f.q}</summary>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--muted)]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {solution && (
        <section className="container-x max-w-[760px] pb-16">
          <Link
            to="/solutions/$slug"
            params={{ slug: solution.slug }}
            className="card-clean flex flex-col p-6"
          >
            <div className="text-[12px] uppercase tracking-wide text-[var(--muted)]">Related service</div>
            <div className="font-display mt-2 text-[22px] font-semibold">{solution.title}</div>
            <p className="mt-2 text-[14px] text-[var(--muted)]">{solution.description}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium">
              Read more <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </section>
      )}

      {siblings.length > 0 && (
        <section className="container-x pb-20">
          <h2 className="font-display text-[22px] font-semibold md:text-[28px]" style={{ letterSpacing: "-0.03em" }}>
            Also popular
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {siblings.map((s) => (
              <Link key={s.slug} to="/$slug" params={{ slug: s.slug }} className="card-clean p-4">
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--muted)]" />
                  <span className="text-[14px] font-medium leading-snug">{s.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <WordmarkBand />
    </div>
  );
}
