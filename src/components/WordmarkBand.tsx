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
        <span className="wordmark-text block translate-y-[16%] text-[15.5vw] leading-none">
          shinebetter
        </span>
      </div>
    </div>
  );
}
