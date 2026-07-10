import type { Course } from "./types";

// ---- 03 · Adobe After Effects ---------------------------------------------
export const aftereffects: Course = {
  slug: "adobe-after-effects",
  index: "03",
  glyph: "Ae",
  title: {
    en: "After Effects in Motion — Animation, Kinetic Type & Brand Motion",
    ar: "أفتر إفكتس — موشن جرافيك وكاينتك تايبوجرافي وموشن برندات",
  },
  short: { en: "Adobe After Effects", ar: "أدوبي أفتر إفكتس" },
  tagline: {
    en: "Make design move — from your first keyframe to logo reveals that sell.",
    ar: "خلّي التصميم يتحرك — من أول Keyframe لحد Logo Reveal يتباع.",
  },
  desc: {
    en: "Motion design from absolute zero: keyframes, easing, shape layers, kinetic type and brand motion — built on the same reels I deliver to clients. You'll animate something real in the first hour.",
    ar: "موشن ديزاين من الصفر تمامًا: Keyframes وEasing وShape Layers وKinetic Type وموشن للبرندات — مبني على نفس الشغل اللي بسلّمه لعملاء حقيقيين. هتحرّك حاجة حقيقية في أول ساعة.",
  },
  level: { en: "Zero → Professional", ar: "من الصفر → للاحتراف" },
  audience: {
    en: "Graphic designers who want the motion skills clients keep asking for — no prior animation experience needed.",
    ar: "مصممين الجرافيك اللي عايزين مهارات الموشن اللي العملاء بيطلبوها — من غير أي خبرة سابقة في التحريك.",
  },
  price: 0,
  cover: "/work/secure/hero.webp",
  outcomes: [
    "Animate with real easing — nothing linear, nothing robotic",
    "Build shape-layer animations and kinetic typography systems",
    "Design logo reveals with professional timing grammar",
    "Structure precomps so complex projects stay editable",
    "Render correct masters for every platform, including Lottie",
  ],
  tools: ["Adobe After Effects", "Adobe Media Encoder"],
  path: [
    { t: "Feel the timeline", d: "Keyframes, easing and the graph editor." },
    { t: "Learn the physics", d: "Animation principles applied inside AE." },
    { t: "Move the type", d: "Shape layers and kinetic typography." },
    { t: "Build the system", d: "Masks, mattes, precomps and effects." },
    { t: "Brand in motion", d: "Logo reveals, transitions, sound and render." },
  ],
  modules: [
    {
      n: "01",
      t: "Motion Foundations",
      lessons: [
        { id: "ae-1-1", t: "Compositions, layers & the AE mental model", dur: 12, d: "How AE thinks — and how not to fight it.", free: true },
        { id: "ae-1-2", t: "Keyframes: your first animation", dur: 13, d: "Position, scale, rotation, opacity — animated properly.", free: true },
        { id: "ae-1-3", t: "Easing & the graph editor", dur: 14, d: "The single skill that separates amateurs from professionals." },
        { id: "ae-1-4", t: "Anchor points & transform discipline", dur: 11, d: "Why your rotations look wrong — and the 10-second fix." },
      ],
    },
    {
      n: "02",
      t: "Animation Principles in AE",
      lessons: [
        { id: "ae-2-1", t: "Timing & spacing", dur: 13, d: "Disney's principles translated to interface motion." },
        { id: "ae-2-2", t: "Overshoot, follow-through & anticipation", dur: 12, d: "Make motion feel alive instead of mechanical." },
        { id: "ae-2-3", t: "Motion-curve recipes", dur: 13, d: "My saved graph-editor curves for entrances, exits, emphasis." },
        { id: "ae-2-4", t: "Parenting & null objects", dur: 12, d: "Rig layered movement without keyframing everything." },
      ],
    },
    {
      n: "03",
      t: "Shape Layers & Kinetic Type",
      lessons: [
        { id: "ae-3-1", t: "Shape layers deep dive", dur: 13, d: "Fills, strokes, paths — the vector engine inside AE." },
        { id: "ae-3-2", t: "Trim paths & repeaters", dur: 12, d: "The two operators behind most motion graphics you admire." },
        { id: "ae-3-3", t: "Kinetic typography systems", dur: 13, d: "Word-by-word builds with rhythm and hierarchy." },
        { id: "ae-3-4", t: "Text animators", dur: 12, d: "Per-character animation without hand-keyframing letters." },
      ],
    },
    {
      n: "04",
      t: "Masks, Mattes & Architecture",
      lessons: [
        { id: "ae-4-1", t: "Masks & track mattes", dur: 13, d: "Reveal anything through anything." },
        { id: "ae-4-2", t: "Precomp architecture", dur: 12, d: "Structure projects so revisions take minutes, not nights." },
        { id: "ae-4-3", t: "The essential effects stack", dur: 12, d: "Glow, blur, displacement — used with restraint." },
        { id: "ae-4-4", t: "3D layers & cameras, the useful 20%", dur: 13, d: "Parallax and depth without the 3D rabbit hole." },
      ],
    },
    {
      n: "05",
      t: "Logo & Brand Motion",
      lessons: [
        { id: "ae-5-1", t: "Logo reveal grammar", dur: 13, d: "The five reveal archetypes clients actually buy." },
        { id: "ae-5-2", t: "Animating brand systems", dur: 12, d: "Turn static identities into motion languages." },
        { id: "ae-5-3", t: "Transitions pack: build your own", dur: 12, d: "Wipes, morphs and swipes for social edits." },
        { id: "ae-5-4", t: "Sound design & sync", dur: 13, d: "Hits, whooshes and why sound is half the animation." },
      ],
    },
    {
      n: "06",
      t: "Pipeline & Delivery",
      lessons: [
        { id: "ae-6-1", t: "Expressions starter kit", dur: 13, d: "Wiggle, loopOut, time — copy-paste power without coding fear." },
        { id: "ae-6-2", t: "Render settings & codecs demystified", dur: 12, d: "ProRes vs H.264 and what to send where." },
        { id: "ae-6-3", t: "Lottie & social exports", dur: 11, d: "Motion for apps, web and every aspect ratio." },
        { id: "ae-6-4", t: "Final project walkthrough: brand motion reel", dur: 14, d: "I build a 15-second brand animation live, start to render." },
      ],
    },
  ],
  quiz: [
    { q: "Motion feels robotic. The first thing to check is…", opts: ["Frame rate", "Easing on the keyframes", "Layer color labels", "Composition name"], a: 1 },
    { q: "To animate a line drawing itself on, you use…", opts: ["Opacity keyframes", "Trim Paths", "Motion blur", "Time remap"], a: 1 },
    { q: "Many layers must move together as one group. Best practice is…", opts: ["Keyframe each layer", "Parent them to a null object", "Merge all layers", "Use 40 precomps"], a: 1 },
    { q: "loopOut() as an expression will…", opts: ["Render the comp twice", "Repeat existing keyframes forever", "Reverse the layer", "Export a GIF"], a: 1 },
    { q: "A track matte lets you…", opts: ["Speed up renders", "Use one layer as the visibility shape of another", "Convert vectors to pixels", "Sync audio"], a: 1 },
    { q: "For a master file sent to an editor, you export…", opts: ["H.264 at low bitrate", "ProRes 422", "Animated GIF", "PNG sequence at 8fps"], a: 1 },
  ],
  projects: [
    { t: "Ease Everything", d: "Take one linear animation and re-time it into three moods: snappy UI, elegant luxury, playful bounce." },
    { t: "Kinetic Quote", d: "Animate a 10-word quote with rhythm, hierarchy and one signature moment." },
    { t: "Logo Reveal", d: "Design and animate a 5-second reveal for a provided logo — including sound." },
  ],
  resources: [
    { t: "Project files for every module", type: "AEP", note: "Open, dissect, break, rebuild." },
    { t: "Motion-curve recipe card", type: "PDF", note: "The graph-editor shapes from Module 02." },
    { t: "Expressions cheat sheet", type: "PDF", note: "Copy-paste snippets with plain-English notes." },
    { t: "Sound effects starter pack", type: "ZIP", note: "Licensed hits and whooshes used in the course." },
  ],
  finalProject: {
    t: "15-Second Brand Motion Reel",
    d: "Animate a complete brand moment for a fictional identity: logo reveal, kinetic type statement and a looping brand pattern — with sound.",
    deliverables: ["ProRes master + H.264 social cut", "Project file with clean precomp structure", "9:16 vertical adaptation", "One-line motion rationale"],
  },
  faq: [
    { q: "Is After Effects hard to learn?", a: "The interface is dense but the core is small: keyframes, easing, and structure. This course sequences that core so you're animating in lesson two, not week two." },
    { q: "Do I need to know Photoshop or Illustrator first?", a: "Helpful but not required. Any vector or layered artwork works, and the course includes ready-made design files for every exercise." },
    { q: "Can my laptop run AE?", a: "If it runs Photoshop comfortably it will handle everything in this course. Heavy 3D and simulations are deliberately out of scope." },
    { q: "Will this get me motion clients?", a: "Logo reveals, kinetic type and social motion are the three most-requested paid motion tasks — the course is built around exactly those." },
  ],
  reviews: [
    { name: "Ahmed Samir", role: "Graphic designer, Giza", text: "I'd opened AE five times and quit five times. The easing lesson finally made it click — now I deliver motion with every identity.", stars: 5 },
    { name: "Lina Mostafa", role: "Social media manager", text: "The transitions module upgraded our whole content calendar. Our reels finally look intentional.", stars: 5 },
    { name: "Hassan Tarek", role: "Freelance editor", text: "Precomp architecture lesson saved me on a real client revision the same week I watched it.", stars: 4 },
  ],
  rating: 4.9,
  ratingCount: 104,
  students: 410,
};

