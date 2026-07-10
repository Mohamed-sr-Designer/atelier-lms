"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

// A FigJam-style scratch board inside every lesson. Four tools:
//   note  — add & drag sticky notes
//   pen   — freehand strokes on a canvas layer
//   erase — drag over strokes to remove them
//   hand  — pan around the oversized surface
// Everything persists per course; strokes use normalized coordinates so they
// survive resizes.
type Note = { id: string; text: string; color: number; x: number; y: number };
type Stroke = { color: number; pts: [number, number][] }; // normalized 0..1
type Mode = "note" | "pen" | "erase" | "hand";

const SURFACE = 1.5; // board surface = 150% of the visible frame

const PALETTE = [
  { chip: "bg-mint", note: "bg-mint/15 border-mint/40", ink: "text-bone-50" },
  { chip: "bg-electric", note: "bg-electric/15 border-electric/40", ink: "text-bone-50" },
  { chip: "bg-bone-50", note: "bg-bone-50 border-bone-50", ink: "text-ink-900" },
  { chip: "bg-ink-600", note: "bg-ink-800 border-line/25", ink: "text-bone-50" },
];

const penColor = (i: number) => {
  const root = getComputedStyle(document.documentElement);
  if (i === 0) return `rgb(${root.getPropertyValue("--mint").trim().split(" ").join(",")})`;
  if (i === 1) return `rgb(${root.getPropertyValue("--electric").trim().split(" ").join(",")})`;
  return i === 2 ? "#F0EFF6" : "#6E6A7E";
};

const keyFor = (slug: string) => `method-board-${slug}`;

