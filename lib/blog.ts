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
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
