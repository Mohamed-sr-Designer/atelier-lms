import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  Fraunces,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import { site } from "@/lib/site";
import { courses, stats } from "@/lib/courses";
import { LangProvider } from "@/lib/i18n";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppButton from "@/components/WhatsAppButton";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ar",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#100F0D",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s — Atelier",
  },
  description: site.description,
  keywords: [
    "online design school",
    "free Photoshop course",
    "free Illustrator course",
    "free After Effects course",
    "free Premiere Pro course",
    "AI photoshoot course",
    "AI video generation course",
    "prompt engineering for designers",
    "learn graphic design online",
    "design course Egypt",
    "graphic design course Arabic",
    "motion design course",
    "design certificate online",
    "Mohamed Tarek",
    "Atelier design school",
  ],
  authors: [{ name: site.instructor, url: `${site.url}/instructor/` }],
  creator: site.instructor,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_EG",
    url: site.url,
    siteName: site.fullName,
    title: site.title,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: site.fullName }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Structured data — how search engines & AI answer engines (ChatGPT, Gemini,
// Claude, Perplexity, Copilot) understand what this school is, who teaches it,
// and what it offers. Page-level Course/FAQ/Article schema references these ids.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "EducationalOrganization"],
      "@id": `${site.url}/#organization`,
      name: "Atelier — School of Visual Direction",
      alternateName: "Atelier by Mohamed Tarek",
      url: site.url,
      logo: `${site.url}/og.jpg`,
      description: site.description,
      email: `mailto:${site.email}`,
      founder: { "@id": `${site.url}/#instructor` },
      address: { "@type": "PostalAddress", addressCountry: "EG" },
      areaServed: ["Egypt", "Saudi Arabia", "Kuwait", "MENA"],
      sameAs: [site.linkedin, site.github],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Design courses",
        itemListElement: courses.map((c) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            "@id": `${site.url}/courses/${c.slug}/#course`,
            name: c.title.en,
          },
        })),
      },
    },
    {
      "@type": "Person",
      "@id": `${site.url}/#instructor`,
      name: site.instructor,
      jobTitle: "Art Director & Design Instructor",
      description: site.instructorBio,
      url: `${site.url}/instructor/`,
      image: `${site.url}/lms/instructor-tall.png`,
      email: `mailto:${site.email}`,
      worksFor: { "@id": `${site.url}/#organization` },
      knowsAbout: [
        "Adobe Photoshop",
        "Adobe Illustrator",
        "Adobe After Effects",
        "Adobe Premiere Pro",
        "Figma",
        "AI Image Generation",
        "AI Video Generation",
        "Prompt Engineering",
        "Brand Identity Design",
        "Art Direction",
        "Motion Design",
      ],
      knowsLanguage: ["ar", "en"],
      affiliation: [
        { "@type": "Organization", name: "SOIC — School of Cinema" },
        { "@type": "Organization", name: "EDUX Academy" },
        { "@type": "Organization", name: "Raya Academy" },
        { "@type": "Organization", name: "Teaching Planet Academy" },
      ],
      sameAs: [site.linkedin, site.github],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.fullName,
      description: `${stats.totalCourses} design courses · ${stats.totalHours} hours · verified certificates`,
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: ["en", "ar"],
    },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${serif.variable} ${arabic.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="bg-ink-900 font-sans text-bone-50 antialiased">
        <LangProvider>
          <Preloader />
          <SmoothScroll />
          <ScrollProgress />
          <Cursor />
          <WhatsAppButton />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
