import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/compliance")({
  component: CompliancePage,
  head: () => ({
    meta: [
      { title: "How I Build Websites That Meet Modern Compliance Standards" },
      {
        name: "description",
        content:
          "Accessibility, privacy, cookies, data collection, email law, consumer protection and e-commerce rules — how every Shine Better website is built to hold up in the US, Canada, UK and Australia.",
      },
      { property: "og:title", content: "How I Build Websites That Meet Modern Compliance Standards" },
      {
        property: "og:description",
        content:
          "Accessibility, privacy, cookies, data, email law and e-commerce requirements, handled as part of the build.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Compliance at Shine Better" },
      {
        name: "twitter:description",
        content: "How every website I build handles accessibility, privacy and consumer protection.",
      },
    ],
    links: [{ rel: "canonical", href: "/compliance" }],
  }),
});

const SECTIONS = [
  {
    id: "accessibility",
    title: "Website Accessibility (ADA & WCAG)",
    body: [
      "Every site I build targets WCAG 2.2 AA as a baseline, not as an afterthought bolted on with an overlay widget. Overlays get businesses sued; real markup does not.",
      "That means proper heading order, real buttons and links instead of clickable divs, visible keyboard focus, labelled form fields, alt text on every meaningful image, and colour contrast checked against the actual palette rather than guessed.",
      "I test with a keyboard, a screen reader pass, and an automated audit before launch, and I hand you the report so you have a record of the effort.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy Policies",
    body: [
      "Your site gets a privacy policy that describes what you actually collect, why you collect it, how long you keep it, and who else can see it. Generic copied policies are worse than none, because they describe processing you never do.",
      "I map the data flows first (forms, analytics, chat, booking, payments), then write the policy against that map. If your business needs a lawyer's review, I will say so plainly rather than pretend a template is legal advice.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Consent",
    body: [
      "Nothing that tracks a visitor fires before they say yes. Consent is stored, honoured across pages, and easy to change later from a link in the footer.",
      "The banner offers a genuine reject option with the same weight as accept, because pre-ticked boxes and hidden reject buttons are exactly what regulators fine businesses for.",
    ],
  },
  {
    id: "data",
    title: "Data Collection",
    body: [
      "I collect the minimum a form needs to do its job. No hidden fields, no silent profiling, no third party pixels you did not ask for.",
      "Form submissions travel over HTTPS, land somewhere you own and control, and can be deleted on request. If you need retention limits or export on demand, I build that into the workflow.",
    ],
  },
  {
    id: "email",
    title: "Email & Anti-Spam Laws",
    body: [
      "Signup forms use real opt-in, not a pre-ticked box hidden under a submit button. Every marketing email carries a working unsubscribe link, an accurate sender name, and a postal address where the law requires one.",
      "This covers CAN-SPAM in the US, CASL in Canada, PECR and UK GDPR in Britain, and the Spam Act in Australia. Unsubscribes are honoured immediately, not in ten business days.",
    ],
  },
  {
    id: "consumer",
    title: "Consumer Protection",
    body: [
      "Claims on your site should be things you can back up. I will not write a fake countdown timer, a fabricated review, or a statistic nobody can source.",
      "Pricing, delivery timelines, guarantees and cancellation terms get stated clearly and placed where a customer sees them before they commit, not buried in a footer link.",
    ],
  },
  {
    id: "ecommerce",
    title: "E-commerce Requirements",
    body: [
      "Stores need more than a checkout button. Total price including tax and shipping shown before payment, a clear order confirmation, refund and returns terms a customer can find in two clicks, and secure payment handled by a processor like Stripe or PayPal rather than anything homegrown.",
      "Card details never touch your server. Order data stays inside the platform you already control.",
    ],
  },
  {
    id: "countries",
    title: "Country-Specific Requirements",
    body: [],
    grid: [
      {
        k: "United States",
        v: "ADA Title III accessibility expectations, state privacy laws such as CCPA and CPRA in California, and CAN-SPAM for email. State laws keep expanding, so policies are written to be updated, not frozen.",
      },
      {
        k: "Canada",
        v: "PIPEDA for personal information, CASL for email and electronic messages, and AODA accessibility rules for organisations operating in Ontario.",
      },
      {
        k: "United Kingdom",
        v: "UK GDPR and the Data Protection Act for personal data, PECR for cookies and marketing, and the Equality Act, which is the practical driver behind accessible websites.",
      },
      {
        k: "Australia",
        v: "The Privacy Act and Australian Privacy Principles, the Spam Act for email and SMS, and Australian Consumer Law for claims, pricing and guarantees.",
      },
    ],
  },
];

const FAQ = [
  {
    q: "Does this make my website legally compliant?",
    a: "It makes your website built to the standards these laws are based on, and it removes the common technical failures that get businesses in trouble. I am a developer, not a lawyer. For regulated industries or high risk claims, have your policies reviewed by a solicitor and I will implement whatever they hand back.",
  },
  {
    q: "Do I have to pay extra for this?",
    a: "No. Accessible markup, a consent-respecting cookie banner, a policy page and honest copy are part of every build. They are not an upsell.",
  },
  {
    q: "I already have a website. Can you audit it?",
    a: "Yes. I run an accessibility and privacy audit, send you a plain-English list of what is broken and what it would cost to fix, and you decide from there.",
  },
  {
    q: "Will an accessibility overlay widget solve this for me?",
    a: "No. Overlays sit on top of broken markup and have been named in a large share of accessibility lawsuits. Fixing the underlying HTML is cheaper and it actually works for the people using it.",
  },
  {
    q: "What if the law changes?",
    a: "Policies and banners are built so text and settings can be edited without a rebuild. If something significant shifts, I will tell you what it means for your site.",
  },
];

function CompliancePage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <header className="fixed inset-x-0 top-0 z-50 nav-shell subnav scrolled">
        <div className="container-x flex h-[64px] items-center justify-between">
          <Link to="/" aria-label="Shine Better home"><Logo /></Link>
          <Link to="/" className="btn btn-secondary btn-sm">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden pt-[112px] pb-12 md:pt-[150px] md:pb-16">
        <div className="hero-blue" />
        <div className="container-x relative max-w-[900px]">
          <span className="chip mb-4">Compliance</span>
          <h1
            className="font-display mt-4 text-[34px] font-semibold leading-[1.03] tracking-tight sm:text-[46px] md:text-[62px]"
            style={{ letterSpacing: "-0.04em" }}
          >
            How I build websites that meet modern compliance standards.
          </h1>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-relaxed text-[var(--muted)] md:text-[18px]">
            Accessibility, privacy and consumer law are not extras I sell you later. They are part of
            how the site gets built, because a website that quietly breaks the rules is a liability
            dressed up as a brochure.
          </p>
        </div>
      </section>

      <div className="container-x grid max-w-[1100px] gap-12 pb-20 md:grid-cols-[220px_1fr] md:gap-14 md:pb-28">
        <aside className="md:sticky md:top-[96px] md:self-start">
          <div className="menu-group-label">On this page</div>
          <nav className="mt-3 flex flex-col gap-2">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-[13.5px] leading-snug text-[var(--muted)] hover:text-[var(--ink)]"
              >
                {s.title}
              </a>
            ))}
            <a href="#faq" className="text-[13.5px] leading-snug text-[var(--muted)] hover:text-[var(--ink)]">
              Frequently asked questions
            </a>
          </nav>
        </aside>

        <div className="min-w-0">
          {SECTIONS.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-[90px] border-t pt-8 pb-10 first:border-t-0 first:pt-0"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h2
                className="font-display mt-3 text-[24px] font-semibold leading-tight md:text-[34px]"
                style={{ letterSpacing: "-0.035em" }}
              >
                {s.title}
              </h2>
              <div className="mt-4 space-y-4 text-[15.5px] leading-[1.75] text-[var(--ink-2)] md:text-[16.5px]">
                {s.body.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              {s.grid && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {s.grid.map((g) => (
                    <div key={g.k} className="card-clean p-5">
                      <div className="font-display text-[16px] font-semibold">{g.k}</div>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{g.v}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          <section id="faq" className="scroll-mt-[90px] border-t pt-8" style={{ borderColor: "var(--border)" }}>
            <h2
              className="font-display text-[24px] font-semibold leading-tight md:text-[34px]"
              style={{ letterSpacing: "-0.035em" }}
            >
              Frequently asked questions
            </h2>
            <div className="mt-6">
              {FAQ.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div key={f.q} className="border-t first:border-t-0" style={{ borderColor: "var(--border)" }}>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="font-display text-[15.5px] font-semibold md:text-[17px]">{f.q}</span>
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-transform ${isOpen ? "rotate-45" : ""}`}
                        style={{
                          borderColor: "var(--border)",
                          background: isOpen ? "var(--ink)" : "transparent",
                          color: isOpen ? "#fff" : "var(--ink)",
                        }}
                      >
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pb-5 pr-6 text-[14.5px] leading-relaxed text-[var(--muted)] md:pr-12">{f.a}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="card-dark mt-12 p-7 md:p-10">
            <h2 className="font-display text-[24px] font-semibold leading-tight text-white md:text-[32px]" style={{ letterSpacing: "-0.035em" }}>
              Want your current site checked?
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
              Send me the URL and I will send back a plain-English list of what is broken and what it
              would take to fix. No charge for the audit.
            </p>
            <a href="mailto:hello@shinebetter.online" className="btn btn-accent btn-lg mt-6">
              Email me the URL <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
