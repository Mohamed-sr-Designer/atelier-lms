"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Animated counter — counts up once when scrolled into view. With
// `keepCounting`, it never truly stops: after the count-up it keeps ticking
// up by one every few seconds, so a "still counting" stat reads as alive.
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  className = "",
  duration = 1.6,
  keepCounting = false,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  keepCounting?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  // keep ticking after the count-up finishes
  useEffect(() => {
    if (!keepCounting || !inView || reduce) return;
    const id = setInterval(() => {
      setN((c) => (c >= value ? c + 1 : c));
    }, 4200);
    return () => clearInterval(id);
  }, [keepCounting, inView, reduce, value]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`} dir="ltr">
      {prefix}
      {n.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
