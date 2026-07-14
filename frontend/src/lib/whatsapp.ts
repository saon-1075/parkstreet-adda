import { restaurant } from "@/config/restaurant.config";

/**
 * Build a wa.me link to the cafe's WhatsApp, optionally pre-filled with text.
 * The itemized order message is composed in the order feature (M4); this is the
 * shared link builder used by nav/footer/contact and checkout.
 */
export function whatsappLink(message?: string): string {
  const number = restaurant.whatsappNumber.replace(/[^\d]/g, "");
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
