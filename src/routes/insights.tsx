import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Gauge, Loader2, Search } from "lucide-react";
import { ToolPage, ToolHero, ToolSection } from "@/components/ToolShell";
import { runPageSpeed } from "@/lib/psi.functions";
import { normalizeUrl, runPageSpeedFromBrowser, type PsiCategory, type PsiReport } from "@/lib/psi";

export const Route = createFileRoute("/insights")({
  component: InsightsPage,
  head: () => ({
    meta: [
      { title: "Free Website Speed Report (Lighthouse) | Shine Better" },
      {
        name: "description",
        content:
          "Run a real Google Lighthouse audit on any website. Get performance, accessibility, best practices and SEO scores with the fixes that matter most.",
      },
      { property: "og:title", content: "Free Website Speed Report (Lighthouse)" },
      {
        property: "og:description",
        content:
          "Real Lighthouse scores for any public URL: performance, accessibility, best practices and SEO. Free, no login.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free Website Speed Report" },
      {
        name: "twitter:description",
        content: "Real Lighthouse scores for any public URL. Free, no login.",
      },
    ],
    links: [{ rel: "canonical", href: "/insights" }],
  }),
});

const CATS: { id: PsiCategory; label: string }[] = [
  { id: "performance", label: "Performance" },
  { id: "accessibility", label: "Accessibility" },
  { id: "best-practices", label: "Best Practices" },
  { id: "seo", label: "SEO" },
];

function tone(v: number | null) {
  if (v == null) return { ring: "#D1D5DB", ink: "#6B7280", label: "—" };
  if (v >= 90) return { ring: "#16A34A", ink: "#15803D", label: "Good" };
  if (v >= 50) return { ring: "#F59E0B", ink: "#B45309", label: "Needs work" };
  return { ring: "#DC2626", ink: "#B91C1C", label: "Poor" };
}

