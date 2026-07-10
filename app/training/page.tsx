import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import TrainingView from "@/components/lms/TrainingView";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Training for Agencies & Teams — On-site in Egypt, Live Online Worldwide",
  description:
    "Custom Tarek programs for agencies, studios and marketing teams: brand, campaign, motion and AI production. On-site in Egypt, live online everywhere else — plus a free 60-minute strategy consultation for CEOs, founders and marketing managers.",
  alternates: { canonical: "/training/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Tarek Team Training",
  serviceType: "Corporate design & AI production training",
  provider: { "@id": `${site.url}/#organization` },
  areaServed: ["Egypt", "Saudi Arabia", "UAE", "Kuwait", "Qatar", "Worldwide"],
  availableChannel: [
    { "@type": "ServiceChannel", name: "On-site (Egypt)" },
    { "@type": "ServiceChannel", name: "Live online" },
  ],
  url: `${site.url}/training/`,
};

export default function TrainingPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <TrainingView />
    </SiteShell>
  );
}
