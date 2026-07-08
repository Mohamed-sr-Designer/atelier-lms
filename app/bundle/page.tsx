import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import BundleView from "@/components/lms/BundleView";
import { site } from "@/lib/site";
import { bundle, bundleCourses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "The Ultimate Design Bundle — Photoshop + AI Photoshoot + AI Video (Save 30%)",
  description:
    "Three courses, one camera-less campaign pipeline: Photoshop Mastery, AI Photoshoot & Prompt Engineering, and AI Video Generation. 13+ hours, 3 certificates, one enrollment.",
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
