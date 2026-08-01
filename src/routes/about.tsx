import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getPage } from "@/lib/content";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  loader: () => {
    const page = getPage("about");
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.page.title ?? "About — Shine Better";
    const description = loaderData?.page.description ?? "About Shine Better.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: "/about" }],
    };
  },
});

function AboutPage() {
  const { page } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="fixed inset-x-0 top-0 z-50 nav-shell subnav scrolled">
        <div className="container-x flex h-[64px] items-center justify-between">
          <Link to="/"><Logo /></Link>
          <Link to="/" className="btn btn-secondary btn-sm"><ArrowLeft className="h-4 w-4" /> Home</Link>
        </div>
      </header>

      <section className="container-x max-w-[820px] pt-[128px] pb-8 md:pt-[168px]">
        <span className="chip mb-4">About</span>
      </section>
      <article className="container-x max-w-[760px] pb-24">
        <div className="prose-clean" dangerouslySetInnerHTML={{ __html: page.rendered.html }} />
      </article>
    </div>
  );
}
