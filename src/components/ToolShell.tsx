import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { WordmarkBand } from "@/components/WordmarkBand";

export function ToolNav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 md:top-6">
      <div className="container-x flex justify-center">
        <div className="nav-pill w-full max-w-[720px] justify-between">
          <Link to="/" aria-label="Shine Better home" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/tools" className="nav-link hidden sm:inline-flex">
              tools.
            </Link>
            <Link to="/" hash="contact" className="btn btn-primary btn-sm">
              Let's talk
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export function ToolFooter() {
  return (
    <footer className="mt-24">
      <div className="container-x pb-10">
        <div
          className="flex flex-col items-start justify-between gap-3 border-t pt-6 text-[12.5px] text-[var(--muted)] md:flex-row md:items-center"
          style={{ borderColor: "var(--border)" }}
        >
          <div>© {new Date().getFullYear()} Shine Better · Free tools, no login</div>
          <div className="flex gap-4">
            <Link to="/tools" className="hover:text-[var(--ink)]">All tools</Link>
            <Link to="/blog" className="hover:text-[var(--ink)]">Blog</Link>
            <Link to="/about" className="hover:text-[var(--ink)]">About</Link>
          </div>
        </div>
      </div>
      <WordmarkBand />
    </footer>
  );
}

export function ToolHero({
  eyebrow,
  title,
  subtitle,
  note,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  note?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="tool-hero pb-16 pt-[120px] md:pb-20 md:pt-[168px]">
      <div className="container-x flex flex-col items-center text-center">
        <span className="tool-eyebrow">{eyebrow}</span>
        <h1 className="tool-h1 mt-3 max-w-[840px] text-[42px] sm:text-[58px] md:text-[76px]">
          {title}
        </h1>
        <p className="mt-5 max-w-[600px] text-[16px] leading-relaxed text-[var(--muted)] md:text-[17px]">
          {subtitle}
        </p>
        {actions && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{actions}</div>
        )}
        {note && <p className="mt-4 text-[13px] text-[var(--muted)]">{note}</p>}
      </div>
    </section>
  );
}

export function ToolSection({
  eyebrow,
  title,
  children,
  center = false,
}: {
  eyebrow?: string;
  title?: ReactNode;
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <section className="container-x py-14 md:py-20">
      {(eyebrow || title) && (
        <div className={center ? "text-center" : ""}>
          {eyebrow && <div className="tool-eyebrow">{eyebrow}</div>}
          {title && (
            <h2 className="tool-h2 mt-2 max-w-[820px] text-[30px] sm:text-[40px] md:text-[52px]"
              style={center ? { marginInline: "auto" } : undefined}>
              {title}
            </h2>
          )}
        </div>
      )}
      <div className="mt-7">{children}</div>
    </section>
  );
}

export function ToolPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <ToolNav />
      {children}
      <ToolFooter />
    </div>
  );
}
