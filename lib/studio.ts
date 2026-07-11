"use client";

// ---- Studio (admin) overrides ------------------------------------------------
// The site is a static export, so the instructor's edits — prices, names,
// covers, extra lessons, the offer ribbon — live in localStorage and are
// merged over the static course data at render time. Same channel pattern
// as lib/store.ts: one key, one blob, one subscribe.

import { useSyncExternalStore } from "react";
import type { Course, Lesson } from "@/lib/courses";

export type CourseOverride = {
  title?: string;
  short?: string;
  tagline?: string;
  price?: number;
  compareAt?: number | null; // null = remove the compare-at price
  cover?: string;
  extraLessons?: { t: string; dur: number; video?: string }[];
};

// A brand-new course the admin builds from scratch (stored, not static).
export type DraftLesson = { t: string; dur: number; video?: string };
export type DraftModule = { t: string; lessons: DraftLesson[] };
export type DraftCourse = {
  slug: string;
  title: string;
  short: string;
  tagline: string;
  price: number;
  compareAt?: number;
  cover: string;
  modules: DraftModule[];
};

export type Studio = {
  courses: Record<string, CourseOverride>;
  drafts?: DraftCourse[];
  offer?: {
    text?: string;
    enabled?: boolean; // default true
    endsAt?: number | null; // null = restart the rolling 7-day timer
  };
};

const KEY = "tarek-studio";
const EMPTY: Studio = { courses: {}, drafts: [] };

let cache: Studio = EMPTY;
let cacheRaw = "";

const read = (): Studio => {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY) || "";
    if (raw === cacheRaw) return cache;
    cacheRaw = raw;
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const write = (next: Studio) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  emit();
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
};

