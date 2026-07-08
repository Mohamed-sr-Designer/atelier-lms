// Prefix for assets not handled by next/image (e.g. <video>) when the site is
// served under a sub-path on GitHub Pages. Empty in local dev.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const withBase = (p: string) => `${basePath}${p}`;
