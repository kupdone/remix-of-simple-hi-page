import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import { ToolPage, ToolHero, ToolSection } from "@/components/ToolShell";

export const Route = createFileRoute("/tools/whatsapp-link-generator")({
  component: WhatsAppLinkGenerator,
  head: () => ({
    meta: [
      { title: "Free WhatsApp Link Generator (wa.me) | Shine Better" },
      {
        name: "description",
        content:
          "Generate a WhatsApp click-to-chat link in seconds. Add your number, an optional prefilled message, and copy a wa.me link for ads, emails or your website.",
      },
      { property: "og:title", content: "Free WhatsApp Link Generator (wa.me)" },
      {
        property: "og:description",
        content:
          "Create a wa.me click-to-chat link with a prefilled message. Free, no login, generated in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free WhatsApp Link Generator" },
      {
        name: "twitter:description",
        content: "Create a wa.me click-to-chat link with a prefilled message. Free and instant.",
      },
    ],
    links: [{ rel: "canonical", href: "/tools/whatsapp-link-generator" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "WhatsApp Link Generator",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description:
            "Generate a WhatsApp click-to-chat (wa.me) link with an optional prefilled message.",
        }),
      },
    ],
  }),
});

const STEPS = [
  {
    n: 1,
    title: "Enter your phone number",
    body: "Include the country code but no plus sign (+). For a US number, enter the digits starting with 1 (e.g. 15551234567).",
  },
  {
    n: 2,
    title: "Write a prefilled message",
    body: "Optional. The text appears pre-typed in the customer's chat window. Use it to add context: \"Hi, I have a question about my order.\"",
  },
  {
    n: 3,
    title: "Copy the generated link",
    body: "Click Copy link. Your wa.me link is ready — nothing is sent to a server.",
  },
  {
    n: 4,
    title: "Place it anywhere",
    body: "Drop it on a website button, email signature, Instagram bio, packaging insert, or ad CTA.",
  },
];

