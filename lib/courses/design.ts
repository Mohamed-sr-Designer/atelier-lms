import type { Course } from "./types";

// ---- 05 · Figma ------------------------------------------------------------
export const figma: Course = {
  slug: "figma-ui-design",
  index: "05",
  glyph: "Fg",
  title: {
    en: "Figma for Designers — Layout, Components & Prototypes",
    ar: "فيجما للمصممين — تنسيق ومكوّنات وبروتوتايب",
  },
  short: { en: "Figma", ar: "فيجما" },
  tagline: {
    en: "The tool every team now expects — mastered with a designer's eye.",
    ar: "الأداة اللي كل فريق دلوقتي بيطلبها — باحتراف وبعين مصمم.",
  },
  desc: {
    en: "Figma taught for visual designers, not developers: auto layout that behaves, real component systems, prototypes that feel alive, and handoff that makes engineers respect your files. From empty frame to portfolio-ready product design.",
    ar: "فيجما متشروحة للمصمم البصري مش للمبرمج: Auto Layout مظبوط، أنظمة Components حقيقية، بروتوتايب حي، وHandoff يخلي المطورين يحترموا ملفاتك. من فريم فاضي لتصميم منتج يدخل البورتفوليو.",
  },
  level: { en: "Zero → Professional", ar: "من الصفر → للاحتراف" },
  audience: {
    en: "Graphic designers moving into UI/product design — the most in-demand transition in the market.",
    ar: "مصممي الجرافيك اللي بينتقلوا لتصميم الواجهات والمنتجات — أكتر انتقال مطلوب في السوق.",
  },
  price: 850,
  compareAt: 1250,
  cover: "/web/fresh-valley.webp",
  outcomes: [
    "Build layouts with auto layout that resize like real products",
    "Create component systems with variants and properties",
    "Design tokens: spacing scales, type systems, color variables",
    "Prototype flows with smart animate that feel shippable",
    "Hand off files developers actually thank you for",
  ],
  tools: ["Figma", "FigJam"],
  path: [
    { t: "Think in frames", d: "The Figma mental model and auto layout." },
    { t: "Systemize layout", d: "Grids, tokens, type and color systems." },
    { t: "Componentize", d: "Variants, properties and a starter library." },
    { t: "Make it move", d: "Prototypes, smart animate and flows." },
    { t: "Hand it off", d: "Dev mode, specs and portfolio frames." },
  ],
  modules: [
    {
      n: "01",
      t: "The Figma Mental Model",
      lessons: [
        { id: "fg-1-1", t: "Files, pages & frames — how Figma thinks", dur: 12, d: "The structure behind every professional file.", free: true },
        { id: "fg-1-2", t: "Auto Layout from day one", dur: 13, d: "Learn it first, not later — everything builds on it.", free: true },
        { id: "fg-1-3", t: "Constraints & responsive thinking", dur: 12, d: "Designs that survive resizing." },
        { id: "fg-1-4", t: "Vector networks & the shape tools", dur: 12, d: "Where Figma's pen beats Illustrator's — and where it doesn't." },
      ],
    },
    {
      n: "02",
      t: "Layout Systems",
      lessons: [
        { id: "fg-2-1", t: "Grids & columns", dur: 12, d: "The 12-column discipline behind clean interfaces." },
        { id: "fg-2-2", t: "Spacing scales & tokens", dur: 13, d: "4/8-point systems — why every spacing decision gets easier." },
        { id: "fg-2-3", t: "Typography systems", dur: 12, d: "Type scales, styles and hierarchy for product screens." },
        { id: "fg-2-4", t: "Color styles & variables", dur: 12, d: "Semantic color that themes light/dark for free." },
        { id: "fg-2-5", t: "Building a landing hero", dur: 12, d: "Apply the whole system to one real section." },
      ],
    },
    {
      n: "03",
      t: "Components",
      lessons: [
        { id: "fg-3-1", t: "Components & instances", dur: 13, d: "Build once, reuse everywhere, update instantly." },
        { id: "fg-3-2", t: "Variants & component properties", dur: 12, d: "One button, every state — the professional pattern." },
        { id: "fg-3-3", t: "Interactive components", dur: 12, d: "Hovers and toggles that work inside prototypes." },
        { id: "fg-3-4", t: "A design-system starter", dur: 12, d: "Buttons, inputs, cards — your reusable foundation." },
        { id: "fg-3-5", t: "Publishing libraries", dur: 12, d: "Team libraries and how real orgs share systems." },
      ],
    },
    {
      n: "04",
      t: "Prototyping",
      lessons: [
        { id: "fg-4-1", t: "Flows, triggers & overlays", dur: 12, d: "Click-through prototypes with modals and menus." },
        { id: "fg-4-2", t: "Smart Animate", dur: 12, d: "The transitions that make stakeholders say 'ship it'." },
        { id: "fg-4-3", t: "Scroll, sticky & mobile gestures", dur: 12, d: "Prototypes that feel like the real app." },
        { id: "fg-4-4", t: "Testing your prototype on humans", dur: 12, d: "A lightweight usability pass before any handoff." },
      ],
    },
    {
      n: "05",
      t: "Handoff & Career",
      lessons: [
        { id: "fg-5-1", t: "Dev Mode & specs", dur: 12, d: "What developers look at — and what makes them curse." },
        { id: "fg-5-2", t: "File hygiene", dur: 11, d: "Naming, organization and the audit before sharing." },
        { id: "fg-5-3", t: "Portfolio-ready case frames", dur: 12, d: "Present product work like a product designer." },
        { id: "fg-5-4", t: "Final project walkthrough: app landing + flow", dur: 11, d: "I design a complete screen system live." },
      ],
    },
  ],
  quiz: [
    { q: "A row of buttons should space evenly as it resizes. You reach for…", opts: ["Manual positioning", "Auto Layout", "A background image", "Locked layers"], a: 1 },
    { q: "One button needs default, hover and disabled states. Best modeled as…", opts: ["Three separate components", "Variants of one component", "Three pages", "Styles"], a: 1 },
    { q: "Semantic color variables let you…", opts: ["Render faster", "Switch light/dark themes by swapping collections", "Export smaller files", "Avoid grids"], a: 1 },
    { q: "An 8-point spacing system means…", opts: ["Only 8px gaps allowed", "Spacing uses multiples of 8 (with 4 for fine control)", "8 columns maximum", "Text at 8pt"], a: 1 },
    { q: "Smart Animate matches layers between frames by…", opts: ["Layer color", "Layer name", "Position only", "Random"], a: 1 },
    { q: "Before sharing a file with developers you should…", opts: ["Flatten everything", "Clean names, remove drafts, mark ready sections", "Export to PDF", "Delete components"], a: 1 },
  ],
  projects: [
    { t: "Auto Layout Gauntlet", d: "Rebuild 3 provided cards so they survive any content length — no manual nudging allowed." },
    { t: "Component Kit", d: "Build a button + input + card set with full variants, used across two screens." },
    { t: "Living Prototype", d: "A 4-screen mobile flow with smart animate transitions and one overlay." },
  ],
  resources: [
    { t: "Course Figma file (all modules)", type: "FIG", note: "Duplicate and dissect every lesson." },
    { t: "Design tokens starter sheet", type: "PDF", note: "The spacing/type/color scales from Module 02." },
    { t: "Component checklist", type: "PDF", note: "What every production component must have." },
    { t: "Handoff audit checklist", type: "PDF", note: "Run before sharing any file with devs." },
  ],
  finalProject: {
    t: "Product Landing + Signup Flow",
    d: "Design a responsive landing page and 3-screen signup flow for a fictional app: full token system, component kit and an interactive prototype.",
    deliverables: ["Figma file with published components", "Interactive prototype link", "Desktop + mobile breakpoints", "Handoff-ready dev mode annotations"],
  },
  faq: [
    { q: "I'm a graphic designer — is UI design a real path for me?", a: "It's the most natural upgrade in the industry: your layout, type and color instincts transfer directly. This course adds the systems thinking employers test for." },
    { q: "Is Figma free?", a: "Yes — everything in this course works on Figma's free plan." },
    { q: "Photoshop habits: will they hurt me here?", a: "A few (like manual positioning) need unlearning — Module 01 targets exactly those habits so auto layout becomes your default." },
    { q: "Does it cover UX research?", a: "It covers a practical usability pass in Module 04. Deep research methods are a different discipline — this course is the visual/system craft." },
  ],
  reviews: [
    { name: "Salma Ibrahim", role: "Graphic designer → UI designer", text: "Landed a product design internship two months after finishing. The component kit project was my interview centerpiece.", stars: 5 },
    { name: "Mohamed Adel", role: "Brand designer", text: "Auto layout finally makes sense. I now design client sites in Figma instead of endless Photoshop mockups.", stars: 5 },
    { name: "Farah Khaled", role: "Student", text: "The tokens lesson gave me a system for decisions I used to agonize over. Everything got faster.", stars: 4 },
  ],
  rating: 4.9,
  ratingCount: 97,
  students: 390,
};
