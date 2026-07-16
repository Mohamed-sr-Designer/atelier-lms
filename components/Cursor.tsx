"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { isLiteDevice } from "@/lib/perf";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.35 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // weak machines get the native cursor — the spring follower is exactly
    // what makes the mouse feel laggy there
    if (!fine || reduce || isLiteDevice()) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-ready");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest(
        "a, button, [data-cursor], input, textarea"
      );
      setHover(Boolean(t));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("cursor-ready");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="custom-cursor pointer-events-none fixed left-0 top-0 z-[120] mix-blend-difference"
      aria-hidden
    >
      <motion.div
        animate={{ width: hover ? 52 : 13, height: hover ? 52 : 13 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
      />
    </motion.div>
  );
}
