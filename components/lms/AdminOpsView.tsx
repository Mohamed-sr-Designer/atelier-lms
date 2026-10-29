"use client";

// The instructor's operations desk: confirm payments, see students and their
// progress, review final projects (approval issues the certificate), answer
// lesson questions and attach a video to every lesson.

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { useOps } from "@/lib/ops-dict";
import { cloud } from "@/lib/cloud";
import { courses, fmtPrice, getCourse, lessonCount } from "@/lib/courses";
import {
  allCertificates,
  allOrders,
  allQuestions,
  allStudents,
  allSubmissions,
  answerQuestion,
  courseMedia,
  deleteQuestion,
  grantCourse,
  reviewSubmission,
  setLessonMedia,
  setOrderStatus,
  useDb,
  type Order,
  type Question,
  type Submission,
} from "@/lib/db";

type Tab = "orders" | "students" | "projects" | "questions" | "videos" | "certs";
const TABS: Tab[] = ["orders", "students", "projects", "questions", "videos", "certs"];

const card = "rounded-2xl border border-line/10 bg-ink-800 p-5";
const field =
  "w-full rounded-xl border border-line/15 bg-ink-900 px-4 py-2.5 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none";
const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const waLink = (phone?: string) => {
  const d = (phone || "").replace(/\D/g, "");
  if (!d) return "";
  return `https://wa.me/${d.startsWith("0") ? "2" + d : d}`;
};

