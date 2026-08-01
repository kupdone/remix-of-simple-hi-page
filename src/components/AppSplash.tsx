import { useEffect, useState } from "react";

export function AppSplash() {
  const [hidden, setHidden] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setFading(true);
      setTimeout(() => setHidden(true), 260);
    };
    // Don't wait on window "load" (images/video); paint + fonts is enough.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) fonts.ready.then(finish).catch(finish);
    const timeout = setTimeout(finish, 900);
    return () => clearTimeout(timeout);
  }, []);


  if (hidden) return null;


  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: "var(--bg)" }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-5">
        <img
          src="/brand/shinebetter-mark.png"
          alt=""
          width="52"
          height="52"
          className="h-12 w-12 animate-pulse object-contain"
        />
        <div
          className="font-display text-[22px] font-semibold text-[var(--ink)]"
          style={{ letterSpacing: "-0.03em" }}
        >
          shinebetter
        </div>
        <div className="h-[3px] w-24 overflow-hidden rounded-full bg-[var(--surface-2)]">
          <div
            className="h-full w-full origin-left bg-[var(--ink)]"
            style={{ animation: "nbLoad 1.2s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  );
}
