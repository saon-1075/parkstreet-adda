import { restaurant } from "@/config/restaurant.config";

/** True when a Razorpay publishable key is configured → show "Pay online". */
export const hasRazorpay = Boolean(import.meta.env.VITE_RAZORPAY_KEY_ID);

/** Thrown when the customer closes the Razorpay modal without paying. */
export class PaymentDismissed extends Error {
  constructor() {
    super("Payment cancelled");
    this.name = "PaymentDismissed";
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
}
interface RazorpayInstance {
  open: () => void;
  on: (event: string, cb: (resp: unknown) => void) => void;
}
type RazorpayCtor = new (options: Record<string, unknown>) => RazorpayInstance;

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if ((window as { Razorpay?: RazorpayCtor }).Razorpay) return resolve();
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Couldn't reach Razorpay. Check your connection."));
    };
    document.body.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Open Razorpay Checkout for the given amount (paise). Resolves with the payment
 * id on success, rejects with PaymentDismissed if the customer closes it, or an
 * Error on failure. Uses only the publishable key_id (safe in the browser).
 */
export async function openRazorpayCheckout(opts: {
  amountPaise: number;
  description: string;
  prefillName?: string;
}): Promise<{ paymentId: string }> {
  await loadScript();
  const Razorpay = (window as { Razorpay?: RazorpayCtor }).Razorpay;
  if (!Razorpay) throw new Error("Razorpay failed to load.");

  const primary =
    getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim() ||
    "#A15E2E";

  return new Promise((resolve, reject) => {
    const rzp = new Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: opts.amountPaise, // in paise
      currency: "INR",
      name: restaurant.name,
      description: opts.description,
      prefill: opts.prefillName ? { name: opts.prefillName } : undefined,
      theme: { color: primary },
      handler: (resp: unknown) =>
        resolve({ paymentId: (resp as RazorpayResponse).razorpay_payment_id }),
      modal: { ondismiss: () => reject(new PaymentDismissed()) },
    });
    rzp.on("payment.failed", (resp: unknown) => {
      const desc = (resp as { error?: { description?: string } })?.error?.description;
      reject(new Error(desc || "Payment failed. Please try again."));
    });
    rzp.open();
  });
}
