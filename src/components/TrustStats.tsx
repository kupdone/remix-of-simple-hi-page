import { motion } from "motion/react";
import { CountUp } from "./CountUp";

const stats = [
  { to: 120, suffix: "+", label: "Projects delivered", bg: "var(--nb-butter)" },
  { to: 18, suffix: "", label: "Countries served", bg: "var(--nb-mint)" },
  { to: 98, suffix: "%", label: "Client satisfaction", bg: "var(--nb-rose)" },
  { to: 48, suffix: "h", label: "First draft, avg.", bg: "var(--nb-peri)" },
];

export function TrustStats() {
  return (
    <section className="relative max-w-[1180px] mx-auto px-6 py-20">
      <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
        <div>
          <span className="nb-chip mb-4">Receipts</span>
          <h2 className="nb-display text-[40px] md:text-[64px] max-w-2xl">
            Small studio. <span className="nb-marker">Real numbers.</span>
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={{ y: -4 }}
            className="nb-card p-6"
            style={{ background: s.bg }}
            data-cursor="card"
          >
            <div className="nb-display text-[54px] md:text-[64px] leading-none">
              <CountUp to={s.to} suffix={s.suffix} />
            </div>
            <div className="text-[12px] font-black uppercase tracking-wider mt-3">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
