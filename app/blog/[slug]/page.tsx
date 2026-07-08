import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import PostView from "@/components/lms/PostView";
import { site } from "@/lib/site";
import { posts, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const p = getPost(params.slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/blog/${p.slug}/` },
    openGraph: {
      title: p.title,
      description: p.excerpt,
      type: "article",
      publishedTime: p.date,
      url: `${site.url}/blog/${p.slug}/`,
      images: [{ url: p.cover, width: 1200, height: 630, alt: p.title }],
    },
    twitter: { card: "summary_large_image", title: p.title, description: p.excerpt },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: p.title,
        description: p.excerpt,
        image: `${site.url}${p.cover}`,
        datePublished: p.date,
        dateModified: p.date,
        url: `${site.url}/blog/${p.slug}/`,
        author: { "@id": `${site.url}/#instructor` },
        publisher: { "@id": `${site.url}/#organization` },
        mainEntityOfPage: `${site.url}/blog/${p.slug}/`,
        articleSection: p.tag,
        inLanguage: "en",
      },
      {
        "@type": "FAQPage",
        mainEntity: p.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Journal", item: `${site.url}/blog/` },
          { "@type": "ListItem", position: 3, name: p.title, item: `${site.url}/blog/${p.slug}/` },
        ],
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
      <PostView post={p} />
    </SiteShell>
  );
}
