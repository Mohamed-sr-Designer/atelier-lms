"use client";

// ---- Client-side student store ----------------------------------------------
// The site is a static export (GitHub Pages), so the whole student experience
// — account, enrollments, lesson progress, quiz scores — lives in
// localStorage. One key, one JSON blob, one subscribe channel so every
// component re-renders together (storage events cover other tabs).

import { useSyncExternalStore } from "react";
import { courses, getCourse, lessonCount } from "@/lib/courses";

export type User = { name: string; email: string; joined: string };
export type StoreState = {
  user: User | null;
  enrollments: string[]; // course slugs (bundle expands to its courses)
  completed: Record<string, string[]>; // slug -> lesson ids
  quizPassed: Record<string, boolean>; // slug -> passed checkpoint quiz
};

const KEY = "atelier-lms"; // storage key kept stable across the Method rename
const EMPTY: StoreState = {
  user: null,
  enrollments: [],
  completed: {},
  quizPassed: {},
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

export const enrolledCourses = (s: StoreState) =>
  courses.filter((c) => s.enrollments.includes(c.slug));
