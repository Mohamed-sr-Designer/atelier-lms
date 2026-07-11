"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import GlyphPlate from "@/components/lms/GlyphPlate";
import AdminGuard from "@/components/lms/AdminGuard";
import { useLang } from "@/lib/i18n";
import {
  useStudio,
  setCourseOverride,
  addStudioLesson,
  resetStudio,
  mergeCourse,
  addDraft,
  updateDraft,
  addDraftModule,
  addDraftLesson,
  removeDraftLesson,
  removeDraft,
  draftToCourse,
  type CourseOverride,
  type DraftCourse,
} from "@/lib/studio";
import { courses, fmtPrice, type Course } from "@/lib/courses";

const ease = [0.16, 1, 0.3, 1] as const;

export default function AdminCoursesView() {
  return (
    <AdminGuard>
      <Editor />
    </AdminGuard>
  );
}

function Editor() {
  const { t } = useLang();
  const studio = useStudio();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const drafts = studio.drafts || [];

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const slug = addDraft(newName);
    setNewName("");
    setOpenSlug(slug);
  };

  return (
    <section className="container-edge mx-auto max-w-edge pb-28 pt-32 md:pt-40">
      <Reveal>
        <SectionLabel index="⌘">{t.admin.editorKicker}</SectionLabel>
      </Reveal>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <Reveal delay={0.05}>
          <h1 className="max-w-2xl text-balance font-display text-4xl font-semibold leading-[0.98] tracking-tightest text-bone-50 md:text-6xl">
            {t.admin.editorTitle}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex items-center gap-3">
            <Link href="/admin/" className="btn btn-ghost px-5 py-2.5 text-sm">
              {t.admin.backToStudio}
            </Link>
            <button
              type="button"
              onClick={resetStudio}
              className="rounded-full border border-red-500/30 px-5 py-2.5 text-sm text-red-400/90 transition-colors hover:border-red-500/60"
            >
              {t.admin.resetAll}
            </button>
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.12}>
        <p className="mt-4 max-w-xl text-sm text-bone-400">{t.admin.editorSub}</p>
      </Reveal>

      {/* create a new course */}
      <Reveal delay={0.16}>
        <form
          onSubmit={create}
          className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-mint/25 bg-mint/[0.05] p-5"
        >
          <span className="text-xs uppercase tracking-ultra text-mint">
            ＋ {t.admin.newCourseLabel}
          </span>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t.admin.newCoursePh}
            className="min-w-[16rem] flex-1 rounded-lg border border-line/15 bg-ink-900/70 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none"
          />
          <button type="submit" className="btn btn-primary px-6 py-3 text-sm">
            {t.admin.createBtn}
          </button>
        </form>
      </Reveal>

      {/* draft (new) courses first */}
      {drafts.length > 0 && (
        <div className="mt-6 space-y-4">
          {drafts.map((d) => (
            <DraftRow
              key={d.slug}
              draft={d}
              open={openSlug === d.slug}
              onToggle={() => setOpenSlug((s) => (s === d.slug ? null : d.slug))}
            />
          ))}
        </div>
      )}

      <div className="mt-4 space-y-4">
        {courses.map((c) => (
          <CourseRow
            key={c.slug}
            base={c}
            ov={studio.courses[c.slug]}
            open={openSlug === c.slug}
            onToggle={() =>
              setOpenSlug((s) => (s === c.slug ? null : c.slug))
            }
          />
        ))}
      </div>

      <Reveal>
        <p className="mt-10 text-center text-[11px] leading-relaxed text-bone-500">
          {t.admin.createdNote} {t.admin.localNote}
        </p>
      </Reveal>
    </section>
  );
}

