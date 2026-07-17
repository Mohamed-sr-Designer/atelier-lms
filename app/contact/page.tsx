import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import ContactView from "@/components/lms/ContactView";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact | Talk to the Instructor Directly",
  description:
    "Enrollment help, team and academy training, or questions about your learning path — WhatsApp or email Mohamed Tarek directly, same-day replies.",
  alternates: { canonical: "/contact/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: `${site.url}/contact/`,
  mainEntity: {
    "@id": `${site.url}/#organization`,
  },
};

export default function ContactPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ContactView />
    </SiteShell>
  );
}
