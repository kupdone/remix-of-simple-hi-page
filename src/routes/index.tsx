import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { LazyToolkit } from "@/components/LazyToolkit";
import { BrandVideo } from "@/components/BrandVideo";

import { Testimonials } from "@/components/Testimonials";
import { openCookiePreferences } from "@/components/CookieBanner";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Shine Better | Make your business shine better online." },
      {
        name: "description",
        content:
          "A one-person studio run by Mahin Islam. Fast, thoughtful websites and SEO for founders, creators and local businesses.",
      },
      { property: "og:title", content: "Shine Better | Make your business shine better online." },
      { property: "og:description", content: "Websites, brands and SEO built to convert. Direct, fast, human." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Shine Better" },
      { name: "twitter:description", content: "Websites, brands and SEO built to convert. Direct, fast, human." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const NAV = [
  { label: "Solutions", href: "#solutions" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Tools", to: "/tools" as const },
  { label: "Blog", to: "/blog" as const },
  { label: "Contact", href: "#contact" },
];


const MENU_GROUPS: Array<{
  label: string;
  items: Array<{ label: string; sub: string; href?: string; to?: string; params?: Record<string, string> }>;
}> = [
  {
    label: "Navigate",
    items: [
      { label: "Solutions", sub: "Everything I can build for you", href: "#solutions" },
      { label: "About", sub: "Who you are actually hiring", to: "/about" },
      { label: "FAQ", sub: "Timelines, ownership, payments", href: "#faq" },
      { label: "Contact", sub: "Email or WhatsApp, same day reply", href: "#contact" },
    ],
  },
  {
    label: "Capabilities",
    items: [
      { label: "Website Design & Development", sub: "React, Next.js, Shopify, WordPress", to: "/solutions/$slug", params: { slug: "web-development" } },
      { label: "Local SEO", sub: "Google Maps and Business Profile", to: "/solutions/$slug", params: { slug: "local-seo" } },
      { label: "AI Business Assistant", sub: "Private beta", to: "/solutions/$slug", params: { slug: "ai-assistant" } },
      { label: "Social Media", sub: "Calendars, captions, creatives", to: "/solutions/$slug", params: { slug: "social-media" } },
      { label: "E-commerce", sub: "Shopify and headless stores", to: "/solutions/$slug", params: { slug: "ecommerce" } },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Free Tools", sub: "WhatsApp links and speed reports", to: "/tools" },
      { label: "Blog", sub: "Notes on building better sites", to: "/blog" },
      { label: "Compliance Standards", sub: "Accessibility, privacy, cookies and consumer law", to: "/compliance" },
      { label: "Website Speed Report", sub: "Real Lighthouse scores for your site", to: "/insights" },
    ],
  },
];



const SOLUTIONS = [
  {
    slug: "web-development",
    title: "Website Design & Development",
    desc: "React, Next.js, Shopify or WordPress. Fast, and tuned for Core Web Vitals.",
  },
  {
    slug: "local-seo",
    title: "Local SEO & Google Business Profile",
    desc: "Get found on Google Maps by customers in your city.",
  },
  {
    slug: "ai-assistant",
    title: "AI Business Assistant",
    desc: "AI-assisted marketing and support, currently in private beta.",
    beta: true,
  },
  {
    slug: "social-media",
    title: "Social Media Management",
    desc: "Content calendars, captions and creatives that stay on brand.",
  },
  {
    slug: "ecommerce",
    title: "E-commerce Optimization",
    desc: "Shopify and headless stores tuned for conversion and speed.",
  },
];

const FAQS = [
  { q: "How long does a website take?", a: "Landing pages ship in 5–7 days. Full marketing sites in 2–3 weeks. E-commerce and custom apps depend on scope, but you always get a fixed timeline before we start." },
  { q: "How much does it cost?", a: "Every project is quoted as one fixed number. Landing pages start around $600, marketing sites around $1,500, and stores or custom builds are quoted after a short call. No hourly billing." },
  { q: "Do I own my website?", a: "Completely. Code, design files, domain, hosting and analytics all ship to your accounts. No lock-in, no monthly ransom." },
  { q: "Can you redesign my existing website?", a: "Yes. Send me the current site (or Figma) and I'll audit it for free, then quote a fixed-scope redesign that keeps your SEO intact." },
  { q: "Can you help me rank on Google?", a: "Yes. Technical SEO, on-page work, Google Business Profile and local citation cleanup. I only promise what I can back with data." },
  { q: "Do you offer ongoing support?", a: "Yes. A light retainer for fixes and small changes, or per-request work. No mandatory monthly hours contracts." },
  { q: "What if I don't have a logo?", a: "I design brands too: logo, palette, typography and a small identity kit. It can be bundled with the website build." },
  { q: "Will my website work on mobile?", a: "Every site I build is mobile-first, tested on real devices, and scored against Core Web Vitals before launch." },
  { q: "Can you migrate my existing website?", a: "Yes. WordPress, Wix, Squarespace, Shopify and Webflow are all handled, with content, SEO and redirects preserved." },
  { q: "What payment methods do you accept?", a: "Stripe, PayPal, Xoom, direct bank transfer, and other supported methods depending on your location. 50% to start, 50% on launch." },
  { q: "Do you work with clients outside your country?", a: "Yes. Most clients are in the US, Australia and Europe. Everything happens over email, WhatsApp and short calls, so time zones never get in the way." },
];

function Home() {
  return (
    <div id="top" className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <Nav />
      <Hero />
      <Solutions />
      <About />
      <Toolkit />
      <TestimonialsWrap />
      <Faq />
      <Contact />
      <Footer />
    </div>
  );
}

/* ---------------- NAV ---------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        if (delta > 0 && y > 120) setHidden(true);
        else setHidden(false);
        lastY.current = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-4 md:top-6 z-50 nav-shell ${scrolled ? "scrolled" : ""} ${hidden && !open ? "hidden-nav" : ""}`}
      >
        <div className="container-x flex justify-center">
          <div className="nav-pill w-full max-w-[720px] justify-between">
            <Link to="/" aria-label="Shine Better home" className="flex items-center">
              <Logo />
            </Link>

            <nav className="hidden items-center md:flex">
              {NAV.slice(0, 4).map((item) =>
                item.to ? (
                  <Link key={item.label} to={item.to} className="nav-link">{item.label.toLowerCase()}.</Link>
                ) : (
                  <a key={item.label} href={item.href} className="nav-link">{item.label.toLowerCase()}.</a>
                ),
              )}
            </nav>

            <button
              className="nav-cta"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {open && <BigMenu onClose={() => setOpen(false)} />}
    </>
  );
}

function BigMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="menu-overlay">
      <header className="fixed inset-x-0 top-4 z-[80] md:top-6">
        <div className="container-x flex justify-center">
          <div className="nav-pill w-full max-w-[720px] justify-between">
            <Link to="/" onClick={onClose} aria-label="Shine Better home" className="flex items-center">
              <Logo />
            </Link>
            <span className="hidden text-[13px] font-medium text-[var(--muted)] md:inline">Menu</span>
            <button
              className="nav-cta"
              onClick={onClose}
              aria-label="Close menu"
              style={{ background: "var(--ink)" }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container-x flex-1 overflow-y-auto pb-14 pt-[104px] md:pt-[140px]">
        <div className="grid gap-10 md:grid-cols-3 md:gap-10">
          {MENU_GROUPS.map((group) => (
            <div key={group.label} className="min-w-0">
              <div className="menu-group-label">{group.label}</div>
              <div className="mt-2">
                {group.items.map((item) => {
                  const inner = (
                    <>
                      <span className="min-w-0">
                        <span className="block truncate md:whitespace-normal">{item.label}</span>
                        <span className="sub">{item.sub}</span>
                      </span>
                      <ArrowUpRight className="chev h-5 w-5" />
                    </>
                  );
                  return item.to ? (
                    <Link
                      key={item.label}
                      to={item.to as never}
                      params={item.params as never}
                      onClick={onClose}
                      className="menu-link"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <a key={item.label} href={item.href} onClick={onClose} className="menu-link">
                      {inner}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--border)" }}>
          <a href="#contact" onClick={onClose} className="btn btn-primary btn-lg w-full sm:w-auto">
            Let's talk <ArrowRight className="h-4 w-4" />
          </a>
          <div className="grid gap-1 text-[13px] text-[var(--muted)] sm:text-right">
            <a href="mailto:hello@shinebetter.online" className="hover:text-[var(--ink)]">hello@shinebetter.online</a>
            <a href="https://wa.me/8801863861872" className="hover:text-[var(--ink)]">WhatsApp +880 1863 861 872</a>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-[128px] pb-20 md:pt-[172px] md:pb-28">
      <div className="hero-blue" />
      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="flex flex-col items-center text-center"
        >
          <h1 className="hero-h1 max-w-[960px] text-[46px] sm:text-[68px] md:text-[92px] lg:text-[108px]">
            Make your business{" "}
            <span className="hl">shine better</span>{" "}
            online.
          </h1>

          <p className="mt-7 max-w-[640px] text-[16px] leading-relaxed text-[var(--muted)] md:text-[18px]">
            Shine Better is a digital studio crafting thoughtful websites,
            memorable brands, and digital experiences for businesses of every
            stage.

          </p>


          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="#contact" className="btn btn-primary btn-lg">
              Start a project <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#solutions" className="btn btn-secondary btn-lg">See solutions</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- SOLUTIONS (big typography list) ---------------- */
function Solutions() {
  return (
    <section id="solutions" className="container-x py-20 md:py-28">
      <div className="mb-12 flex flex-col items-start justify-between gap-4 md:mb-16 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <span className="chip mb-4">Solutions</span>
          <h2 className="font-display mt-3 text-[32px] font-semibold leading-tight tracking-tight md:text-[52px]" style={{ letterSpacing: "-0.035em" }}>
            One studio.<br className="hidden md:block" /> Every screen your business needs.
          </h2>
        </div>
        <p className="max-w-md text-[15px] leading-relaxed text-[var(--muted)]">
          Pick one to start with or combine a few. Everything is scoped and quoted
          before any work begins, so you always know what you are getting.
        </p>

      </div>

      <div>
        {SOLUTIONS.map((s) => (
          <Link key={s.title} to="/solutions/$slug" params={{ slug: s.slug }} className="sol-row">
            <div className="sol-meta">
              <span className="sol-title">{s.title}</span>
              <span className="sol-arrow"><ArrowUpRight className="h-6 w-6" /></span>
            </div>
            <div className="mt-3 flex items-start justify-between gap-6">
              <p className="sol-desc">{s.desc}</p>
              <span className="hidden text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--muted)] sm:inline">
                {s.beta ? "Private beta" : "Read more"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------------- ABOUT (writing block, replaces 4-card grid) ---------------- */
function About() {
  return (
    <section id="about" className="border-y bg-white" style={{ borderColor: "var(--border)" }}>
      <div className="container-x py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <span className="chip mb-4">About</span>
            <h2 className="font-display mt-3 text-[32px] font-semibold leading-[1.02] tracking-tight md:text-[52px]" style={{ letterSpacing: "-0.04em" }}>
              I'm Mahin. Shine Better is my studio.
            </h2>
            <BrandVideo />

            <div className="mt-6 flex gap-3">
              <Link to="/about" className="btn btn-primary btn-sm">
                More about me <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a href="#contact" className="btn btn-secondary btn-sm">Say hi</a>
            </div>
          </div>

          <div className="space-y-5 text-[16px] leading-[1.75] text-[var(--ink-2)] md:text-[17px]">
            <p>
              I'm Mahin. I started Shine Better because I think too many businesses
              are settling for websites that look finished but feel forgettable. I
              build websites that are fast, thoughtful and actually reflect the
              business behind them.
            </p>
            <p>
              You talk to me, not an account manager. Every project is one fixed
              scope, one number and one timeline, agreed before I start. First
              drafts land in days rather than weeks, and if you don't need
              something, I'll say so instead of selling it to you.
            </p>
            <p className="text-[var(--muted)]">
              What I don't do: long retainers built on vague monthly hours,
              cookie-cutter templates, or SEO promises I can't back with data.
            </p>

            <div className="mt-8 grid gap-4 border-t pt-6 sm:grid-cols-2" style={{ borderColor: "var(--border)" }}>
              <div>
                <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">Education</div>
                <div className="mt-2 font-display text-[15px] font-semibold leading-snug">M.Sc. ICT, BUP</div>
                <div className="text-[13px] text-[var(--muted)]">Current GPA 3.93 / 4.00</div>
              </div>
              <div>
                <div className="hidden text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)] sm:block">&nbsp;</div>
                <div className="mt-2 font-display text-[15px] font-semibold leading-snug">B.Sc. CSE, IUBAT</div>
                <div className="text-[13px] text-[var(--muted)]">GPA 3.43 / 4.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TOOLKIT ---------------- */
function Toolkit() {
  return (
    <section id="work" className="container-x py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <span className="chip mb-4">The toolkit</span>
          <h2 className="font-display mt-3 text-[32px] font-semibold leading-tight tracking-tight md:text-[46px]" style={{ letterSpacing: "-0.035em" }}>
            The right tool for the right job.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--muted)]">
            I don't force every project into one stack. If Shopify is the answer,
            it's Shopify. If it's a hand-rolled React app on Cloudflare, it's that.
            Grab a pill and throw it around. I speak them all.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["React", "Next.js", "TanStack", "Shopify", "WordPress", "Tailwind", "Cloudflare", "Framer", "Figma"].map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        </div>
        <LazyToolkit />
      </div>
    </section>
  );
}




function TestimonialsWrap() { return <Testimonials />; }

/* ---------------- FAQ ---------------- */
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container-x py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <span className="chip mb-4">FAQ</span>
          <h2 className="font-display mt-3 text-[32px] font-semibold leading-tight tracking-tight md:text-[44px]" style={{ letterSpacing: "-0.035em" }}>
            Questions, answered.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
            Missing something? <a href="#contact" className="underline">Ask directly</a>.
          </p>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-t first:border-t-0" style={{ borderColor: "var(--border)" }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-display text-[16px] font-semibold text-[var(--ink)] md:text-[17px]">{f.q}</span>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-transform ${isOpen ? "rotate-45" : ""}`}
                    style={{ borderColor: "var(--border)", background: isOpen ? "var(--ink)" : "transparent", color: isOpen ? "#fff" : "var(--ink)" }}>
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-5 pr-12 text-[14.5px] leading-relaxed text-[var(--muted)]">{f.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */
function Contact() {
  return (
    <section id="contact" className="container-x pb-20 md:pb-28">
      <div className="card-dark relative overflow-hidden p-8 md:p-14">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "22px 22px" }} />
        <div className="relative grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <span className="chip chip-accent mb-4">Let's talk</span>
            <h2 className="font-display mt-3 text-[36px] font-semibold leading-tight text-white md:text-[56px]" style={{ letterSpacing: "-0.035em" }}>
              Ready to make your business shine better?
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
              Tell me about your project. I reply within one business day, and
              usually much faster than that.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <a href="mailto:hello@shinebetter.online" className="btn btn-accent btn-lg justify-between">
              <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@shinebetter.online</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href="https://wa.me/8801863861872" target="_blank" rel="noopener noreferrer"
              className="btn btn-secondary btn-lg justify-between">
              <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp me</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="border-t bg-white" style={{ borderColor: "var(--border)" }}>
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-[var(--muted)]">
              A one-person studio run by Mahin Islam, building websites that are fast,
              thoughtful and worth remembering.
            </p>
          </div>
          <FooterCol title="Solutions" items={[
            { l: "Web Development", to: "/solutions/$slug", params: { slug: "web-development" } },
            { l: "Local SEO", to: "/solutions/$slug", params: { slug: "local-seo" } },
            { l: "AI Assistant", to: "/solutions/$slug", params: { slug: "ai-assistant" } },
            { l: "Social Media", to: "/solutions/$slug", params: { slug: "social-media" } },
            { l: "E-commerce", to: "/solutions/$slug", params: { slug: "ecommerce" } },
          ]} />

          <FooterCol title="Studio" items={[
            { l: "About", to: "/about" },
            { l: "Blog", to: "/blog" },
            { l: "Insights", to: "/insights" },
            { l: "Compliance", to: "/compliance" },
          ]} />

          <div>
            <div className="text-[12px] font-medium uppercase tracking-wider text-[var(--muted)]">Contact</div>
            <div className="mt-4 space-y-2 text-[13.5px]">
              <a href="mailto:hello@shinebetter.online" className="block text-[var(--ink)] hover:underline">hello@shinebetter.online</a>
              <a href="https://wa.me/8801863861872" className="block text-[var(--ink)] hover:underline">WhatsApp</a>
              <button onClick={openCookiePreferences} className="text-[var(--muted)] hover:text-[var(--ink)] hover:underline">
                Cookie preferences
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 text-[12.5px] text-[var(--muted)] md:flex-row md:items-center" style={{ borderColor: "var(--border)" }}>
          <div>© {new Date().getFullYear()} Shine Better · Made by Mahin Islam</div>
          <div className="flex gap-4">
            <a href="/sitemap.xml" className="hover:text-[var(--ink)]">Sitemap</a>
            <a href="/rss.xml" className="hover:text-[var(--ink)]">RSS</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: Array<{ l: string; to: any; params?: any }> }) {
  return (
    <div>
      <div className="text-[12px] font-medium uppercase tracking-wider text-[var(--muted)]">{title}</div>
      <ul className="mt-4 space-y-2 text-[13.5px]">
        {items.map((i) => (
          <li key={i.l}>
            <Link to={i.to} params={i.params} className="text-[var(--ink)] hover:underline">{i.l}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
