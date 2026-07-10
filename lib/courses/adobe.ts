import type { Course } from "./types";

// ---- 01 · Adobe Photoshop ------------------------------------------------
export const photoshop: Course = {
  slug: "adobe-photoshop",
  index: "01",
  glyph: "Ps",
  title: {
    en: "Photoshop Mastery — Retouch, Composite & Campaign Craft",
    ar: "احتراف فوتوشوب — ريتاتش وكومبوزيت وتنفيذ الحملات",
  },
  short: { en: "Adobe Photoshop", ar: "أدوبي فوتوشوب" },
  tagline: {
    en: "From your first layer to campaign-ready visuals agencies pay for.",
    ar: "من أول Layer لتنفيذ Visuals جاهزة للحملات بمستوى الوكالات.",
  },
  desc: {
    en: "The exact Photoshop workflow I use directing real campaigns — selections, masking, color, retouch and compositing — taught from zero, with zero filler. Every lesson ends with something you can use the same day.",
    ar: "نفس أسلوب الشغل اللي بستخدمه في حملات حقيقية — تحديد، ماسكات، ألوان، ريتاتش وكومبوزيت — من الصفر ومن غير أي حشو. كل درس بيخلص بحاجة تقدر تستخدمها في نفس اليوم.",
  },
  level: { en: "Zero → Professional", ar: "من الصفر → للاحتراف" },
  audience: {
    en: "Beginners, social media designers, and self-taught retouchers who want an agency-grade workflow.",
    ar: "المبتدئين ومصممي السوشيال ميديا وكل اللي اتعلم لوحده وعايز Workflow بمستوى الوكالات.",
  },
  price: 0,
  cover: "/work/axia/hero-2.webp",
  icon: "/lms/icons/ps.webp",
  plate: ["#001E36", "#31A8FF"],
  outcomes: [
    "Cut anything — hair, glass, motion blur — with clean edges",
    "Grade color like a colorist, not a filter user",
    "Retouch skin and products without the plastic look",
    "Composite a full key visual from separate sources",
    "Deliver print, web and social masters correctly",
  ],
  tools: ["Adobe Photoshop", "Camera Raw"],
  path: [
    { t: "See the canvas", d: "Layers, smart objects and the non-destructive mindset." },
    { t: "Own selections", d: "Masking and cutting that survives client zoom-ins." },
    { t: "Command light", d: "Curves, grading and matching light across sources." },
    { t: "Retouch & build", d: "Skin, product and full composite construction." },
    { t: "Ship like a pro", d: "Templating, batching and delivery masters." },
  ],
  modules: [
    {
      n: "01",
      t: "The Professional Canvas",
      lessons: [
        { id: "ps-1-1", t: "Interface like a pro: workspaces & panels", dur: 12, d: "Set up the workspace working retouchers actually use.", free: true },
        { id: "ps-1-2", t: "Layers: the mental model", dur: 13, d: "Groups, stacking logic and naming that scales to 200-layer files.", free: true },
        { id: "ps-1-3", t: "Non-destructive thinking: smart objects & adjustment layers", dur: 13, d: "Edit forever without breaking pixels." },
        { id: "ps-1-4", t: "Selections 101: marquee to quick select", dur: 12, d: "The fast tools — and exactly when they fail." },
      ],
    },
    {
      n: "02",
      t: "Selections & Masking",
      lessons: [
        { id: "ps-2-1", t: "Masking fundamentals", dur: 12, d: "Layer masks, density, feather — the core of every composite." },
        { id: "ps-2-2", t: "Select & Mask: hair and soft edges", dur: 14, d: "Clean hair cuts on busy backgrounds." },
        { id: "ps-2-3", t: "Pen tool precision cuts", dur: 13, d: "Product-grade paths for hard-edge subjects." },
        { id: "ps-2-4", t: "Channels for impossible selections", dur: 12, d: "Smoke, glass and fine fabric via channel contrast." },
      ],
    },
    {
      n: "03",
      t: "Color & Light",
      lessons: [
        { id: "ps-3-1", t: "Curves: the only tool you truly need", dur: 13, d: "Contrast, color casts and channel-level control." },
        { id: "ps-3-2", t: "Color grading with Camera Raw", dur: 13, d: "A colorist's pass: HSL, color wheels, calibration." },
        { id: "ps-3-3", t: "Matching light between composite sources", dur: 12, d: "Direction, temperature and falloff — the realism triad." },
        { id: "ps-3-4", t: "Gradient maps & split toning", dur: 11, d: "The premium cinematic looks, built by hand." },
      ],
    },
    {
      n: "04",
      t: "Retouching",
      lessons: [
        { id: "ps-4-1", t: "Healing, cloning & the cleanup pass", dur: 14, d: "A disciplined order of operations for any image." },
        { id: "ps-4-2", t: "Dodge & burn for depth", dur: 12, d: "Sculpt light to make flat images dimensional." },
        { id: "ps-4-3", t: "Skin retouch that keeps texture", dur: 13, d: "Frequency separation used correctly — no plastic skin." },
        { id: "ps-4-4", t: "Product cleanup: edges, dust & reflections", dur: 11, d: "E-commerce and campaign product standards." },
      ],
    },
    {
      n: "05",
      t: "Compositing & Campaign Craft",
      lessons: [
        { id: "ps-5-1", t: "Building a key visual: composition & hierarchy", dur: 13, d: "Where the eye goes first, second, third — on purpose." },
        { id: "ps-5-2", t: "Blending modes in real work", dur: 12, d: "The six modes professionals actually use." },
        { id: "ps-5-3", t: "Shadows & grounding objects", dur: 13, d: "Contact shadows, cast shadows, ambient occlusion by hand." },
        { id: "ps-5-4", t: "Typography inside the image", dur: 12, d: "Integrating headlines so they belong to the scene." },
      ],
    },
    {
      n: "06",
      t: "Pro Workflow & Delivery",
      lessons: [
        { id: "ps-6-1", t: "Smart mockups & templating", dur: 13, d: "Build once, swap artwork in seconds." },
        { id: "ps-6-2", t: "Actions & batch processing", dur: 11, d: "Automate the boring 40% of every job." },
        { id: "ps-6-3", t: "Export science: web, print & social", dur: 12, d: "Color profiles, sizes and compression that keep quality." },
        { id: "ps-6-4", t: "Final project walkthrough: campaign visual", dur: 14, d: "I build a full KV live — then you build yours." },
      ],
    },
  ],
  quiz: [
    { q: "You need to edit a placed logo repeatedly without quality loss. What do you use?", opts: ["Rasterize the layer", "A smart object", "Flatten and re-import", "Index the colors"], a: 1 },
    { q: "Which tool gives channel-level color control in one panel?", opts: ["Brightness/Contrast", "Vibrance", "Curves", "Posterize"], a: 2 },
    { q: "Hair on a busy background is best selected with…", opts: ["Polygonal lasso", "Select & Mask refine tools", "Magic wand at tolerance 100", "Rectangle marquee"], a: 1 },
    { q: "Frequency separation splits an image into…", opts: ["Shadows and highlights", "Texture and color/tone", "RGB and CMYK", "Vector and raster"], a: 1 },
    { q: "An object composited into a scene looks 'floating'. The usual fix is…", opts: ["More saturation", "A contact shadow and matched light direction", "A bigger canvas", "Sharpening"], a: 1 },
    { q: "For social exports you should convert to which color profile?", opts: ["CMYK Coated", "sRGB", "ProPhoto RGB", "Grayscale"], a: 1 },
  ],
  projects: [
    { t: "The Impossible Cutout", d: "Extract a model with flyaway hair from a patterned background and place her in a new scene." },
    { t: "Cinematic Grade", d: "Take one flat photo through three distinct premium grades: warm editorial, cold thriller, golden-hour ad." },
    { t: "Product Hero Shot", d: "Clean, retouch and re-light an e-commerce product to campaign standard." },
    { t: "Mini Key Visual", d: "Composite a 3-source KV with typography, shadows and a unified grade." },
  ],
  resources: [
    { t: "Layered PSD source files (all modules)", type: "PSD", note: "Every working file from the lessons." },
    { t: "Retouch checklist & order of operations", type: "PDF", note: "Print it, tape it next to your screen." },
    { t: "Curves & grading cheat sheet", type: "PDF", note: "The recipes from Module 03." },
    { t: "Action pack: sharpen, export, contact sheet", type: "ZIP", note: "My personal automation set." },
  ],
  finalProject: {
    t: "Full Campaign Key Visual",
    d: "Art-direct and build a complete key visual for a fictional brand brief: sourcing, compositing, grading, typography and delivery masters.",
    deliverables: ["Layered master PSD", "Print-ready TIFF", "3 social crops (1:1, 4:5, 9:16)", "One-line rationale of your visual concept"],
  },
  faq: [
    { q: "Do I need a powerful computer?", a: "No — every technique in the course runs on any machine that can install Photoshop CC. Large composites are taught with performance tips included." },
    { q: "Which Photoshop version do I need?", a: "Any Creative Cloud version from 2022 onward. Nothing in the course depends on beta-only features." },
    { q: "Is this for photographers or designers?", a: "Designers first — the course is built around campaign and social production, not photo library management. Photographers who retouch will still benefit." },
    { q: "What do I walk away with?", a: "A complete campaign key visual you built yourself — reviewed personally — plus the working files and delivery masters. Your first real portfolio piece, not a watch history." },
  ],
  reviews: [
    { name: "Nour El-Sayed", role: "Social media designer, Cairo", text: "The masking module alone paid for the course. My cutouts stopped looking like stickers within a week.", stars: 5 },
    { name: "Omar Farouk", role: "Freelance retoucher", text: "Finally someone teaching order of operations instead of random tricks. My files are cleaner and clients noticed.", stars: 5 },
    { name: "Sarah Mahmoud", role: "Marketing team designer", text: "I came for retouching, stayed for the compositing. The KV project is now the first piece in my portfolio.", stars: 4 },
  ],
  rating: 4.9,
  ratingCount: 118,
  students: 480,
};

