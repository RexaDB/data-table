import { expect, test } from "bun:test";

// Runs in a child process: the DOM tests register happy-dom globals for the
// whole test process, and server rendering must be checked without them.
test("renders on the server without DOM globals", async () => {
  const proc = Bun.spawn(["bun", "run", `${import.meta.dir}/ssr-render.tsx`], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const [out, err, code] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  expect(err).toBe("");
  expect(code).toBe(0);
  expect(out).toContain("Ada");
  expect(out).toContain('data-slot="data-table"');
});
