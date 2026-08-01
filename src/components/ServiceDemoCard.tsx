import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

type DemoKind = "web" | "design" | "youtube" | "map" | "marketing";

export function ServiceDemoCard({
  icon: Icon,
  title,
  desc,
  color,
  demo,
  index,
  total,
  href,
  ctaLabel = "Read More",
  disabled = false,
  className = "",
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  demo: DemoKind;
  index: number;
  total: number;
  href?: string;
  ctaLabel?: string;
  disabled?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => e && setInView(e.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const active = hover || inView;

  const inner = (
    <>
      <div className="flex items-center justify-between mb-5">
        <div
          className="nb-flat bg-white h-11 w-11 flex items-center justify-center transition-transform group-hover:rotate-[-8deg]"
          style={{ borderRadius: 12 }}
        >
          <Icon className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <span className="font-black text-[12px] opacity-70">
          0{index + 1} / 0{total}
        </span>
      </div>

      <h3 className="nb-display text-[26px] mb-2">{title}</h3>
      <p className="text-[13.5px] leading-relaxed font-medium text-[#1f1f1f]/85 mb-5">
        {desc}
      </p>

      <div className="nb-flat bg-white overflow-hidden h-[140px] mb-4 relative">
        {demo === "web" && <WebDemo active={active} />}
        {demo === "design" && <DesignDemo active={active} />}
        {demo === "youtube" && <YouTubeDemo active={active} />}
        {demo === "map" && <MapDemo active={active} />}
        {demo === "marketing" && <MarketingDemo active={active} />}
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span
          className={`text-[12px] font-black uppercase tracking-wider ${
            disabled ? "opacity-50" : ""
          }`}
        >
          {ctaLabel}
        </span>
        {!disabled && (
          <ArrowUpRight
            className="h-5 w-5 transition-transform group-hover:rotate-45"
            strokeWidth={3}
          />
        )}
      </div>
    </>
  );

  const wrapperProps = {
    ref,
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: {
      duration: 0.55,
      delay: index * 0.05,
      ease: [0.22, 1, 0.36, 1] as const,
    },
    whileHover: disabled ? undefined : { y: -6 },
    onHoverStart: () => setHover(true),
    onHoverEnd: () => setHover(false),
    "data-cursor": disabled ? undefined : "card",
    className: `nb-card solution-card p-6 flex flex-col group ${
      disabled ? "cursor-not-allowed opacity-95" : ""
    } ${className}`,
    style: { background: color },
  } as const;

  if (href && !disabled) {
    return (
      <motion.div {...wrapperProps}>
        <a href={href} className="flex flex-col h-full" data-cursor="card">
          {inner}
        </a>
      </motion.div>
    );
  }

  return <motion.div {...wrapperProps}>{inner}</motion.div>;
}

/* ---------- demos (unchanged) ---------- */

function WebDemo({ active }: { active: boolean }) {
  const [chars, setChars] = useState(0);
  const line = "<h1>hello.world</h1>";
  useEffect(() => {
    if (!active) return;
    setChars(0);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setChars(i);
      if (i >= line.length) clearInterval(t);
    }, 55);
    return () => clearInterval(t);
  }, [active]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="h-6 bg-[var(--nb-cream)] border-b-[2.5px] border-[var(--nb-ink)] flex items-center gap-1 px-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[9px] font-bold opacity-60">shinebetter.online</span>
      </div>
      <div className="flex-1 p-3 font-mono text-[11px] leading-relaxed">
        <span className="opacity-40">1</span>{" "}
        <span>{line.slice(0, chars)}</span>
        <span className="inline-block w-[6px] h-[12px] bg-[var(--nb-ink)] ml-0.5 align-middle animate-pulse" />
      </div>
    </div>
  );
}

