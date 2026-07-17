/**
 * Generate favicons, app icons, and the social/OG image from the brand assets
 * (logo.webp + banner.webp). Re-run after a reskin swaps those files:
 *
 *   npm run generate:icons
 */
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";

const BRAND = path.resolve(import.meta.dirname, "../public/brand");
const logo = await readFile(path.join(BRAND, "logo.webp"));
const banner = await readFile(path.join(BRAND, "banner.webp"));

async function icon(size, name) {
  await sharp(logo).resize(size, size, { fit: "cover" }).png().toFile(path.join(BRAND, name));
  console.log(`  brand/${name}  (${size}x${size})`);
}

await icon(32, "favicon-32.png");
await icon(180, "apple-touch-icon.png");
await icon(192, "icon-192.png");
await icon(512, "icon-512.png");

// Social preview card (1200x630) from the hero banner.
await sharp(banner)
  .resize(1200, 630, { fit: "cover" })
  .jpeg({ quality: 82 })
  .toFile(path.join(BRAND, "og.jpg"));
console.log("  brand/og.jpg  (1200x630)");
