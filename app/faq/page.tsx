import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import FaqPageView from "@/components/lms/FaqPageView";
import { site } from "@/lib/site";
import { dict } from "@/lib/dict";

export const metadata: Metadata = {
  title: "FAQ — Enrollment, Courses, Payments & Access",
  description:
    "Everything about learning at Tarek: how courses work, InstaPay & Vodafone Cash payments, lifetime access, refunds, final-project reviews and team training.",
  alternates: { canonical: "/faq/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  url: `${site.url}/faq/`,
  mainEntity: dict.en.faqPage.items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <FaqPageView />
    </SiteShell>
  );
}