function Dial({ value, label, size = 92 }: { value: number | null; label: string; size?: number }) {
  const t = tone(value);
  const pct = value ?? 0;
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="dial"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${t.ring} ${pct * 3.6}deg, var(--surface) 0deg)`,
        }}
      >
        <div
          className="dial grid place-items-center bg-white"
          style={{ width: size - 14, height: size - 14 }}
        >
          <span className="dial-num text-[24px]" style={{ color: t.ink }}>
            {value ?? "—"}
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-[13px] font-medium">{label}</div>
        <div className="text-[11.5px] text-[var(--muted)]">{t.label}</div>
      </div>
    </div>
  );
}

const STEPS = [
  { n: 1, title: "Paste any public URL", body: "Your homepage, a landing page, or a competitor's site. It just needs to be reachable without a login." },
  { n: 2, title: "Pick mobile or desktop", body: "Mobile is throttled and stricter — it's the one Google uses for ranking, so start there." },
  { n: 3, title: "Wait about 20 seconds", body: "Google loads the page in a real headless Chrome instance and measures it. No estimates." },
  { n: 4, title: "Fix the top three", body: "Scores move fastest when you address the highest-impact opportunities first, not all of them." },
];

function InsightsPage() {
  const runAuditFn = useServerFn(runPageSpeed);
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PsiReport | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizeUrl(url)) {
      setError("Please enter a valid website URL, e.g. example.com");
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      let report: PsiReport;
      try {
        report = await runAuditFn({ data: { url, strategy } });
      } catch {
        // Static hosting without a server runtime: call Google directly.
        report = await runPageSpeedFromBrowser(url, strategy);
      }
      setResult(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPage>
      <ToolHero
        eyebrow="Free tool"
        title={
          <>
            Free website <span className="hl">speed report</span>
          </>
        }
        subtitle="Run a real Google Lighthouse audit on any public URL. Performance, accessibility, best practices and SEO — with the fixes worth doing first."
        note="No login. Powered by the Google PageSpeed Insights API."
        actions={
          <>
            <a href="#audit" className="btn btn-primary btn-lg">Run a report</a>
            <Link to="/tools" className="btn btn-secondary btn-lg">More free tools</Link>
          </>
        }
      />

      {/* ---------- Audit form ---------- */}
      <div id="audit" className="container-x relative z-10 -mt-10 scroll-mt-24 md:-mt-14">
        <div className="tool-card mx-auto max-w-[760px] p-6 md:p-8">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#DBEAFE] text-[#1D4ED8]">
              <Gauge className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-[19px] font-semibold tracking-tight">
                Check your website
              </h2>
              <p className="text-[13.5px] text-[var(--muted)]">
                One URL, about twenty seconds, real Lighthouse numbers.
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="psi-url" className="block text-[13.5px] font-medium">
                Website URL
              </label>
              <input
                id="psi-url"
                type="text"
                inputMode="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. shinebetter.online"
                className="tool-field mt-2"
              />
            </div>

            <div>
              <span className="block text-[13.5px] font-medium">Device</span>
              <div
                className="mt-2 inline-flex rounded-[12px] border p-1"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                {(["mobile", "desktop"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStrategy(s)}
                    className={`rounded-[9px] px-4 py-1.5 text-[13.5px] font-medium capitalize transition-colors ${
                      strategy === s ? "bg-white shadow-sm text-[var(--ink)]" : "text-[var(--muted)]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? "Analysing with Lighthouse…" : "Run the report"}
            </button>

            {error && (
              <p className="rounded-[10px] border px-3 py-2 text-[13.5px]" style={{ borderColor: "#FCA5A5", background: "#FEF2F2", color: "#B91C1C" }}>
                {error}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* ---------- Results ---------- */}
      {result && (
        <div className="container-x mt-12">
          <div className="mx-auto max-w-[900px]">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="tool-h2 text-[26px] md:text-[34px]">Your results</h2>
              <p className="text-[13px] text-[var(--muted)]">
                {result.strategy} · {new Date(result.fetchTime).toLocaleString()}
              </p>
            </div>
            <p className="mt-1 break-all text-[13.5px] text-[var(--muted)]">{result.finalUrl}</p>

            <div className="tool-card mt-6 grid grid-cols-2 gap-6 p-7 sm:grid-cols-4">
              {CATS.map((c) => (
                <Dial key={c.id} value={result.scores[c.id]} label={c.label} />
              ))}
            </div>

            {result.metrics.length > 0 && (
              <div className="mt-6">
                <h3 className="font-display text-[16px] font-semibold tracking-tight">Core metrics</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {result.metrics.map((m) => {
                    const t = tone(m.score);
                    return (
                      <div key={m.id} className="step-card bg-white">
                        <div className="text-[12.5px] text-[var(--muted)]">{m.label}</div>
                        <div className="font-display mt-1 text-[20px] font-semibold" style={{ color: t.ink }}>
                          {m.display}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {result.opportunities.length > 0 && (
              <div className="mt-8">
                <h3 className="font-display text-[16px] font-semibold tracking-tight">
                  Biggest opportunities
                </h3>
                <div className="mt-3 divide-y rounded-[14px] border bg-white" style={{ borderColor: "var(--border)" }}>
                  {result.opportunities.map((o) => (
                    <div key={o.id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-[14.5px] font-semibold">{o.title}</h4>
                        {o.display && (
                          <span className="shrink-0 text-[12.5px] font-medium text-[var(--muted)]">
                            {o.display}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--muted)]">
                        {o.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------- TL;DR ---------- */}
      <div className="container-x mt-16">
        <div className="mx-auto max-w-[820px] rounded-[18px] p-7 text-center md:p-9" style={{ background: "var(--surface)" }}>
          <div className="tool-eyebrow">TL;DR</div>
          <p className="mt-3 text-[16px] leading-relaxed text-[var(--ink-2)] md:text-[17px]">
            Lighthouse is the audit engine built into Chrome that Google uses to score page
            experience. This tool runs it against your URL through the official PageSpeed Insights
            API and shows the four category scores plus the specific fixes that would move them
            most. Mobile performance is the score that affects rankings.
          </p>
        </div>
      </div>

      {/* ---------- How it works ---------- */}
      <ToolSection eyebrow="How it works" title={<>How to read your Lighthouse report</>}>
        <p className="max-w-[820px] text-[15.5px] leading-relaxed text-[var(--ink-2)]">
          Scores run 0–100. Anything at 90 or above is good, 50–89 needs work, and below 50 is
          poor. Performance is the volatile one — it depends on network conditions, so run it a
          couple of times and look at the trend rather than a single number.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {STEPS.map((s) => (
            <div key={s.n} className="step-card">
              <span className="step-num">{s.n}</span>
              <h3 className="font-display mt-3 text-[15.5px] font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--muted)]">{s.body}</p>
            </div>
          ))}
        </div>
      </ToolSection>

      {/* ---------- CTA ---------- */}
      <div className="container-x">
        <div className="card-dark relative overflow-hidden p-8 text-center md:p-12">
          <h2 className="font-display text-[28px] font-semibold leading-tight text-white md:text-[40px]" style={{ letterSpacing: "-0.035em" }}>
            Scores in the red?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
            Shine Better rebuilds slow sites into fast ones. Send me the report and I'll tell you
            what's actually worth fixing.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/" hash="contact" className="btn btn-accent btn-lg">Start a project</Link>
            <Link to="/tools" className="btn btn-secondary btn-lg">Other free tools</Link>
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
