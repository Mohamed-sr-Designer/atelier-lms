"use client";

import type { Course, Resource } from "@/lib/courses";

// Client-generated resource downloads. Video lessons are publishing module by
// module; resource packs ship as branded manifests so the download flow —
// button, file, naming — works end to end today and swaps to real archives
// without UI changes.
export function downloadResource(course: Course, r: Resource) {
  const lines = [
    "METHOD — SCHOOL OF VISUAL DIRECTION",
    "════════════════════════════════════",
    "",
    `Course:   ${course.title.en}`,
    `Resource: ${r.t}`,
    `Format:   ${r.type}`,
    "",
    r.note,
    "",
    "────────────────────────────────────",
    "This resource pack is being finalized alongside the lesson videos.",
    "You'll be notified on WhatsApp the moment it ships — your enrollment",
    "already includes it, forever.",
    "",
    `Instructor: Mohamed Tarek`,
    `Support:    wa.me — see the contact page`,
    `© ${new Date().getFullYear()} Method`,
  ].join("\n");

  const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `atelier-${course.slug}-${r.t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
}
