import { restaurant } from "@/config/restaurant.config";

/**
 * Format integer paise as a currency string. Money is stored/computed in paise
 * everywhere; this is the display edge. Whole rupees render without decimals.
 *
 *   formatPaise(3000)  -> "₹30"
 *   formatPaise(12550) -> "₹125.50"
 */
export function formatPaise(paise: number, currency = restaurant.currency): string {
  const rupees = paise / 100;
  const body = Number.isInteger(rupees)
    ? rupees.toLocaleString("en-IN")
    : rupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${currency}${body}`;
}