// Editor for a brand-new (draft) course: identity fields + modules & video
// lessons, mirroring the static-course editor but writing to the draft store.
function DraftRow({
  draft,
  open,
  onToggle,
}: {
  draft: DraftCourse;
  open: boolean;
  onToggle: () => void;
}) {
  const { t, lang } = useLang();
  const live = draftToCourse(draft);

  const [title, setTitle] = useState(draft.title);
  const [short, setShort] = useState(draft.short);
  const [tagline, setTagline] = useState(draft.tagline);
  const [price, setPrice] = useState(String(draft.price));
  const [compareAt, setCompareAt] = useState(draft.compareAt ? String(draft.compareAt) : "");
  const [cover, setCover] = useState(draft.cover);
  const [moduleName, setModuleName] = useState("");
  // per-module lesson draft inputs
  const [lTitle, setLTitle] = useState("");
  const [lMins, setLMins] = useState("8");
  const [lUrl, setLUrl] = useState("");
  const [lModIdx, setLModIdx] = useState(0);
  const [saved, setSaved] = useState(false);

  const input =
    "mt-2 w-full rounded-lg border border-line/15 bg-ink-900/70 px-3.5 py-3 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none";
  const label = "text-[11px] uppercase tracking-ultra text-bone-500";

  const save = () => {
    const p = parseInt(price, 10);
    const ca = compareAt.trim() === "" ? undefined : parseInt(compareAt, 10);
    updateDraft(draft.slug, {
      title: title.trim() || draft.title,
      short: short.trim() || title.trim(),
      tagline: tagline.trim(),
      price: Number.isNaN(p) ? 0 : Math.max(0, p),
      compareAt: ca && !Number.isNaN(ca) ? ca : undefined,
      cover: cover.trim() || draft.cover,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const addModule = () => {
    const name = moduleName.trim() || `Module ${String(draft.modules.length + 1).padStart(2, "0")}`;
    addDraftModule(draft.slug, name);
    setModuleName("");
  };

  const addLesson = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(lMins, 10);
    if (!lTitle.trim() || Number.isNaN(mins) || mins <= 0) return;
    addDraftLesson(draft.slug, lModIdx, {
      t: lTitle.trim(),
      dur: mins,
      video: lUrl.trim() || undefined,
    });
    setLTitle("");
    setLUrl("");
  };

  const lessonCount = draft.modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
        open ? "border-mint/40 bg-ink-800/70" : "border-mint/20 bg-mint/[0.03] hover:border-mint/35"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-5 p-4 text-left md:p-5"
      >
        <div className="w-20 shrink-0" style={{ containerType: "inline-size" }}>
          <GlyphPlate course={live} className="aspect-[4/3]" />
        </div>
        <div className="min-w-0 grow">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="truncate text-base font-semibold tracking-tight text-bone-50 md:text-lg">
              {live.short[lang]}
            </p>
            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]">
              {t.admin.draftBadge} ✦
            </span>
            <span className="text-[11px] text-bone-500">
              {draft.modules.length} {t.common.modules} · {lessonCount} {t.common.lessons}
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-bone-500">{live.tagline[lang]}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold ${
            live.price === 0
              ? "text-white [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]"
              : "bg-ink-900 text-bone-50 ring-1 ring-mint/40"
          }`}
        >
          {fmtPrice(live.price, lang)}
        </span>
        <span className={`shrink-0 text-bone-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            <div className="border-t border-line/10 p-5 md:p-7">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className={label}>{t.admin.fTitle}</span>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={input} />
                </label>
                <label className="block">
                  <span className={label}>{t.admin.fShort}</span>
                  <input type="text" value={short} onChange={(e) => setShort(e.target.value)} className={input} />
                </label>
                <label className="block">
                  <span className={label}>{t.admin.fCover}</span>
                  <input type="text" value={cover} onChange={(e) => setCover(e.target.value)} className={input} />
                </label>
                <label className="block md:col-span-2">
                  <span className={label}>{t.admin.fTagline}</span>
                  <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className={input} />
                </label>
                <label className="block">
                  <span className={label}>{t.admin.fPrice}</span>
                  <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={input} dir="ltr" />
                </label>
                <label className="block">
                  <span className={label}>{t.admin.fCompare}</span>
                  <input type="number" min="0" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} placeholder="—" className={input} dir="ltr" />
                </label>
              </div>

              {/* modules & lessons */}
              <div className="mt-7 rounded-xl border border-line/15 bg-ink-900/40 p-4 md:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className={label}>{t.admin.moduleLabel}</p>
                  <span className="inline-flex items-center gap-2">
                    <input
                      type="text"
                      value={moduleName}
                      onChange={(e) => setModuleName(e.target.value)}
                      placeholder={t.admin.fModule}
                      className="w-44 rounded-lg border border-line/15 bg-ink-900/70 px-3 py-2 text-xs text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addModule}
                      className="rounded-full border border-mint/40 bg-mint/10 px-3 py-2 text-xs text-mint hover:bg-mint/20"
                    >
                      {t.admin.addModuleBtn}
                    </button>
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  {draft.modules.map((m, mi) => (
                    <div key={mi} className="rounded-lg border border-line/10 bg-ink-900/60 p-4">
                      <p className="text-sm font-semibold text-bone-50">
                        <span className="font-serif italic text-mint">{String(mi + 1).padStart(2, "0")}</span>{" "}
                        {m.t}
                      </p>
                      {m.lessons.length ? (
                        <ul className="mt-3 space-y-1.5">
                          {m.lessons.map((l, li) => (
                            <li key={li} className="flex items-center gap-3 text-xs text-bone-300">
                              <span className="text-mint">{l.video ? "▶" : "✦"}</span>
                              <span className="grow truncate">{l.t}</span>
                              <span className="shrink-0 text-bone-500" dir="ltr">{l.dur}m</span>
                              <button
                                type="button"
                                onClick={() => removeDraftLesson(draft.slug, mi, li)}
                                aria-label="Remove lesson"
                                className="shrink-0 text-bone-500 transition-colors hover:text-red-400"
                              >
                                ✕
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-xs italic text-bone-500">{t.admin.noLessons}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* add a video lesson to a chosen module */}
                <form onSubmit={addLesson} className="mt-4 grid gap-3 md:grid-cols-[auto_1fr_5rem_1fr_auto]">
                  <select
                    value={lModIdx}
                    onChange={(e) => setLModIdx(Number(e.target.value))}
                    className="rounded-lg border border-line/15 bg-ink-900/70 px-3 py-3 text-xs text-bone-50 focus:border-mint/60 focus:outline-none"
                  >
                    {draft.modules.map((m, mi) => (
                      <option key={mi} value={mi}>
                        {String(mi + 1).padStart(2, "0")} · {m.t}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={lTitle}
                    onChange={(e) => setLTitle(e.target.value)}
                    placeholder={t.admin.fLessonTitle}
                    className="rounded-lg border border-line/15 bg-ink-900/70 px-3.5 py-3 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none"
                  />
                  <input
                    type="number"
                    min="1"
                    value={lMins}
                    onChange={(e) => setLMins(e.target.value)}
                    placeholder={t.admin.fLessonMins}
                    className="rounded-lg border border-line/15 bg-ink-900/70 px-3 py-3 text-sm text-bone-50 focus:border-mint/60 focus:outline-none"
                    dir="ltr"
                  />
                  <input
                    type="url"
                    value={lUrl}
                    onChange={(e) => setLUrl(e.target.value)}
                    placeholder={t.admin.fLessonUrl}
                    className="rounded-lg border border-line/15 bg-ink-900/70 px-3.5 py-3 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none"
                    dir="ltr"
                  />
                  <button
                    type="submit"
                    className="btn border border-mint/40 bg-mint/10 px-5 text-sm text-mint hover:bg-mint/20"
                  >
                    {t.admin.addLessonBtn}
                  </button>
                </form>
              </div>

              {/* actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button type="button" onClick={save} className="btn btn-primary px-7 py-3 text-sm">
                  {saved ? t.admin.saved : t.admin.save}
                </button>
                <Link href={`/preview/?slug=${draft.slug}`} className="btn btn-ghost px-6 py-3 text-sm">
                  {t.admin.previewCourse}
                </Link>
                <button
                  type="button"
                  onClick={() => removeDraft(draft.slug)}
                  className="ml-auto rounded-full border border-red-500/30 px-5 py-2.5 text-xs text-red-400/90 transition-colors hover:border-red-500/60"
                >
                  {t.admin.deleteDraft}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CourseRow({
  base,
  ov,
  open,
  onToggle,
}: {
  base: Course;
  ov?: CourseOverride;
  open: boolean;
  onToggle: () => void;
}) {
  const { t, lang } = useLang();
  const live = mergeCourse(base, ov);
  const edited = Boolean(ov && Object.keys(ov).length);

  // form state seeded from the live (merged) values
  const [title, setTitle] = useState(live.title.en);
  const [short, setShort] = useState(live.short.en);
  const [tagline, setTagline] = useState(live.tagline.en);
  const [price, setPrice] = useState(String(live.price));
  const [compareAt, setCompareAt] = useState(live.compareAt ? String(live.compareAt) : "");
  const [cover, setCover] = useState(live.cover);
  const [lTitle, setLTitle] = useState("");
  const [lMins, setLMins] = useState("8");
  const [lUrl, setLUrl] = useState("");
  const [saved, setSaved] = useState(false);

  const input =
    "mt-2 w-full rounded-lg border border-line/15 bg-ink-900/70 px-3.5 py-3 text-sm text-bone-50 placeholder:text-bone-500/60 focus:border-mint/60 focus:outline-none";
  const label = "text-[11px] uppercase tracking-ultra text-bone-500";

  const save = () => {
    const patch: CourseOverride = {};
    if (title.trim() && title.trim() !== base.title.en) patch.title = title.trim();
    if (short.trim() && short.trim() !== base.short.en) patch.short = short.trim();
    if (tagline.trim() && tagline.trim() !== base.tagline.en)
      patch.tagline = tagline.trim();
    const p = parseInt(price, 10);
    if (!Number.isNaN(p) && p >= 0 && p !== base.price) patch.price = p;
    const ca = compareAt.trim() === "" ? null : parseInt(compareAt, 10);
    if (ca === null) {
      if (base.compareAt) patch.compareAt = null;
    } else if (!Number.isNaN(ca) && ca !== base.compareAt) {
      patch.compareAt = ca;
    }
    if (cover.trim() && cover.trim() !== base.cover) patch.cover = cover.trim();
    setCourseOverride(base.slug, {
      ...(ov?.extraLessons ? { extraLessons: ov.extraLessons } : {}),
      ...patch,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const addLesson = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(lMins, 10);
    if (!lTitle.trim() || Number.isNaN(mins) || mins <= 0) return;
    addStudioLesson(base.slug, {
      t: lTitle.trim(),
      dur: mins,
      video: lUrl.trim() || undefined,
    });
    setLTitle("");
    setLUrl("");
  };

  const reset = () => {
    setCourseOverride(base.slug, null);
    setTitle(base.title.en);
    setShort(base.short.en);
    setTagline(base.tagline.en);
    setPrice(String(base.price));
    setCompareAt(base.compareAt ? String(base.compareAt) : "");
    setCover(base.cover);
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
        open ? "border-mint/30 bg-ink-800/70" : "border-line/10 bg-ink-800/50 hover:border-line/25"
      }`}
    >
      {/* row header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-5 p-4 text-left md:p-5"
      >
        <div className="w-20 shrink-0" style={{ containerType: "inline-size" }}>
          <GlyphPlate course={live} className="aspect-[4/3]" />
        </div>
        <div className="min-w-0 grow">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="truncate text-base font-semibold tracking-tight text-bone-50 md:text-lg">
              {live.short[lang]}
            </p>
            {edited && (
              <span className="rounded-full bg-electric/15 px-2.5 py-0.5 text-[10px] font-bold text-electric">
                {t.admin.edited} ✎
              </span>
            )}
            {ov?.extraLessons?.length ? (
              <span className="rounded-full bg-mint/10 px-2.5 py-0.5 text-[10px] font-bold text-mint">
                +{ov.extraLessons.length} {t.admin.extraCount}
              </span>
            ) : null}
          </div>
          <p className="mt-1 truncate text-xs text-bone-500">{live.tagline[lang]}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold ${
            live.price === 0
              ? "text-white [background:linear-gradient(120deg,rgb(var(--mint)),rgb(var(--electric)))]"
              : "bg-ink-900 text-bone-50 ring-1 ring-mint/40"
          }`}
        >
          {fmtPrice(live.price, lang)}
        </span>
        <span
          className={`shrink-0 text-bone-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {/* editor body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            <div className="border-t border-line/10 p-5 md:p-7">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className={label}>{t.admin.fTitle}</span>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={input} />
                </label>
                <label className="block">
                  <span className={label}>{t.admin.fShort}</span>
                  <input type="text" value={short} onChange={(e) => setShort(e.target.value)} className={input} />
                </label>
                <label className="block">
                  <span className={label}>{t.admin.fCover}</span>
                  <input type="text" value={cover} onChange={(e) => setCover(e.target.value)} className={input} />
                </label>
                <label className="block md:col-span-2">
                  <span className={label}>{t.admin.fTagline}</span>
                  <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className={input} />
                </label>
                <label className="block">
                  <span className={label}>{t.admin.fPrice}</span>
                  <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className={input} dir="ltr" />
                </label>
                <label className="block">
                  <span className={label}>{t.admin.fCompare}</span>
                  <input type="number" min="0" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} placeholder="—" className={input} dir="ltr" />
                </label>
              </div>

              {/* add lesson */}
              <form
                onSubmit={addLesson}
                className="mt-6 rounded-xl border border-mint/20 bg-mint/[0.04] p-4 md:p-5"
              >
                <p className={label}>＋ {t.admin.addLessonLabel}</p>
                <div className="mt-1 grid gap-4 md:grid-cols-[1fr_6rem_1fr_auto]">
                  <label className="block">
                    <span className="sr-only">{t.admin.fLessonTitle}</span>
                    <input
                      type="text"
                      value={lTitle}
                      onChange={(e) => setLTitle(e.target.value)}
                      placeholder={t.admin.fLessonTitle}
                      className={input}
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">{t.admin.fLessonMins}</span>
                    <input
                      type="number"
                      min="1"
                      value={lMins}
                      onChange={(e) => setLMins(e.target.value)}
                      placeholder={t.admin.fLessonMins}
                      className={input}
                      dir="ltr"
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">{t.admin.fLessonUrl}</span>
                    <input
                      type="url"
                      value={lUrl}
                      onChange={(e) => setLUrl(e.target.value)}
                      placeholder={t.admin.fLessonUrl}
                      className={input}
                      dir="ltr"
                    />
                  </label>
                  <button
                    type="submit"
                    className="btn mt-2 self-stretch border border-mint/40 bg-mint/10 px-5 text-sm text-mint hover:bg-mint/20"
                  >
                    {t.admin.addLessonBtn}
                  </button>
                </div>
                {ov?.extraLessons?.length ? (
                  <ul className="mt-4 space-y-1.5">
                    {ov.extraLessons.map((l, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs text-bone-300">
                        <span className="text-mint">✦</span>
                        <span className="truncate">{l.t}</span>
                        <span className="shrink-0 text-bone-500" dir="ltr">
                          {l.dur}m
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </form>

              {/* actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button type="button" onClick={save} className="btn btn-primary px-7 py-3 text-sm">
                  {saved ? t.admin.saved : t.admin.save}
                </button>
                <Link
                  href={`/courses/${base.slug}/`}
                  className="btn btn-ghost px-6 py-3 text-sm"
                >
                  {t.admin.open} →
                </Link>
                <button
                  type="button"
                  onClick={reset}
                  className="ml-auto rounded-full border border-red-500/30 px-5 py-2.5 text-xs text-red-400/90 transition-colors hover:border-red-500/60"
                >
                  {t.admin.resetCourse}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
