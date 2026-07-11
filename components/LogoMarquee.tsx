import { Media } from "@/components/ui/Media";

// The real companies + academies Mohamed Tarek's work has served, as a slow
// continuous marquee. Uses the same logo assets as the instructor page so
// nothing is a broken placeholder.
const brands = [
  { name: "Osolutions", logo: "/lms/companies/osolutions.jpg" },
  { name: "Bundle IMS", logo: "/lms/companies/bundle.jpg" },
  { name: "JUMPPEAK", logo: "/lms/companies/jumppeak.jpg" },
  { name: "Pala De 7", logo: "/lms/companies/pala7.jpg" },
  { name: "Flowrista", logo: "/lms/companies/flowrista.jpg" },
  { name: "Prepd", logo: "/lms/companies/prepd.jpg" },
  { name: "SOIC — School of Cinema", logo: "/lms/academies/soic.jpg" },
  { name: "EDUX Academy", logo: "/lms/academies/edux.jpg" },
  { name: "Teaching Planet", logo: "/lms/academies/teaching.jpg" },
  { name: "Raya Academy", logo: "/lms/academies/raya.jpg" },
];

export default function LogoMarquee() {
  return (
    <section
      aria-label="Brands and academies Mohamed Tarek's work has served"
      className="relative overflow-hidden border-y border-line/10 py-8"
    >
      <div
        className="flex w-max animate-marquee items-center gap-10 pr-10"
        style={{ animationDuration: "60s" }}
      >
        {[...brands, ...brands].map((b, i) => (
          <span
            key={`${b.name}-${i}`}
            className="flex shrink-0 items-center gap-3 opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            <Media
              src={b.logo}
              alt={`${b.name} logo`}
              sizes="44px"
              className="h-11 w-11 rounded-full border border-line/15 object-cover"
            />
            <span className="whitespace-nowrap text-sm font-medium tracking-tight text-bone-300">
              {b.name}
            </span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-ink-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-ink-900 to-transparent" />
    </section>
  );
}