// ---- 02 · Adobe Illustrator ----------------------------------------------
export const illustrator: Course = {
  slug: "adobe-illustrator",
  index: "02",
  glyph: "Ai",
  title: {
    en: "Illustrator Foundations — Vectors, Logos & Brand Systems",
    ar: "أساسيات إليستريتور — فيكتور ولوجوهات وأنظمة برندات",
  },
  short: { en: "Adobe Illustrator", ar: "أدوبي إليستريتور" },
  tagline: {
    en: "Draw with intent: from your first path to a logo clients sign off.",
    ar: "ارسم بقصد: من أول Path لحد لوجو العميل يوافق عليه.",
  },
  desc: {
    en: "Vector design taught the way brand studios work: geometry, optical corrections, lockups and delivery. You leave with a complete mini identity built with your own hands — not traced, constructed.",
    ar: "تصميم الفيكتور بنفس طريقة شغل استوديوهات البرندنج: هندسة وتصحيحات بصرية وLockups وتسليم. هتخرج بهوية مصغرة كاملة بنيتها بإيدك — مش Trace، بناء حقيقي.",
  },
  level: { en: "Zero → Professional", ar: "من الصفر → للاحتراف" },
  audience: {
    en: "Beginners and social designers who want real logo and identity skills — the highest-paid corner of graphic design.",
    ar: "المبتدئين ومصممي السوشيال اللي عايزين مهارات لوجو وهوية حقيقية — أعلى تخصص أجرًا في التصميم الجرافيكي.",
  },
  price: 0,
  cover: "/work/fresh-valley/marks.webp",
  icon: "/lms/icons/ai.webp",
  plate: ["#33000C", "#FF9A00"],
  outcomes: [
    "Draw any mark with the pen tool — confidently, not accidentally",
    "Construct logos with grids, geometry and optical corrections",
    "Build full lockup systems: horizontal, stacked, icon-only",
    "Master global colors, tints and brand palettes",
    "Package files a printer or client can actually open",
  ],
  tools: ["Adobe Illustrator"],
  path: [
    { t: "Think in vectors", d: "Shapes, booleans and the Appearance panel." },
    { t: "Draw anything", d: "Pen mastery and anchor-point economy." },
    { t: "Construct a mark", d: "Geometry, grids and optical corrections." },
    { t: "Systemize it", d: "Color, type and pattern into a brand kit." },
    { t: "Deliver it", d: "Exports, formats and a mini brand sheet." },
  ],
  modules: [
    {
      n: "01",
      t: "Vector Thinking",
      lessons: [
        { id: "il-1-1", t: "Why vectors run brand design", dur: 12, d: "Raster vs vector — and why every logo you love is math.", free: true },
        { id: "il-1-2", t: "Artboards, shapes & boolean logic", dur: 12, d: "Build complex forms from primitive shapes.", free: true },
        { id: "il-1-3", t: "Pathfinder & Shape Builder mastery", dur: 13, d: "The two panels that construct 80% of professional marks." },
        { id: "il-1-4", t: "Strokes, corners & the Appearance panel", dur: 12, d: "Non-destructive styling most designers never learn." },
      ],
    },
    {
      n: "02",
      t: "Drawing & the Pen",
      lessons: [
        { id: "il-2-1", t: "Pen tool bootcamp: lines to curves", dur: 12, d: "The drills that make the pen feel natural in days." },
        { id: "il-2-2", t: "Curvature tool & anchor economy", dur: 13, d: "Fewer points, smoother curves — the mark of a pro file." },
        { id: "il-2-3", t: "Tracing like a designer, not autotrace", dur: 12, d: "Redraw references with intention and better geometry." },
        { id: "il-2-4", t: "Grids, guides & pixel-perfect geometry", dur: 12, d: "Set up construction grids like the big identity studios." },
        { id: "il-2-5", t: "Custom lettering foundations", dur: 12, d: "Modify type into ownable wordmarks." },
      ],
    },
    {
      n: "03",
      t: "Logo Construction",
      lessons: [
        { id: "il-3-1", t: "From brief to sketches", dur: 13, d: "Concept routes: literal, abstract, lettermark, combination." },
        { id: "il-3-2", t: "Building marks with geometry", dur: 12, d: "Circles, ratios and the construction lines behind famous logos." },
        { id: "il-3-3", t: "Optical corrections the eye demands", dur: 12, d: "Overshoot, visual weight, and why math alone looks wrong." },
        { id: "il-3-4", t: "Logo variations & lockups", dur: 12, d: "Primary, secondary, icon, monochrome — the full family." },
        { id: "il-3-5", t: "Testing at sizes: favicon to billboard", dur: 12, d: "Stress-test legibility before the client does." },
      ],
    },
    {
      n: "04",
      t: "Color, Type & Layout",
      lessons: [
        { id: "il-4-1", t: "Brand palettes: swatches, tints & global colors", dur: 12, d: "Change one swatch, update the whole system." },
        { id: "il-4-2", t: "Typography pairing & customization", dur: 12, d: "Choose and refine type that matches the mark's voice." },
        { id: "il-4-3", t: "Patterns & repeat systems", dur: 12, d: "Brand patterns that scale across packaging and social." },
        { id: "il-4-4", t: "Social & print layouts in Illustrator", dur: 12, d: "When Illustrator beats Photoshop for layout — and how." },
      ],
    },
    {
      n: "05",
      t: "Delivery & Systems",
      lessons: [
        { id: "il-5-1", t: "Preparing files clients can open", dur: 12, d: "Outlines, embedded links and version-safe saves." },
        { id: "il-5-2", t: "Export: SVG, PDF/X & packaging", dur: 11, d: "Every format a client or printer will ever ask for." },
        { id: "il-5-3", t: "The mini brand sheet", dur: 12, d: "Present logo, palette, type and usage on one elegant board." },
        { id: "il-5-4", t: "Final project walkthrough: full identity", dur: 11, d: "I construct a complete mark live, brief to delivery." },
      ],
    },
  ],
  quiz: [
    { q: "Combining two overlapping circles into one shape uses…", opts: ["Clipping mask", "Pathfinder Unite", "Rasterize", "Blend tool"], a: 1 },
    { q: "A professional vector curve should use…", opts: ["As many anchor points as possible", "The fewest anchor points that hold the shape", "Only straight segments", "Auto-trace output"], a: 1 },
    { q: "'Optical correction' in logo design means…", opts: ["Fixing screen calibration", "Adjusting shapes so they look right even if the math is off", "Using only geometric fonts", "Adding gradients"], a: 1 },
    { q: "Global colors are powerful because…", opts: ["They render faster", "Editing the swatch updates every object using it", "They convert to CMYK automatically", "They're required for SVG"], a: 1 },
    { q: "Before sending a logo to a client who has no fonts installed, you…", opts: ["Rasterize the text", "Convert type to outlines in a copy", "Use only system fonts", "Send a screenshot"], a: 1 },
    { q: "For a logo used on the web at any size, the ideal format is…", opts: ["JPG", "SVG", "TIFF", "BMP"], a: 1 },
  ],
  projects: [
    { t: "Boolean Beast", d: "Construct 5 pictogram marks using only primitive shapes and Pathfinder — no pen tool allowed." },
    { t: "Pen Gauntlet", d: "Redraw 3 curved references with minimum anchor points; compare against the provided pro versions." },
    { t: "Lettermark Lab", d: "Turn your own initials into a constructed monogram with a visible grid system." },
  ],
  resources: [
    { t: "Construction grid templates", type: "AI", note: "The grids used in every Module 03 lesson." },
    { t: "Pen tool drill sheets", type: "PDF", note: "Printable practice paths, easy to brutal." },
    { t: "Logo presentation mockup kit", type: "ZIP", note: "Show your marks like a studio would." },
    { t: "Brand sheet template", type: "AI", note: "The one-board mini guideline from Module 05." },
  ],
  finalProject: {
    t: "Mini Brand Identity",
    d: "Design a complete mini identity for a fictional café or startup: mark construction, lockup family, palette, type pairing and a one-board brand sheet.",
    deliverables: ["Logo family (AI + SVG + PNG)", "Construction grid artboard", "One-board brand sheet PDF", "Favicon and social avatar exports"],
  },
  faq: [
    { q: "Is the pen tool really learnable?", a: "Yes — it's drills, not talent. Module 02 gives you a training progression that makes curves feel natural within days of practice." },
    { q: "Photoshop or Illustrator first?", a: "They solve different problems: Illustrator for anything that must scale (logos, icons, print), Photoshop for anything made of pixels. This course makes you dangerous in the first camp." },
    { q: "Will I be able to charge for logo work after this?", a: "You'll have the construction skills and one complete identity project. Combine it with the final-project critique and you have a legitimate first portfolio piece." },
    { q: "Does it cover AI features?", a: "Where they help real workflows, yes — but the core is the vector craft that AI tools still can't replace: construction, correction and taste." },
  ],
  reviews: [
    { name: "Youssef Adel", role: "Junior designer, Alexandria", text: "The construction grid lessons changed how I see every logo on the street. I finally understand the 'why'.", stars: 5 },
    { name: "Mariam Hassan", role: "Freelancer", text: "Sold my first paid logo three weeks after finishing. The brand sheet template made me look way more senior than I am.", stars: 5 },
    { name: "Karim Nabil", role: "Motion designer", text: "Took it to fix my messy vector files before animating them. Anchor economy module = life changing.", stars: 4 },
  ],
  rating: 4.8,
  ratingCount: 92,
  students: 350,
};
