"use client";

// ---- Data layer ---------------------------------------------------------------
// Orders, project reviews, lesson questions, certificates, lesson videos and
// the admin's student list. Each call goes to Supabase in cloud mode, or to a
// local "table" blob in demo mode, so every screen works the same either way
// (in demo mode the admin and the student just share one browser).

import { useCallback, useEffect, useState } from "react";
import { cloud, sb } from "@/lib/cloud";
import { getState, hydrate, type StoreState, type User } from "@/lib/store";
import { getCourse } from "@/lib/courses";

export type OrderStatus = "pending" | "approved" | "rejected";
export type Order = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  title: string;
  courseSlugs: string[];
  amount: number;
  promo?: string;
  method: string;
  reference?: string;
  status: OrderStatus;
  adminNote?: string;
  createdAt: string;
  reviewedAt?: string;
};

export type SubmissionStatus = "pending" | "approved" | "changes";
export type Submission = {
  id: string;
  userId: string;
  userName: string;
  courseSlug: string;
  link: string;
  note?: string;
  status: SubmissionStatus;
  feedback?: string;
  createdAt: string;
  reviewedAt?: string;
};

export type Question = {
  id: string;
  userId: string;
  userName: string;
  courseSlug: string;
  lessonId: string;
  body: string;
  answer?: string;
  answeredAt?: string;
  createdAt: string;
};

export type Certificate = {
  id: string;
  userId: string;
  name: string;
  courseSlug: string;
  courseTitle: string;
  issuedAt: string;
};

export type Student = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joined: string;
  enrollments: string[];
  completed: Record<string, string[]>;
};

// ---------------------------------------------------------------- events
// Any write fires "mt-db" so every open list refreshes itself.
const CHANGED = "mt-db";
const changed = () => window.dispatchEvent(new Event(CHANGED));

export function useDb<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);
  useEffect(() => {
    let alive = true;
    const load = () =>
      run()
        .then((d) => alive && (setData(d), setError("")))
        .catch((e) => alive && setError(String(e?.message || e)));
    load();
    window.addEventListener(CHANGED, load);
    return () => {
      alive = false;
      window.removeEventListener(CHANGED, load);
    };
  }, [run]);
  return { data, error };
}

// ------------------------------------------------------------ demo tables
type Local = {
  orders: Order[];
  submissions: Submission[];
  questions: Question[];
  certificates: Certificate[];
  media: Record<string, { courseSlug: string; url: string; free: boolean }>;
};
const LKEY = "mt-db";
const EMPTY: Local = { orders: [], submissions: [], questions: [], certificates: [], media: {} };
const lread = (): Local => {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(LKEY) || "{}") };
  } catch {
    return EMPTY;
  }
};
const lwrite = (patch: Partial<Local>) => {
  try {
    localStorage.setItem(LKEY, JSON.stringify({ ...lread(), ...patch }));
  } catch {}
  changed();
};
const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
const now = () => new Date().toISOString();
const me = (): User => {
  const u = getState().user;
  if (!u) throw new Error("not signed in");
  return u;
};
const myId = () => me().id || me().email;

// ------------------------------------------------------------ row mappers
/* eslint-disable @typescript-eslint/no-explicit-any */
const toOrder = (r: any): Order => ({
  id: r.id,
  userId: r.user_id,
  userName: r.user_name,
  userEmail: r.user_email,
  userPhone: r.user_phone ?? undefined,
  title: r.title,
  courseSlugs: r.course_slugs,
  amount: r.amount,
  promo: r.promo ?? undefined,
  method: r.method,
  reference: r.reference ?? undefined,
  status: r.status,
  adminNote: r.admin_note ?? undefined,
  createdAt: r.created_at,
  reviewedAt: r.reviewed_at ?? undefined,
});
const toSub = (r: any): Submission => ({
  id: r.id,
  userId: r.user_id,
  userName: r.user_name,
  courseSlug: r.course_slug,
  link: r.link,
  note: r.note ?? undefined,
  status: r.status,
  feedback: r.feedback ?? undefined,
  createdAt: r.created_at,
  reviewedAt: r.reviewed_at ?? undefined,
});
const toQ = (r: any): Question => ({
  id: r.id,
  userId: r.user_id,
  userName: r.user_name,
  courseSlug: r.course_slug,
  lessonId: r.lesson_id,
  body: r.body,
  answer: r.answer ?? undefined,
  answeredAt: r.answered_at ?? undefined,
  createdAt: r.created_at,
});
const toCert = (r: any): Certificate => ({
  id: r.id,
  userId: r.user_id,
  name: r.name,
  courseSlug: r.course_slug,
  courseTitle: r.course_title,
  issuedAt: r.issued_at,
});
/* eslint-enable @typescript-eslint/no-explicit-any */

