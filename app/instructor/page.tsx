import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import InstructorView from "@/components/lms/InstructorView";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mohamed Tarek — Art Director & Design Instructor",
  description:
    "Meet the instructor: 9+ years of brand, campaign and motion work across Egypt, Saudi Arabia and Kuwait, and 1,200+ students taught across four academies.",
  alternates: { canonical: "/instructor/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${site.url}/instructor/`,
  mainEntity: { "@id": `${site.url}/#instructor` },
};

export default function InstructorPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <InstructorView />
    </SiteShell>
  );
}
