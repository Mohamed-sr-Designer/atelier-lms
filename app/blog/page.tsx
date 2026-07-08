import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import BlogView from "@/components/lms/BlogView";
import { site } from "@/lib/site";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Journal — Design Education, Career Paths & AI Production",
  description:
    "Honest writing on learning design, tool sequencing and AI production workflows — by art director and instructor Mohamed Tarek.",
  alternates: { canonical: "/blog/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Atelier Journal",
  url: `${site.url}/blog/`,
  publisher: { "@id": `${site.url}/#organization` },
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    url: `${site.url}/blog/${p.slug}/`,
    datePublished: p.date,
    author: { "@id": `${site.url}/#instructor` },
  })),
};

export default function BlogPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <BlogView />
    </SiteShell>
  );
}