export default function AdminOpsView() {
  const o = useOps();
  const { lang } = useLang();
  const params = useSearchParams();
  const router = useRouter();
  const tab = (TABS.includes(params.get("tab") as Tab) ? params.get("tab") : "orders") as Tab;

  const { data: orders } = useDb(allOrders);
  const { data: subs } = useDb(allSubmissions);
  const { data: qs } = useDb(allQuestions);

  const pendingOrders = (orders || []).filter((x) => x.status === "pending").length;
  const pendingSubs = (subs || []).filter((x) => x.status === "pending").length;
  const openQs = (qs || []).filter((x) => !x.answer).length;
  const revenue = (orders || []).filter((x) => x.status === "approved").reduce((n, x) => n + x.amount, 0);

  const badge: Partial<Record<Tab, number>> = {
    orders: pendingOrders,
    projects: pendingSubs,
    questions: openQs,
  };

  return (
    <section className="container-edge mx-auto max-w-edge pb-24 pt-28 md:pt-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin/" className="text-sm text-bone-400 hover:text-bone-50">
            ← Studio
          </Link>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tightest text-bone-50 md:text-5xl">
            {o.admin.opsTitle}
          </h1>
          <p className="mt-2 text-sm text-bone-400">{o.admin.opsSub}</p>
        </div>
        <p
          className={`rounded-full px-4 py-2 text-xs ${
            cloud ? "bg-mint/15 text-mint" : "border border-electric/30 bg-electric/5 text-bone-300"
          }`}
        >
          {cloud ? o.admin.liveNote : o.admin.demoNote}
        </p>
      </div>

      {/* numbers that matter, all real */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: o.admin.revenue, v: `EGP ${revenue.toLocaleString("en-US")}` },
          { l: o.admin.pendingOrders, v: String(pendingOrders), go: "orders" as Tab },
          { l: o.admin.pendingProjects, v: String(pendingSubs), go: "projects" as Tab },
          { l: o.admin.openQuestions, v: String(openQs), go: "questions" as Tab },
        ].map((s) => (
          <button
            key={s.l}
            type="button"
            onClick={() => s.go && router.replace(`/admin/ops/?tab=${s.go}`)}
            className={`${card} text-start transition-colors hover:border-mint/40`}
          >
            <p className="text-[11px] uppercase tracking-ultra text-bone-500">{s.l}</p>
            <p className="mt-2 font-display text-2xl font-semibold text-bone-50" dir="ltr">
              {s.v}
            </p>
          </button>
        ))}
      </div>

      {/* tabs */}
      <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto border-b border-line/10 pb-4">
        {TABS.map((x) => (
          <button
            key={x}
            type="button"
            onClick={() => router.replace(`/admin/ops/?tab=${x}`)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors ${
              tab === x ? "bg-mint text-white" : "text-bone-300 hover:text-bone-50"
            }`}
          >
            {o.admin.tabs[x]}
            {badge[x] ? (
              <span className="ms-2 rounded-full bg-ink-900/60 px-2 py-0.5 text-[11px]">{badge[x]}</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="pt-8">
        {tab === "orders" && <OrdersTab orders={orders || []} />}
        {tab === "students" && <StudentsTab />}
        {tab === "projects" && <ProjectsTab subs={subs || []} />}
        {tab === "questions" && <QuestionsTab qs={qs || []} />}
        {tab === "videos" && <VideosTab />}
        {tab === "certs" && <CertsTab />}
      </div>
    </section>
  );
}

function Empty() {
  const o = useOps();
  return <p className="text-sm text-bone-500">{o.admin.empty}</p>;
}

function PendingToggle({ all, setAll }: { all: boolean; setAll: (v: boolean) => void }) {
  const o = useOps();
  return (
    <div className="mb-5 flex gap-2 text-xs">
      {[false, true].map((v) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => setAll(v)}
          className={`rounded-full border px-4 py-1.5 ${
            all === v ? "border-mint/60 text-mint" : "border-line/15 text-bone-400"
          }`}
        >
          {v ? o.admin.filterAll : o.admin.filterPending}
        </button>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ orders
function OrdersTab({ orders }: { orders: Order[] }) {
  const o = useOps();
  const { lang } = useLang();
  const [all, setAll] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const list = all ? orders : orders.filter((x) => x.status === "pending");

  const act = async (x: Order, status: "approved" | "rejected") => {
    setBusy(x.id);
    try {
      await setOrderStatus(x, status, notes[x.id]);
    } catch (e) {
      alert(String((e as Error).message || e));
    }
    setBusy("");
  };

  return (
    <div>
      <PendingToggle all={all} setAll={setAll} />
      {list.length === 0 ? (
        <Empty />
      ) : (
        <ul className="grid gap-4">
          {list.map((x) => (
            <li key={x.id} className={card}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-bone-50">{x.title}</p>
                  <p className="mt-1 text-sm text-bone-300" dir="auto">
                    {x.userName} · <span dir="ltr">{x.userEmail}</span>
                    {x.userPhone ? (
                      <>
                        {" "}
                        · <span dir="ltr">{x.userPhone}</span>
                      </>
                    ) : null}
                  </p>
                  <p className="mt-2 text-xs text-bone-500">
                    {when(x.createdAt)} · {x.method}
                    {x.promo ? ` · promo ${x.promo}` : ""}
                  </p>
                  <p className="mt-2 rounded-lg bg-ink-900 px-3 py-2 font-mono text-sm text-bone-100" dir="ltr">
                    {x.reference || "(no reference)"}
                  </p>
                </div>
                <div className="text-end">
                  <p className="font-display text-2xl font-semibold text-bone-50" dir="ltr">
                    {fmtPrice(x.amount, lang)}
                  </p>
                  <StatusPill status={x.status} />
                </div>
              </div>
              {x.status === "pending" ? (
                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
                  <input
                    value={notes[x.id] || ""}
                    onChange={(e) => setNotes({ ...notes, [x.id]: e.target.value })}
                    placeholder={o.admin.notePh}
                    className={`${field} grow`}
                  />
                  <div className="flex shrink-0 gap-2">
                    {waLink(x.userPhone) && (
                      <a href={waLink(x.userPhone)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-4 py-2.5 text-sm">
                        {o.admin.whatsapp}
                      </a>
                    )}
                    <button
                      type="button"
                      disabled={busy === x.id}
                      onClick={() => act(x, "rejected")}
                      className="btn btn-ghost px-4 py-2.5 text-sm disabled:opacity-50"
                    >
                      {o.admin.reject}
                    </button>
                    <button
                      type="button"
                      disabled={busy === x.id}
                      onClick={() => act(x, "approved")}
                      className="btn btn-primary px-5 py-2.5 text-sm disabled:opacity-50"
                    >
                      {o.admin.approve}
                    </button>
                  </div>
                </div>
              ) : x.adminNote ? (
                <p className="mt-3 text-xs text-bone-400">{x.adminNote}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const o = useOps();
  const map: Record<string, [string, string]> = {
    pending: [o.orders.pending, "bg-ink-700 text-bone-300"],
    approved: [o.orders.approved, "bg-mint/15 text-mint"],
    rejected: [o.orders.rejected, "bg-red-500/10 text-red-300"],
    changes: [o.project.changes, "bg-electric/15 text-electric"],
  };
  const [label, cls] = map[status] || [status, "bg-ink-700 text-bone-300"];
  return <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs ${cls}`}>{label}</span>;
}

// ---------------------------------------------------------------- students
function StudentsTab() {
  const o = useOps();
  const { lang } = useLang();
  const { data } = useDb(allStudents);
  const [q, setQ] = useState("");
  const [pick, setPick] = useState<Record<string, string>>({});
  const list = (data || []).filter((s) =>
    `${s.name} ${s.email} ${s.phone || ""}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={o.admin.search} className={`${field} max-w-sm`} />
        <p className="text-sm text-bone-400">
          {o.admin.students}: <span className="text-bone-50">{data?.length ?? 0}</span>
        </p>
      </div>
      {list.length === 0 ? (
        <Empty />
      ) : (
        <ul className="grid gap-3">
          {list.map((s) => (
            <li key={s.id} className={card}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-bone-50" dir="auto">
                    {s.name}
                  </p>
                  <p className="mt-1 text-xs text-bone-400" dir="ltr">
                    {s.email}
                    {s.phone ? ` · ${s.phone}` : ""}
                  </p>
                  <p className="mt-1 text-[11px] text-bone-500">{when(s.joined)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {waLink(s.phone) && (
                    <a href={waLink(s.phone)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-4 py-2 text-xs">
                      {o.admin.whatsapp}
                    </a>
                  )}
                  <select
                    value={pick[s.id] || ""}
                    onChange={(e) => setPick({ ...pick, [s.id]: e.target.value })}
                    className="rounded-xl border border-line/15 bg-ink-900 px-3 py-2 text-xs text-bone-100"
                  >
                    <option value="">{o.admin.grantPick}</option>
                    {courses
                      .filter((c) => !s.enrollments.includes(c.slug))
                      .map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.short[lang]}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    disabled={!pick[s.id]}
                    onClick={() => grantCourse(s.id, pick[s.id]).then(() => setPick({ ...pick, [s.id]: "" }))}
                    className="btn btn-primary px-4 py-2 text-xs disabled:opacity-40"
                  >
                    {o.admin.grant}
                  </button>
                </div>
              </div>
              {s.enrollments.length > 0 && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {s.enrollments.map((slug) => {
                    const c = getCourse(slug);
                    if (!c) return null;
                    const pct = Math.round(((s.completed[slug]?.length || 0) / Math.max(1, lessonCount(c))) * 100);
                    return (
                      <div key={slug} className="rounded-xl bg-ink-900 px-3 py-2.5">
                        <p className="flex justify-between text-xs text-bone-200">
                          <span>{c.short[lang]}</span>
                          <span dir="ltr">{pct}%</span>
                        </p>
                        <div className="mt-1.5 h-1 rounded-full bg-ink-700">
                          <div className="h-full rounded-full bg-mint" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- projects
function ProjectsTab({ subs }: { subs: Submission[] }) {
  const o = useOps();
  const { lang } = useLang();
  const [all, setAll] = useState(false);
  const [fb, setFb] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const list = all ? subs : subs.filter((x) => x.status === "pending");

  const act = async (x: Submission, status: "approved" | "changes") => {
    setBusy(x.id);
    try {
      await reviewSubmission(x, status, fb[x.id] || "");
    } catch (e) {
      alert(String((e as Error).message || e));
    }
    setBusy("");
  };

  return (
    <div>
      <PendingToggle all={all} setAll={setAll} />
      {list.length === 0 ? (
        <Empty />
      ) : (
        <ul className="grid gap-4">
          {list.map((x) => (
            <li key={x.id} className={card}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-bone-50" dir="auto">
                    {x.userName}
                  </p>
                  <p className="mt-1 text-sm text-bone-300">{getCourse(x.courseSlug)?.short[lang] || x.courseSlug}</p>
                  <p className="mt-1 text-xs text-bone-500">{when(x.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={x.status} />
                  <a href={x.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-4 py-2 text-xs">
                    {o.admin.openLink}
                  </a>
                </div>
              </div>
              {x.note && (
                <p className="mt-3 whitespace-pre-wrap rounded-lg bg-ink-900 p-3 text-sm text-bone-200" dir="auto">
                  {x.note}
                </p>
              )}
              {x.status === "pending" ? (
                <div className="mt-4">
                  <textarea
                    value={fb[x.id] || ""}
                    onChange={(e) => setFb({ ...fb, [x.id]: e.target.value })}
                    rows={3}
                    placeholder={o.admin.feedbackPh}
                    className={`${field} resize-y`}
                  />
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      disabled={busy === x.id}
                      onClick={() => act(x, "changes")}
                      className="btn btn-ghost px-5 py-2.5 text-sm disabled:opacity-50"
                    >
                      {o.admin.requestChanges}
                    </button>
                    <button
                      type="button"
                      disabled={busy === x.id}
                      onClick={() => act(x, "approved")}
                      className="btn btn-primary px-5 py-2.5 text-sm disabled:opacity-50"
                    >
                      {o.admin.approveProject}
                    </button>
                  </div>
                </div>
              ) : x.feedback ? (
                <p className="mt-3 border-s-2 border-mint ps-3 text-sm text-bone-300" dir="auto">
                  {x.feedback}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --------------------------------------------------------------- questions
function QuestionsTab({ qs }: { qs: Question[] }) {
  const o = useOps();
  const { lang } = useLang();
  const [all, setAll] = useState(false);
  const [ans, setAns] = useState<Record<string, string>>({});
  const list = all ? qs : qs.filter((x) => !x.answer);
  const lessonTitle = (slug: string, id: string) =>
    getCourse(slug)?.modules.flatMap((m) => m.lessons).find((l) => l.id === id)?.t || id;

  return (
    <div>
      <PendingToggle all={all} setAll={setAll} />
      {list.length === 0 ? (
        <Empty />
      ) : (
        <ul className="grid gap-4">
          {list.map((x) => (
            <li key={x.id} className={card}>
              <p className="text-xs text-bone-500">
                {getCourse(x.courseSlug)?.short[lang]} · {o.admin.lesson}: {lessonTitle(x.courseSlug, x.lessonId)} ·{" "}
                {when(x.createdAt)}
              </p>
              <p className="mt-2 text-sm font-medium text-bone-300" dir="auto">
                {x.userName}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-bone-50" dir="auto">
                {x.body}
              </p>
              {x.answer ? (
                <p className="mt-3 border-s-2 border-mint ps-3 text-sm text-bone-300" dir="auto">
                  {x.answer}
                </p>
              ) : (
                <div className="mt-4 flex flex-col gap-3 md:flex-row">
                  <textarea
                    value={ans[x.id] || ""}
                    onChange={(e) => setAns({ ...ans, [x.id]: e.target.value })}
                    rows={2}
                    placeholder={o.admin.answerPh}
                    className={`${field} grow resize-y`}
                  />
                  <div className="flex shrink-0 gap-2 md:flex-col">
                    <button
                      type="button"
                      disabled={!ans[x.id]?.trim()}
                      onClick={() => answerQuestion(x.id, ans[x.id].trim())}
                      className="btn btn-primary px-5 py-2.5 text-sm disabled:opacity-40"
                    >
                      {o.admin.answer}
                    </button>
                    <button type="button" onClick={() => deleteQuestion(x.id)} className="btn btn-ghost px-5 py-2.5 text-sm">
                      {o.admin.delete}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ videos
function VideosTab() {
  const o = useOps();
  const { lang } = useLang();
  const [slug, setSlug] = useState(courses[0].slug);
  const course = getCourse(slug)!;
  const { data: media } = useDb(() => courseMedia(slug), [slug]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState("");
  const filled = useMemo(() => Object.keys(media || {}).length, [media]);

  const save = async (lessonId: string, free: boolean) => {
    const v = draft[lessonId] ?? media?.[lessonId] ?? "";
    try {
      await setLessonMedia(slug, lessonId, v, free);
      setSaved(lessonId);
      setTimeout(() => setSaved(""), 1600);
    } catch (e) {
      alert(String((e as Error).message || e));
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setDraft({});
          }}
          className="rounded-xl border border-line/15 bg-ink-900 px-4 py-2.5 text-sm text-bone-100"
        >
          {courses.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.short[lang]}
            </option>
          ))}
        </select>
        <p className="text-sm text-bone-400" dir="ltr">
          {filled} / {lessonCount(course)}
        </p>
      </div>
      <p className="mb-6 text-xs text-bone-500">{o.admin.videoHint}</p>
      <div className="grid gap-6">
        {course.modules.map((m) => (
          <div key={m.n} className={card}>
            <p className="text-sm font-semibold text-bone-50">
              {m.n} · {m.t}
            </p>
            <ul className="mt-4 grid gap-3">
              {m.lessons.map((l) => (
                <li key={l.id} className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] md:items-center">
                  <p className="text-xs text-bone-300">
                    {l.t}
                    {l.free ? <span className="ms-2 rounded bg-electric/15 px-1.5 text-[10px] text-electric">free</span> : null}
                  </p>
                  <input
                    dir="ltr"
                    value={draft[l.id] ?? media?.[l.id] ?? ""}
                    onChange={(e) => setDraft({ ...draft, [l.id]: e.target.value })}
                    placeholder={o.admin.videoPh}
                    className={field}
                  />
                  <button
                    type="button"
                    onClick={() => save(l.id, Boolean(l.free) || course.price === 0)}
                    className="btn btn-ghost px-4 py-2 text-xs"
                  >
                    {saved === l.id ? o.admin.videoSaved : o.admin.videoSave}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------ certificates
function CertsTab() {
  const { data } = useDb(allCertificates);
  if (!data?.length) return <Empty />;
  return (
    <ul className="grid gap-3">
      {data.map((c) => (
        <li key={c.id} className={`${card} flex flex-wrap items-center justify-between gap-3`}>
          <div>
            <p className="font-semibold text-bone-50" dir="auto">
              {c.name}
            </p>
            <p className="mt-1 text-xs text-bone-400">
              {c.courseTitle} · {when(c.issuedAt)}
            </p>
          </div>
          <Link href={`/certificate/?id=${c.id}`} className="font-mono text-sm text-mint hover:underline" dir="ltr">
            {c.id} ↗
          </Link>
        </li>
      ))}
    </ul>
  );
}

