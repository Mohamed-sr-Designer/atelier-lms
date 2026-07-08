"use client";

// ---- Client-side student store ----------------------------------------------
// The site is a static export (GitHub Pages), so the whole student experience
// — account, enrollments, lesson progress, quiz scores, certificates — lives
// in localStorage. One key, one JSON blob, one subscribe channel so every
// component re-renders together (storage events cover other tabs).

import { useCallback, useSyncExternalStore } from "react";
import { courses, getCourse, lessonCount } from "@/lib/courses";

export type User = { name: string; email: string; joined: string };
export type Certificate = {
  id: string; // e.g. "ATL-PS-4F2K9"
  slug: string;
  name: string; // student name at time of issue
  date: string; // ISO
};
export type StoreState = {
  user: User | null;
  enrollments: string[]; // course slugs (bundle expands to its courses)
  completed: Record<string, string[]>; // slug -> lesson ids
  quizPassed: Record<string, boolean>; // slug -> passed checkpoint quiz
  certificates: Certificate[];
};

const KEY = "atelier-lms";
const EMPTY: StoreState = {
  user: null,
  enrollments: [],
  completed: {},
  quizPassed: {},
  certificates: [],
};

let cache: StoreState = EMPTY;
let cacheRaw = "";

const read = (): StoreState => {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY) || "";
    if (raw === cacheRaw) return cache; // stable reference for useSyncExternalStore
    cacheRaw = raw;
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const write = (next: StoreState) => {
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

export function useStore(): StoreState {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

// ---- actions ---------------------------------------------------------------

export const login = (name: string, email: string) => {
  const s = read();
  write({
    ...s,
    user: { name, email, joined: s.user?.joined || new Date().toISOString() },
  });
};

export const logout = () => write({ ...read(), user: null });

export const enroll = (slugs: string | string[]) => {
  const s = read();
  const add = (Array.isArray(slugs) ? slugs : [slugs]).filter(
    (x) => getCourse(x) && !s.enrollments.includes(x)
  );
  if (add.length) write({ ...s, enrollments: [...s.enrollments, ...add] });
};

export const toggleLesson = (slug: string, lessonId: string) => {
  const s = read();
  const done = s.completed[slug] || [];
  const next = done.includes(lessonId)
    ? done.filter((x) => x !== lessonId)
    : [...done, lessonId];
  write({ ...s, completed: { ...s.completed, [slug]: next } });
};

export const passQuiz = (slug: string) => {
  const s = read();
  write({ ...s, quizPassed: { ...s.quizPassed, [slug]: true } });
};

const certId = (slug: string) => {
  const c = getCourse(slug);
  const tag = (c?.glyph || "XX").replace(/[^A-Za-z]/g, "").toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `ATL-${tag}-${rand}`;
};

export const issueCertificate = (slug: string): Certificate | null => {
  const s = read();
  if (!s.user) return null;
  const existing = s.certificates.find((c) => c.slug === slug);
  if (existing) return existing;
  const cert: Certificate = {
    id: certId(slug),
    slug,
    name: s.user.name,
    date: new Date().toISOString(),
  };
  write({ ...s, certificates: [...s.certificates, cert] });
  return cert;
};

// ---- derived helpers ---------------------------------------------------------

export const courseProgress = (s: StoreState, slug: string) => {
  const c = getCourse(slug);
  if (!c) return 0;
  const total = lessonCount(c);
  const done = (s.completed[slug] || []).length;
  return total ? Math.min(100, Math.round((done / total) * 100)) : 0;
};

export const isEnrolled = (s: StoreState, slug: string) =>
  s.enrollments.includes(slug);

export const certificateReady = (s: StoreState, slug: string) =>
  courseProgress(s, slug) === 100 && Boolean(s.quizPassed[slug]);

export const enrolledCourses = (s: StoreState) =>
  courses.filter((c) => s.enrollments.includes(c.slug));
