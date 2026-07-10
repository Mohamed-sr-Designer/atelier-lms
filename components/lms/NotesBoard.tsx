"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

// A FigJam-style scratch board inside every lesson: sticky notes you can add,
// write on, recolor, drag around and delete — persisted per course in
// localStorage so your references survive between sessions.
type Note = {
  id: string;
  text: string;
  color: number; // index into PALETTE
  x: number; // px, relative to board
  y: number;
};

const PALETTE = [
  { chip: "bg-mint", note: "bg-mint/15 border-mint/40", ink: "text-bone-50" },
  { chip: "bg-electric", note: "bg-electric/15 border-electric/40", ink: "text-bone-50" },
  { chip: "bg-bone-50", note: "bg-bone-50 border-bone-50", ink: "text-ink-900" },
  { chip: "bg-ink-600", note: "bg-ink-800 border-line/25", ink: "text-bone-50" },
];

const keyFor = (slug: string) => `method-board-${slug}`;

export default function NotesBoard({ slug }: { slug: string }) {
  const { t } = useLang();
  const boardRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [color, setColor] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(keyFor(slug));
      if (raw) setNotes(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [slug]);

  // persist
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(keyFor(slug), JSON.stringify(notes));
    } catch {}
  }, [notes, slug, loaded]);

  const addNote = () => {
    const n = notes.length;
    setNotes((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2, 9),
        text: "",
        color,
        x: 24 + (n % 4) * 48,
        y: 24 + (n % 5) * 40,
      },
    ]);
  };

  const update = (id: string, patch: Partial<Note>) =>
    setNotes((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const remove = (id: string) =>
    setNotes((prev) => prev.filter((x) => x.id !== id));

  const clearAll = () => {
    if (notes.length && !window.confirm(t.learn.boardClearConfirm)) return;
    setNotes([]);
  };

  return (
    <div>
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-t-2xl border border-line/15 bg-ink-800/80 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={addNote}
          className="btn btn-primary px-4 py-2 text-xs"
        >
          + {t.learn.boardAdd}
        </button>
        <span aria-hidden className="h-5 w-px bg-line/15" />
        <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Note color">
          {PALETTE.map((p, i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={color === i}
              onClick={() => setColor(i)}
              className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${p.chip} ${
                color === i ? "border-bone-50 scale-110" : "border-transparent"
              }`}
              aria-label={`Color ${i + 1}`}
            />
          ))}
        </div>
        <span className="ms-auto text-[11px] text-bone-500">{t.learn.boardHint}</span>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-bone-500 transition-colors hover:text-red-400"
        >
          {t.learn.boardClear}
        </button>
      </div>

      {/* the board — dotted grid, drag space */}
      <div
        ref={boardRef}
        className="relative h-[26rem] overflow-hidden rounded-b-2xl border border-t-0 border-line/15 bg-ink-900 md:h-[30rem]"
        style={{
          backgroundImage:
            "radial-gradient(rgb(var(--line) / 0.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        {notes.length === 0 && (
          <p className="pointer-events-none absolute inset-0 grid place-items-center px-8 text-center font-serif text-lg italic text-bone-500">
            {t.learn.boardEmpty}
          </p>
        )}
        {notes.map((n) => {
          const p = PALETTE[n.color] ?? PALETTE[0];
          return (
            <motion.div
              key={n.id}
              drag
              dragConstraints={boardRef}
              dragMomentum={false}
              dragElastic={0.08}
              initial={{ x: n.x, y: n.y, scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileDrag={{ scale: 1.04, rotate: -1.5, zIndex: 30 }}
              onDragEnd={(_, info) =>
                update(n.id, {
                  x: Math.max(0, n.x + info.offset.x),
                  y: Math.max(0, n.y + info.offset.y),
                })
              }
              className={`absolute w-52 cursor-grab rounded-xl border p-3 shadow-xl shadow-black/30 backdrop-blur active:cursor-grabbing ${p.note}`}
            >
              <div className="flex items-center justify-between pb-2">
                <span className={`h-1.5 w-6 rounded-full ${p.chip}`} aria-hidden />
                <button
                  type="button"
                  onClick={() => remove(n.id)}
                  className={`-mr-1 -mt-1 grid h-6 w-6 place-items-center rounded-full text-xs opacity-50 transition hover:bg-ink-900/20 hover:opacity-100 ${p.ink}`}
                  aria-label={t.learn.boardDelete}
                >
                  ✕
                </button>
              </div>
              <textarea
                value={n.text}
                onChange={(e) => update(n.id, { text: e.target.value })}
                onPointerDown={(e) => e.stopPropagation()}
                placeholder={t.learn.boardPlaceholder}
                rows={4}
                className={`w-full resize-none bg-transparent text-sm leading-snug outline-none placeholder:opacity-40 ${p.ink}`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
