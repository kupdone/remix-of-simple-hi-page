import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [variant, setVariant] = useState<"default" | "button" | "card" | "view">("default");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;
    document.documentElement.classList.add("nb-cursor-on");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%,-50%)`;
      }
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%,-50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor], a, button, input, textarea, [role='button']",
      );
      if (!t) {
        setVariant("default");
        setLabel(null);
        return;
      }
      const v = t.dataset.cursor;
      if (v === "view") {
        setVariant("view");
        setLabel("VIEW");
      } else if (v === "card") {
        setVariant("card");
        setLabel(null);
      } else if (t.tagName === "A" || t.tagName === "BUTTON" || v === "button") {
        setVariant("button");
        setLabel(null);
      } else if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") {
        setVariant("default");
        setLabel(null);
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        className={`nb-cursor-dot nb-cursor-${variant}`}
        aria-hidden
      />
      <div
        ref={ring}
        className={`nb-cursor-ring nb-cursor-${variant}`}
        aria-hidden
      >
        {label && <span className="nb-cursor-label">{label}</span>}
      </div>
    </>
  );
}
