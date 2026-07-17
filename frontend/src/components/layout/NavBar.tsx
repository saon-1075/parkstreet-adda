import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";
import { buttonVariants } from "@/components/ui/button";
import { BrandMark } from "@/components/ui/BrandMark";
import { useCart } from "@/features/cart/CartProvider";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/menu", label: "Menu", end: false },
  { to: "/our-story", label: "Our Story", end: false },
  { to: "/contact", label: "Contact", end: false },
];

export function NavBar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <BrandMark className="h-9 w-9" />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            {restaurant.name}
          </span>
        </Link>

        {/* Desktop links with animated active underline */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                className="group text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                {({ isActive }) => (
                  <span className="relative inline-block py-1">
                    <span className={cn(isActive && "text-ink")}>{l.label}</span>
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-primary transition-transform duration-200",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Link
            to="/menu"
            className={cn(buttonVariants({ variant: "primary", size: "sm" }), "hidden sm:inline-flex")}
          >
            {restaurant.hero.ctaLabel}
          </Link>

          <CartButton />

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-ink hover:bg-surface2 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-bg md:hidden">
          <ul className="mx-auto max-w-5xl px-4 py-2">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    cn(
                      "flex min-h-[44px] items-center rounded-lg px-2 text-base font-medium text-ink hover:bg-surface2",
                      isActive && "text-primary"
                    )
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li className="px-2 py-3">
              <Link
                to="/menu"
                className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full")}
              >
                {restaurant.hero.ctaLabel}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

/** Cart icon with a live item-count badge; opens the mini-cart drawer. */
function CartButton() {
  const { totalQuantity, openCart } = useCart();
  const [bump, setBump] = useState(false);
  const prev = useRef(totalQuantity);

  useEffect(() => {
    if (totalQuantity > prev.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 340);
      prev.current = totalQuantity;
      return () => clearTimeout(t);
    }
    prev.current = totalQuantity;
  }, [totalQuantity]);

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`View cart, ${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}`}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl text-ink hover:bg-surface2"
    >
      <ShoppingBag className="h-5 w-5" />
      {totalQuantity > 0 && (
        <span
          className={cn(
            "absolute right-1 top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white tabular-nums",
            bump && "badge-bump"
          )}
        >
          {totalQuantity}
        </span>
      )}
    </button>
  );
}
