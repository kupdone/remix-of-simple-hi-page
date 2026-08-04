import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Loads GA4 (only when VITE_GA_MEASUREMENT_ID is set) and sends a page_view
 * on every client-side route change.
 */
export function Analytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!GA_ID || typeof window === "undefined") return;
    if (window.gtag) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: false });
  }, []);

  useEffect(() => {
    if (!GA_ID) return;
    window.gtag?.("event", "page_view", { page_path: pathname });
  }, [pathname]);

  return null;
}
