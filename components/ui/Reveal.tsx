"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
} from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

// Stagger is a plain wrapper that injects an index into each StaggerItem so the
// items reveal in sequence. Each item triggers its own in-view animation, which
// is far more reliable than parent-driven variant propagation.
export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {Children.map(children, (child, i) =>
        isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ _index?: number }>, {
              _index: i,
            })
          : child
      )}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  _index = 0,
}: {
  children: ReactNode;
  className?: string;
  _index?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: 0.7,
        ease,
        delay: reduce ? 0 : Math.min(_index * 0.07, 0.42),
      }}
    >
      {children}
    </motion.div>
  );
}
