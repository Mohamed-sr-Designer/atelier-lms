# Atelier — School of Visual Direction

The online design school of art director **Mohamed Tarek**: a premium,
conversion-focused LMS built with **Next.js (App Router) · TypeScript ·
Tailwind CSS · Framer Motion**, statically exported to GitHub Pages.

**Live:** https://mohamed-sr-designer.github.io/atelier-lms/

---

## What's inside

- **7 courses** (3–5 hours each, zero filler): Photoshop, Illustrator,
  After Effects, Premiere Pro, Figma, AI Photoshoot & Prompt Engineering
  (free flagship), AI Video Generation — each with a learning path, modules,
  lessons, practical projects, downloadable resources, a checkpoint quiz,
  a final project and a verified certificate.
- **The Ultimate Design Bundle** — Photoshop + AI Photoshoot + AI Video.
- **Full student experience** on a static host: register/login, checkout
  (InstaPay / Vodafone Cash + WhatsApp confirmation), dashboard with progress,
  learning interface, quizzes, canvas-rendered downloadable certificates,
  resource vault — all persisted in `localStorage` (no server).
- **Bilingual** EN/AR with full RTL, light/dark themes, custom cursor,
  route transitions, magnetic CTAs, scroll storytelling.
- **SEO/GEO**: Course, FAQ, Review, Person, EducationalOrganization,
  BreadcrumbList and Blog schema; sitemap, Open Graph, Twitter cards.

## Quick start

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # static export → ./out
```

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds with
`NEXT_PUBLIC_BASE_PATH=/atelier-lms` and publishes `./out` to GitHub Pages.

## Structure

```
app/            routes (landing, courses, learn, dashboard, checkout, blog…)
components/lms/ LMS views & components (GlyphPlate, CurriculumIndex, QuizPanel…)
lib/courses/    the curriculum data layer (7 courses + bundle)
lib/store.ts    localStorage student store (auth, enrollments, progress, certs)
lib/dict.ts     bilingual EN/AR dictionary
```
