import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import OffersView from "@/components/lms/OffersView";
import { site } from "@/lib/site";
import { bundles } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Offers | Course Bundles & Launch Deals",
  description:
    "Course bundles priced under the sum of their parts: the AI Production Stack, the Editor's Suite (After Effects + Premiere) and the Motion + AI Master Pack.",
  alternates: { canonical: "/offers/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Mohamed Tarek | Course Bundles",
  url: `${site.url}/offers/`,
  itemListElement: bundles.map((b) => ({
    "@type": "Offer",
    name: b.title.en,
    price: b.price,
    priceCurrency: "EGP",
    url: `${site.url}/checkout/?bundle=${b.slug}`,
  })),
};

export default function OffersPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <OffersView />
    </SiteShell>
  );
}
