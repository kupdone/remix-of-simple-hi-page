import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Gauge, MessageCircle } from "lucide-react";
import { ToolPage, ToolHero, ToolSection } from "@/components/ToolShell";

export const Route = createFileRoute("/tools/")({
  component: ToolsIndex,
  head: () => ({
    meta: [
      { title: "Free Tools for Small Businesses | Shine Better" },
      {
        name: "description",
        content:
          "Free, no-login tools from Shine Better: a WhatsApp click-to-chat link generator and a Lighthouse website speed report. Both run in seconds.",
      },
      { property: "og:title", content: "Free Tools for Small Businesses | Shine Better" },
      {
        property: "og:description",
        content:
          "Generate a wa.me link or run a Lighthouse audit on your site. Free, no signup, results in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free Tools | Shine Better" },
      {
        name: "twitter:description",
        content: "WhatsApp link generator and website speed reports. Free and instant.",
      },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
});

const TOOLS = [
  {
    to: "/tools/whatsapp-link-generator" as const,
    Icon: MessageCircle,
    name: "WhatsApp link generator",
    desc: "Turn any phone number into a wa.me click-to-chat link, with an optional prefilled message.",
    tag: "Runs in your browser",
  },
  {
    to: "/insights" as const,
    Icon: Gauge,
    name: "Website speed report",
    desc: "A real Google Lighthouse audit of your site: performance, accessibility, best practices and SEO.",
    tag: "Powered by PageSpeed Insights",
  },
];

function ToolsIndex() {
  return (
    <ToolPage>
      <ToolHero
        eyebrow="Free tools"
        title={<>Small tools that save you a phone call.</>}
        subtitle="No login, no limits, no upsell. Built because I needed them for client work and figured you probably do too."
      />

      <ToolSection>
        <div className="grid gap-5 md:grid-cols-2">
          {TOOLS.map((t) => (
            <Link key={t.to} to={t.to} className="tool-card group block p-7 transition-transform hover:-translate-y-1">
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--surface)]">
                  <t.Icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-5 w-5 text-[var(--muted)] transition-colors group-hover:text-[var(--ink)]" />
              </div>
              <h3 className="tool-h2 mt-5 text-[22px]">{t.name}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--muted)]">{t.desc}</p>
              <span className="chip mt-5 inline-flex">{t.tag}</span>
            </Link>
          ))}
        </div>
      </ToolSection>
    </ToolPage>
  );
}