const ToolBtn = ({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    title={title}
    className={`grid h-9 w-9 place-items-center rounded-full border transition-all duration-300 ${
      active
        ? "border-mint bg-mint/15 text-mint shadow-[0_0_14px_rgb(var(--mint)/0.4)]"
        : "border-line/15 text-bone-400 hover:border-mint/50 hover:text-mint"
    }`}
  >
    {children}
  </button>
);

export default function NotesBoard({ slug }: { slug: string }) {
  const { t } = useLang();
  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef<Stroke | null>(null);
  const panning = useRef<{ x: number; y: number } | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [color, setColor] = useState(0);
  const [mode, setMode] = useState<Mode>("note");
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  // hydrate (supports older formats)
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

  const redraw = useCallback(() => {
    const cv = canvasRef.current;
    const board = boardRef.current;
    if (!cv || !board) return;
    cv.width = board.clientWidth * SURFACE;
    cv.height = board.clientHeight * SURFACE;
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
    const r = canvasRef.current!.getBoundingClientRect();
    return [
      Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    ];
  };

  const eraseAt = (p: [number, number]) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const r2 = 18 * 18; // px radius²
    setStrokes((prev) =>
      prev.filter(
        (s) =>
          !s.pts.some(([x, y]) => {
            const dx = (x - p[0]) * cv.width;
            const dy = (y - p[1]) * cv.height;
            return dx * dx + dy * dy < r2;
          })
      )
    );
  };

  const clampOffset = (x: number, y: number) => {
    const b = boardRef.current;
    if (!b) return { x, y };
    const maxPan = {
      x: b.clientWidth * (SURFACE - 1),
      y: b.clientHeight * (SURFACE - 1),
    };
    return {
      x: Math.min(0, Math.max(-maxPan.x, x)),
      y: Math.min(0, Math.max(-maxPan.y, y)),
    };
  };

  const surfaceDown = (e: React.PointerEvent) => {
    if (mode === "pen") {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      drawing.current = { color, pts: [norm(e)] };
    } else if (mode === "erase") {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      eraseAt(norm(e));
      drawing.current = { color: -1, pts: [] }; // marks "erasing" drag
    }
  };
  const surfaceMove = (e: React.PointerEvent) => {
    if (mode === "pen" && drawing.current && drawing.current.color !== -1) {
      drawing.current.pts.push(norm(e));
      redraw();
    } else if (mode === "erase" && drawing.current) {
      eraseAt(norm(e));
    }
  };
  const surfaceUp = () => {
    if (drawing.current && drawing.current.color !== -1 && drawing.current.pts.length > 1) {
      const done = drawing.current;
      drawing.current = null;
      setStrokes((prev) => [...prev, done]);
    } else {
      drawing.current = null;
    }
  };

  const boardDown = (e: React.PointerEvent) => {
    if (mode !== "hand") return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    panning.current = { x: e.clientX, y: e.clientY };
  };
  const boardMove = (e: React.PointerEvent) => {
    if (mode !== "hand" || !panning.current) return;
    const dx = e.clientX - panning.current.x;
    const dy = e.clientY - panning.current.y;
    panning.current = { x: e.clientX, y: e.clientY };
    setOffset((o) => clampOffset(o.x + dx, o.y + dy));
  };
  const boardUp = () => {
    panning.current = null;
  };

  const addNote = () => {
    const n = notes.length;
    setNotes((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2, 9),
        text: "",
        color,
        x: -offset.x + 24 + (n % 4) * 48,
        y: -offset.y + 24 + (n % 5) * 40,
      },
    ]);
    setMode("note");
  };

  const update = (id: string, patch: Partial<Note>) =>
    setNotes((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const remove = (id: string) => setNotes((prev) => prev.filter((x) => x.id !== id));

  const clearAll = () => {
    if ((notes.length || strokes.length) && !window.confirm(t.learn.boardClearConfirm))
      return;
    setNotes([]);
    setStrokes([]);
  };

  const hint =
    mode === "pen"
      ? t.learn.boardPenHint
      : mode === "erase"
        ? t.learn.boardEraseHint
        : mode === "hand"
          ? t.learn.boardHandHint
          : t.learn.boardHint;

  return (
    <div>
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-t-2xl border border-line/15 bg-ink-800/70 px-4 py-3 backdrop-blur-xl">
        <button type="button" onClick={addNote} className="btn btn-primary px-4 py-2 text-xs">
          + {t.learn.boardAdd}
        </button>
        <ToolBtn active={mode === "pen"} onClick={() => setMode(mode === "pen" ? "note" : "pen")} title={t.learn.boardPen}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </ToolBtn>
        <ToolBtn active={mode === "erase"} onClick={() => setMode(mode === "erase" ? "note" : "erase")} title={t.learn.boardErase}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
            <path d="M22 21H7" />
            <path d="m5 11 9 9" />
          </svg>
        </ToolBtn>
        <ToolBtn active={mode === "hand"} onClick={() => setMode(mode === "hand" ? "note" : "hand")} title={t.learn.boardHand}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 11V6a2 2 0 0 0-4 0v5" />
            <path d="M14 10V4a2 2 0 0 0-4 0v2" />
            <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
            <path d="m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 0 0-4 0v5" />
          </svg>
        </ToolBtn>
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
        <span className="ms-auto text-[11px] text-bone-500">{hint}</span>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-bone-500 transition-colors hover:text-red-400"
        >
          {t.learn.boardClear}
        </button>
      </div>

      {/* the board frame */}
      <div
        ref={boardRef}
        onPointerDown={boardDown}
        onPointerMove={boardMove}
        onPointerUp={boardUp}
        onPointerLeave={boardUp}
        className={`relative h-[26rem] touch-none overflow-hidden rounded-b-2xl border border-t-0 border-line/15 bg-ink-900 md:h-[30rem] ${
          mode === "hand" ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        {/* oversized surface — pans with the hand tool */}
        <div
          className="absolute left-0 top-0 transition-transform duration-75"
          style={{
            width: `${SURFACE * 100}%`,
            height: `${SURFACE * 100}%`,
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            backgroundImage:
              "radial-gradient(rgb(var(--line) / 0.12) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={surfaceDown}
            onPointerMove={surfaceMove}
            onPointerUp={surfaceUp}
            onPointerLeave={surfaceUp}
            className={`absolute inset-0 z-10 h-full w-full touch-none ${
              mode === "pen"
                ? "cursor-crosshair"
                : mode === "erase"
                  ? "cursor-cell"
                  : "pointer-events-none"
            }`}
          />

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
                  mode === "note" ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
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

        {notes.length === 0 && strokes.length === 0 && (
          <p className="pointer-events-none absolute inset-0 grid place-items-center px-8 text-center font-serif text-lg italic text-bone-500">
            {t.learn.boardEmpty}
          </p>
        )}
      </div>
    </div>
  );
}
