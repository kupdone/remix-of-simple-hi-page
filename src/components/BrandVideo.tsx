import { useEffect, useRef, useState } from "react";

/**
 * Loads the brand loop only when it scrolls near the viewport, so the
 * homepage never pays for it during first paint.
 */
export function BrandVideo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative mt-6 overflow-hidden rounded-2xl border"
      style={{ borderColor: "var(--border)", aspectRatio: "540 / 960" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <img
        src="/media/logomotion-poster.jpg"
        alt="Shine Better logo animation"
        width={540}
        height={960}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {active && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/media/logomotion-poster.jpg"
          controls={false}
          disablePictureInPicture
          controlsList="nodownload noremoteplayback nofullscreen"
          onContextMenu={(e) => e.preventDefault()}
          className="pointer-events-none absolute inset-0 block h-full w-full select-none object-cover"
        >
          <source src="/media/logomotion.webm" type="video/webm" />
          <source src="/media/logomotion.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0" aria-hidden="true" />
    </div>
  );
}
