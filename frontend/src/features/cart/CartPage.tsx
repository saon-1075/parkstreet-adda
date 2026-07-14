import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/button";

/** Placeholder — the working cart + WhatsApp checkout arrive in M3/M4. */
export default function CartPage() {
  return (
    <Container className="max-w-2xl py-16 sm:py-20">
      <div className="rounded-2xl border border-border bg-surface p-10 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface2">
          <ShoppingBag className="h-6 w-6 text-accent" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold text-ink">Your cart</h1>
        <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted">
          The cart and WhatsApp checkout land in the next milestone. For now, browse the
          menu.
        </p>
        <Link to="/menu" className={`${buttonVariants({ size: "md" })} mt-6`}>
          View Menu
        </Link>
      </div>
    </Container>
  );
}
