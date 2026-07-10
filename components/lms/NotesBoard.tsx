"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

// A FigJam-style scratch board inside every lesson: sticky notes AND a pen.
// Notes drag; the pen draws freehand strokes on a canvas layer. Everything is
// persisted per course (strokes stored as normalized coordinates so they
// survive resizes).
type Note = {
  id: string;
  text: string;
  color: number;
  x: number;
  y: number;
};
type Stroke = { color: number; pts: [number, number][] }; // normalized 0..1

const PALETTE = [
  { chip: "bg-mint", note: "bg-mint/15 border-mint/40", ink: "text-bone-50", hex: "var(--pen-a)" },
  { chip: "bg-electric", note: "bg-electric/15 border-electric/40", ink: "text-bone-50", hex: "var(--pen-b)" },
  { chip: "bg-bone-50", note: "bg-bone-50 border-bone-50", ink: "text-ink-900", hex: "#F0EFF6" },
  { chip: "bg-ink-600", note: "bg-ink-800 border-line/25", ink: "text-bone-50", hex: "#6E6A7E" },
];

const penColor = (i: number) => {
  // resolve accent-aware pen colors from CSS vars at draw time
  const root = getComputedStyle(document.documentElement);
  if (i === 0) return `rgb(${root.getPropertyValue("--mint").trim().split(" ").join(",")})`;
  if (i === 1) return `rgb(${root.getPropertyValue("--electric").trim().split(" ").join(",")})`;
  return PALETTE[i].hex;
};

const keyFor = (slug: string) => `method-board-${slug}`;

export default function NotesBoard({ slug }: { slug: string }) {
  const { t } = useLang();
  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef<Stroke | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [color, setColor] = useState(0);
  const [mode, setMode] = useState<"note" | "pen">("note");
  const [loaded, setLoaded] = useState(false);

  // hydrate (supports the older notes-only array format)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(keyFor(slug));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setNotes(parsed);
        else {
          setNotes(parsed.notes ?? []);
          setStrokes(parsed.strokes ?? []);
        }
      }
    } catch {}
    setLoaded(true);
  }, [slug]);

  // persist
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(keyFor(slug), JSON.stringify({ notes, strokes }));
    } catch {}
  }, [notes, strokes, slug, loaded]);

  // canvas sizing + redraw
  const redraw = useCallback(() => {
    const cv = canvasRef.current;
    const board = boardRef.current;
    if (!cv || !board) return;
    cv.width = board.clientWidth;
    cv.height = board.clientHeight;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const s of [...strokes, ...(drawing.current ? [drawing.current] : [])]) {
      if (s.pts.length < 2) continue;
      ctx.strokeStyle = penColor(s.color);
      ctx.beginPath();
      ctx.moveTo(s.pts[0][0] * cv.width, s.pts[0][1] * cv.height);
      for (const [x, y] of s.pts.slice(1)) ctx.lineTo(x * cv.width, y * cv.height);
      ctx.stroke();
    }
  }, [strokes]);

  useEffect(() => {
    redraw();
    const onResize = () => redraw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [redraw]);

  const norm = (e: React.PointerEvent): [number, number] => {
    const r = boardRef.current!.getBoundingClientRect();
    return [
      Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    ];
  };

  const penDown = (e: React.PointerEvent) => {
    if (mode !== "pen") return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drawing.current = { color, pts: [norm(e)] };
  };
  const penMove = (e: React.PointerEvent) => {
    if (mode !== "pen" || !drawing.current) return;
    drawing.current.pts.push(norm(e));
    redraw();
  };
  const penUp = () => {
    if (drawing.current && drawing.current.pts.length > 1) {
      const done = drawing.current;
      drawing.current = null;
      setStrokes((prev) => [...prev, done]);
    } else {
      drawing.current = null;
    }
  };

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
    setMode("note");
  };

  const update = (id: string, patch: Partial<Note>) =>
    setNotes((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const remove = (id: string) =>
    setNotes((prev) => prev.filter((x) => x.id !== id));

  const clearAll = () => {
    if ((notes.length || strokes.length) && !window.confirm(t.learn.boardClearConfirm))
      return;
    setNotes([]);
    setStrokes([]);
  };

  return (
    <div>
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-t-2xl border border-line/15 bg-ink-800/80 px-4 py-3 backdrop-blur">
        <button type="button" onClick={addNote} className="btn btn-primary px-4 py-2 text-xs">
          + {t.learn.boardAdd}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "pen" ? "note" : "pen")}
          aria-pressed={mode === "pen"}
          title={t.learn.boardPen}
          className={`grid h-9 w-9 place-items-center rounded-full border transition-all duration-300 ${
            mode === "pen"
              ? "border-mint bg-mint/15 text-mint shadow-[0_0_14px_rgb(var(--mint)/0.4)]"
              : "border-line/15 text-bone-400 hover:border-mint/50 hover:text-mint"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </button>
        <span aria-hidden className="h-5 w-px bg-line/15" />
        <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Color">
          {PALETTE.map((p, i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={color === i}
              onClick={() => setColor(i)}
              className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${p.chip} ${
                color === i ? "scale-110 border-bone-50" : "border-transparent"
              }`}
              aria-label={`Color ${i + 1}`}
            />
          ))}
        </div>
        <span className="ms-auto text-[11px] text-bone-500">
          {mode === "pen" ? t.learn.boardPenHint : t.learn.boardHint}
        </span>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-bone-500 transition-colors hover:text-red-400"
        >
          {t.learn.boardClear}
        </button>
      </div>

      {/* the board */}
      <div
        ref={boardRef}
        className="relative h-[26rem] overflow-hidden rounded-b-2xl border border-t-0 border-line/15 bg-ink-900 md:h-[30rem]"
        style={{
          backgroundImage:
            "radial-gradient(rgb(var(--line) / 0.12) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        {/* drawing layer */}
        <canvas
          ref={canvasRef}
          onPointerDown={penDown}
          onPointerMove={penMove}
          onPointerUp={penUp}
          onPointerLeave={penUp}
          className={`absolute inset-0 z-10 touch-none ${
            mode === "pen" ? "cursor-crosshair" : "pointer-events-none"
          }`}
        />

        {notes.length === 0 && strokes.length === 0 && (
          <p className="pointer-events-none absolute inset-0 grid place-items-center px-8 text-center font-serif text-lg italic text-bone-500">
            {t.learn.boardEmpty}
          </p>
        )}
        {notes.map((n) => {
          const p = PALETTE[n.color] ?? PALETTE[0];
          return (
            <motion.div
              key={n.id}
              drag={mode === "note"}
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
              className={`absolute w-52 rounded-xl border p-3 shadow-xl shadow-black/30 backdrop-blur ${
                mode === "note" ? "cursor-grab active:cursor-grabbing" : ""
              } ${p.note}`}
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
