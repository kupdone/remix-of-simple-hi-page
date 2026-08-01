export function Logo({ className = "", inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      <img
        src="/brand/shinebetter-mark.png"
        alt=""
        width="28"
        height="28"
        aria-hidden="true"
        className={`h-7 w-7 shrink-0 object-contain ${inverted ? "invert" : ""}`}
      />
      <span
        className="font-display truncate text-[16px] font-semibold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        shinebetter
      </span>
    </div>
  );
}
