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

export type Studio = {
  courses: Record<string, CourseOverride>;
  offer?: {
    text?: string;
    enabled?: boolean; // default true
    endsAt?: number | null; // null = restart the rolling 7-day timer
  };
};

const KEY = "tarek-studio";
const EMPTY: Studio = { courses: {} };

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
