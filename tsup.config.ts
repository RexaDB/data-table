import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { defineConfig } from "tsup";

const USE_CLIENT = '"use client";';

/** tsup drops banners from CJS chunks; put the directive on every JS file. */
async function ensureUseClient(dir: string): Promise<void> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await ensureUseClient(path);
    } else if (/\.c?js$/.test(entry.name)) {
      const code = await readFile(path, "utf8");
      if (!code.startsWith(USE_CLIENT)) {
        await writeFile(path, `${USE_CLIENT}\n${code}`);
      }
    }
  }
}

export default defineConfig({
  entry: { index: "src/index.ts", "grid/index": "src/grid/index.ts" },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  target: "es2020",
  external: ["react", "react-dom", "@glideapps/glide-data-grid"],
  // Every export renders or is used by client components; frameworks with
  // server components (Next.js App Router) need the directive on each chunk.
  banner: { js: USE_CLIENT },
  onSuccess: () => ensureUseClient("dist"),
});
