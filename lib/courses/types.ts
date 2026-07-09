// ---- Course data model -------------------------------------------------
// Every course is a complete learning ecosystem: path → modules → lessons →
// projects → resources → quizzes → final project → portfolio piece.
// Durations are stored per-lesson (minutes) and summed by helpers so the
// 3–5 hour rule is enforced by the data itself, not by hand-written labels.

export type Bi = { en: string; ar: string };

export type Lesson = {
  id: string;
  t: string; // title (EN — tool vocabulary stays in English by convention)
  dur: number; // minutes
  d: string; // one-line practical detail
  free?: boolean; // free preview lesson
};

export type QuizQ = { q: string; opts: string[]; a: number };

export type Module = {
  n: string; // "01"
  t: string;
  lessons: Lesson[];
};

export type Project = { t: string; d: string };

export type Resource = {
  t: string;
  type: "PDF" | "ZIP" | "TXT" | "FIG" | "PSD" | "AI" | "AEP" | "PRPROJ";
  note: string;
};

export type Review = { name: string; role: string; text: string; stars: number };

export type Course = {
  slug: string;
  index: string; // editorial numeral "01"
  glyph: string; // tool plate glyph "Ps"
  title: Bi;
  short: Bi; // card-length name
  tagline: Bi;
  desc: Bi;
  level: Bi;
  audience: Bi;
  price: number; // EGP; 0 = free
  compareAt?: number;
  cover: string; // atmosphere image (existing portfolio asset)
  outcomes: string[];
  tools: string[];
  path: { t: string; d: string }[]; // Zero → Pro stations
  modules: Module[];
  quiz: QuizQ[]; // course quiz bank (module checkpoints draw from it)
  projects: Project[];
  resources: Resource[];
  finalProject: { t: string; d: string; deliverables: string[] };
  faq: { q: string; a: string }[];
  reviews: Review[];
  rating: number; // aggregate (schema.org)
  ratingCount: number;
  students: number; // enrolled counter (marketing)
};

export const lessonCount = (c: Course) =>
  c.modules.reduce((n, m) => n + m.lessons.length, 0);

export const totalMinutes = (c: Course) =>
  c.modules.reduce(
    (n, m) => n + m.lessons.reduce((x, l) => x + l.dur, 0),
    0
  );

export const fmtDuration = (mins: number, lang: "en" | "ar" = "en") => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (lang === "ar") return m ? `${h} س ${m} د` : `${h} ساعات`;
  return m ? `${h}h ${m}m` : `${h}h`;
};

export const fmtPrice = (egp: number, lang: "en" | "ar" = "en") =>
  egp === 0
    ? lang === "ar"
      ? "مجاني"
      : "Free"
    : lang === "ar"
      ? `${egp.toLocaleString("en-US")} ج.م`
      : `EGP ${egp.toLocaleString("en-US")}`;
