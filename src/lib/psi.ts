export type PsiCategory = "performance" | "accessibility" | "best-practices" | "seo";

export interface PsiMetric {
  id: string;
  label: string;
  display: string;
  score: number | null;
}

export interface PsiOpportunity {
  id: string;
  title: string;
  description: string;
  display: string;
  score: number | null;
}

export interface PsiReport {
  finalUrl: string;
  strategy: "mobile" | "desktop";
  fetchTime: string;
  scores: Record<PsiCategory, number | null>;
  metrics: PsiMetric[];
  opportunities: PsiOpportunity[];
}

const METRIC_LABELS: Record<string, string> = {
  "first-contentful-paint": "First Contentful Paint",
  "largest-contentful-paint": "Largest Contentful Paint",
  "total-blocking-time": "Total Blocking Time",
  "cumulative-layout-shift": "Cumulative Layout Shift",
  "speed-index": "Speed Index",
  interactive: "Time to Interactive",
};

function toScore(v: unknown): number | null {
  return typeof v === "number" ? Math.round(v * 100) : null;
}

export function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withScheme);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname.includes(".")) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function buildPsiUrl(target: string, strategy: string, apiKey?: string) {
  const params = new URLSearchParams();
  params.set("url", target);
  params.set("strategy", strategy);
  for (const c of ["performance", "accessibility", "best-practices", "seo"]) {
    params.append("category", c);
  }
  if (apiKey) params.set("key", apiKey);
  return `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`;
}

export function parsePsiPayload(json: any, strategy: "mobile" | "desktop"): PsiReport {
  const lh = json?.lighthouseResult ?? {};
  const cats = lh.categories ?? {};
  const audits = lh.audits ?? {};

  const metrics: PsiMetric[] = Object.keys(METRIC_LABELS)
    .filter((id) => audits[id])
    .map((id) => ({
      id,
      label: METRIC_LABELS[id],
      display: audits[id]?.displayValue ?? "—",
      score: toScore(audits[id]?.score),
    }));

  const opportunities: PsiOpportunity[] = Object.values<any>(audits)
    .filter(
      (a) =>
        a &&
        typeof a.score === "number" &&
        a.score < 0.9 &&
        (a.details?.type === "opportunity" || a.details?.type === "table") &&
        a.title,
    )
    .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
    .slice(0, 8)
    .map((a) => ({
      id: a.id,
      title: a.title,
      description: String(a.description ?? "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
      display: a.displayValue ?? "",
      score: toScore(a.score),
    }));

  return {
    finalUrl: lh.finalUrl ?? json?.id ?? "",
    strategy,
    fetchTime: lh.fetchTime ?? new Date().toISOString(),
    scores: {
      performance: toScore(cats.performance?.score),
      accessibility: toScore(cats.accessibility?.score),
      "best-practices": toScore(cats["best-practices"]?.score),
      seo: toScore(cats.seo?.score),
    },
    metrics,
    opportunities,
  };
}

/** Browser fallback: PageSpeed Insights accepts keyless requests (lower quota). */
export async function runPageSpeedFromBrowser(
  url: string,
  strategy: "mobile" | "desktop",
): Promise<PsiReport> {
  const target = normalizeUrl(url);
  if (!target) throw new Error("That doesn't look like a valid website URL.");
  const key = import.meta.env.VITE_PSI_API_KEY as string | undefined;
  const res = await fetch(buildPsiUrl(target, strategy, key));
  if (!res.ok) {
    throw new Error("Google couldn't analyse that URL. Check it's public and try again.");
  }
  return parsePsiPayload(await res.json(), strategy);
}