// ---- 04 · Adobe Premiere Pro ----------------------------------------------
export const premiere: Course = {
  slug: "adobe-premiere-pro",
  index: "04",
  glyph: "Pr",
  title: {
    en: "Premiere Pro Editing — Cut, Sound, Color & Delivery",
    ar: "مونتاج بريمير برو — قص وصوت وألوان وتسليم",
  },
  short: { en: "Adobe Premiere Pro", ar: "أدوبي بريمير برو" },
  tagline: {
    en: "Edit stories, not clips — a complete editor's workflow in 4 hours.",
    ar: "اعمل مونتاج لقصص مش مجرد لقطات — Workflow مونتير كامل في ٤ ساعات.",
  },
  desc: {
    en: "The complete editing craft: story-driven cutting, sound that carries emotion, color that looks graded not filtered, and delivery for every platform. Built from real brand edits, trimmed of everything you won't use.",
    ar: "حرفة المونتاج كاملة: قص مبني على الحكاية، صوت بيوصل الإحساس، ألوان شكلها Graded مش فلاتر، وتسليم لكل منصة. متبني من شغل برندات حقيقي ومتشال منه أي حاجة مش هتستخدمها.",
  },
  level: { en: "Zero → Professional", ar: "من الصفر → للاحتراف" },
  audience: {
    en: "Designers, marketers and creators who need professional edits for brands and social — fast.",
    ar: "المصممين والماركترز وصنّاع المحتوى اللي محتاجين مونتاج احترافي للبرندات والسوشيال — بسرعة.",
  },
  price: 0,
  cover: "/work/tilal/building.webp",
  outcomes: [
    "Cut with story logic — rhythm, motivation, breathing room",
    "Edit to music beats and mix VO, music and SFX properly",
    "Grade with Lumetri: correction first, look second",
    "Build titles and captions with the Essential Graphics panel",
    "Export the right master for every platform, every time",
  ],
  tools: ["Adobe Premiere Pro", "Adobe Media Encoder"],
  path: [
    { t: "Command the timeline", d: "Project setup and cutting fundamentals." },
    { t: "Cut with story", d: "Pacing, J/L cuts and motivated edits." },
    { t: "Carry it with sound", d: "Music, VO, ducking and platform loudness." },
    { t: "Grade the look", d: "Lumetri correction, matching and looks." },
    { t: "Ship every format", d: "Graphics, captions, exports and proxies." },
  ],
  modules: [
    {
      n: "01",
      t: "Edit Foundations",
      lessons: [
        { id: "pr-1-1", t: "Project setup & media management", dur: 12, d: "The folder structure that prevents 90% of editing pain.", free: true },
        { id: "pr-1-2", t: "Timeline surgery: tools & shortcuts", dur: 12, d: "Ripple, roll, slip, slide — with the shortcuts that matter.", free: true },
        { id: "pr-1-3", t: "Cuts that tell stories", dur: 12, d: "Why you cut, not just where — motivation and continuity." },
        { id: "pr-1-4", t: "J-cuts, L-cuts & pacing", dur: 12, d: "The invisible techniques behind every professional edit." },
      ],
    },
    {
      n: "02",
      t: "Sound & Music",
      lessons: [
        { id: "pr-2-1", t: "Audio cleanup essentials", dur: 12, d: "DeNoise, EQ and making location audio usable." },
        { id: "pr-2-2", t: "Editing to the beat", dur: 12, d: "Music-driven cutting for reels and brand films." },
        { id: "pr-2-3", t: "Voiceover & ducking", dur: 12, d: "Auto-ducking done right, plus manual finesse." },
        { id: "pr-2-4", t: "Mix levels for platforms", dur: 12, d: "LUFS targets for social, web and broadcast — simply explained." },
      ],
    },
    {
      n: "03",
      t: "Color & Look",
      lessons: [
        { id: "pr-3-1", t: "Lumetri fundamentals", dur: 12, d: "Scopes, exposure and white balance without guesswork." },
        { id: "pr-3-2", t: "Correction vs grade", dur: 12, d: "The two-pass discipline every colorist uses." },
        { id: "pr-3-3", t: "Matching shots", dur: 12, d: "Make three cameras look like one shoot." },
        { id: "pr-3-4", t: "Looks & LUT discipline", dur: 12, d: "Use LUTs as a starting point, never a crutch." },
      ],
    },
    {
      n: "04",
      t: "Graphics & Speed",
      lessons: [
        { id: "pr-4-1", t: "Essential Graphics & titles", dur: 12, d: "Branded titles and lower thirds, reusable as templates." },
        { id: "pr-4-2", t: "Speed ramps & time remapping", dur: 12, d: "The smooth ramps every brand reel uses." },
        { id: "pr-4-3", t: "Transitions with intent", dur: 12, d: "When to cut, when to move — and building clean transitions." },
        { id: "pr-4-4", t: "Captions & accessibility", dur: 12, d: "Auto-captions, styling and why they double watch time." },
      ],
    },
    {
      n: "05",
      t: "Delivery & Pipeline",
      lessons: [
        { id: "pr-5-1", t: "Export recipes per platform", dur: 12, d: "Instagram, TikTok, YouTube, client masters — exact settings." },
        { id: "pr-5-2", t: "Proxies & performance", dur: 12, d: "Edit 4K smoothly on modest machines." },
        { id: "pr-5-3", t: "Project organization at scale", dur: 12, d: "Versioning, archiving and handing off to other editors." },
        { id: "pr-5-4", t: "Final project walkthrough: 60-second brand edit", dur: 12, d: "I cut a complete brand film live — selects to master." },
      ],
    },
  ],
  quiz: [
    { q: "Audio starts before its video appears. That's a…", opts: ["L-cut", "J-cut", "Jump cut", "Match cut"], a: 1 },
    { q: "The correct order in color work is…", opts: ["Look first, correction second", "Correction first, look second", "LUT only", "Saturation first"], a: 1 },
    { q: "Editing 4K on a slow laptop, you should use…", opts: ["Lower timeline resolution only", "Proxies", "Render everything first", "Convert to GIF"], a: 1 },
    { q: "Music overpowering the voiceover is fixed with…", opts: ["Deleting the music", "Ducking", "More VO gain until it clips", "A different font"], a: 1 },
    { q: "For Instagram Reels you export…", opts: ["16:9 ProRes", "9:16 H.264", "4:3 DV", "1:1 TIFF sequence"], a: 1 },
    { q: "Slip tool changes…", opts: ["Clip position on the timeline", "Which part of the source plays, keeping duration", "Playback speed", "Audio pitch"], a: 1 },
  ],
  projects: [
    { t: "The Rhythm Cut", d: "Cut a 30-second montage to a provided track — every edit motivated by the music." },
    { t: "Interview Rescue", d: "Clean, cut and duck a messy interview into a tight 45-second story." },
    { t: "Shot Match Lab", d: "Match three mismatched clips into one coherent graded scene." },
  ],
  resources: [
    { t: "Practice footage pack (4K + music + VO)", type: "ZIP", note: "Licensed media for every exercise." },
    { t: "Export recipe cards", type: "PDF", note: "Platform-by-platform settings from Module 05." },
    { t: "Keyboard shortcut map", type: "PDF", note: "The editor's muscle-memory sheet." },
    { t: "Branded title templates", type: "PRPROJ", note: "The Essential Graphics templates from Module 04." },
  ],
  finalProject: {
    t: "60-Second Brand Film",
    d: "Edit a complete brand film from provided rushes: story structure, beat-driven cutting, mixed sound, matched grade and platform masters.",
    deliverables: ["16:9 master + 9:16 vertical cut", "Mixed audio at platform loudness", "Styled captions file", "Organized project archive"],
  },
  faq: [
    { q: "Premiere or CapCut?", a: "CapCut is fine for quick phone edits. Premiere is where paid work happens: client revisions, team handoffs, proper color and audio. This course makes the jump painless." },
    { q: "Do I need footage to practice?", a: "No — the course includes a licensed practice pack with 4K footage, music and voiceover for every module." },
    { q: "Will my laptop handle it?", a: "The proxies lesson exists exactly for this. You'll edit 4K smoothly on mid-range hardware." },
    { q: "Does it cover vertical video?", a: "Throughout — every project ships a 9:16 adaptation, because that's where your clients' audiences are." },
  ],
  reviews: [
    { name: "Mostafa Kamel", role: "Content creator", text: "The beat-editing lesson doubled the quality of my reels overnight. Not exaggerating.", stars: 5 },
    { name: "Dina Ashraf", role: "Marketing lead", text: "We stopped outsourcing simple edits after two people on my team took this. Paid for itself in a month.", stars: 5 },
    { name: "Ali Ragab", role: "Photographer", text: "Color module is worth the price alone. My video finally matches my photography grade.", stars: 4 },
  ],
  rating: 4.8,
  ratingCount: 86,
  students: 320,
};
