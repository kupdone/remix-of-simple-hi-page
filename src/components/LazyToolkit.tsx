import { Suspense, lazy, useEffect, useRef, useState } from "react";

const MatterToolkit = lazy(() =>
  import("@/components/MatterToolkit").then((m) => ({ default: m.MatterToolkit })),
);

/**
 * matter-js is ~90kb of physics. Only fetch it once the section is close
 * to the viewport, and never on small screens where it adds nothing.
 */
export function LazyToolkit() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[220px]">
      {show && (
        <Suspense fallback={null}>
          <MatterToolkit />
        </Suspense>
      )}
    </div>
  );
}
