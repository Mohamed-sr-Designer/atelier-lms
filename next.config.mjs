/** @type {import('next').NextConfig} */
// basePath is set by the GitHub Pages workflow (repo name). Empty locally.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export", // static site, deployable to GitHub Pages
  // Local Windows/OneDrive builds can race the .next folder; allow routing it
  // outside the synced folder via env. CI leaves this unset (uses .next).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true, // required for static export; images are already optimized WebP
  },
  poweredByHeader: false,
};

export default nextConfig;
