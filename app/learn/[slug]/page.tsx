import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import LearnView from "@/components/lms/LearnView";
import { courses, getCourse } from "@/lib/courses";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const c = getCourse(params.slug);
  return {
    title: c ? `Learning | ${c.short.en}` : "Learning",
    robots: { index: false },
  };
}

export default function LearnPage({ params }: { params: { slug: string } }) {
  const c = getCourse(params.slug);
  if (!c) notFound();
  return (
    <SiteShell>
      <Suspense>
        <LearnView course={c} />
      </Suspense>
    </SiteShell>
  );
}