const must = <T,>(res: { data: T | null; error: { message: string } | null }): T => {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
};

// ============================================================ enrollments
// Free courses: the student enrolls themselves. Paid ones only through an
// approved order (see setOrderStatus).
export async function enrollFree(slugs: string[]) {
  const s = getState();
  const add = slugs.filter((x) => getCourse(x)?.price === 0 && !s.enrollments.includes(x));
  if (!add.length) return;
  if (cloud) {
    const id = me().id!;
    must(
      await sb()
        .from("enrollments")
        .upsert(add.map((course_slug) => ({ user_id: id, course_slug, source: "free" })))
    );
  }
  hydrate({ ...getState(), enrollments: [...s.enrollments, ...add] });
}

// ================================================================= orders
export async function createOrder(o: {
  title: string;
  courseSlugs: string[];
  amount: number;
  promo?: string;
  method: string;
  reference: string;
}) {
  const u = me();
  if (cloud) {
    must(
      await sb().from("orders").insert({
        user_id: u.id,
        user_name: u.name,
        user_email: u.email,
        user_phone: u.phone || null,
        title: o.title,
        course_slugs: o.courseSlugs,
        amount: o.amount,
        promo: o.promo || null,
        method: o.method,
        reference: o.reference,
      })
    );
    changed();
    return;
  }
  const order: Order = {
    id: uid(),
    userId: myId(),
    userName: u.name,
    userEmail: u.email,
    userPhone: u.phone,
    ...o,
    status: "pending",
    createdAt: now(),
  };
  lwrite({ orders: [order, ...lread().orders] });
}

export async function myOrders(): Promise<Order[]> {
  if (!getState().user) return [];
  if (cloud) {
    const r = await sb().from("orders").select("*").eq("user_id", me().id!).order("created_at", { ascending: false });
    return must(r).map(toOrder);
  }
  return lread().orders.filter((o) => o.userId === myId());
}

export async function allOrders(): Promise<Order[]> {
  if (cloud) {
    const r = await sb().from("orders").select("*").order("created_at", { ascending: false });
    return must(r).map(toOrder);
  }
  return lread().orders;
}

export async function setOrderStatus(order: Order, status: OrderStatus, note?: string) {
  if (cloud) {
    if (status === "approved") {
      must(
        await sb()
          .from("enrollments")
          .upsert(order.courseSlugs.map((course_slug) => ({ user_id: order.userId, course_slug, source: "order" })))
      );
    }
    must(
      await sb()
        .from("orders")
        .update({ status, admin_note: note || null, reviewed_at: now() })
        .eq("id", order.id)
    );
    changed();
    return;
  }
  lwrite({
    orders: lread().orders.map((o) =>
      o.id === order.id ? { ...o, status, adminNote: note, reviewedAt: now() } : o
    ),
  });
  // demo mode: the buyer is this same browser
  if (status === "approved") {
    const s = getState();
    hydrate({ ...s, enrollments: Array.from(new Set([...s.enrollments, ...order.courseSlugs])) });
  }
}

// ============================================================ submissions
export async function submitProject(courseSlug: string, link: string, note: string) {
  const u = me();
  if (cloud) {
    must(
      await sb().from("submissions").insert({
        user_id: u.id,
        user_name: u.name,
        course_slug: courseSlug,
        link,
        note: note || null,
      })
    );
    changed();
    return;
  }
  const sub: Submission = {
    id: uid(),
    userId: myId(),
    userName: u.name,
    courseSlug,
    link,
    note,
    status: "pending",
    createdAt: now(),
  };
  lwrite({ submissions: [sub, ...lread().submissions] });
}

