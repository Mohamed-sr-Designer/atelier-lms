import { Media } from "@/components/ui/Media";

// The companies and academies Mohamed Tarek has worked at / taught for —
// shown as a compact logo row under the instructor CTAs.
const places = [
  { name: "Osolutions", logo: "/lms/companies/osolutions.jpg" },
  { name: "Bundle IMS", logo: "/lms/companies/bundle.jpg" },
  { name: "JUMPPEAK", logo: "/lms/companies/jumppeak.jpg" },
  { name: "Pala De 7", logo: "/lms/companies/pala7.jpg" },
  { name: "Flowrista", logo: "/lms/companies/flowrista.jpg" },
  { name: "Prepd", logo: "/lms/companies/prepd.jpg" },
  { name: "SOIC", logo: "/lms/academies/soic.jpg" },
  { name: "EDUX", logo: "/lms/academies/edux.jpg" },
  { name: "Teaching Planet", logo: "/lms/academies/teaching.jpg" },
  { name: "Raya Academy", logo: "/lms/academies/raya.jpg" },
];

export default function WorkedWith({ label }: { label?: string }) {
  return (
    <div>
      {label ? (
        <p className="text-[11px] uppercase tracking-ultra text-bone-500">{label}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        {places.map((p) => (
          <span
            key={p.name}
            className="flex items-center gap-2.5 rounded-full border border-line/10 bg-ink-900/40 py-1.5 pl-1.5 pr-4 opacity-90 transition-all duration-300 hover:border-mint/40 hover:opacity-100"
          >
            <Media
              src={p.logo}
              alt={`${p.name} logo`}
              sizes="32px"
              className="h-8 w-8 rounded-full border border-line/15 object-cover"
            />
            <span className="whitespace-nowrap text-xs font-medium text-bone-300">
              {p.name}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
