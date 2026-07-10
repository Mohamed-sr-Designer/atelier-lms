import { photoshop, illustrator } from "./adobe";
import { aftereffects, premiere } from "./motion";
import { aiPhotoshoot, aiVideo } from "./ai";
import { totalMinutes, lessonCount, type Course, type Bi } from "./types";

export * from "./types";

// The business model: software craft is FREE (the funnel — nobody gatekeeps
// tools in 2026), AI production is PREMIUM (the money skill clients pay for).
export const courses: Course[] = [
  photoshop,
  illustrator,
  aftereffects,
  premiere,
  aiPhotoshoot,
  aiVideo,
];

export const getCourse = (slug: string) =>
  courses.find((c) => c.slug === slug);

// ---- The AI Production Stack -------------------------------------------------
// Both premium AI tracks: the complete camera-less campaign pipeline.
export type Bundle = {
  slug: string;
  title: Bi;
  tagline: Bi;
  desc: Bi;
  courseSlugs: string[];
  price: number;
  compareAt: number; // sum of the parts
};

export const bundle: Bundle = {
  slug: "ai-production-stack",
  title: { en: "The AI Production Stack", ar: "باقة إنتاج الـ AI الكاملة" },
  tagline: {
    en: "Both AI courses — the full camera-less pipeline, one enrollment.",
    ar: "كورسات الـ AI الاتنين — خط الإنتاج الكامل من غير كاميرا، باشتراك واحد.",
  },
  desc: {
    en: "AI Photoshoot & Prompt Engineering + AI Video Generation: direct stills like a photographer, then turn them into finished spots clients approve. The two highest-earning skills we teach, 6+ hours, two reviewed final projects.",
    ar: "التصوير بالذكاء الاصطناعي وهندسة البرومبت + توليد الفيديو: أخرج الصور كأنك مصوّر محترف، وبعدين حوّلها لإعلانات نهائية العميل يوافق عليها. أعلى مهارتين بيكسّبوا عندنا، أكتر من ٦ ساعات، ومشروعان نهائيان بمراجعة.",
  },
  courseSlugs: ["ai-photoshoot", "ai-video-generation"],
  price: 5200,
  compareAt: 6000, // 2,800 + 3,200
};

export const bundleCourses = bundle.courseSlugs
  .map((s) => getCourse(s))
  .filter((c): c is Course => Boolean(c));

// ---- Aggregates for hero counters & schema ---------------------------------
export const stats = {
  totalHours: Math.round(
    courses.reduce((n, c) => n + totalMinutes(c), 0) / 60
  ),
  totalLessons: courses.reduce((n, c) => n + lessonCount(c), 0),
  totalStudents: courses.reduce((n, c) => n + c.students, 0),
  totalCourses: courses.length,
  freeCourses: courses.filter((c) => c.price === 0).length,
  // Real-world teaching record (from the portfolio's verified history)
  graduates: 1200,
  academies: 4,
};
