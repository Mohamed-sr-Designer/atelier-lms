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

// ---- Bundles ------------------------------------------------------------------
// Multi-course packs, each priced under the sum of its parts.
export type Bundle = {
  slug: string;
  title: Bi;
  tagline: Bi;
  desc: Bi;
  courseSlugs: string[];
  price: number;
  compareAt: number; // sum of the parts
};

export const bundles: Bundle[] = [
  {
    slug: "ai-production-stack",
    title: { en: "The AI Production Stack", ar: "حزمة إنتاج الذكاء الاصطناعي" },
    tagline: {
      en: "Both AI courses — the full camera-less pipeline, one enrollment.",
      ar: "دورتا الذكاء الاصطناعي معًا — خط الإنتاج الكامل دون كاميرا، باشتراك واحد.",
    },
    desc: {
      en: "AI Photoshoot & Prompt Engineering + AI Video Generation: direct stills like a photographer, then turn them into finished spots clients approve. The two highest-earning skills we teach, 6+ hours, two reviewed final projects.",
      ar: "التصوير بالذكاء الاصطناعي وهندسة الأوامر + توليد الفيديو بالذكاء الاصطناعي: أخرِج الصور كمصوّر محترف ثم حوّلها إلى إعلانات نهائية يعتمدها العميل. أعلى مهارتين ربحًا نُدرّسهما، أكثر من ست ساعات، ومشروعان نهائيان بمراجعة شخصية.",
    },
    courseSlugs: ["ai-photoshoot", "ai-video-generation"],
    price: 5700,
    compareAt: 7000, // 3,300 + 3,700
  },
  {
    slug: "editors-suite",
    title: { en: "The Editor's Suite", ar: "حزمة المونتير المحترف" },
    tagline: {
      en: "After Effects + Premiere Pro — motion and editing, one enrollment.",
      ar: "أفتر إفكتس + بريمير برو — الموشن والمونتاج معًا باشتراك واحد.",
    },
    desc: {
      en: "The complete motion-and-edit pipeline: animate in After Effects, cut and finish in Premiere Pro. Everything a working editor ships, taught from real client reels — two reviewed final projects.",
      ar: "خط الموشن والمونتاج الكامل: حرّك في أفتر إفكتس، واقطع وسلّم في بريمير برو. كل ما يسلّمه المونتير المحترف، مُدرَّس من أعمال حقيقية لعملاء — ومشروعان نهائيان بمراجعة.",
    },
    courseSlugs: ["adobe-after-effects", "adobe-premiere-pro"],
    price: 3950,
    compareAt: 4850, // 2,800 + 2,050
  },
  {
    slug: "motion-ai-master",
    title: { en: "The Motion + AI Master Pack", ar: "الحزمة الكبرى: موشن + ذكاء اصطناعي" },
    tagline: {
      en: "After Effects + Premiere + AI Photoshoot + AI Video — everything that moves and sells.",
      ar: "أفتر إفكتس + بريمير + التصوير والفيديو بالذكاء الاصطناعي — كل ما يتحرك ويبيع.",
    },
    desc: {
      en: "The everything pack: animate in After Effects, direct AI photoshoots, generate AI footage, and cut it all into finished spots in Premiere Pro. Four courses, four reviewed final projects — the complete modern production skill set.",
      ar: "حزمة كل شيء: حرّك في أفتر إفكتس، وأخرِج جلسات تصوير بالذكاء الاصطناعي، وولّد لقطات فيديو، ثم اصنع منها إعلانات نهائية في بريمير برو. أربع دورات وأربعة مشاريع نهائية بمراجعة — عدّة الإنتاج الحديثة كاملة.",
    },
    courseSlugs: ["adobe-after-effects", "adobe-premiere-pro", "ai-photoshoot", "ai-video-generation"],
    price: 8825,
    compareAt: 11850, // 2,800 + 2,050 + 3,300 + 3,700
  },
];

export const getBundle = (slug: string) =>
  bundles.find((b) => b.slug === slug);

export const coursesOfBundle = (b: Bundle) =>
  b.courseSlugs
    .map((s) => getCourse(s))
    .filter((c): c is Course => Boolean(c));

// Back-compat: the flagship bundle most surfaces reference directly.
export const bundle = bundles[0];
export const bundleCourses = coursesOfBundle(bundle);

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