function DesignDemo({ active }: { active: boolean }) {
  return (
    <div className="h-full w-full grid grid-cols-[1fr_auto] items-center gap-3 px-3">
      <svg viewBox="0 0 100 60" className="h-full w-full">
        <motion.path
          d="M10 45 Q 25 10, 50 30 T 90 20"
          fill="none"
          stroke="var(--nb-ink)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: active ? 1 : 0 }}
          transition={{ duration: 1.3, ease: "easeInOut" }}
        />
        <motion.circle
          cx="50" cy="30" r="4" fill="var(--nb-orange)"
          initial={{ scale: 0 }}
          animate={{ scale: active ? 1 : 0 }}
          transition={{ delay: 0.7 }}
        />
      </svg>
      <div className="flex flex-col gap-1.5">
        {["#FF8A3D", "#FFE680", "#B6E8D8", "#C9D2F4"].map((c, i) => (
          <motion.div
            key={c}
            initial={{ scale: 0 }}
            animate={{ scale: active ? 1 : 0 }}
            transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 500 }}
            className="h-4 w-8 rounded border-[2px] border-[var(--nb-ink)]"
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
}

function YouTubeDemo({ active }: { active: boolean }) {
  const [views, setViews] = useState(0);
  useEffect(() => {
    if (!active) return;
    setViews(0);
    const t = setInterval(() => setViews((v) => (v < 128000 ? v + 4200 : 128000)), 30);
    return () => clearInterval(t);
  }, [active]);
  return (
    <div className="h-full w-full flex flex-col p-3 gap-2">
      <div className="flex items-center gap-2">
        <div className="h-6 w-9 rounded-[4px] bg-[#FF0000] grid place-items-center">
          <div className="w-0 h-0 border-l-[7px] border-l-white border-y-[4px] border-y-transparent ml-0.5" />
        </div>
        <div className="text-[11px] font-black">
          {views.toLocaleString()}
          <span className="opacity-60 font-bold"> views</span>
        </div>
      </div>
      <svg viewBox="0 0 100 40" className="w-full h-14">
        <motion.polyline
          points="0,35 15,30 30,25 45,22 60,15 75,10 90,6 100,3"
          fill="none" stroke="var(--nb-ink)" strokeWidth={2.5}
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: active ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.polygon
          points="0,35 15,30 30,25 45,22 60,15 75,10 90,6 100,3 100,40 0,40"
          fill="var(--nb-orange)" opacity={0.25}
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 0.25 : 0 }}
          transition={{ delay: 1 }}
        />
      </svg>
    </div>
  );
}

function MapDemo({ active }: { active: boolean }) {
  return (
    <div className="h-full w-full relative overflow-hidden"
         style={{
           background:
             "linear-gradient(#e8f0dc 1px, transparent 1px) 0 0/16px 16px, linear-gradient(90deg,#e8f0dc 1px,transparent 1px) 0 0/16px 16px, #f4f7ee",
         }}>
      <div className="absolute inset-0">
        <div className="absolute left-0 right-0 top-[45%] h-[3px] bg-[var(--nb-ink)]/70" />
        <div className="absolute top-0 bottom-0 left-[38%] w-[3px] bg-[var(--nb-ink)]/70" />
      </div>
      {[
        { x: "22%", y: "30%", d: 0 },
        { x: "55%", y: "58%", d: 0.2 },
        { x: "72%", y: "28%", d: 0.4 },
      ].map((p, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: active ? 0 : -20, opacity: active ? 1 : 0 }}
          transition={{ delay: p.d, type: "spring", stiffness: 400, damping: 14 }}
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: p.x, top: p.y }}
        >
          <div
            className="w-5 h-5 rounded-full border-[2.5px] border-[var(--nb-ink)]"
            style={{ background: i === 1 ? "var(--nb-orange)" : "#fff" }}
          />
          <div className="w-[2.5px] h-2 bg-[var(--nb-ink)] mx-auto" />
        </motion.div>
      ))}
      <div className="absolute bottom-1.5 right-2 nb-flat bg-white px-1.5 py-0.5 text-[9px] font-black">
        #1 in area
      </div>
    </div>
  );
}

function MarketingDemo({ active }: { active: boolean }) {
  const bars = [30, 55, 42, 78, 62, 92];
  return (
    <div className="h-full w-full p-3 flex items-end gap-1.5">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: active ? `${h}%` : 0 }}
          transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 border-[2.5px] border-[var(--nb-ink)] rounded-t-md"
          style={{ background: i === bars.length - 1 ? "var(--nb-orange)" : "var(--nb-butter)" }}
        />
      ))}
    </div>
  );
}
