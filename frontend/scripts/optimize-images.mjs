/**
 * Optimise brand + menu imagery for mobile.
 *
 * Source photos (AI-generated or stock) arrive far larger than we render them —
 * a 2.7 MB dish photo shown in a ~96px thumbnail is orders of magnitude more
 * data than needed, and this demo is judged on a phone over 4G. This resizes and
 * re-encodes every image to the size we actually display, in WebP.
 *
 * Each file is read fully into memory before being written back: on Windows,
 * reading from and writing to the same path keeps a handle open and the write
 * fails with EPERM. Originals are recoverable from git history.
 *
 *   npm run optimize:images
 */
import sharp from "sharp";
import { readdir, stat, readFile, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const MENU_DIR = path.join(ROOT, "public/menu");
const BRAND_DIR = path.join(ROOT, "public/brand");

/** Rendered at ~96px thumb / ~400px featured card → 800px square is ample (2x). */
const DISH = { width: 800, height: 800, fit: "cover", quality: 78, maxBytes: 200 * 1024 };

const BRAND_TARGETS = {
  "banner.png": { out: "banner.webp", width: 1600, fit: "inside", quality: 80 },
  "logo.png": { out: "logo.webp", width: 512, height: 512, fit: "inside", quality: 88 },
  "ambience.webp": {
    out: "ambience.webp",
    width: 1600,
    height: 900,
    fit: "cover",
    quality: 80,
    maxBytes: 250 * 1024,
  },
};

/**
 * Re-encoding an already-optimised image loses a little quality every pass, and
 * this script is re-run each time a photo is added. So skip anything already
 * within its target dimensions and byte budget.
 */
async function isAlreadyOptimised(input, size, opts) {
  if (!opts.maxBytes || size > opts.maxBytes) return false;
  const meta = await sharp(input).metadata();
  if (meta.format !== "webp") return false;
  return meta.width <= opts.width && meta.height <= (opts.height ?? Infinity);
}

const mb = (b) => (b / 1024 / 1024).toFixed(2);
let before = 0;
let after = 0;

async function encode(srcPath, destPath, opts, input) {
  const output = await sharp(input)
    .resize({
      width: opts.width,
      height: opts.height,
      fit: opts.fit ?? "cover",
      withoutEnlargement: true,
    })
    .webp({ quality: opts.quality })
    .toBuffer();
  await writeFile(destPath, output);
  return output.length;
}

async function optimiseDishes() {
  const files = (await readdir(MENU_DIR)).filter((f) => f.endsWith(".webp"));
  for (const file of files) {
    const src = path.join(MENU_DIR, file);
    const sizeBefore = (await stat(src)).size;
    before += sizeBefore;

    const input = await readFile(src); // full read → no lingering file handle
    if (await isAlreadyOptimised(input, sizeBefore, DISH)) {
      after += sizeBefore;
      console.log(`  menu/${file.padEnd(28)} ${mb(sizeBefore).padStart(6)} MB     — skipped (already optimised)`);
      continue;
    }

    const sizeAfter = await encode(src, src, DISH, input);
    after += sizeAfter;

    const saved = Math.round((1 - sizeAfter / sizeBefore) * 100);
    console.log(
      `  menu/${file.padEnd(28)} ${mb(sizeBefore).padStart(6)} MB -> ${mb(sizeAfter).padStart(5)} MB  (-${saved}%)`
    );
  }
}

async function optimiseBrand() {
  for (const [file, cfg] of Object.entries(BRAND_TARGETS)) {
    const src = path.join(BRAND_DIR, file);
    let sizeBefore;
    try {
      sizeBefore = (await stat(src)).size;
    } catch {
      console.log(`  brand/${file} — not found, skipping`);
      continue;
    }
    before += sizeBefore;

    const input = await readFile(src);
    if (cfg.out === file && (await isAlreadyOptimised(input, sizeBefore, cfg))) {
      after += sizeBefore;
      console.log(`  brand/${file.padEnd(27)} ${mb(sizeBefore).padStart(6)} MB     — skipped (already optimised)`);
      continue;
    }

    const dest = path.join(BRAND_DIR, cfg.out);
    const sizeAfter = await encode(src, dest, cfg, input);
    after += sizeAfter;

    // Drop the heavy original once replaced by a differently-named output.
    if (cfg.out !== file) await unlink(src);

    const saved = Math.round((1 - sizeAfter / sizeBefore) * 100);
    console.log(
      `  brand/${file.padEnd(27)} ${mb(sizeBefore).padStart(6)} MB -> ${mb(sizeAfter).padStart(5)} MB  (-${saved}%)  [${cfg.out}]`
    );
  }
}

console.log("Optimising images…\n");
await optimiseDishes();
await optimiseBrand();
console.log(
  `\n  TOTAL ${mb(before)} MB -> ${mb(after)} MB  (-${Math.round((1 - after / before) * 100)}%)`
);
