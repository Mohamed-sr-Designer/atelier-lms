// The AI film reel: real client renders, web-encoded from the studio masters.
// Orientation is stored per clip so the grid can size each one honestly, a
// portrait render is never letterboxed into a landscape frame.
export type Clip = {
  src: string;
  poster: string;
  orientation: "portrait" | "landscape";
};

export const clips: Clip[] = [
  { src: "/lms/gallery/l1.mp4", poster: "/lms/gallery/l1.jpg", orientation: "landscape" },
  { src: "/lms/gallery/p1.mp4", poster: "/lms/gallery/p1.jpg", orientation: "portrait" },
  { src: "/lms/gallery/p2.mp4", poster: "/lms/gallery/p2.jpg", orientation: "portrait" },
  { src: "/lms/gallery/l2.mp4", poster: "/lms/gallery/l2.jpg", orientation: "landscape" },
  { src: "/lms/gallery/p3.mp4", poster: "/lms/gallery/p3.jpg", orientation: "portrait" },
  { src: "/lms/gallery/p4.mp4", poster: "/lms/gallery/p4.jpg", orientation: "portrait" },
  { src: "/lms/gallery/p5.mp4", poster: "/lms/gallery/p5.jpg", orientation: "portrait" },
];

// The film behind the AI stack section and the AI Video course card.
export const heroFilm = {
  src: "/lms/gallery/hero-render.mp4",
  poster: "/lms/gallery/hero-render.jpg",
};
