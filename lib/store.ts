"use client";

// ---- Client-side student store ----------------------------------------------
// The site is a static export (GitHub Pages), so the whole student experience
// — account, enrollments, lesson progress, quiz scores — lives in
// localStorage. One key, one JSON blob, one subscribe channel so every
// component re-renders together (storage events cover other tabs).

import { useSyncExternalStore } from "react";
import { courses, getCourse, lessonCount } from "@/lib/courses";

export type Role = "user" | "admin";
export type User = {
  name: string;
  email: string;
  joined: string;
  phone?: string;
  avatar?: string; // small data-URL, set from the account page
  role?: Role; // absent = "user" (accounts created before roles existed)
};
export type StoreState = {
  user: User | null;
  enrollments: string[]; // course slugs (bundle expands to its courses)
  completed: Record<string, string[]>; // slug -> lesson ids
  quizPassed: Record<string, boolean>; // slug -> passed checkpoint quiz
  archived: string[]; // course slugs moved off the active shelf
  activity: Record<string, number>; // "YYYY-MM-DD" -> minutes studied that day
  goal: number; // weekly study goal, in hours
};

// Dummy instructor account — logging in with this email grants the admin role.
export const ADMIN_EMAIL = "admin@tarek.school";

const KEY = "atelier-lms"; // storage key kept stable across the Tarek rename
const EMPTY: StoreState = {
  user: null,
  enrollments: [],
  completed: {},
  quizPassed: {},
  archived: [],
  activity: {},
  goal: 5,
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
  const role: Role =
    email.trim().toLowerCase() === ADMIN_EMAIL ? "admin" : "user";
  write({
    ...s,
    user: {
      ...s.user,
      name,
      email,
      role,
      joined: s.user?.joined || new Date().toISOString(),
    },
  });
};

const dayKey = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
};

// One-click demo accounts. The student comes pre-seeded with enrollments,
// progress and a week of activity so every dashboard section demos alive.
export const loginAs = (kind: "student" | "admin") => {
  if (kind === "admin") {
    write({
      ...read(),
      user: {
        name: "Mohamed Tarek",
        email: ADMIN_EMAIL,
        role: "admin",
        joined: new Date().toISOString(),
      },
    });
    return;
  }
  const ps = getCourse("adobe-photoshop");
  const ai = getCourse("ai-photoshoot");
  const psDone = ps
    ? ps.modules.flatMap((m) => m.lessons).slice(0, 7).map((l) => l.id)
    : [];
  const aiDone = ai
    ? ai.modules.flatMap((m) => m.lessons).slice(0, 2).map((l) => l.id)
    : [];
  const week = [45, 20, 0, 65, 30, 50, 25]; // minutes, today going back
  const activity: Record<string, number> = {};
  week.forEach((m, i) => {
    if (m) activity[dayKey(i)] = m;
  });
  write({
    user: {
      name: "Demo Student",
      email: "student@tarek.school",
      role: "user",
      joined: new Date(Date.now() - 32 * 86400000).toISOString(),
    },
    enrollments: ["adobe-photoshop", "ai-photoshoot"],
    completed: { "adobe-photoshop": psDone, "ai-photoshoot": aiDone },
    quizPassed: {},
    archived: [],
    activity,
    goal: 5,
  });
};

export const toggleArchive = (slug: string) => {
  const s = read();
  const archived = s.archived.includes(slug)
    ? s.archived.filter((x) => x !== slug)
    : [...s.archived, slug];
  write({ ...s, archived });
};

export const setGoal = (hours: number) =>
  write({ ...read(), goal: Math.max(1, Math.min(40, Math.round(hours))) });

// Patch profile fields (photo, phone, name, email) without touching joined.
export const updateUser = (patch: Partial<Omit<User, "joined">>) => {
  const s = read();
  if (!s.user) return;
  write({ ...s, user: { ...s.user, ...patch } });
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
  const marking = !done.includes(lessonId);
  const next = marking
    ? [...done, lessonId]
    : done.filter((x) => x !== lessonId);
  // log study minutes on today's activity so the dashboard chart is real
  const dur =
    getCourse(slug)
      ?.modules.flatMap((m) => m.lessons)
      .find((l) => l.id === lessonId)?.dur || 0;
  const key = dayKey();
  const minutes = Math.max(0, (s.activity[key] || 0) + (marking ? dur : -dur));
  write({
    ...s,
    completed: { ...s.completed, [slug]: next },
    activity: { ...s.activity, [key]: minutes },
  });
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
