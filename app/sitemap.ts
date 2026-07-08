import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { courses } from "@/lib/courses";
import { posts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (
    p: string,
    priority: number,
    changeFrequency: "weekly" | "monthly" = "monthly"
  ) => ({
    url: `${site.url}${p}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("", 1, "weekly"),
    page("/courses/", 0.9, "weekly"),
    ...courses.map((c) => page(`/courses/${c.slug}/`, 0.9)),
    page("/bundle/", 0.9),
    page("/instructor/", 0.8),
    page("/blog/", 0.7, "weekly"),
    ...posts.map((p) => page(`/blog/${p.slug}/`, 0.6)),
    page("/faq/", 0.7),
    page("/contact/", 0.6),
    page("/legal/terms/", 0.2),
    page("/legal/privacy/", 0.2),
    page("/legal/refunds/", 0.3),
  ];
}
