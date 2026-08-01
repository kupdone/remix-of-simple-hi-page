import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, ArrowUpRight } from "lucide-react";

type Phase = "hidden" | "scanning" | "results";

export function AuditWidget() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("hidden");
  const [score, setScore] = useState(0);
  const [seo, setSeo] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Reveal after landing
  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => {
      setOpen(true);
      setPhase("scanning");
    }, 2400);
    return () => clearTimeout(t);
  }, [dismissed]);

  // Scanning → results
  useEffect(() => {
    if (phase !== "scanning") return;
    const t = setTimeout(() => setPhase("results"), 2600);
    return () => clearTimeout(t);
  }, [phase]);

  // Count-ups
  useEffect(() => {
    if (phase !== "results") return;
    const targets = { score: 62, seo: 8, speed: 5 };
    const start = performance.now();
    const dur = 1200;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setScore(Math.round(targets.score * e));
      setSeo(Math.round(targets.seo * e));
      setSpeed(Math.round(targets.speed * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const close = () => {
    setOpen(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="fixed bottom-6 left-6 z-[55] w-[300px] max-w-[calc(100vw-96px)]"
          data-cursor="card"
        >
          <div
            className="nb-card p-4"
            style={{ background: "var(--nb-cream)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inset-0 rounded-full bg-[var(--nb-orange)] animate-ping opacity-70" />
                <span className="relative rounded-full bg-[var(--nb-orange)] h-2.5 w-2.5" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider">
                Live site scan
              </span>
              <button
                onClick={close}
                aria-label="Close"
                className="ml-auto -mr-1 h-7 w-7 grid place-items-center rounded-full hover:bg-[var(--nb-butter)]"
              >
                <X className="h-3.5 w-3.5" strokeWidth={3} />
              </button>
            </div>

            {phase === "scanning" && (
              <div>
                <div className="text-[15px] font-black mb-2">
                  Scanning your website…
                </div>
                <div className="h-2 w-full rounded-full bg-white border-[2.5px] border-[var(--nb-ink)] overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.4, ease: "easeInOut" }}
                    className="h-full bg-[var(--nb-orange)]"
                  />
                </div>
                <ul className="mt-3 space-y-1 text-[12px] font-bold">
                  <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    ✓ Fetching structure
                  </motion.li>
                  <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                    ✓ Checking SEO signals
                  </motion.li>
                  <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                    ✓ Measuring speed
                  </motion.li>
                </ul>
              </div>
            )}

            {phase === "results" && (
              <div>
                <div className="flex items-end gap-3 mb-3">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-70">
                      Website score
                    </div>
                    <div className="nb-display text-[42px] leading-none mt-1">
                      {score}
                      <span className="text-[16px] font-bold">/100</span>
                    </div>
                  </div>
                  <div className="ml-auto grid gap-1 text-right">
                    <div className="text-[11px] font-bold">
                      <span className="nb-marker inline-block !py-0 !px-1.5 text-[11px]">
                        {seo}
                      </span>{" "}
                      SEO wins
                    </div>
                    <div className="text-[11px] font-bold">
                      <span className="nb-marker inline-block !py-0 !px-1.5 text-[11px]" style={{ background: "var(--nb-mint)" }}>
                        {speed}
                      </span>{" "}
                      speed wins
                    </div>
                  </div>
                </div>
                <a
                  href="#contact"
                  className="nb-btn nb-btn-orange w-full justify-center !h-11 !text-[13px]"
                >
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={3} />
                  Get my free audit
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={3} />
                </a>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
