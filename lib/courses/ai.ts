import type { Course } from "./types";

// ---- 06 · AI Photoshoot & Prompt Engineering (premium flagship) -------------
// Expanded from the original portfolio course track — same DNA, full ecosystem.
export const aiPhotoshoot: Course = {
  slug: "ai-photoshoot",
  index: "06",
  glyph: "A·i",
  title: {
    en: "AI Photoshoot & Prompt Engineering — Campaigns Without a Camera",
    ar: "جلسة تصوير بالذكاء الاصطناعي وهندسة البرومبت — حملات من غير كاميرا",
  },
  short: { en: "AI Photoshoot", ar: "التصوير بالذكاء الاصطناعي" },
  tagline: {
    en: "Direct full campaign photoshoots with AI — the skill clients pay premium for.",
    ar: "أخرج جلسات تصوير حملات كاملة بالذكاء الاصطناعي — المهارة اللي العملاء بيدفعوا فيها بريميوم.",
  },
  desc: {
    en: "The course that built real campaigns: prompt engineering with a photographer's vocabulary, generating and curating hero frames, then finishing in Photoshop to a standard clients sign. This is the exact pipeline behind paid client work — taught end to end, including how to price it.",
    ar: "الكورس اللي اتبنت بيه حملات حقيقية: هندسة برومبت بمفردات المصور المحترف، توليد واختيار اللقطات البطلة، وبعدين التشطيب في فوتوشوب لمستوى العميل يمضي عليه. ده نفس خط الإنتاج ورا شغل عملاء مدفوع — متشرح من الأول للآخر، وبتتعلم تسعّره كمان.",
  },
  level: { en: "Zero → Professional", ar: "من الصفر → للاحتراف" },
  audience: {
    en: "Designers, marketers and creative teams who need premium visuals without production budgets.",
    ar: "المصممين والماركترز والفرق الإبداعية اللي محتاجين Visuals بريميوم من غير ميزانيات إنتاج.",
  },
  price: 1750,
  compareAt: 2500,
  cover: "/lms/featured-banner.jpg",
  showcase: {
    images: [
      "/work/axia/banner-her.webp",
      "/work/axia/insta-2.webp",
      "/work/tilal/02.webp",
      "/work/secure/cover.webp",
      "/work/axia/insta-4.webp",
      "/work/tilal/10.webp",
      "/work/secure/wide.webp",
      "/work/misc/24.webp",
    ],
  },
  outcomes: [
    "A repeatable prompt-to-photoshoot workflow",
    "A photographer's vocabulary: light, lens, composition — in prompts",
    "Curation instincts: picking hero frames from hundreds",
    "Retouch & grading that makes AI output read premium",
    "A campaign-ready set delivered like a studio would",
  ],
  tools: ["Midjourney / Freepik AI", "Adobe Photoshop", "Magnific / upscalers"],
  path: [
    { t: "See like a photographer", d: "Light, lens and composition literacy." },
    { t: "Engineer the prompt", d: "Structure, style control and consistency." },
    { t: "Generate & curate", d: "Batches, hero frames and upscaling." },
    { t: "Finish like a studio", d: "Retouch, grade and campaign delivery." },
  ],
  modules: [
    {
      n: "01",
      t: "Seeing Like a Photographer",
      lessons: [
        { id: "ap-1-1", t: "What makes an AI photoshoot look real", dur: 13, d: "Reading light, lens and composition like a photographer.", free: true },
        { id: "ap-1-2", t: "Light direction, quality & mood", dur: 13, d: "The lighting vocabulary that drives believable prompts.", free: true },
        { id: "ap-1-3", t: "References & moodboards", dur: 13, d: "Sourcing and steering the model toward your direction." },
      ],
    },
    {
      n: "02",
      t: "Prompt Engineering",
      lessons: [
        { id: "ap-2-1", t: "Prompt structure: subject · scene · lens · light · mood · constraints", dur: 13, d: "The six-slot formula behind every controlled generation.", free: true },
        { id: "ap-2-2", t: "Building the shot: framing & lens language", dur: 13, d: "85mm portrait vs 24mm environmental — say it, get it." },
        { id: "ap-2-3", t: "Style control & set consistency", dur: 13, d: "Same look across 12 frames — the campaign requirement." },
        { id: "ap-2-4", t: "Negative prompts & failure modes", dur: 12, d: "Hands, text, artifacts — diagnose and fix systematically." },
      ],
    },
    {
      n: "03",
      t: "Generate & Curate",
      lessons: [
        { id: "ap-3-1", t: "Batching variations & selecting hero frames", dur: 13, d: "Generate wide, choose narrow — a curator's process." },
        { id: "ap-3-2", t: "Upscaling & detail passes", dur: 13, d: "From preview quality to print-capable files." },
        { id: "ap-3-3", t: "Character & product consistency", dur: 13, d: "The same face, the same bottle — across a whole set." },
      ],
    },
    {
      n: "04",
      t: "Finish Like a Studio",
      lessons: [
        { id: "ap-4-1", t: "Retouch & compositing in Photoshop", dur: 13, d: "Fixing hands, edges and details AI gets wrong." },
        { id: "ap-4-2", t: "Color grading the set", dur: 13, d: "One consistent, premium grade across every frame." },
        { id: "ap-4-3", t: "Delivering a campaign set", dur: 13, d: "Exports, ratios and a clean client handoff." },
        { id: "ap-4-4", t: "Final project walkthrough: full AI campaign", dur: 12, d: "I produce a complete branded shoot live — brief to delivery." },
      ],
    },
  ],
  quiz: [
    { q: "The six-slot prompt formula is subject · scene · lens · light · ____ · constraints.", opts: ["Resolution", "Mood", "Seed", "Aspect"], a: 1 },
    { q: "For an intimate portrait with soft background blur you'd prompt…", opts: ["24mm wide angle", "85mm portrait lens", "Fisheye", "Drone shot"], a: 1 },
    { q: "AI generated a great frame but ruined the hands. Professional fix:", opts: ["Ship it anyway", "Retouch/composite in Photoshop", "Lower the resolution", "Add a watermark"], a: 1 },
    { q: "Set consistency across 12 frames comes mostly from…", opts: ["Luck", "Locked style tokens, seeds and reference images", "Generating once", "Higher resolution"], a: 1 },
    { q: "Before print delivery, AI images usually need…", opts: ["Nothing", "Upscaling and a detail pass", "Conversion to GIF", "More saturation"], a: 1 },
    { q: "A moodboard's job in AI production is…", opts: ["Decoration", "Steering generations toward one art direction", "Client billing", "File storage"], a: 1 },
  ],
  projects: [
    { t: "One Product, Three Worlds", d: "Shoot the same product in studio, lifestyle and cinematic settings — one consistent brand look." },
    { t: "The Casting Call", d: "Create one consistent character across 6 different scenes and poses." },
    { t: "Fix the Fails", d: "Take 5 provided broken generations and rescue them in Photoshop." },
  ],
  resources: [
    { t: "The six-slot prompt sheet", type: "TXT", note: "Copy-paste prompt scaffolds from Module 02." },
    { t: "Lens & light vocabulary card", type: "PDF", note: "Photography language for prompt writers." },
    { t: "Curation checklist", type: "PDF", note: "How I pick hero frames from hundreds." },
    { t: "Retouch source files", type: "PSD", note: "The Module 04 working files." },
  ],
  finalProject: {
    t: "Full AI Campaign Set",
    d: "Produce a 6-frame campaign photoshoot for a brand of your choice: moodboard, prompt system, curated hero frames, retouch, grade and delivery.",
    deliverables: ["6 finished campaign frames", "Your reusable prompt system", "Moodboard + art direction note", "Social crops of the hero frame"],
  },
  faq: [
    { q: "Why is this course priced premium?", a: "Because it's the money skill. AI photoshoots replace studio budgets — one approved client brief covers the course several times over. The course includes the pricing and positioning lessons to make that happen, and the software craft courses on the platform are free so your budget goes where the earning is." },
    { q: "Which AI tool does it use?", a: "The method is tool-agnostic — prompts are taught as photography direction, which transfers across Midjourney, Freepik, Firefly and whatever ships next." },
    { q: "Do I need Photoshop?", a: "For Module 04, yes — any recent version. Modules 01–03 need only a generation tool." },
    { q: "Is AI imagery actually used in real campaigns?", a: "The cover of this course is from a real client campaign produced exactly this way. That's the standard the course teaches to." },
  ],
  reviews: [
    { name: "Rana Sherif", role: "Brand designer", text: "I pitched an AI photoshoot to a client the week after the prompt module. They approved it over the studio quote.", stars: 5 },
    { name: "Amr Hany", role: "Marketer", text: "Better structured than any course I've bought. The six-slot formula is stuck in my head permanently — and it closed my first AI brief.", stars: 5 },
    { name: "Nadine Fouad", role: "Art student", text: "The curation lesson changed how I look at my own generations. Less volume, more taste.", stars: 5 },
  ],
  rating: 4.9,
  ratingCount: 260,
  students: 1200,
};