export function useStudio(): Studio {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

// ---- actions -----------------------------------------------------------------

export const setCourseOverride = (
  slug: string,
  patch: CourseOverride | null
) => {
  const s = read();
  const courses = { ...s.courses };
  if (patch === null) delete courses[slug];
  else courses[slug] = { ...courses[slug], ...patch };
  write({ ...s, courses });
};

export const addStudioLesson = (
  slug: string,
  lesson: { t: string; dur: number; video?: string }
) => {
  const s = read();
  const ov = s.courses[slug] || {};
  setCourseOverride(slug, {
    ...ov,
    extraLessons: [...(ov.extraLessons || []), lesson],
  });
};

export const setOfferOverride = (patch: NonNullable<Studio["offer"]>) => {
  const s = read();
  write({ ...s, offer: { ...s.offer, ...patch } });
};

// ---- draft courses (built from scratch in the studio) ------------------------

const slugify = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || `course-${Date.now().toString(36)}`;

export const addDraft = (name: string): string => {
  const s = read();
  const drafts = s.drafts || [];
  let slug = slugify(name);
  // keep slugs unique across drafts
  let n = 2;
  while (drafts.some((d) => d.slug === slug)) slug = `${slugify(name)}-${n++}`;
  const draft: DraftCourse = {
    slug,
    title: name.trim(),
    short: name.trim(),
    tagline: "A new course from the studio.",
    price: 0,
    cover: "/lms/featured-banner.jpg",
    modules: [{ t: "Module 01", lessons: [] }],
  };
  write({ ...s, drafts: [...drafts, draft] });
  return slug;
};

export const updateDraft = (
  slug: string,
  patch: Partial<Omit<DraftCourse, "slug" | "modules">>
) => {
  const s = read();
  write({
    ...s,
    drafts: (s.drafts || []).map((d) =>
      d.slug === slug ? { ...d, ...patch } : d
    ),
  });
};

export const addDraftModule = (slug: string, title: string) => {
  const s = read();
  write({
    ...s,
    drafts: (s.drafts || []).map((d) =>
      d.slug === slug
        ? { ...d, modules: [...d.modules, { t: title, lessons: [] }] }
        : d
    ),
  });
};

export const addDraftLesson = (
  slug: string,
  moduleIndex: number,
  lesson: DraftLesson
) => {
  const s = read();
  write({
    ...s,
    drafts: (s.drafts || []).map((d) =>
      d.slug === slug
        ? {
            ...d,
            modules: d.modules.map((m, i) =>
              i === moduleIndex ? { ...m, lessons: [...m.lessons, lesson] } : m
            ),
          }
        : d
    ),
  });
};

export const removeDraftLesson = (
  slug: string,
  moduleIndex: number,
  lessonIndex: number
) => {
  const s = read();
  write({
    ...s,
    drafts: (s.drafts || []).map((d) =>
      d.slug === slug
        ? {
            ...d,
            modules: d.modules.map((m, i) =>
              i === moduleIndex
                ? { ...m, lessons: m.lessons.filter((_, li) => li !== lessonIndex) }
                : m
            ),
          }
        : d
    ),
  });
};

export const removeDraft = (slug: string) => {
  const s = read();
  write({ ...s, drafts: (s.drafts || []).filter((d) => d.slug !== slug) });
};

// Turn a draft into a full Course object so it renders through the same
// CourseCard / detail components as the static catalogue.
export const draftToCourse = (d: DraftCourse): Course => {
  const modules = (d.modules.length ? d.modules : [{ t: "Module 01", lessons: [] }]).map(
    (m, mi) => ({
      n: String(mi + 1).padStart(2, "0"),
      t: m.t,
      lessons: m.lessons.map((l, li) => ({
        id: `${d.slug}-${mi + 1}-${li + 1}`,
        t: l.t,
        dur: l.dur,
        d: l.video ? "Video lesson" : "Lesson",
        free: mi === 0 && li === 0,
      })),
    })
  );
  const bi = (en: string) => ({ en, ar: en });
  return {
    slug: d.slug,
    index: "NEW",
    glyph: "★",
    title: bi(d.title),
    short: bi(d.short || d.title),
    tagline: bi(d.tagline),
    desc: bi(d.tagline),
    level: bi("Zero → Professional"),
    audience: bi("Anyone who wants to learn this, hands-on."),
    price: d.price,
    compareAt: d.compareAt,
    cover: d.cover || "/lms/featured-banner.jpg",
    outcomes: modules.flatMap((m) => m.lessons.map((l) => l.t)).slice(0, 6),
    tools: [],
    path: [],
    modules,
    quiz: [],
    projects: [],
    resources: [],
    finalProject: {
      t: "Final project",
      d: "Apply everything from this course in one deliverable.",
      deliverables: ["Your finished project"],
    },
    faq: [],
    reviews: [],
    rating: 5,
    ratingCount: 0,
    students: 0,
  };
};

export const findDraft = (studio: Studio, slug: string) =>
  (studio.drafts || []).find((d) => d.slug === slug);

export const resetStudio = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  cacheRaw = "";
  cache = EMPTY;
  emit();
};

// ---- merge -------------------------------------------------------------------

export const mergeCourse = (c: Course, ov?: CourseOverride): Course => {
  if (!ov) return c;
  const merged: Course = {
    ...c,
    title: ov.title ? { ...c.title, en: ov.title } : c.title,
    short: ov.short ? { ...c.short, en: ov.short } : c.short,
    tagline: ov.tagline ? { ...c.tagline, en: ov.tagline } : c.tagline,
    price: ov.price ?? c.price,
    compareAt:
      ov.compareAt === null ? undefined : ov.compareAt ?? c.compareAt,
    cover: ov.cover || c.cover,
  };
  if (ov.extraLessons?.length) {
    const extra: Lesson[] = ov.extraLessons.map((l, i) => ({
      id: `${c.slug}-x-${i + 1}`,
      t: l.t,
      dur: l.dur,
      d: l.video || "Fresh drop from the studio",
    }));
    merged.modules = [
      ...c.modules,
      {
        n: String(c.modules.length + 1).padStart(2, "0"),
        t: "Fresh drops",
        lessons: extra,
      },
    ];
  }
  return merged;
};

// Merge a single course against the live overrides (hook form).
export function useLiveCourse(c: Course): Course {
  const studio = useStudio();
  return mergeCourse(c, studio.courses[c.slug]);
}
