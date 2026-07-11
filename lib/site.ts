// ---- Tarek — the school of Mohamed Tarek ----------------------------------
export const site = {
  // Platform identity
  name: "Mohamed Tarek Academy",
  shortName: "Tarek",
  fullName: "Mohamed Tarek Academy — School of Visual Direction",
  title:
    "Mohamed Tarek — Art Director & Design Academy | Free Adobe Courses + Premium AI Production",
  description:
    "Mohamed Tarek is an art director and designer running an online design academy. His software courses — Photoshop, Illustrator, After Effects, Premiere Pro — are completely free, start to finish. The premium AI production tracks (AI photoshoots and AI video) teach the highest-earning skill in design today. Real projects, quizzes and reviewed final projects.",
  url: "https://mohamed-sr-designer.github.io/atelier-lms",

  // Instructor
  instructor: "Mohamed Tarek",
  instructorRole: "Art Director, Designer & Founder",
  instructorBio:
    "Mohamed Tarek is an art director and graphic designer leading brand, campaign and motion work across Egypt, Saudi Arabia and Kuwait — and the founder of Mohamed Tarek Academy, teaching design and AI production to 1,200+ students across four academies.",

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
    "Hi Mohamed — I completed payment for my Tarek enrollment. Screenshot attached. Order:",
};
