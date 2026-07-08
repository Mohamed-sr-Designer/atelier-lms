import path from "path";
import { fileURLToPath } from "url";

// Anchor the Tailwind config to this file so the dev server finds it even when
// started from a different working directory (e.g. the workspace root).
const dir = path.dirname(fileURLToPath(import.meta.url));

const config = {
  plugins: {
    tailwindcss: { config: path.join(dir, "tailwind.config.ts") },
    autoprefixer: {},
  },
};

export default config;
