import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getAllLandingPages, getAllSolutions } from "@/lib/content";
import { Logo } from "@/components/Logo";
import { WordmarkBand } from "@/components/WordmarkBand";

const SITE = "https://shinebetter.online";
const TITLE = "Services & locations — Shine Better";
const DESC =
  "Every service Shine Better offers — websites, redesigns, Shopify, local SEO, social and AI automation — plus dedicated pages for the industries and cities we work with.";

export const Route = createFileRoute("/services")({
  component: ServicesHub,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
          ],
        }),
      },
    ],
  }),
});

function ServicesHub() {
  const solutions = getAllSolutions();
  const landing = getAllLandingPages();
  const niches = landing.filter((l) => l.kind === "niche");
  const locations = landing.filter((l) => l.kind === "location");

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="fixed inset-x-0 top-0 z-50 nav-shell subnav scrolled">
        <div className="container-x flex h-[64px] items-center justify-between">
          <Link to="/"><Logo /></Link>
          <Link to="/" className="btn btn-secondary btn-sm"><ArrowLeft className="h-4 w-4" /> Home</Link>
        </div>
      </header>

      <section className="container-x max-w-[880px] pt-[128px] pb-8 md:pt-[168px]">
        <span className="chip mb-4">Services</span>
        <h1 className="font-display mt-3 text-[42px] font-semibold leading-[1.02] tracking-tight md:text-[68px]" style={{ letterSpacing: "-0.04em" }}>
          Everything I build.
        </h1>
        <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-[var(--muted)] md:text-[19px]">
          {DESC}
        </p>
      </section>

      <section className="container-x pb-12">
        <h2 className="font-display text-[24px] font-semibold md:text-[32px]" style={{ letterSpacing: "-0.03em" }}>Core services</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {solutions.map((s) => (
            <Link key={s.slug} to="/solutions/$slug" params={{ slug: s.slug }} className="card-clean flex flex-col p-5">
              <div className="font-display text-[18px] font-semibold leading-tight">{s.title}</div>
              <p className="mt-2 line-clamp-3 text-[13.5px] text-[var(--muted)]">{s.description}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium">
                Read more <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <HubList title="Websites by industry" items={niches} />
      <HubList title="Websites by location" items={locations} />

      <WordmarkBand />
    </div>
  );
}

function HubList({ title, items }: { title: string; items: { slug: string; title: string }[] }) {
  if (!items.length) return null;
  return (
    <section className="container-x pb-12">
      <h2 className="font-display text-[24px] font-semibold md:text-[32px]" style={{ letterSpacing: "-0.03em" }}>{title}</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {items.map((i) => (
          <Link key={i.slug} to="/$slug" params={{ slug: i.slug }} className="card-clean p-4 text-[14px] font-medium">
            {i.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
