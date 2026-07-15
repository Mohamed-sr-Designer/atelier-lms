"use client";

import { motion } from "framer-motion";
import { Media } from "@/components/ui/Media";

// The companies and academies Mohamed Tarek has worked at / taught for.
// Rendered as an overlapping avatar stack (there are a lot of them) that gently
// fans apart on hover, with a trailing "+N" count and the current name.
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
      <div className="mt-4 flex flex-wrap items-center gap-4">
        {/* overlapping stack — fans apart slightly on hover */}
        <div className="group flex items-center">
          <div className="flex -space-x-3.5 transition-all duration-500 group-hover:-space-x-2">
            {places.map((p, i) => (
              <motion.span
                key={p.name}
                title={p.name}
                initial={{ opacity: 0, scale: 0.6, x: -8 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, scale: 1.12, zIndex: 30 }}
                className="relative grid h-11 w-11 place-items-center rounded-full ring-2 ring-ink-900 transition-shadow duration-300 hover:shadow-[0_10px_30px_rgb(var(--mint)/0.4)]"
                style={{ zIndex: places.length - i }}
              >
                <Media
                  src={p.logo}
                  alt={`${p.name} logo`}
                  sizes="44px"
                  className="h-11 w-11 rounded-full border border-line/15 object-cover"
                />
              </motion.span>
            ))}
          </div>
          {/* count chip */}
          <span className="ml-3 grid h-11 shrink-0 place-items-center rounded-full border border-mint/30 bg-mint/5 px-4 text-sm font-semibold text-mint">
            +{places.length}
          </span>
        </div>
      </div>
    </div>
  );
}
