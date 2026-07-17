import { supabase } from "@/lib/supabase";

const MAX_DIM = 800; // dishes render at ~96px thumb / ~400px card → 800 is ample
const QUALITY = 0.8;
const MAX_INPUT_BYTES = 15 * 1024 * 1024;

/**
 * Take a file from the owner's device, normalise it to a small WebP, upload it
 * to the `menu-images` Storage bucket, and return the public URL to store in
 * menu_items.image_url.
 *
 * - HEIC/HEIF (iPhone default) is converted to JPEG first via heic2any, loaded
 *   lazily so it never touches the customer bundle.
 * - Everything is resized to fit 800px and re-encoded as WebP (~<200KB), keeping
 *   owner uploads as light as the optimised seed photos.
 */
export async function processAndUploadMenuImage(file: File): Promise<string> {
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("That image is over 15 MB. Please pick a smaller one.");
  }

  let source: Blob = file;
  const isHeic = /hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
  if (isHeic) {
    const heic2any = (await import("heic2any")).default;
    source = (await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 })) as Blob;
  } else if (!file.type.startsWith("image/")) {
    throw new Error("That's not an image file. Use JPG, PNG, WebP or HEIC.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(source);
  } catch {
    throw new Error("Couldn't read that image. Try a JPG or PNG.");
  }

  const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't process the image on this device.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY)
  );
  if (!blob) throw new Error("Couldn't encode the image. Try another one.");

  const path = `${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from("menu-images").upload(path, blob, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  return supabase.storage.from("menu-images").getPublicUrl(path).data.publicUrl;
}
