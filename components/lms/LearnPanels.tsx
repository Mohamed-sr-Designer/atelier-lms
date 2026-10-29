"use client";

// The interactive pieces of a lesson page: timestamped notes, the lesson's
// question thread, and final-project submission with its review status.

import { useState } from "react";
import Link from "next/link";
import { useOps } from "@/lib/ops-dict";
import { addNote, removeNote, useStore } from "@/lib/store";
import {
  askQuestion,
  lessonQuestions,
  myCertificates,
  mySubmissions,
  submitProject,
  useDb,
} from "@/lib/db";
import { openAuth } from "@/components/lms/AuthModal";
import { clock } from "@/components/lms/LessonPlayer";

const field =
  "w-full rounded-xl border border-line/15 bg-ink-900 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none";

const when = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });

// ------------------------------------------------------------------ notes
export function LessonNotes({
  slug,
  lessonId,
  lessonTitle,
  now,
  onSeek,
  titleOf,
}: {
  slug: string;
  lessonId: string;
  lessonTitle: string;
  now: number | null; // current playhead, when the player reports one
  onSeek: (lessonId: string, sec: number) => void;
  titleOf: (lessonId: string) => string;
}) {
  const o = useOps();
  const store = useStore();
  const [text, setText] = useState("");
  const notes = [...(store.notes[slug] || [])].reverse();

  const save = () => {
    const v = text.trim();
    if (!v) return;
    addNote(slug, lessonId, v, now);
    setText("");
  };

  return (
    <div>
      <div className="rounded-2xl border border-line/10 bg-ink-800 p-5">
        <p className="text-xs text-bone-500">
          {lessonTitle}
          {now != null && (
            <span className="ms-2 rounded bg-mint/15 px-1.5 py-0.5 font-mono text-mint" dir="ltr">
              {clock(now)}
            </span>
          )}
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.ctrlKey || e.metaKey) && save()}
          rows={3}
          placeholder={o.learn.notePh}
          className={`${field} mt-3 resize-y`}
        />
        <button type="button" onClick={save} className="btn btn-primary mt-3 px-6 py-2.5 text-sm">
          {o.learn.noteAdd}
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="mt-6 text-sm text-bone-500">{o.learn.notesEmpty}</p>
      ) : (
        <ul className="mt-6 divide-y divide-line/10 border-y border-line/10">
          {notes.map((n) => (
            <li key={n.id} className="flex gap-4 py-4">
              <button
                type="button"
                onClick={() => n.sec != null && onSeek(n.lesson, n.sec)}
                className="shrink-0 text-start"
                disabled={n.sec == null}
              >
                <span
                  className={`block rounded-md px-2 py-1 font-mono text-xs ${
                    n.sec != null ? "bg-mint/15 text-mint hover:bg-mint/25" : "bg-ink-700 text-bone-500"
                  }`}
                  dir="ltr"
                >
                  {n.sec != null ? clock(n.sec) : o.learn.noteNoTime}
                </span>
              </button>
              <div className="min-w-0 grow">
                <p className="text-[11px] text-bone-500">{titleOf(n.lesson)}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-bone-100">{n.text}</p>
              </div>
              <button
                type="button"
                onClick={() => removeNote(slug, n.id)}
                aria-label="Delete note"
                className="shrink-0 self-start text-bone-500 hover:text-mint"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --------------------------------------------------------------- lesson Q&A
export function LessonQA({ slug, lessonId }: { slug: string; lessonId: string }) {
  const o = useOps();
  const store = useStore();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const { data } = useDb(() => lessonQuestions(slug, lessonId), [slug, lessonId, store.user?.email]);
  const list = data || [];

  const send = async () => {
    const v = body.trim();
    if (!v) return;
    if (!store.user) return openAuth("login");
    setBusy(true);
    try {
      await askQuestion(slug, lessonId, v);
      setBody("");
      setErr("");
    } catch (x) {
      setErr(String((x as Error).message || x));
    }
    setBusy(false);
  };

  return (
    <section className="mt-10">
      <h3 className="text-lg font-semibold tracking-tight text-bone-50">
        {o.learn.qaTitle}
        <span className="ms-2 text-sm font-normal text-bone-500">{list.length || ""}</span>
      </h3>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={2}
          placeholder={store.user ? o.learn.qaPh : o.learn.qaLogin}
          className={`${field} grow resize-y`}
        />
        <button
          type="button"
          onClick={send}
          disabled={busy}
          className="btn btn-primary shrink-0 px-7 py-3 text-sm disabled:opacity-60 sm:self-start"
        >
          {o.learn.qaSend}
        </button>
      </div>
      {err && <p className="mt-2 text-sm text-mint">{err}</p>}

      {list.length === 0 ? (
        <p className="mt-5 text-sm text-bone-500">{o.learn.qaEmpty}</p>
      ) : (
        <ul className="mt-6 grid gap-4">
          {list.map((q) => (
            <li key={q.id} className="rounded-2xl border border-line/10 bg-ink-800 p-5">
              <p className="flex items-center justify-between gap-3 text-xs text-bone-500">
                <span className="font-medium text-bone-300" dir="auto">
                  {q.userName}
                </span>
                <span>{when(q.createdAt)}</span>
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-bone-100" dir="auto">
                {q.body}
              </p>
              {q.answer ? (
                <div className="mt-4 border-s-2 border-mint ps-4">
                  <p className="text-[11px] uppercase tracking-ultra text-mint">{o.learn.qaAnswer}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-bone-50" dir="auto">
                    {q.answer}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-xs text-bone-500">⏳ {o.learn.qaPending}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// --------------------------------------------------------- final project
export function ProjectSubmit({ slug, enrolled }: { slug: string; enrolled: boolean }) {
  const o = useOps();
  const store = useStore();
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [again, setAgain] = useState(false);
  const { data: subs } = useDb(() => mySubmissions(slug), [slug, store.user?.email]);
  const { data: certs } = useDb(myCertificates, [store.user?.email]);
  const latest = subs?.[0];
  const cert = certs?.find((c) => c.courseSlug === slug);

  if (!enrolled) return <p className="mt-6 text-sm text-bone-400">{o.project.needEnroll}</p>;

  const send = async () => {
    if (!/^https?:\/\/\S+\.\S+/.test(link.trim())) return setErr(o.project.errLink);
    setBusy(true);
    try {
      await submitProject(slug, link.trim(), note.trim());
      setLink("");
      setNote("");
      setErr("");
      setAgain(false);
    } catch (x) {
      setErr(String((x as Error).message || x));
    }
    setBusy(false);
  };

  const statusText = latest
    ? { pending: o.project.pending, approved: o.project.approved, changes: o.project.changes }[latest.status]
    : "";
  const showForm = !latest || again || latest.status === "changes";

  return (
    <div className="mt-8">
      {cert && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-electric/40 bg-electric/5 p-5">
          <p className="font-serif text-lg italic text-bone-50">{o.project.certReady} ✦</p>
          <Link href={`/certificate/?id=${cert.id}`} className="btn btn-primary px-6 py-3 text-sm">
            {o.project.viewCert}
          </Link>
        </div>
      )}

      {latest && (
        <div className="rounded-2xl border border-line/10 bg-ink-800 p-5">
          <p className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-ultra text-bone-500">{o.project.status}</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                latest.status === "approved"
                  ? "bg-mint/15 text-mint"
                  : latest.status === "changes"
                    ? "bg-electric/15 text-electric"
                    : "bg-ink-700 text-bone-300"
              }`}
            >
              {statusText}
            </span>
          </p>
          <a
            href={latest.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block truncate text-sm text-bone-200 underline-offset-4 hover:underline"
            dir="ltr"
          >
            {latest.link}
          </a>
          {latest.feedback && (
            <div className="mt-4 border-s-2 border-mint ps-4">
              <p className="text-[11px] uppercase tracking-ultra text-mint">{o.project.feedback}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-bone-50" dir="auto">
                {latest.feedback}
              </p>
            </div>
          )}
          {latest.status === "approved" && !again && (
            <button
              type="button"
              onClick={() => setAgain(true)}
              className="link-underline mt-4 text-xs text-bone-400"
            >
              {o.project.resubmit}
            </button>
          )}
        </div>
      )}

      {showForm && latest?.status !== "pending" && (
        <div className="mt-6 grid gap-4">
          <p className="text-sm font-semibold text-bone-50">
            {latest ? o.project.resubmit : o.project.submitTitle}
          </p>
          <label className="block">
            <span className="text-xs uppercase tracking-ultra text-bone-500">{o.project.linkLabel}</span>
            <input
              type="url"
              dir="ltr"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder={o.project.linkPh}
              className={`${field} mt-1.5`}
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-ultra text-bone-500">{o.project.noteLabel}</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={o.project.notePh}
              className={`${field} mt-1.5 resize-y`}
            />
          </label>
          {err && <p className="text-sm text-mint">{err}</p>}
          <button
            type="button"
            onClick={send}
            disabled={busy}
            className="btn btn-primary w-full py-3.5 disabled:opacity-60 sm:w-auto sm:px-9"
          >
            {o.project.send}
          </button>
        </div>
      )}
    </div>
  );
}
