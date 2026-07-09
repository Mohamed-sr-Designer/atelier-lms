import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import CatalogView from "@/components/lms/CatalogView";
import { site } from "@/lib/site";
import { courses, lessonCount, totalMinutes } from "@/lib/courses";

export const metadata: Metadata = {
  title: "Courses — Free Photoshop, Illustrator, After Effects & Premiere + Premium AI Production",
  description:
    "Browse Atelier's catalog: 4 completely free software courses and 2 premium AI production tracks (3–5 hours each) — practical projects, quizzes, final projects and verified certificates.",
  alternates: { canonical: "/courses/" },
};

// Course catalog as structured data — every course with duration and price.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Atelier design courses",
  numberOfItems: courses.length,
  itemListElement: courses.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Course",
      "@id": `${site.url}/courses/${c.slug}/`,
      url: `${site.url}/courses/${c.slug}/`,
      name: c.title.en,
      description: c.tagline.en,
      timeRequired: `PT${Math.floor(totalMinutes(c) / 60)}H${totalMinutes(c) % 60}M`,
      numberOfCredits: lessonCount(c),
      provider: { "@id": `${site.url}/#organization` },
    },
  })),
};

export default function CoursesPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CatalogView />
    </SiteShell>
  );
}
