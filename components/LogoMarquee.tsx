import { Media } from "@/components/ui/Media";

// Client logos as a slow, continuous marquee — the real white/mono client
// marks, since the site is dark-only.
const logos = Array.from({ length: 36 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

export default function LogoMarquee() {
  return (
    <section
      aria-label="Brands I've worked with"
      className="relative overflow-hidden border-y border-line/10 py-8"
    >
      <div
        className="flex w-max animate-marquee items-center gap-20 pr-20"
        style={{ animationDuration: "130s" }}
      >
        {[...logos, ...logos].map((n, i) => (
          <span
            key={`${n}-${i}`}
            className="relative block h-14 w-36 shrink-0 opacity-75 transition-opacity duration-300 hover:opacity-100"
          >
            <Media
              src={`/logos/dark/${n}.webp`}
              alt="Client logo"
              fill
              sizes="144px"
              className="object-contain"
            />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-ink-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-ink-900 to-transparent" />
    </section>
  );
}
