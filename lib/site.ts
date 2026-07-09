// ---- Method — the school of Mohamed Tarek ----------------------------------
export const site = {
  // Platform identity
  name: "Method",
  fullName: "Method — The School of Visual Direction",
  title:
    "Method by Mohamed Tarek — Free Photoshop, Illustrator, After Effects & Premiere Courses + Premium AI Production",
  description:
    "Method is the online design school of art director Mohamed Tarek. The software courses — Photoshop, Illustrator, After Effects, Premiere Pro — are completely free, start to finish. The premium AI production tracks (AI photoshoots and AI video) teach the highest-earning skill in design today. 3–5 hours each, real projects, quizzes and reviewed final projects.",
  url: "https://mohamed-sr-designer.github.io/atelier-lms",

  // Instructor
  instructor: "Mohamed Tarek",
  instructorRole: "Art Director & Team Lead",
  instructorBio:
    "Art director and design instructor with 9+ years across Egypt, Saudi Arabia and Kuwait — leading brand, campaign and motion work by day, and teaching across four academies with 1,200+ graduates.",

  email: "mohamed.tarek.ahmed1@gmail.com",
  phoneDisplay: "+20 10 1145 8929",
  phone: "+201011458929",
  whatsappDisplay: "+20 122 874 8098",
  whatsapp: "201228748098",
  linkedin: "https://www.linkedin.com/in/mohamedrk/",
  linkedinHandle: "/in/mohamedrk",
  github: "https://github.com/Mohamed-sr-Designer",
  location: "Egypt",
  markets: "Egypt · Saudi Arabia · Kuwait",
};

// ---- Payments (manual rails live today; gateways UI-ready) -------------------
export const payments = {
  currency: "EGP",
  manual: {
    instapay: "mohamedtarek@instapay", // TODO: real InstaPay handle
    vodafoneCash: "01011458929", // TODO: real Vodafone Cash number
  },
  gateways: [
    { id: "paymob", label: "Paymob", enabled: false },
    { id: "fawry", label: "Fawry", enabled: false },
    { id: "valu", label: "valU", enabled: false },
  ],
  waEnrollMsg:
    "Hi Mohamed — I completed payment for my Method enrollment. Screenshot attached. Order:",
};
