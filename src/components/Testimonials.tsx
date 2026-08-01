const notes = [
  { quote: "Mahin shipped our site in a week. Bookings went up the same month.", name: "Rafiq A.", role: "Café owner, Dhaka" },
  { quote: "Finally, a freelancer who actually replies. YouTube views 4×'d.", name: "Priya S.", role: "Creator, 82K subs" },
  { quote: "The brand kit felt custom. Not templated at all.", name: "Jonas M.", role: "Founder, Berlin" },
  { quote: "Ranked #1 on Google Maps in six weeks.", name: "Tanvir H.", role: "Salon owner" },
];

export function Testimonials() {
  return (
    <section className="container-x py-20 md:py-28">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <span className="chip mb-4">Kind words</span>
          <h2 className="font-display mt-3 text-[32px] font-semibold tracking-tight md:text-[44px]" style={{ letterSpacing: "-0.03em" }}>
            Trusted by teams that care about the details.
          </h2>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {notes.map((n) => (
          <figure
            key={n.name}
            className="card-clean p-6"
          >
            <blockquote className="text-[14.5px] leading-relaxed text-[var(--ink)]">
              "{n.quote}"
            </blockquote>
            <figcaption className="mt-5 border-t pt-4" style={{ borderColor: "var(--border)" }}>
              <div className="text-[13px] font-semibold text-[var(--ink)]">{n.name}</div>
              <div className="text-[12px] text-[var(--muted)]">{n.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
