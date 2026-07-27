"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { withBase } from "@/lib/base";
import { clips, type Clip } from "@/lib/gallery";

const ease = [0.16, 1, 0.3, 1] as const;

// One clip. Nothing downloads until the visitor asks for it: the poster
// carries the weight, and preload="none" keeps a 7-clip reel off the
// critical path (this matters on the weak phones the site targets).
function ClipCard({ clip, i }: { clip: Clip; i: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, ease, delay: (i % 4) * 0.07 }}
      aria-label={playing ? "Pause clip" : "Play clip"}
      className={`group relative block w-full overflow-hidden rounded-2xl border border-line/15 bg-ink-900 ${
        clip.orientation === "portrait" ? "aspect-[9/16]" : "aspect-video"
      }`}
    >
      <video
        ref={ref}
        src={withBase(clip.src)}
        poster={withBase(clip.poster)}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover"
        onEnded={() => setPlaying(false)}
      />
      {/* play affordance, fades out while the clip runs */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 grid place-items-center bg-ink-900/30 transition-opacity duration-300 ${
          playing ? "opacity-0" : "opacity-100 group-hover:bg-ink-900/20"
        }`}
      >
        <span className="glass-strong grid h-14 w-14 place-items-center rounded-full text-lg text-bone-50 transition-transform duration-300 group-hover:scale-110">
          ▶
        </span>
      </span>
    </motion.button>
  );
}

// A masonry-ish reel: portraits stay tall, landscapes span two columns so
// nothing is cropped to fit a grid that wasn't built for it.
export default function VideoGallery({ limit }: { limit?: number }) {
  const list = limit ? clips.slice(0, limit) : clips;
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {list.map((c, i) => (
        <div
          key={c.src}
          className={c.orientation === "landscape" ? "col-span-2" : "col-span-1"}
        >
          <ClipCard clip={c} i={i} />
        </div>
      ))}
    </div>
  );
}