export async function mySubmissions(courseSlug?: string): Promise<Submission[]> {
  if (!getState().user) return [];
  if (cloud) {
    let q = sb().from("submissions").select("*").eq("user_id", me().id!);
    if (courseSlug) q = q.eq("course_slug", courseSlug);
    return must(await q.order("created_at", { ascending: false })).map(toSub);
  }
  return lread().submissions.filter(
    (s) => s.userId === myId() && (!courseSlug || s.courseSlug === courseSlug)
  );
}

export async function allSubmissions(): Promise<Submission[]> {
  if (cloud) {
    return must(await sb().from("submissions").select("*").order("created_at", { ascending: false })).map(toSub);
  }
  return lread().submissions;
}

// Approved student work, for the public gallery.
export async function approvedSubmissions(): Promise<Submission[]> {
  if (cloud) {
    const r = await sb()
      .from("submissions")
      .select("*")
      .eq("status", "approved")
      .order("reviewed_at", { ascending: false })
      .limit(24);
    return must(r).map(toSub);
  }
  return lread().submissions.filter((s) => s.status === "approved");
}

// Approving a final project is what earns the certificate.
export async function reviewSubmission(sub: Submission, status: SubmissionStatus, feedback: string) {
  const course = getCourse(sub.courseSlug);
  if (cloud) {
    must(
      await sb()
        .from("submissions")
        .update({ status, feedback: feedback || null, reviewed_at: now() })
        .eq("id", sub.id)
    );
    if (status === "approved" && course) {
      const { data } = await sb()
        .from("certificates")
        .select("id")
        .eq("user_id", sub.userId)
        .eq("course_slug", sub.courseSlug)
        .maybeSingle();
      if (!data) {
        must(
          await sb().from("certificates").insert({
            id: certId(),
            user_id: sub.userId,
            name: sub.userName,
            course_slug: sub.courseSlug,
            course_title: course.title.en,
          })
        );
      }
    }
    changed();
    return;
  }
  const l = lread();
  const certificates =
    status === "approved" &&
    course &&
    !l.certificates.some((c) => c.userId === sub.userId && c.courseSlug === sub.courseSlug)
      ? [
          {
            id: certId(),
            userId: sub.userId,
            name: sub.userName,
            courseSlug: sub.courseSlug,
            courseTitle: course.title.en,
            issuedAt: now(),
          },
          ...l.certificates,
        ]
      : l.certificates;
  lwrite({
    submissions: l.submissions.map((s) =>
      s.id === sub.id ? { ...s, status, feedback, reviewedAt: now() } : s
    ),
    certificates,
  });
}

// ========================================================== certificates
// MT-26-XXXXXX: year + 6 unambiguous characters.
const certId = () => {
  const abc = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let s = "";
  for (let i = 0; i < 6; i++) s += abc[Math.floor(Math.random() * abc.length)];
  return `MT-${String(new Date().getFullYear()).slice(2)}-${s}`;
};

export async function myCertificates(): Promise<Certificate[]> {
  if (!getState().user) return [];
  if (cloud) {
    return must(await sb().from("certificates").select("*").eq("user_id", me().id!)).map(toCert);
  }
  return lread().certificates.filter((c) => c.userId === myId());
}

export async function getCertificate(id: string): Promise<Certificate | null> {
  const clean = id.trim().toUpperCase();
  if (!clean) return null;
  if (cloud) {
    const r = await sb().from("certificates").select("*").eq("id", clean).maybeSingle();
    return r.data ? toCert(r.data) : null;
  }
  return lread().certificates.find((c) => c.id === clean) || null;
}

export async function allCertificates(): Promise<Certificate[]> {
  if (cloud) {
    return must(await sb().from("certificates").select("*").order("issued_at", { ascending: false })).map(toCert);
  }
  return lread().certificates;
}

// ============================================================== questions
export async function askQuestion(courseSlug: string, lessonId: string, body: string) {
  const u = me();
  if (cloud) {
    must(
      await sb().from("questions").insert({
        user_id: u.id,
        user_name: u.name,
        course_slug: courseSlug,
        lesson_id: lessonId,
        body,
      })
    );
    changed();
    return;
  }
  const q: Question = {
    id: uid(),
    userId: myId(),
    userName: u.name,
    courseSlug,
    lessonId,
    body,
    createdAt: now(),
  };
  lwrite({ questions: [q, ...lread().questions] });
}