function WhatsAppLinkGenerator() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const digits = useMemo(() => phone.replace(/\D/g, ""), [phone]);

  const link = useMemo(() => {
    if (!digits) return "";
    const base = `https://wa.me/${digits}`;
    return message.trim() ? `${base}?text=${encodeURIComponent(message.trim())}` : base;
  }, [digits, message]);

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <ToolPage>
      <ToolHero
        eyebrow="Free tool"
        title={
          <>
            Free WhatsApp <span className="hl">link generator</span>
          </>
        }
        subtitle="Generate a wa.me click-to-chat link in seconds. Enter your number, add a prefilled message, and copy a link you can drop into ads, emails, packaging, or your website."
        note="No login. No limits. Generated client-side in your browser."
        actions={
          <>
            <a href="#generator" className="btn btn-primary btn-lg">Use the generator</a>
            <Link to="/tools" className="btn btn-secondary btn-lg">More free tools</Link>
          </>
        }
      />

      {/* ---------- Generator ---------- */}
      <div id="generator" className="container-x -mt-10 md:-mt-14">
        <div className="tool-card mx-auto max-w-[760px] p-6 md:p-8">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#DCFCE7] text-[#166534]">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-[19px] font-semibold tracking-tight">
                Create your wa.me link
              </h2>
              <p className="text-[13.5px] text-[var(--muted)]">
                Type your number, add an optional message, copy the result. That's it.
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-5">
            <div>
              <label htmlFor="wa-phone" className="block text-[13.5px] font-medium">
                Phone number
              </label>
              <p className="mt-0.5 text-[13px] text-[var(--muted)]">
                Include the country code, without the plus sign (+).
              </p>
              <input
                id="wa-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 15551234567"
                className="tool-field mt-2"
              />
            </div>

            <div>
              <label htmlFor="wa-msg" className="block text-[13.5px] font-medium">
                Prefilled message{" "}
                <span className="font-normal text-[var(--muted)]">(optional)</span>
              </label>
              <p className="mt-0.5 text-[13px] text-[var(--muted)]">
                Appears pre-typed in the customer's chat window.
              </p>
              <textarea
                id="wa-msg"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I have a question about my order."
                className="tool-field mt-2 resize-y"
              />
            </div>

            <div className="rounded-[14px] border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <div className="text-[12px] font-medium uppercase tracking-wider text-[var(--muted)]">
                Your link
              </div>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <code className="min-w-0 break-all font-mono text-[13.5px] text-[var(--ink)]">
                  {link || "Your link will appear here."}
                </code>
                <button
                  type="button"
                  onClick={copy}
                  disabled={!link}
                  className="btn btn-primary btn-sm shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[13px] underline underline-offset-2 text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  Test the link
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- TL;DR ---------- */}
      <div className="container-x mt-16">
        <div
          className="mx-auto max-w-[820px] rounded-[18px] p-7 text-center md:p-9"
          style={{ background: "var(--surface)" }}
        >
          <div className="tool-eyebrow">TL;DR</div>
          <p className="mt-3 text-[16px] leading-relaxed text-[var(--ink-2)] md:text-[17px]">
            A WhatsApp click-to-chat link (wa.me link) opens a WhatsApp conversation with a
            specific number when tapped. Businesses use them to route customers from websites,
            email signatures, ads and social profiles directly into a chat. This generator
            creates a ready-to-use link in under 10 seconds, free, with no WhatsApp Business
            account required.
          </p>
        </div>
      </div>

      {/* ---------- Why it matters ---------- */}
      <ToolSection
        center
        eyebrow="Why it matters"
        title={<>Why businesses need a WhatsApp click-to-chat link</>}
      >
        <div className="mx-auto max-w-[720px] space-y-4 text-[15.5px] leading-relaxed text-[var(--ink-2)]">
          <p>
            A wa.me link removes every step between a customer seeing your number and actually
            messaging you. Without one, customers must save your number manually before they can
            start a chat, and most do not.
          </p>
          <p>
            WhatsApp has over 2 billion monthly active users. For ecommerce brands and small
            businesses, it is already the channel their customers use daily. The friction is on
            the business side: making it easy to start a conversation.
          </p>
          <p>
            A click-to-chat link fixes that. One tap and the customer is in a WhatsApp chat with
            your number. You can also pre-fill a message so they do not have to type anything,
            which increases the chance they actually send it.
          </p>
        </div>
      </ToolSection>

      {/* ---------- How it works ---------- */}
      <ToolSection
        eyebrow="How it works"
        title={<>How do you create a WhatsApp click-to-chat link?</>}
      >
        <p className="max-w-[820px] text-[15.5px] leading-relaxed text-[var(--ink-2)]">
          To create a WhatsApp click-to-chat link, write <code className="code-inline">https://wa.me/</code>{" "}
          followed by the full international phone number without the plus sign. To pre-fill a
          message, append <code className="code-inline">?text=</code> and the URL-encoded message.
          This generator builds the link automatically as you type.
        </p>
        <p className="mt-4 text-[14px] text-[var(--muted)]">The whole flow takes under 30 seconds.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {STEPS.map((s) => (
            <div key={s.n} className="step-card">
              <span className="step-num">{s.n}</span>
              <h3 className="font-display mt-3 text-[15.5px] font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--muted)]">{s.body}</p>
            </div>
          ))}
        </div>
      </ToolSection>

      {/* ---------- Format ---------- */}
      <ToolSection center eyebrow="Format" title={<>What a wa.me link looks like</>}>
        <div className="mx-auto max-w-[760px] space-y-5 text-[15.5px] leading-relaxed text-[var(--ink-2)]">
          <p>
            The official WhatsApp click-to-chat format is{" "}
            <code className="code-inline">https://wa.me/[phone]</code> or{" "}
            <code className="code-inline">https://wa.me/[phone]?text=[message]</code>. Both formats
            are supported on iOS, Android and desktop.
          </p>
          <p className="text-[14px] text-[var(--muted)]">A basic wa.me link:</p>
          <div className="code-block">https://wa.me/15551234567</div>
          <p className="text-[14px] text-[var(--muted)]">A link with a prefilled message:</p>
          <div className="code-block">
            https://wa.me/15551234567?text=Hi%2C+I%27d+like+to+know+more+about+your+products
          </div>
          <p>
            The text after <code className="code-inline">?text=</code> is URL-encoded. Spaces
            become <code className="code-inline">+</code> and special characters use percent
            encoding — the generator above handles all of that for you.
          </p>
        </div>
      </ToolSection>

      {/* ---------- CTA ---------- */}
      <div className="container-x">
        <div className="card-dark relative overflow-hidden p-8 text-center md:p-12">
          <h2 className="font-display text-[28px] font-semibold leading-tight text-white md:text-[40px]" style={{ letterSpacing: "-0.035em" }}>
            Want the website that link points to?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
            Shine Better builds fast, thoughtful websites and brands for businesses of every stage.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/" hash="contact" className="btn btn-accent btn-lg">Start a project</Link>
            <Link to="/tools" className="btn btn-secondary btn-lg">Other free tools</Link>
          </div>
        </div>
      </div>
    </ToolPage>
  );
}
