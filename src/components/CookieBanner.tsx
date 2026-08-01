import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const COOKIE_PREF_KEY = "shinebetter_cookie_choice";
export const COOKIE_OPEN_EVENT = "sb:open-cookie-preferences";

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(COOKIE_PREF_KEY);
    if (saved !== "saved") {
      const t = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(t);
    }
    const handler = () => { setCustomizing(false); setOpen(true); };
    window.addEventListener(COOKIE_OPEN_EVENT, handler);
    return () => window.removeEventListener(COOKIE_OPEN_EVENT, handler);
  }, []);

  const close = () => {
    window.localStorage.setItem(COOKIE_PREF_KEY, "saved");
    setOpen(false);
    setCustomizing(false);
  };
  const acceptAll = () => { setAnalytics(true); setMarketing(true); close(); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[70] md:bottom-6 md:left-auto md:right-6 md:w-[400px]"
          role="dialog"
          aria-live="polite"
        >
          <div
            className="overflow-hidden rounded-2xl bg-white p-5"
            style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}
          >
            {!customizing ? (
              <>
                <div className="mb-1 text-[13px] font-medium text-[var(--muted)]">
                  Cookies
                </div>
                <h3 className="font-display text-[17px] font-semibold text-[var(--ink)]">
                  We use cookies to improve your experience.
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted)]">
                  Essential cookies keep the site working. Analytics and marketing
                  cookies are off by default.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={acceptAll} className="btn btn-primary btn-sm">Accept all</button>
                  <button onClick={() => setCustomizing(true)} className="btn btn-secondary btn-sm">
                    Customize
                  </button>
                  <button onClick={close} className="btn btn-ghost btn-sm">Essential only</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-display text-[17px] font-semibold text-[var(--ink)]">
                  Cookie preferences
                </h3>
                <div className="mt-4 space-y-2">
                  <Row label="Essential" desc="Required for the site to work." locked />
                  <Row label="Analytics" desc="Helps understand what pages work best." on={analytics} onChange={() => setAnalytics(v => !v)} />
                  <Row label="Marketing" desc="Keeps future offers more relevant." on={marketing} onChange={() => setMarketing(v => !v)} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={close} className="btn btn-primary btn-sm">Save choices</button>
                  <button onClick={() => setCustomizing(false)} className="btn btn-ghost btn-sm">Back</button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, desc, on, onChange, locked }: { label: string; desc: string; on?: boolean; onChange?: () => void; locked?: boolean }) {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl p-3"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div>
        <div className="text-[13px] font-semibold text-[var(--ink)]">{label}</div>
        <div className="text-[12px] text-[var(--muted)]">{desc}</div>
      </div>
      {locked ? (
        <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">Always on</span>
      ) : (
        <button
          type="button"
          onClick={onChange}
          aria-pressed={on}
          className={`cookie-toggle ${on ? "is-on" : ""}`}
        >
          <span />
        </button>
      )}
    </div>
  );
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(COOKIE_OPEN_EVENT));
}