// Answered questions for everyone, plus the viewer's own pending ones.
export async function lessonQuestions(courseSlug: string, lessonId: string): Promise<Question[]> {
  if (cloud) {
    const r = await sb()
      .from("questions")
      .select("*")
      .eq("course_slug", courseSlug)
      .eq("lesson_id", lessonId)
      .order("created_at", { ascending: true });
    return must(r).map(toQ);
  }
  const mine = getState().user ? myId() : "";
  return lread()
    .questions.filter(
      (q) => q.courseSlug === courseSlug && q.lessonId === lessonId && (q.answer || q.userId === mine)
    )
    .reverse();
}

export async function allQuestions(): Promise<Question[]> {
  if (cloud) {
    return must(await sb().from("questions").select("*").order("created_at", { ascending: false })).map(toQ);
  }
  return lread().questions;
}

export async function answerQuestion(id: string, answer: string) {
  if (cloud) {
    must(await sb().from("questions").update({ answer, answered_at: now() }).eq("id", id));
    changed();
    return;
  }
  lwrite({
    questions: lread().questions.map((q) => (q.id === id ? { ...q, answer, answeredAt: now() } : q)),
  });
}

export async function deleteQuestion(id: string) {
  if (cloud) {
    must(await sb().from("questions").delete().eq("id", id));
    changed();
    return;
  }
  lwrite({ questions: lread().questions.filter((q) => q.id !== id) });
}

// =========================================================== lesson media
// lesson id -> video URL. RLS hides paid lessons from students who are not
// enrolled, so this map only ever holds what the viewer may watch.
export async function courseMedia(courseSlug: string): Promise<Record<string, string>> {
  if (cloud) {
    const r = await sb().from("lesson_media").select("lesson_id,url").eq("course_slug", courseSlug);
    const out: Record<string, string> = {};
    for (const row of must(r) as { lesson_id: string; url: string }[]) out[row.lesson_id] = row.url;
    return out;
  }
  const out: Record<string, string> = {};
  for (const [id, m] of Object.entries(lread().media)) if (m.courseSlug === courseSlug) out[id] = m.url;
  return out;
}

export async function setLessonMedia(courseSlug: string, lessonId: string, url: string, free: boolean) {
  const clean = url.trim();
  if (cloud) {
    if (!clean) must(await sb().from("lesson_media").delete().eq("lesson_id", lessonId));
    else
      must(
        await sb()
          .from("lesson_media")
          .upsert({ lesson_id: lessonId, course_slug: courseSlug, url: clean, free, updated_at: now() })
      );
    changed();
    return;
  }
  const media = { ...lread().media };
  if (clean) media[lessonId] = { courseSlug, url: clean, free };
  else delete media[lessonId];
  lwrite({ media });
}

// ================================================================ students
export async function allStudents(): Promise<Student[]> {
  if (cloud) {
    const [p, e, st] = await Promise.all([
      sb().from("profiles").select("*").order("created_at", { ascending: false }),
      sb().from("enrollments").select("user_id,course_slug"),
      sb().from("student_state").select("user_id,data"),
    ]);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const enr = must(e) as any[];
    const states = new Map((must(st) as any[]).map((r) => [r.user_id, r.data]));
    return (must(p) as any[])
      .filter((r) => r.role !== "admin")
      .map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone ?? undefined,
        joined: r.created_at,
        enrollments: enr.filter((x) => x.user_id === r.id).map((x) => x.course_slug),
        completed: (states.get(r.id)?.completed as Record<string, string[]>) || {},
      }));
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
  // demo: the only student is whoever is signed in on this browser
  const s = getState();
  if (!s.user || s.user.role === "admin") return [];
  return [
    {
      id: s.user.email,
      name: s.user.name,
      email: s.user.email,
      phone: s.user.phone,
      joined: s.user.joined,
      enrollments: s.enrollments,
      completed: s.completed,
    },
  ];
}

// ============================================================ admin grant
export async function grantCourse(userId: string, courseSlug: string) {
  if (cloud) {
    must(await sb().from("enrollments").upsert({ user_id: userId, course_slug: courseSlug, source: "admin" }));
    changed();
    return;
  }
  const s = getState();
  hydrate({ ...s, enrollments: Array.from(new Set([...s.enrollments, courseSlug])) });
  changed();
}

export type { StoreState };
