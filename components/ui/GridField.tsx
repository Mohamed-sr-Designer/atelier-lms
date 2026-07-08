"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

// Reference-style backdrop: grid paper + a few accent squares that drift
// with the mouse at different depths (parallax). Purely decorative.
const squares = [
  { left: "7%", top: "15%", size: 30, depth: 55, cls: "bg-mint" },
  { left: "70%", top: "9%", size: 42, depth: -75, cls: "bg-electric/80" },
  { left: "91%", top: "56%", size: 24, depth: 95, cls: "bg-mint/80" },
  { left: "13%", top: "80%", size: 36, depth: -60, cls: "bg-electric/70" },
  { left: "47%", top: "5%", size: 18, depth: 70, cls: "bg-mint/60" },
];

function Square({
  left,
  top,
  size,
  depth,
  cls,
  mx,
  my,
}: (typeof squares)[number] & {
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const x = useSpring(useTransform(mx, (v) => v * depth), {
    stiffness: 55,
    damping: 16,
  });
  const y = useSpring(useTransform(my, (v) => v * depth), {
    stiffness: 55,
    damping: 16,
  });
  const rotate = useSpring(useTransform(mx, (v) => v * depth * 0.35), {
    stiffness: 40,
    damping: 18,
  });
  return (
    <motion.span
      aria-hidden
      className={`absolute rounded-[3px] ${cls}`}
      style={{ left, top, width: size, height: size, x, y, rotate }}
    />
  );
}

export default function GridField() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduce]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_75%_70%_at_50%_40%,black_45%,transparent_100%)]" />
      {squares.map((s, i) => (
        <Square key={i} {...s} mx={mx} my={my} />
      ))}
    </div>
  );
}
