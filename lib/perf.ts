// Weak-device detection. Low RAM or few cores → the live frosted glass,
// custom cursor and decorative animation layers cost more than they're
// worth; components check this to fall back to the "lite" experience.
// Keep in sync with the inline bootstrap script in app/layout.tsx (that one
// runs before first paint so the CSS class lands without a flash).
export function isLiteDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  return mem <= 4 || cores <= 4;
}
