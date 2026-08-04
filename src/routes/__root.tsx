import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppSplash } from "@/components/AppSplash";
import { CookieBanner } from "@/components/CookieBanner";
import { TransitionOrigin } from "@/components/TransitionOrigin";
import { Analytics } from "@/components/Analytics";

const SITE_URL = "https://shinebetter.online";
const GSC_VERIFICATION = import.meta.env.VITE_GSC_VERIFICATION as string | undefined;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-semibold text-[var(--ink)]">404</h1>
        <h2 className="mt-4 text-lg font-medium text-[var(--ink)]">Page not found</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn btn-primary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold text-[var(--ink)]">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Something went wrong. Try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn btn-primary"
          >
            Try again
          </button>
          <a href="/" className="btn btn-secondary">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Mahin Islam" },
      { name: "theme-color", content: "#FBFBFA" },
      { property: "og:site_name", content: "Shine Better" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(GSC_VERIFICATION
        ? [{ name: "google-site-verification", content: GSC_VERIFICATION }]
        : []),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/inter-400-latin.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "/fonts/space-grotesk-600-latin.woff2",
        crossOrigin: "anonymous",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "Shine Better",
              url: SITE_URL,
              description:
                "Shine Better is a digital studio crafting thoughtful websites, memorable brands, and digital experiences for businesses of every stage.",
              founder: { "@type": "Person", name: "Mahin Islam" },
            },
            {
              "@type": "ProfessionalService",
              "@id": `${SITE_URL}/#localbusiness`,
              name: "Shine Better",
              url: SITE_URL,
              image: `${SITE_URL}/favicon.png`,
              priceRange: "$$",
              areaServed: ["Australia", "United States", "United Kingdom"],
              serviceType: [
                "Website design and development",
                "Website redesign",
                "Shopify development",
                "Local SEO",
                "Social media management",
                "AI business automation",
              ],
            },
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: "Shine Better",
              publisher: { "@id": `${SITE_URL}/#organization` },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <TransitionOrigin />
      <Analytics />
      <AppSplash />

      <Outlet />
      <CookieBanner />
    </QueryClientProvider>
  );
}
