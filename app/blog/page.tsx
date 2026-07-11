import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import BlogView from "@/components/lms/BlogView";
import { site } from "@/lib/site";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog & Support — Guides, How-tos & Answers",
  description:
    "Support articles and honest how-tos on learning design, tool sequencing and AI production — by art director and designer Mohamed Tarek.",
  alternates: { canonical: "/blog/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Mohamed Tarek Academy — Blog & Support",
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
