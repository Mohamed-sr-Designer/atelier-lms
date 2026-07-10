import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import HomeView from "@/components/lms/HomeView";
import { site } from "@/lib/site";
import { courses, stats, totalMinutes } from "@/lib/courses";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    type: "website",
  },
};

// ItemList of all courses — the landing page is the catalog's front door.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Tarek course catalog",
  description: `${stats.totalCourses} design courses, ${stats.totalHours} hours total`,
  itemListElement: courses.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${site.url}/courses/${c.slug}/`,
    name: c.title.en,
  })),
};

export default function Home() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomeView />
    </SiteShell>
  );
}
