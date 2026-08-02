import { useEffect } from "react";

/**
 * Records where the user last pressed so the radial page transition
 * (::view-transition-new(root)) can expand from that exact point.
 * Also paints a very short ripple so the press feels acknowledged
 * before the new page wipes in.
 */
export function TransitionOrigin() {
  useEffect(() => {
    const root = document.documentElement;

    const setOrigin = (x: number, y: number) => {
      root.style.setProperty("--vt-x", `${(x / window.innerWidth) * 100}%`);
      root.style.setProperty("--vt-y", `${(y / window.innerHeight) * 100}%`);
    };

    const onPointerDown = (e: PointerEvent) => {
      setOrigin(e.clientX, e.clientY);

      const target = (e.target as HTMLElement | null)?.closest(
        "a[href], button, .nav-link, .menu-link, .sol-row",
      );
      if (!target) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const size = 220;
      const ripple = document.createElement("span");
      ripple.className = "vt-ripple";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - size / 2}px`;
      ripple.style.top = `${e.clientY - size / 2}px`;
      document.body.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 520);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const el = document.activeElement as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setOrigin(r.left + r.width / 2, r.top + r.height / 2);
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("keydown", onKeyDown, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