// ---- 07 · AI Video Generation ----------------------------------------------
export const aiVideo: Course = {
  slug: "ai-video-generation",
  index: "07",
  glyph: "A·v",
  title: {
    en: "AI Video Generation — From Prompt to Finished Cut",
    ar: "توليد الفيديو بالذكاء الاصطناعي — من البرومبت للمونتاج النهائي",
  },
  short: { en: "AI Video", ar: "فيديو الذكاء الاصطناعي" },
  tagline: {
    en: "Direct AI like a film crew — and deliver spots clients approve.",
    ar: "أخرج بالذكاء الاصطناعي كأنه فريق تصوير — وسلّم إعلانات العميل يوافق عليها.",
  },
  desc: {
    en: "The complete AI video pipeline I use for client work: directing motion with prompts, blending generated shots with stock, and cutting it all into a finished spot in Premiere Pro. From a text idea to a deliverable film.",
    ar: "خط إنتاج الفيديو بالذكاء الاصطناعي الكامل اللي بستخدمه في شغل العملاء: إخراج الحركة بالبرومبت، دمج اللقطات المولّدة مع الستوك، ومونتاج كل ده لإعلان نهائي في بريمير برو. من فكرة مكتوبة لفيلم يتسلّم.",
  },
  level: { en: "Zero → Professional", ar: "من الصفر → للاحتراف" },
  audience: {
    en: "Designers and editors who want to sell AI video — the fastest-growing deliverable in advertising.",
    ar: "المصممين والمونتيرية اللي عايزين يبيعوا فيديو AI — أسرع منتج نموًا في الإعلانات.",
  },
  price: 2250,
  compareAt: 3200,
  cover: "/work/tilal/hero.webp",
  coverVideo: "/lms/reels/video-1.mp4",
  showcase: {
    videos: [
      "/lms/reels/coffee-ad.mp4",
      "/lms/reels/reel-c.mp4",
      "/lms/reels/tilal-aerial.mp4",
      "/lms/reels/reel-e.mp4",
      "/lms/reels/space.mp4",
      "/lms/reels/reel-d.mp4",
    ],
  },
  outcomes: [
    "Prompt motion with camera language: pans, pushes, speed",
    "Storyboard a spot before generating a single frame",
    "Blend AI shots with stock so nobody spots the seam",
    "Cut, grade and mix a finished spot in Premiere Pro",
    "Present and price AI video work to clients",
  ],
  tools: ["AI video models (Seedance, Kling, Runway)", "Adobe Premiere Pro", "Adobe Photoshop"],
  path: [
    { t: "Direct the motion", d: "Camera language and references." },
    { t: "Source & generate", d: "Stock prep and driving the models." },
    { t: "Cut the film", d: "Assembly, sound and grade in Premiere." },
    { t: "Ship & sell", d: "Masters, ratios and client presentation." },
  ],
  modules: [
    {
      n: "01",
      t: "Directing AI Motion",
      lessons: [
        { id: "av-1-1", t: "Prompt engineering for video: motion & camera language", dur: 17, d: "Shot length, movement and lensing — written as direction.", free: true },
        { id: "av-1-2", t: "Gathering references that define look & pace", dur: 16, d: "Build a reference edit before generating anything." },
        { id: "av-1-3", t: "Storyboarding a 30-second spot", dur: 16, d: "Beats, shots and the generation shot-list." },
      ],
    },
    {
      n: "02",
      t: "Source & Generate",
      lessons: [
        { id: "av-2-1", t: "Sourcing & preparing stock to blend", dur: 16, d: "Finding, cleaning and grading stock to sit beside AI shots." },
        { id: "av-2-2", t: "Driving video-gen models to usable shots", dur: 17, d: "Iteration strategy: from mush to on-brand footage." },
        { id: "av-2-3", t: "Image-to-video: animating stills", dur: 16, d: "Turn AI photoshoot frames into moving shots." },
      ],
    },
    {
      n: "03",
      t: "The Edit",
      lessons: [
        { id: "av-3-1", t: "Assembly & pacing in Premiere Pro", dur: 16, d: "Selects, structure and a rhythm that hides generation limits." },
        { id: "av-3-2", t: "Sound, music & mix", dur: 16, d: "The half of AI video everyone forgets." },
        { id: "av-3-3", t: "Grade & finish for consistency", dur: 16, d: "One look across AI, stock and graphics." },
      ],
    },
    {
      n: "04",
      t: "Ship It",
      lessons: [
        { id: "av-4-1", t: "Ratios, captions & platform masters", dur: 16, d: "Every deliverable a campaign actually needs." },
        { id: "av-4-2", t: "Presenting & pricing AI video", dur: 16, d: "Position the work, handle the 'is it AI?' question, price it." },
        { id: "av-4-3", t: "Final project walkthrough: finished AI spot", dur: 17, d: "I produce a complete 30-second spot live — brief to master." },
      ],
    },
  ],
  quiz: [
    { q: "'Slow push-in on subject, 35mm, handheld feel' is an example of…", opts: ["A render setting", "Camera language in a video prompt", "An export preset", "A LUT"], a: 1 },
    { q: "Before generating shots for a spot, professionals build…", opts: ["A logo", "A storyboard and shot list", "A caption file", "A thumbnail"], a: 1 },
    { q: "AI shots and stock footage sit together convincingly when…", opts: ["Both are 4K", "They share one grade and consistent motion pacing", "AI shots come first", "You add transitions"], a: 1 },
    { q: "The most commonly neglected half of AI video is…", opts: ["Resolution", "Sound design and mix", "Watermarks", "File naming"], a: 1 },
    { q: "A generated shot is almost right but drifts at the end. You…", opts: ["Regenerate 50 times", "Cut before the drift — editing hides limits", "Slow it to 10%", "Add text over it"], a: 1 },
    { q: "When a client asks 'is this AI?', the professional answer is…", opts: ["Deny it", "Explain the directed pipeline and where craft was applied", "Change the subject", "Refund them"], a: 1 },
  ],
  projects: [
    { t: "Reference Cut", d: "Build a 20-second reference edit from existing films that defines your spot's look and pace." },
    { t: "Hybrid Sequence", d: "Cut a 15-second sequence mixing 2 AI shots with 2 stock shots — invisible seams." },
    { t: "Still to Motion", d: "Animate 3 frames from an AI photoshoot into usable video shots." },
  ],
  resources: [
    { t: "Video prompt scaffolds", type: "TXT", note: "Camera-language templates from Module 01." },
    { t: "Storyboard & shot-list template", type: "PDF", note: "The pre-production sheet from Module 01." },
    { t: "Premiere project template", type: "PRPROJ", note: "The exact timeline structure from Module 03." },
    { t: "Client presentation deck template", type: "PDF", note: "How I present AI work from Module 04." },
  ],
  finalProject: {
    t: "30-Second AI Brand Spot",
    d: "Produce a complete branded spot: storyboard, generated + stock footage, edit, sound, grade and platform masters — the full pipeline, solo.",
    deliverables: ["30s master + 9:16 vertical", "Storyboard and shot list", "Project file with organized timeline", "One-slide pipeline explanation for clients"],
  },
  faq: [
    { q: "Which AI video tools does the course use?", a: "The direction method is model-agnostic and demonstrated across current leaders (Seedance, Kling, Runway). When models change — and they will — the directing skills transfer." },
    { q: "Do I need editing experience?", a: "No — Module 03 teaches the exact Premiere skills the pipeline needs. If you want deeper editing craft, the Premiere Pro course pairs perfectly." },
    { q: "How do subscriptions/credits work cost-wise?", a: "Module 04 includes the real economics: what a spot costs in credits, how to budget generations, and how to price the work so margins stay healthy." },
    { q: "What do I walk away with?", a: "A finished 30-second AI spot — reviewed personally — plus the storyboard system, the Premiere template and the client-presentation deck. A sellable service, not a watch history." },
  ],
  reviews: [
    { name: "Khaled Emad", role: "Freelance designer", text: "Sold my first AI video spot for more than my monthly salary. The pricing lesson gave me the confidence to quote it.", stars: 5 },
    { name: "Aya Tamer", role: "Agency editor", text: "The hybrid stock+AI approach is the trick nobody talks about. Our clients can't tell — and the briefs keep coming.", stars: 5 },
    { name: "Sherif Lotfy", role: "Videographer", text: "Came in skeptical, left with a new service line. The storyboard-first discipline is what makes it professional.", stars: 4 },
  ],
  rating: 4.8,
  ratingCount: 140,
  students: 640,
};
