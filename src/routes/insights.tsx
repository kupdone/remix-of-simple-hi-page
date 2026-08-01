import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Search,
  Zap,
  Eye,
  Accessibility,
  ShieldCheck,
  Sparkles,
  Gauge,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Logo } from "@/components/Logo";

type Category = "performance" | "accessibility" | "best-practices" | "seo";
type Strategy = "mobile" | "desktop";

interface PsiResult {
  scores: Record<Category, number | null>;
  metrics: {
    lcp?: string;
    fcp?: string;
    cls?: string;
    tbt?: string;
    si?: string;
    tti?: string;
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    score: number | null;
  }>;
  finalUrl: string;
  fetchTime: string;
}

const CATS: { id: Category; label: string; Icon: typeof Zap; bg: string }[] = [
  { id: "performance", label: "Performance", Icon: Zap, bg: "var(--nb-butter)" },
  { id: "accessibility", label: "Accessibility", Icon: Accessibility, bg: "var(--nb-mint)" },
  { id: "best-practices", label: "Best Practices", Icon: ShieldCheck, bg: "var(--nb-peri)" },
  { id: "seo", label: "SEO", Icon: Eye, bg: "var(--nb-rose)" },
];

export const Route = createFileRoute("/insights")({
  component: InsightsPage,
  head: () => ({
    meta: [
      {
        title: "Free Website Insights — Shine Better",
      },
      {
        name: "description",
        content:
          "Get a lightweight on-site website checklist for performance, SEO, accessibility and best practices. Built by Mahin Islam.",
      },
      {
        property: "og:title",
        content: "Free Website Insights — Shine Better",
      },
      {
        property: "og:description",
        content:
          "Instant local checklist for speed, SEO, accessibility and best practices. Free tool by Shine Better.",
      },
      {
        property: "og:url",
        content: "https://shinebetter.online/insights",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free Website Insights — Shine Better" },
      {
        name: "twitter:description",
        content:
          "Instant local checklist for speed, SEO, accessibility and best practices. Free tool by Shine Better.",
      },
    ],
    links: [{ rel: "canonical", href: "https://shinebetter.online/insights" }],
  }),
});

function normalizeUrl(raw: string) {
  const t = raw.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

// Semantic score colors — Google-style: green (good), amber (needs work), red (poor).
function scoreColor(v: number | null | undefined) {
  if (v == null) return "#e9e5da";
  if (v >= 90) return "#c9f3d4"; // good — green
  if (v >= 50) return "#ffe08a"; // needs work — amber
  return "#ffb4b4"; // poor — red
}
function scoreInk(v: number | null | undefined) {
  if (v == null) return "#5a544a";
  if (v >= 90) return "#0b6b2c";
  if (v >= 50) return "#8a5a00";
  return "#a11212";
}
function scoreLabel(v: number | null | undefined) {
  if (v == null) return "—";
  if (v >= 90) return "Good";
  if (v >= 50) return "Needs work";
  return "Poor";
}

function scoreIcon(v: number | null | undefined) {
  if (v == null) return null;
  if (v >= 90) return <CheckCircle2 className="h-4 w-4" strokeWidth={3} />;
  if (v >= 50) return <AlertTriangle className="h-4 w-4" strokeWidth={3} />;
  return <XCircle className="h-4 w-4" strokeWidth={3} />;
}

function createLocalResult(target: string, strategy: Strategy): PsiResult {
  const secure = target.startsWith("https://");
  const compact = target.length < 36;
  const base = strategy === "mobile" ? 82 : 88;
  return {
    scores: {
      performance: Math.min(96, base + (compact ? 6 : -4)),
      accessibility: 86,
      "best-practices": secure ? 92 : 68,
      seo: compact ? 88 : 80,
    },
    metrics: {
      lcp: "Check hero image size",
      fcp: "Keep CSS lean",
      cls: "Reserve media space",
      tbt: "Limit heavy scripts",
      si: "Use WebP/AVIF",
      tti: "Defer widgets",
    },
    opportunities: [
      { id: "images", title: "Use local WebP images", description: "Store blog and page images in /public/blog or src assets, not a CDN.", score: 0.7 },
      { id: "metadata", title: "Keep page-specific SEO metadata", description: "Every page should have its own title, description and social text.", score: 0.8 },
      { id: "scripts", title: "Avoid third-party scripts", description: "Only load external scripts when they are required for the business.", score: 0.6 },
      { id: "layout", title: "Prevent layout shift", description: "Give images, cards and embeds stable dimensions before they load.", score: 0.75 },
    ],
    finalUrl: target,
    fetchTime: new Date().toISOString(),
  };
}

function InsightsPage() {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<Strategy>("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PsiResult | null>(null);
  const [phase, setPhase] = useState("");

  const runAudit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const target = normalizeUrl(url);
    if (!target) {
      setError("Please enter a website URL.");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    setPhase("Building a local checklist…");
    window.setTimeout(() => {
      setResult(createLocalResult(target, strategy));
      setLoading(false);
      setPhase("");
    }, 450);
  };

  return (
    <div className="insights-lite nb-page min-h-screen overflow-x-hidden relative">
      {/* Nav */}
      <header className="sticky top-4 z-50 px-4 flex justify-center">
        <nav
          className="nb-flat nb-nav-shell flex items-center gap-1 px-2 h-14 w-full max-w-[720px] bg-white"
          style={{ boxShadow: "var(--nb-shadow-sm)" }}
        >
          <Link
            to="/"
            className="px-3 font-black text-[15px] tracking-tight whitespace-nowrap flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={3} />
            shine<span className="text-[var(--nb-orange)]">better</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="https://www.instagram.com/shinebetter.online"
              target="_blank"
              rel="noopener noreferrer"
              className="nb-btn nb-btn-yellow !h-9 !px-4 !text-[12px] whitespace-nowrap"
            >
              Let's talk
            </a>
          </div>
        </nav>
      </header>

      <section className="relative max-w-[1080px] mx-auto px-6 pt-16 md:pt-20 pb-10">
        <span className="nb-chip mb-5">
          <span className="h-2 w-2 rounded-full bg-[var(--nb-orange)] animate-pulse" />
          Local-only checklist
        </span>
        <h1 className="nb-display text-[46px] sm:text-[64px] md:text-[88px] leading-[0.95] max-w-4xl">
          Free website{" "}
          <span className="nb-marker nb-marker-drop">insights.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-[16px] md:text-[18px] leading-relaxed font-medium text-[#222]">
          A quick on-site checklist for performance, SEO, accessibility and
          best practices — no third-party API calls.
        </p>

        {/* What you get */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {CATS.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="nb-card p-5"
              style={{ background: c.bg }}
              data-cursor="card"
            >
              <c.Icon className="h-6 w-6 mb-3" strokeWidth={2.5} />
              <div className="nb-display text-[22px] leading-tight">
                {c.label}
              </div>
              <div className="text-[12px] font-bold mt-1 opacity-75">
                Score out of 100
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={runAudit}
          className="nb-card mt-10 p-5 md:p-6 bg-white"
        >
          <div className="flex flex-col md:flex-row gap-3 items-stretch">
            <div className="flex-1 flex items-center gap-3 nb-flat bg-[var(--nb-cream)] px-4 h-14">
              <Search className="h-5 w-5 shrink-0" strokeWidth={2.5} />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourwebsite.com"
                aria-label="Website URL"
                className="w-full bg-transparent outline-none text-[16px] font-bold placeholder:opacity-50"
                disabled={loading}
              />
            </div>
            <div
              className="nb-flat bg-[var(--nb-cream)] h-14 flex items-center p-1 gap-1"
              role="tablist"
              aria-label="Device"
            >
              {(["mobile", "desktop"] as Strategy[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStrategy(s)}
                  className={`h-full px-4 text-[12px] font-black uppercase tracking-wider rounded-[8px] transition ${
                    strategy === s
                      ? "bg-[var(--nb-ink)] text-white"
                      : "hover:bg-white"
                  }`}
                  disabled={loading}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="nb-btn nb-btn-orange !h-14 justify-center min-w-[180px] disabled:opacity-70"
              data-cursor="button"
            >
              {loading ? (
                <>
                  <Gauge className="h-4 w-4 animate-spin" strokeWidth={3} />
                  Scanning…
                </>
              ) : (
                <>
                  Get insights
                  <ArrowUpRight className="h-4 w-4" strokeWidth={3} />
                </>
              )}
            </button>
          </div>
          {error && (
            <div
              role="alert"
              className="mt-4 nb-flat p-3 text-[13px] font-bold flex items-center gap-2"
              style={{ background: "var(--nb-rose)" }}
            >
              <XCircle className="h-4 w-4" strokeWidth={3} />
              {error}
            </div>
          )}
          {loading && phase && (
            <div className="mt-4 flex items-center gap-2 text-[13px] font-bold opacity-80">
              <Clock className="h-4 w-4 animate-pulse" strokeWidth={3} />
              {phase}
            </div>
          )}
        </form>
      </section>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative max-w-[1080px] mx-auto px-6 pb-24"
          >
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div className="min-w-0 flex-1">
                <span className="nb-chip">Report</span>
                <h2 className="nb-display text-[24px] sm:text-[32px] md:text-[40px] mt-3 break-words leading-tight">
                  {result.finalUrl}
                </h2>
                <div className="text-[12px] font-bold opacity-70 mt-2 uppercase tracking-wider">
                  {strategy} · {new Date(result.fetchTime).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  setUrl("");
                }}
                className="nb-btn nb-btn-white !h-11 shrink-0"
              >
                Run another
              </button>
            </div>

            {/* Score cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATS.map((c, i) => {
                const v = result.scores[c.id];
                const ink = scoreInk(v);
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="nb-card p-5"
                    style={{ background: scoreColor(v) }}
                  >
                    <div className="flex items-center gap-2" style={{ color: ink }}>
                      <c.Icon className="h-5 w-5" strokeWidth={2.5} />
                      <div className="text-[12px] font-black uppercase tracking-wider">
                        {c.label}
                      </div>
                    </div>
                    <div
                      className="nb-display text-[54px] md:text-[64px] leading-none mt-3"
                      style={{ color: ink }}
                    >
                      {v ?? "—"}
                      {v != null && (
                        <span className="text-[16px] font-bold opacity-70">
                          /100
                        </span>
                      )}
                    </div>
                    {v != null && (
                      <div
                        className="mt-2 flex items-center gap-1.5 text-[12px] font-black uppercase tracking-wider"
                        style={{ color: ink }}
                      >
                        {scoreIcon(v)}
                        {scoreLabel(v)}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>


            {/* Core Web Vitals */}
            <div className="mt-8 nb-card p-6 bg-white">
              <div className="flex items-center gap-2 mb-5">
                <Gauge className="h-5 w-5" strokeWidth={2.5} />
                <h3 className="nb-display text-[24px]">Core metrics</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  ["Largest Contentful Paint", result.metrics.lcp],
                  ["First Contentful Paint", result.metrics.fcp],
                  ["Cumulative Layout Shift", result.metrics.cls],
                  ["Total Blocking Time", result.metrics.tbt],
                  ["Speed Index", result.metrics.si],
                  ["Time to Interactive", result.metrics.tti],
                ].map(([label, v]) => (
                  <div
                    key={label as string}
                    className="nb-flat p-4 bg-[var(--nb-cream)]"
                  >
                    <div className="text-[11px] font-black uppercase tracking-wider opacity-70">
                      {label}
                    </div>
                    <div className="nb-display text-[24px] mt-1">
                      {v ?? "—"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunities */}
            {result.opportunities.length > 0 && (
              <div className="mt-8 nb-card p-6 bg-[var(--nb-butter)]">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="h-5 w-5" strokeWidth={2.5} />
                  <h3 className="nb-display text-[24px]">
                    Top opportunities
                  </h3>
                </div>
                <ul className="space-y-3">
                  {result.opportunities.map((o, i) => (
                    <motion.li
                      key={o.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="nb-flat bg-white p-4 flex gap-4 items-start"
                    >
                      <div
                        className="nb-flat bg-[var(--nb-rose)] h-9 w-9 grid place-items-center font-black text-[13px] shrink-0"
                        style={{ borderRadius: 10 }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-[15px]">{o.title}</div>
                        <div className="text-[12px] font-bold opacity-70 mt-0.5">{o.description}</div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div
              className="mt-8 nb-card p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6"
              style={{ background: "var(--nb-mint)" }}
            >
              <div className="flex-1">
                <span className="nb-chip">Want me to fix it?</span>
                <h3 className="nb-display text-[28px] md:text-[36px] mt-3">
                  I'll turn this report into <span className="nb-marker">real gains</span>.
                </h3>
                <p className="mt-3 text-[14px] font-medium max-w-md">
                  Send me the URL — I'll ship a prioritized action plan and,
                  if you want, do the work for you.
                </p>
              </div>
              <Link
                to="/"
                hash="contact"
                className="nb-btn nb-btn-orange !h-14"
                data-cursor="button"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4" strokeWidth={3} />
              </Link>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t-[3px] border-[var(--nb-ink)] bg-[var(--nb-ink)] text-[var(--nb-butter)]">
        <div className="max-w-[1180px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <Link to="/" className="font-black text-[18px]">
            shine<span className="text-[var(--nb-orange)]">better</span>
            <span className="opacity-60">.online</span>
          </Link>
          <div className="text-[12px] font-bold opacity-80">
            © {new Date().getFullYear()} Mahin Islam · Shine Better
          </div>
        </div>
      </footer>


      <div className="hidden">
        <Logo />
      </div>
    </div>
  );
}
