// ---- Blog / Journal ----------------------------------------------------------
// Entity-rich educational articles written for both search engines and AI
// answer engines (ChatGPT, Gemini, Claude, Perplexity, Copilot). Each post
// carries its own FAQ block → FAQPage schema on the post page.

export type Post = {
  slug: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  date: string; // ISO
  readMins: number;
  tag: string;
  cover: string;
  relatedCourse: string; // course slug — internal linking
  body: { h?: string; p: string }[];
  faq: { q: string; a: string }[];
};

export const posts: Post[] = [
  {
    slug: "how-long-to-learn-photoshop",
    title: "How Long Does It Really Take to Learn Photoshop in 2026?",
    titleAr: "قد إيه فعلًا تحتاج علشان تتعلم فوتوشوب في 2026؟",
    excerpt:
      "Not 10,000 hours. With a structured path, a working professional workflow takes weeks — here's the honest timeline stage by stage.",
    excerptAr:
      "مش ١٠ آلاف ساعة. بمسار منظم، الـ Workflow الاحترافي بياخد أسابيع — دي الأرقام الحقيقية مرحلة بمرحلة.",
    date: "2026-06-12",
    readMins: 6,
    tag: "Learning Paths",
    cover: "/work/axia/hero.webp",
    relatedCourse: "adobe-photoshop",
    body: [
      {
        p: "The most common question I get after nine years of teaching design — across EDUX Academy, Raya Academy, Teaching Planet and SOIC — is some version of: how long until I'm actually good at Photoshop? The honest answer is more encouraging than the mythology. You don't need years. You need sequence.",
      },
      {
        h: "The 4-stage timeline",
        p: "Stage one — the canvas (week 1): layers, smart objects, adjustment layers, basic selections. Stage two — selections and masking (weeks 2–3): this is the wall where self-taught learners get stuck for months, because they learn tools instead of decision rules. Stage three — color and retouch (weeks 3–5): curves, grading, frequency-aware retouching. Stage four — compositing (weeks 5–8): building complete visuals from multiple sources. Total: about two months of consistent practice to a genuinely professional workflow.",
      },
      {
        h: "Why self-taught takes 10x longer",
        p: "YouTube teaches Photoshop as ten thousand disconnected tricks. Professional workflow is maybe forty decisions applied in the right order. When my Photoshop Mastery students finish the five-hour course, they haven't seen everything Photoshop does — they've internalized the order of operations working retouchers use daily. That's the difference between knowing the software and being employable with it.",
      },
      {
        h: "The practice ratio that works",
        p: "For every hour of lessons, spend two hours rebuilding the exercise with your own images. That 1:2 ratio is why the course caps at five hours of video: fifteen total hours of engaged learning beats sixty hours of passive watching, every single time.",
      },
    ],
    faq: [
      {
        q: "Can I learn Photoshop in one month?",
        a: "Yes — a professional core workflow (selections, masking, color, retouch) is achievable in 4–8 weeks with a structured course and a 1:2 lesson-to-practice ratio.",
      },
      {
        q: "Is Photoshop still worth learning in the AI era?",
        a: "More than ever. AI generates raw material; Photoshop is where professionals fix, composite and finish it. Every AI production pipeline ends in Photoshop.",
      },
      {
        q: "Do I need a drawing tablet to learn Photoshop?",
        a: "No. Retouching and compositing are precision work, not sketching — a mouse is fine for everything in a design workflow.",
      },
    ],
  },
  {
    slug: "designer-roadmap-zero-to-pro",
    title: "The 2026 Designer Roadmap: Zero to Professional Workflow",
    titleAr: "خريطة المصمم 2026: من الصفر لـ Workflow احترافي",
    excerpt:
      "The exact tool-by-tool sequence I've used to take 1,200+ students from zero to hired — and the order most people get wrong.",
    excerptAr:
      "الترتيب الصح للأدوات اللي وصّلت بيه أكتر من ١٢٠٠ طالب من الصفر للشغل — والترتيب اللي أغلب الناس بتغلط فيه.",
    date: "2026-06-24",
    readMins: 8,
    tag: "Career",
    cover: "/work/fresh-valley/hero.webp",
    relatedCourse: "adobe-illustrator",
    body: [
      {
        p: "After teaching more than 1,200 students across four academies, I can tell you the single biggest mistake beginners make: they choose tools by hype instead of by sequence. The order you learn in determines whether skills compound or evaporate.",
      },
      {
        h: "Phase 1 — Photoshop first (weeks 1–8)",
        p: "Photoshop teaches the fundamentals every other tool assumes: layers, masking, color, composition. It's also where the most junior paid work lives — social media design, retouching, ad adaptation. Employability arrives fastest here.",
      },
      {
        h: "Phase 2 — Illustrator for construction (weeks 9–16)",
        p: "Vectors teach discipline pixels never will: geometry, optical correction, systems. Logo and identity work is the highest-value corner of graphic design, and it runs entirely on Illustrator craft.",
      },
      {
        h: "Phase 3 — pick a multiplier (months 4–6)",
        p: "Now branch by market: After Effects if you love rhythm and film (motion is the most requested add-on skill for designers). Figma if you're drawn to products and apps — the graphic-designer-to-UI transition is the most in-demand career move right now. Premiere Pro if content and campaigns are your world.",
      },
      {
        h: "Phase 4 — the AI layer on top",
        p: "AI photoshoots and AI video are multipliers, not shortcuts. They multiply the taste and craft you built in phases 1–3. A prompt engineer who can't retouch ships broken images; a designer who can do both replaces a production studio. That's why my AI Photoshoot course is free — it proves the method, and it shows you exactly why craft still matters.",
      },
    ],
    faq: [
      {
        q: "Which design tool should a complete beginner learn first?",
        a: "Photoshop. It teaches the transferable fundamentals (layers, masking, color) and unlocks the largest pool of entry-level paid work — then Illustrator for logo and identity craft.",
      },
      {
        q: "Should beginners skip Adobe and learn AI tools instead?",
        a: "No — AI output still requires finishing, compositing and taste. Learn craft first, then add AI as a multiplier. Designers with both replace entire production pipelines.",
      },
      {
        q: "How long from zero to first paid design work?",
        a: "Typically 2–4 months: Photoshop fundamentals plus a small portfolio of exercises rebuilt as personal projects is enough for entry-level freelance and social design roles.",
      },
    ],
  },
  {
    slug: "ai-photoshoots-real-campaigns",
    title: "AI Photoshoots Are Already in Real Campaigns — Here's the Workflow",
    titleAr: "جلسات تصوير الذكاء الاصطناعي في حملات حقيقية بالفعل — ده الـ Workflow",
    excerpt:
      "I've shipped client campaigns shot entirely with AI. The pipeline that makes it client-grade has five stages — and none of them is 'type a prompt'.",
    excerptAr:
      "سلّمت حملات لعملاء اتصورت بالكامل بالذكاء الاصطناعي. الخط اللي بيخليها بمستوى العميل فيه خمس مراحل — ولا واحدة منهم 'اكتب برومبت'.",
    date: "2026-07-01",
    readMins: 7,
    tag: "AI Production",
    cover: "/work/axia/insta-2.webp",
    relatedCourse: "ai-photoshoot",
    body: [
      {
        p: "The gifting brand campaign in this post's cover image never saw a camera. No studio, no lighting rig, no product samples shipped across the city. It was directed, generated, retouched and delivered — and the client approved it over a traditional studio quote. This isn't the future; it's how my team works today.",
      },
      {
        h: "Stage 1 — art direction still comes first",
        p: "AI didn't remove the moodboard; it made it mandatory. Before any generation, we lock a reference set: light quality, lens language, color world, composition rules. The model is a very fast photographer with no taste — the taste is your job.",
      },
      {
        h: "Stage 2 — prompts as photography direction",
        p: "The prompts that work read like a shot list: subject, scene, lens, light, mood, constraints. 'Warm product hero, 85mm, soft window light from camera left, amber palette, negative space top-right for headline.' Photography vocabulary in, photography results out.",
      },
      {
        h: "Stage 3 — generate wide, curate ruthlessly",
        p: "A 6-frame campaign set starts as 150+ generations. Curation — the discipline of picking hero frames — is where sets stop looking 'AI-ish'. Consistency of character, product and grade across frames is the professional requirement clients silently check.",
      },
      {
        h: "Stages 4 & 5 — Photoshop finishing and delivery",
        p: "Every frame gets a retouch pass (hands, edges, artifacts), then one unified grade across the set, then proper delivery masters. The AI got us 80% in minutes; the craft closes the 20% that separates a demo from an invoice. I teach this exact pipeline — free — in the AI Photoshoot & Prompt Engineering course.",
      },
    ],
    faq: [
      {
        q: "Are AI-generated images legal to use in commercial campaigns?",
        a: "Generally yes for model outputs you created, but check your generator's commercial license tier and disclose AI usage where regulations require it. Always confirm brand-safety and trademark clearance like any other asset.",
      },
      {
        q: "Do clients accept AI photoshoots?",
        a: "Increasingly yes — when the finishing is professional. Clients buy the result and the cost/speed advantage; they reject uncanny artifacts. The retouch-and-grade stage is what makes approval happen.",
      },
      {
        q: "What's the best AI tool for product photoshoots?",
        a: "The workflow matters more than the tool: Midjourney, Freepik AI and Firefly all reach campaign quality when driven with photography-language prompts and finished in Photoshop.",
      },
    ],
  },
  {
    slug: "figma-vs-photoshop-beginners",
    title: "Figma vs Photoshop: Which Should a New Designer Learn?",
    titleAr: "فيجما ولا فوتوشوب: مبتدئ التصميم يتعلم إيه الأول؟",
    excerpt:
      "They're not competitors — they're different careers. A simple decision framework from someone who teaches both.",
    excerptAr:
      "مش منافسين — دول مسارين مهنيين مختلفين. إطار قرار بسيط من حد بيدرّس الاتنين.",
    date: "2026-06-05",
    readMins: 5,
    tag: "Learning Paths",
    cover: "/web/fresh-valley.webp",
    relatedCourse: "adobe-photoshop",
    body: [
      {
        p: "Every week a student asks me to settle the Figma vs Photoshop debate. Here's the truth the debate misses: they don't compete. They serve two different careers that happen to share the word 'designer'.",
      },
      {
        h: "The one-question framework",
        p: "Ask yourself what you want to make: images or interfaces. If the answer is campaigns, social content, ads, retouched visuals — that's the image world, and it runs on Photoshop. If the answer is apps, websites, products people click through — that's the interface world, and it runs on Figma. Neither is a subset of the other.",
      },
      {
        h: "Where the money differs",
        p: "Photoshop skills monetize faster at entry level (social design and retouch briefs are everywhere, especially in the MENA agency market). Figma skills have a higher ceiling in product companies and remote roles. Graphic designers who add Figma make the single most in-demand career transition of the moment — and their visual instincts transfer on day one, which is why designers coming from the graphic side pick it up faster than anyone.",
      },
      {
        h: "The honest recommendation",
        p: "If you're at absolute zero: Photoshop first for fundamentals and fast employability, Figma second as your growth multiplier. If you already have graphic foundations and feel drawn to products: go straight to Figma — your visual instincts transfer on day one.",
      },
    ],
    faq: [
      {
        q: "Is Figma harder to learn than Photoshop?",
        a: "No — Figma's core is smaller and more logical. The challenge is unlearning manual-positioning habits; auto layout thinking is the real skill jump.",
      },
      {
        q: "Can Figma replace Photoshop?",
        a: "No. Figma is for interfaces and product design; it cannot retouch, composite or grade images. Professional designers commonly use both for different jobs.",
      },
      {
        q: "Do UI designers earn more than graphic designers?",
        a: "On average yes, especially in product companies and remote markets — but senior brand/campaign designers out-earn junior UI designers. Sequence and seniority matter more than the tool.",
      },
    ],
  },
  {
    slug: "photoshop-tips-tricks-pros-2026",
    title: "12 Photoshop Tips & Tricks the Pros Use Every Single Day",
    titleAr: "١٢ تريك في فوتوشوب المحترفين بيستخدموها كل يوم",
    excerpt:
      "The small, high-leverage Photoshop habits that separate a beginner from a working retoucher — shortcuts, non-destructive moves and speed tricks.",
    excerptAr:
      "العادات الصغيرة عالية القيمة اللي بتفرق بين المبتدئ والريتشر المحترف — اختصارات وحركات non-destructive وتريكات سرعة.",
    date: "2026-07-05",
    readMins: 7,
    tag: "Photoshop Tips",
    cover: "/lms/story.jpg",
    relatedCourse: "adobe-photoshop",
    body: [
      {
        p: "After nine years retouching client work and teaching Photoshop across four academies, I've noticed the gap between beginners and professionals isn't knowledge of obscure features — it's a handful of tiny habits repeated thousands of times. Here are the twelve that matter most.",
      },
      {
        h: "Speed tricks that compound",
        p: "1. Hold Alt/Option while clicking a layer mask to view it full-screen. 2. Use Shift+Backspace for the Fill dialog instead of hunting menus. 3. Bracket keys [ and ] resize any brush instantly. 4. Ctrl/Cmd+J duplicates a layer; do it before every risky move. These feel trivial — but a retoucher makes each of these gestures hundreds of times a day, and the seconds add up to hours a week.",
      },
      {
        h: "Non-destructive is a mindset, not a feature",
        p: "5. Curves and Hue/Saturation as adjustment layers, never as direct edits. 6. Smart Objects for anything you'll scale or filter. 7. Frequency separation on two linked layers so texture and tone stay independent. 8. Dodge and burn on a 50%-gray Soft Light layer, not the pixels. The rule: if you can't undo it a week later, you did it wrong.",
      },
      {
        h: "Selection & masking tricks that save hours",
        p: "9. Select Subject then refine in Select and Mask — start from AI, finish by hand. 10. Color Range for skies and consistent backgrounds. 11. Paint masks with a soft low-flow brush for natural edges. 12. Push a mask's contrast with a Levels adjustment clipped to it. Masking is where self-taught learners stall for months; these four moves are 80% of professional selection work.",
      },
      {
        h: "How to actually internalize them",
        p: "Don't memorize this list — rebuild one real image using only these twelve moves. That's the exact practice loop inside the free Photoshop course: every lesson ends with a brief you finish with your own files, which is the only way habits like these become automatic.",
      },
    ],
    faq: [
      {
        q: "What is the single most useful Photoshop shortcut?",
        a: "Alt/Option-clicking a layer mask to view and paint it directly. Masking is the core professional skill, and seeing the mask full-screen makes precise selections far faster.",
      },
      {
        q: "What does non-destructive editing mean in Photoshop?",
        a: "Editing through adjustment layers, masks and Smart Objects so the original pixels are never changed — every decision stays reversible, which is the baseline of employable, professional work.",
      },
      {
        q: "Are Photoshop skills still worth it with AI tools around?",
        a: "Yes. AI generates raw material; Photoshop is where it's retouched, composited and finished. Every professional AI production pipeline ends in Photoshop.",
      },
    ],
  },
  {
    slug: "illustrator-pen-tool-beginners-guide",
    title: "Master the Illustrator Pen Tool: A Beginner's Guide That Finally Clicks",
    titleAr: "احترف البن تول في إليستريتور: دليل المبتدئين اللي هيخليها تظبط أخيرًا",
    excerpt:
      "The Pen Tool is where most Illustrator beginners quit. Here's the mental model and the three-move practice that makes curves feel effortless.",
    excerptAr:
      "البن تول هو المكان اللي أغلب المبتدئين بيسيبوا إليستريتور عنده. دي الطريقة الذهنية والتمرين اللي بيخلي المنحنيات سهلة.",
    date: "2026-07-08",
    readMins: 6,
    tag: "Illustrator",
    cover: "/work/fresh-valley/hero.webp",
    relatedCourse: "adobe-illustrator",
    body: [
      {
        p: "Every Illustrator beginner hits the same wall: the Pen Tool. It feels unpredictable, the curves fight back, and most people retreat to the shape tools forever. The problem isn't your hand — it's that nobody gave you the mental model first.",
      },
      {
        h: "The one rule: anchor points go at extremes",
        p: "Place anchor points only where a curve changes direction — the top of a hill, the bottom of a valley. Beginners scatter points everywhere and then fight the handles. Professionals use the fewest points possible. A perfect circle needs exactly four. If your path has twice the points it needs, every edit becomes a wrestling match.",
      },
      {
        h: "Handles are levers, not decorations",
        p: "Drag a handle in the direction the curve is travelling, and keep it about one-third the length of the curve segment. Longer handles make loopy, unstable shapes. Hold Shift to constrain handles to 45° angles for clean, predictable geometry. This single habit fixes 90% of 'my curves look wrong'.",
      },
      {
        h: "The practice that builds muscle memory",
        p: "Trace letterforms. Pull a bold serif typeface onto your artboard, lock it, and rebuild each letter with the Pen Tool. Letters contain every curve problem you'll ever face — and because you can see the target, your hand learns faster than any abstract exercise. This is exactly how the Illustrator course opens, because pen confidence unlocks everything else: logos, icons, illustration.",
      },
    ],
    faq: [
      {
        q: "Why is the Illustrator Pen Tool so hard for beginners?",
        a: "Because most people place too many anchor points and drag handles randomly. The fix is a rule: points only at direction changes, handles about one-third the curve length in the direction of travel.",
      },
      {
        q: "How many anchor points should a shape have?",
        a: "As few as possible. A circle needs four. Fewer, well-placed points give smoother curves and far easier edits than many scattered ones.",
      },
      {
        q: "What's the fastest way to learn the Pen Tool?",
        a: "Trace typography. Lock a bold typeface and rebuild each letter with the Pen — letters contain every curve type, and seeing the target trains your hand faster than abstract drills.",
      },
    ],
  },
  {
    slug: "illustrator-tricks-logo-designers",
    title: "10 Illustrator Tricks Every Logo Designer Should Know",
    titleAr: "١٠ تريكات في إليستريتور لازم كل مصمم لوجو يعرفها",
    excerpt:
      "Grids, optical correction, Pathfinder discipline and the small moves that make a logo look engineered instead of drawn.",
    excerptAr:
      "الجريدات، التصحيح البصري، انضباط الـ Pathfinder، والحركات الصغيرة اللي بتخلي اللوجو مهندس مش مرسوم.",
    date: "2026-07-09",
    readMins: 7,
    tag: "Illustrator Tips",
    cover: "/web/fresh-valley.webp",
    relatedCourse: "adobe-illustrator",
    body: [
      {
        p: "Logo and identity work is the highest-value corner of graphic design — and it lives entirely in Illustrator craft. These are ten tricks I use on every client mark, the difference between a shape that looks drawn and one that looks engineered.",
      },
      {
        h: "Build on a grid, correct by eye",
        p: "1. Start every mark on a grid for consistent proportion. 2. But override the grid with optical correction: circles must be drawn slightly larger than squares to look the same size, and horizontal bars slightly thinner than verticals. 3. Overshoot curved letterforms past the baseline. Math gets you close; the eye makes the final call.",
      },
      {
        h: "Pathfinder & shape discipline",
        p: "4. Build complex marks from simple boolean shapes with Pathfinder, never freehand. 5. Keep everything on a shared baseline grid. 6. Use the Shape Builder tool (Shift+M) for fast, controlled merging. 7. Expand strokes before delivery so scaling never breaks the weight.",
      },
      {
        h: "Delivery that survives the real world",
        p: "8. Test every logo at 16px — if it dies as a favicon, it isn't finished. 9. Deliver a single-color version first; if it works in one color, it works everywhere. 10. Provide proper lockups and clear-space rules so clients can't destroy it. A logo isn't a drawing, it's a system — and the system is what you're actually paid for.",
      },
    ],
    faq: [
      {
        q: "What is optical correction in logo design?",
        a: "Adjusting shapes so they look correct rather than being mathematically equal — circles drawn slightly larger than squares, horizontals slightly thinner than verticals — because the eye, not the ruler, judges the final mark.",
      },
      {
        q: "Should a logo be designed in one color first?",
        a: "Yes. A mark that works in a single color works everywhere. Color and gradients are added last, over a form that's already strong in pure black and white.",
      },
      {
        q: "Why test a logo at 16 pixels?",
        a: "Because favicons, app icons and tiny UI placements are real usage. If a mark collapses at 16px it isn't finished — legibility at small sizes is a core requirement, not an afterthought.",
      },
    ],
  },
  {
    slug: "ai-prompt-rules-pro-photoshoots",
    title: "The 7 AI Prompt Rules Behind Pro-Grade Photoshoots (Not AI Slop)",
    titleAr: "٧ قواعد للبرومبت وراء جلسات التصوير الاحترافية بالـ AI (مش سلوب)",
    excerpt:
      "Prompting for client-grade images is photography direction, not keyword soup. The seven rules that make AI sets look shot, not generated.",
    excerptAr:
      "البرومبت للصور بمستوى العميل هو إخراج تصوير، مش خلطة كلمات. السبع قواعد اللي بتخلي الست بتاعت الـ AI تبان متصورة مش متولّدة.",
    date: "2026-07-10",
    readMins: 8,
    tag: "AI Production",
    cover: "/work/axia/insta-2.webp",
    relatedCourse: "ai-photoshoot",
    body: [
      {
        p: "I've shipped client campaigns shot entirely with AI, approved over traditional studio quotes. The single biggest lever is how you prompt — and pro prompting reads like a photographer's shot list, not a pile of adjectives. Here are the seven rules.",
      },
      {
        h: "Rules 1–3: speak photography",
        p: "1. Lead with subject and scene, not style words. 2. Specify the lens — 85mm for flattering product heroes, 35mm for environmental context — because focal length changes everything. 3. Direct the light like on set: 'soft window light from camera left, warm key, gentle fill'. Photography vocabulary in, photography results out.",
      },
      {
        h: "Rules 4–5: composition & constraints",
        p: "4. Call your composition: negative space top-right for a headline, rule-of-thirds placement, tight crop. 5. Add constraints, not just wishes — 'no text, no logos, shallow depth of field, muted amber palette'. Constraints are what stop a model from drifting into generic stock-photo territory.",
      },
      {
        h: "Rules 6–7: consistency & curation",
        p: "6. For a campaign SET, lock a reference and reuse the exact character, product and grade language across every frame — consistency is the professional tell clients silently check. 7. Generate wide, curate ruthlessly: a 6-frame set starts as 150+ generations, and picking hero frames is a design skill, not luck. The prompt gets you 80%; direction and curation close the rest.",
      },
      {
        h: "Where the craft actually lives",
        p: "None of these rules is 'type a prompt and pray'. They're art direction applied to a very fast, tasteless photographer. That's the whole premium AI Photoshoot course: the prompt scaffolds, the reference discipline, and the Photoshop finishing that turns a good generation into an invoice.",
      },
    ],
    faq: [
      {
        q: "How do you write prompts for professional AI photoshoots?",
        a: "Like a photographer's shot list: subject and scene first, then lens (e.g. 85mm), light direction, composition and hard constraints. Photography language produces photographic results; adjective soup produces AI slop.",
      },
      {
        q: "Why do AI campaign images need to be consistent?",
        a: "Because clients silently check whether the character, product and color grade hold across every frame. Consistency across a set is the main signal that separates professional work from one-off lucky generations.",
      },
      {
        q: "Is prompting enough to deliver client-grade AI images?",
        a: "No. Prompting reaches about 80%. Curation of hero frames plus Photoshop retouching and a unified grade close the final 20% that separates a demo from a deliverable clients pay for.",
      },
    ],
  },
  {
    slug: "direct-ai-video-like-film-crew",
    title: "How to Direct AI Video Like a Film Crew: Prompt to Finished Cut",
    titleAr: "إزاي تخرج فيديو AI كأنه فريق تصوير: من البرومبت للمونتاج النهائي",
    excerpt:
      "AI video isn't 'generate a clip'. It's directing, sourcing, cutting and finishing. The four-stage pipeline that delivers spots clients approve.",
    excerptAr:
      "فيديو الـ AI مش 'ولّد كليب'. ده إخراج ومصادر ومونتاج وتشطيب. الخط بأربع مراحل اللي بيسلّم إعلانات العميل يوافق عليها.",
    date: "2026-07-10",
    readMins: 8,
    tag: "AI Production",
    cover: "/work/tilal/hero.webp",
    relatedCourse: "ai-video-generation",
    body: [
      {
        p: "The fastest-growing deliverable in advertising right now is AI video — and the people winning that work aren't the ones with the best model access. They're the ones who treat it like directing a film crew, not rolling a slot machine. Here's the pipeline from text idea to a spot a client signs off.",
      },
      {
        h: "Stage 1 — direct the camera in words",
        p: "Before generating a single frame, write a shot list. Each shot gets camera language: 'slow push-in on subject, 35mm, handheld feel, warm dusk light'. You're directing motion and lensing, not describing a scene. Storyboard the 30-second spot first — the generation is the last step, not the first.",
      },
      {
        h: "Stage 2 — generate & source",
        p: "Drive the video models toward usable shots through iteration, and blend them with prepared stock so nobody spots the seam. Image-to-video is a secret weapon: animate frames from an AI photoshoot into moving shots for perfect consistency. The mix of generated and sourced footage is what makes a spot feel produced.",
      },
      {
        h: "Stages 3 & 4 — cut it like film, then ship",
        p: "Assemble in Premiere Pro with real editorial rhythm — pacing hides generation limits, and cutting before a shot drifts is how pros work. Then the half everyone forgets: sound design and mix. Finally grade for one consistent look across AI, stock and graphics, export platform masters and ratios, and present it with confidence when the client asks 'is this AI?'. The answer is a directed pipeline, and that's exactly what the premium AI Video course teaches end to end.",
      },
    ],
    faq: [
      {
        q: "Can you make client-ready video with AI?",
        a: "Yes — when it's directed, not just generated. A shot list, camera-language prompts, editing in Premiere Pro, sound design and a unified grade turn AI clips into spots clients approve.",
      },
      {
        q: "How do you keep AI video shots consistent?",
        a: "Storyboard first, reuse reference and character language across shots, blend generated footage with prepared stock, and animate stills from an AI photoshoot with image-to-video for perfect continuity.",
      },
      {
        q: "What's the most overlooked part of AI video?",
        a: "Sound. Most AI video fails on audio, not visuals. Professional sound design and mix are half of why a finished spot feels real and gets approved.",
      },
    ],
  },
  {
    slug: "ai-vs-photoshop-use-both",
    title: "AI vs Photoshop: Why the Best Designers Use Both (and Charge More)",
    titleAr: "الذكاء الاصطناعي ولا فوتوشوب: ليه أحسن المصممين بيستخدموا الاتنين",
    excerpt:
      "AI isn't replacing Photoshop — it's feeding it. The designers thriving right now do both, and they replace whole production studios.",
    excerptAr:
      "الـ AI مش بيحل محل فوتوشوب — بيغذّيه. المصممين اللي بينجحوا دلوقتي بيعملوا الاتنين، وبيحلوا محل استوديوهات إنتاج كاملة.",
    date: "2026-07-11",
    readMins: 6,
    tag: "AI Production",
    cover: "/work/secure/hero.webp",
    relatedCourse: "ai-photoshoot",
    body: [
      {
        p: "The 'AI is killing design' headlines get one thing exactly backwards. In real production, AI and Photoshop aren't rivals — they're two stages of one pipeline. The designers thriving right now are the ones who own both, and they're quietly replacing entire production studios.",
      },
      {
        h: "AI generates. Photoshop finishes.",
        p: "A generated image is raw material: great composition, wrong hands, soft edges, artifacts, an inconsistent grade. Photoshop is where a professional fixes the hands, cleans the edges, composites the product accurately and unifies the color. AI gets you 80% in minutes; Photoshop closes the 20% that separates a demo from an invoice.",
      },
      {
        h: "Why 'both' is the money skill",
        p: "A prompt engineer who can't retouch ships broken images. A retoucher who can't prompt is slower and more expensive than the market now allows. A designer who can direct AI and finish in Photoshop does a full campaign shoot in a day — that combined skill is what clients pay premium budgets for, because it replaces a photographer, a studio and a retouch team.",
      },
      {
        h: "The sequence to learn it in",
        p: "Craft first, AI second. Learn Photoshop fundamentals — free, in full — so you can judge and finish anything a model gives you. Then add the AI Photoshoot pipeline on top as a multiplier. That's the whole business model here: the software courses are free because they prove why craft still matters, and the premium AI tracks are where that craft turns into the highest-earning skill in design today.",
      },
    ],
    faq: [
      {
        q: "Is AI going to replace Photoshop?",
        a: "No. AI generates raw images; Photoshop retouches, composites and finishes them. Every professional AI pipeline still ends in Photoshop — they're two stages of one workflow, not competitors.",
      },
      {
        q: "Should I learn Photoshop or AI first?",
        a: "Photoshop first. Craft lets you judge and finish anything AI produces. Add AI generation on top as a multiplier — designers who can do both replace entire production studios.",
      },
      {
        q: "Why do designers who use both AI and Photoshop earn more?",
        a: "Because the combined skill delivers a full campaign in a day — replacing a photographer, studio and retouch team. That end-to-end capability is what clients pay premium budgets for.",
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
