/**
 * Large gradient closing band that fades into a bluish tone with the
 * brand wordmark set oversized in white — used as the last section on
 * marketing and tool pages.
 */
export function WordmarkBand({ className = "" }: { className?: string }) {
  return (
    <div
      className={`wordmark-band wordmark-band-dark relative ${className}`}
      aria-hidden="true"
    >
      <div className="relative mx-auto flex max-w-[1400px] items-end justify-center px-4 pb-0 pt-16 md:pt-24">
        <img
          src="/brand/shinebetter-mark.png"
          alt=""
          className="wordmark-glyph hidden brightness-0 invert md:block"
          loading="lazy"
          decoding="async"
        />
        <span className="wordmark-text block translate-y-[14%] text-[19vw] leading-none md:text-[17vw]">
          shinebetter
        </span>
      </div>
    </div>
  );
}
