import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import CourseDetailView from "@/components/lms/CourseDetailView";
import { site } from "@/lib/site";
import {
  courses,
  getCourse,
  lessonCount,
  totalMinutes,
} from "@/lib/courses";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const c = getCourse(params.slug);
  if (!c) return {};
  const mins = totalMinutes(c);
  const title = `${c.title.en} | ${Math.round(mins / 60)}h Course`;
  const description = `${c.tagline.en} ${lessonCount(c)} lessons · ${c.modules.length} modules · practical projects, quizzes & a reviewed final project. Taught by art director Mohamed Tarek.`;
  return {
    title,
    description,
    alternates: { canonical: `/courses/${c.slug}/` },
    openGraph: {
      title,
      description,
      url: `${site.url}/courses/${c.slug}/`,
      type: "website",
      images: [{ url: c.cover, width: 1200, height: 630, alt: c.title.en }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function CoursePage({ params }: { params: { slug: string } }) {
  const c = getCourse(params.slug);
  if (!c) notFound();

  const mins = totalMinutes(c);
  const url = `${site.url}/courses/${c.slug}/`;

  // Course + Breadcrumb + FAQ — the full educational schema stack.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "@id": `${url}#course`,
        name: c.title.en,
        description: c.desc.en,
        url,
        image: `${site.url}${c.cover}`,
        provider: { "@id": `${site.url}/#organization` },
        instructor: { "@id": `${site.url}/#instructor` },
        inLanguage: ["ar", "en"],
        educationalLevel: "Beginner to Professional",
        teaches: c.outcomes,
        timeRequired: `PT${Math.floor(mins / 60)}H${mins % 60}M`,
        numberOfLessons: lessonCount(c),
        coursePrerequisites: "None — starts from zero",
        educationalCredentialAwarded: "Personally reviewed final portfolio project",
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: `PT${Math.floor(mins / 60)}H${mins % 60}M`,
        },
        offers: {
          "@type": "Offer",
          category: c.price === 0 ? "Free" : "Paid",
          price: c.price,
          priceCurrency: "EGP",
          availability: "https://schema.org/InStock",
          url,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: c.rating,
          ratingCount: c.ratingCount,
          bestRating: 5,
        },
        review: c.reviews.map((r) => ({
          "@type": "Review",
          reviewRating: { "@type": "Rating", ratingValue: r.stars, bestRating: 5 },
          author: { "@type": "Person", name: r.name },
          reviewBody: r.text,
        })),
        syllabusSections: c.modules.map((m) => ({
          "@type": "Syllabus",
          name: `Module ${m.n}: ${m.t}`,
          timeRequired: `PT${m.lessons.reduce((n, l) => n + l.dur, 0)}M`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Courses", item: `${site.url}/courses/` },
          { "@type": "ListItem", position: 3, name: c.short.en, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CourseDetailView course={c} />
    </SiteShell>
  );
}
