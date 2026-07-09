import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import BundleView from "@/components/lms/BundleView";
import { site } from "@/lib/site";
import { bundle, bundleCourses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "The AI Production Stack — AI Photoshoot + AI Video (Save 26%)",
  description:
    "Both premium AI tracks in one enrollment: AI Photoshoot & Prompt Engineering + AI Video Generation. The complete camera-less campaign pipeline — 6+ hours, 2 reviewed final projects, EGP 2,950 instead of 4,000.",
  alternates: { canonical: "/bundle/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: bundle.title.en,
  description: bundle.desc.en,
  url: `${site.url}/bundle/`,
  brand: { "@id": `${site.url}/#organization` },
  offers: {
    "@type": "Offer",
    price: bundle.price,
    priceCurrency: "EGP",
    availability: "https://schema.org/InStock",
    url: `${site.url}/bundle/`,
  },
  isRelatedTo: bundleCourses.map((c) => ({
    "@type": "Course",
    "@id": `${site.url}/courses/${c.slug}/#course`,
    name: c.title.en,
  })),
};

export default function BundlePage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <BundleView />
    </SiteShell>
  );
}
