import { useEffect, useState } from "react";

export function ShaderBackground() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
      {/* CSS fallback — brushed black swirl */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 30%, rgba(60, 60, 60, 0.55) 0%, transparent 65%)," +
            "radial-gradient(70% 55% at 75% 80%, rgba(30, 30, 30, 0.6) 0%, transparent 70%)," +
            "radial-gradient(40% 40% at 50% 50%, rgba(232, 255, 58, 0.06) 0%, transparent 70%)," +
            "linear-gradient(180deg, #050505 0%, #0a0a0a 100%)",
        }}
      />

      {mounted && size.w > 0 && (
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              "conic-gradient(from 140deg at 50% 50%, transparent 0deg, rgba(232,255,58,0.14) 80deg, transparent 150deg, rgba(255,255,255,0.08) 240deg, transparent 360deg)",
            transform: `scale(${Math.max(1, size.w / Math.max(size.h, 1))})`,
          }}
        />
      )}

      {/* very light vignette only — keep the shader visible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </div>
  );
}
