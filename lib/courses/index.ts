import { photoshop, illustrator } from "./adobe";
import { aftereffects, premiere } from "./motion";
import { figma } from "./design";
import { aiPhotoshoot, aiVideo } from "./ai";
import { totalMinutes, lessonCount, type Course, type Bi } from "./types";

export * from "./types";

// Catalog order = funnel order: free flagship sits by the paid tracks it feeds.
export const courses: Course[] = [
  photoshop,
  illustrator,
  aftereffects,
  premiere,
  figma,
  aiPhotoshoot,
  aiVideo,
];

export const getCourse = (slug: string) =>
  courses.find((c) => c.slug === slug);

// ---- Ultimate Design Bundle -------------------------------------------------
// Photoshop + the two original AI tracks: the "camera-less campaign" stack.
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
  slug: "ultimate-design-bundle",
  title: { en: "The Ultimate Design Bundle", ar: "باقة التصميم الشاملة" },
  tagline: {
    en: "Photoshop mastery + the complete AI production stack — one enrollment.",
    ar: "احتراف فوتوشوب + منظومة إنتاج الذكاء الاصطناعي الكاملة — باشتراك واحد.",
  },
  desc: {
    en: "The full camera-less campaign pipeline: master Photoshop craft, direct AI photoshoots, then turn stills into finished AI video. Three courses, one workflow, 13+ hours.",
    ar: "خط إنتاج الحملات الكامل من غير كاميرا: احترف الفوتوشوب، أخرج جلسات تصوير AI، وحوّل الصور لفيديو نهائي. ثلاث كورسات، Workflow واحد، أكتر من ١٣ ساعة.",
  },
  courseSlugs: ["adobe-photoshop", "ai-photoshoot", "ai-video-generation"],
  price: 1190,
  compareAt: 1700, // 950 + 0 + 750
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
  // Real-world teaching record (from the portfolio's verified history)
  graduates: 1200,
  academies: 4,
};
