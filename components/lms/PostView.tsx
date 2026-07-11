"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import FaqList from "@/components/lms/FaqList";
import CourseCard from "@/components/lms/CourseCard";
import { useLang } from "@/lib/i18n";
import { getCourse } from "@/lib/courses";
import type { Post } from "@/lib/blog";

export default function PostView({ post }: { post: Post }) {
  const { t, lang } = useLang();
  const related = getCourse(post.relatedCourse);

  return (
    <article className="pb-28 pt-32 md:pt-44">
      <div className="container-edge mx-auto max-w-4xl">
        <Reveal>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-bone-500">
            <Link href="/" className="transition-colors hover:text-bone-200">
              {t.common.home}
            </Link>
            <span aria-hidden>/</span>
            <Link href="/blog/" className="transition-colors hover:text-bone-200">
              {t.nav.blog}
            </Link>
            <span aria-hidden>/</span>
            <span className="truncate text-bone-300">{post.tag}</span>
          </nav>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-8 text-balance font-display text-4xl font-semibold leading-[1.02] tracking-tightest text-bone-50 md:text-6xl">
            {post.title}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-bone-500">
            <span className="flex items-center gap-2 text-bone-300">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-mint/15 font-serif text-xs italic text-mint">
                M
              </span>
              Mohamed Tarek
            </span>
            <span aria-hidden>·</span>
            <span>
              {new Date(post.date).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span aria-hidden>·</span>
            <span>
              {post.readMins} {t.blogUi.minsRead}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative mt-10 overflow-hidden rounded-2xl border border-line/10">
            <div className="aspect-[16/8]">
              <Media
                src={post.cover}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1024px) 56rem, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        {/* body — English editorial content with generous measure */}
        <div className="mx-auto mt-14 max-w-2xl" dir="ltr">
          {post.body.map((b, i) => (
            <Reveal key={i}>
              <div>
                {b.h && (
                  <h2 className="mt-12 text-2xl font-semibold tracking-tight text-bone-50 md:text-3xl">
                    {b.h}
                  </h2>
                )}
                <p className="mt-5 text-pretty text-base leading-[1.85] text-bone-200/90 md:text-lg">
                  {b.p}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* in-post FAQ */}
        <div className="mx-auto mt-16 max-w-2xl" dir="ltr">
          <Reveal>
            <p className="text-xs uppercase tracking-ultra text-bone-500">
              {t.blogUi.faqInPost}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-6">
              <FaqList items={post.faq} />
            </div>
          </Reveal>
        </div>

        {/* related course — explicit CTA into the course this article covers */}
        {related && (
          <div className="mx-auto mt-16 max-w-2xl">
            <Reveal>
              <p className="text-xs uppercase tracking-ultra text-bone-500">
                {t.blogUi.relatedCourse}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="mt-6">
                <CourseCard course={related} />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-mint/25 bg-mint/[0.05] p-5">
                <p className="grow font-serif text-lg italic text-bone-100">
                  {t.blogUi.courseCtaLead}
                </p>
                <Link
                  href={`/courses/${related.slug}/`}
                  className="btn btn-primary px-7 py-3.5"
                >
                  {t.blogUi.courseCtaBtn}
                </Link>
              </div>
            </Reveal>
          </div>
        )}

        <Reveal>
          <div className="mx-auto mt-14 max-w-2xl border-t border-line/10 pt-8">
            <Link href="/blog/" className="link-underline text-sm text-mint">
              {t.blogUi.backToBlog}
            </Link>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
