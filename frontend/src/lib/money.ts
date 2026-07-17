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

/** Parse a rupee input ("120", "₹120.50") to integer paise. NaN if invalid. */
export function rupeesToPaise(input: string): number {
  const rupees = parseFloat(input.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(rupees) || rupees < 0) return NaN;
  return Math.round(rupees * 100);
}

/** Paise → a plain rupee string for editing in an input (no currency symbol). */
export function paiseToRupeeInput(paise: number): string {
  const rupees = paise / 100;
  return Number.isInteger(rupees) ? String(rupees) : rupees.toFixed(2);
}
