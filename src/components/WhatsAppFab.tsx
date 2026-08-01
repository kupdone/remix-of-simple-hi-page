import { MessageCircle } from "lucide-react";

const WA_NUMBER = "8801863861872"; // +880 1863861872
const WA_TEXT = encodeURIComponent(
  "Hi shinebetter.online — I'd like to talk about a project.",
);

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp: 01863861872"
      className="fixed bottom-6 right-6 z-[60] group"
    >
      <span className="absolute inset-0 rounded-full pulse-glow" aria-hidden />
      <span
        className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-transform duration-300 group-hover:scale-110"
        style={{
          background:
            "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
          boxShadow:
            "0 8px 24px -4px rgba(37,211,102,0.55), 0 0 0 1px rgba(255,255,255,0.15) inset",
        }}
      >
        <MessageCircle className="h-6 w-6" strokeWidth={2} fill="currentColor" />
      </span>
      <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-[12px] text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
        WhatsApp · 01863861872
      </span>
    </a>
  );
}
