import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Entrypoint: copy the winning label from entry.txt (next to this file)
// into $MAKEFUN_OUTPUT_DIR/entry.txt. No other files, no network.
const here = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(join(here, "entry.txt"), "utf8");
const text = raw.trim();

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("error: MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

// Length guard: the competition gate requires 1-120 characters of real
// text on a single line — not empty, not whitespace-only, no line breaks.
if (text.length < 1 || text.length > 120 || text.includes("\n")) {
  console.error(`error: entry must be 1-120 characters on one line, got ${text.length}`);
  process.exit(1);
}

try {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), text, "utf8");
} catch (err) {
  console.error(`error: failed to write output: ${err}`);
  process.exit(1);
}
