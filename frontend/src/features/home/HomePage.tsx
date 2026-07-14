import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Coffee, ArrowRight } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";
import { useMenu } from "@/hooks/useMenu";
import { formatPaise } from "@/lib/money";
import type { MenuItem } from "@/types/db";
import { ItemImage } from "@/features/menu/ItemImage";

// A few crowd-pleasers to feature on the landing page.
const FEATURED_NAMES = [
  "Kosha Mangsho Kathi Roll",
  "Mughlai Paratha",
  "Cold Coffee with Ice Cream",
  "Nolen Gur Rosogolla (2 pc)",
];

export default function HomePage() {
  const { hero, highlights, story } = restaurant;
  const { categories } = useMenu();

  const featured = useMemo<MenuItem[]>(() => {
    const items = categories.flatMap((c) => c.items);
    const byName = new Map(items.map((i) => [i.name, i]));
    const picked = FEATURED_NAMES.map((n) => byName.get(n)).filter(
      (i): i is MenuItem => Boolean(i)
    );
    return picked.length >= 3 ? picked.slice(0, 4) : items.slice(0, 4);
  }, [categories]);

  return (
    <div>
      {/* ---- Hero (caramel star surface) ---- */}
      <section className="bg-primary text-white">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2">
          <div className="reveal">
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-white/70">
              {restaurant.tagline}
            </p>
            <h1 className="mt-4 whitespace-pre-line font-display text-4xl font-semibold leading-[1.08] sm:text-6xl">
              {hero.headline}
            </h1>
            <p className="mt-5 max-w-md text-white/80">{hero.subcopy}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                to="/menu"
                className="rounded-xl bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-eyebrow text-primary transition-transform hover:-translate-y-0.5"
              >
                {hero.ctaLabel}
              </Link>
              <Link
                to="/our-story"
                className="text-sm font-medium text-white/90 underline decoration-white/40 underline-offset-4 hover:decoration-white"
              >
                Our story
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="reveal reveal-delay-1 order-first md:order-last">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-card">
              {hero.imageUrl ? (
                <img
                  src={hero.imageUrl}
                  alt={restaurant.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/40 to-primary/30">
                  <Coffee className="h-16 w-16 text-white/80" strokeWidth={1.25} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Guest favourites ---- */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Guest favourites</p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
                Most-loved at the adda
              </h2>
            </div>
            <Link
              to="/menu"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold uppercase tracking-eyebrow text-primary sm:inline-flex"
            >
              Full menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {featured.map((item) => (
              <Link
                key={item.id}
                to="/menu"
                className="lift block overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
              >
                <div className="aspect-square">
                  <ItemImage src={item.image_url} alt={item.name} category={item.category} />
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-1 text-sm font-medium text-ink">{item.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {formatPaise(item.price_paise)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Link
            to="/menu"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-eyebrow text-primary sm:hidden"
          >
            Full menu <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      )}

      {/* ---- Highlights ---- */}
      <section className="border-y border-border bg-surface2/50">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
          {highlights.map((h) => (
            <div key={h.title} className="text-center sm:text-left">
              <p className="font-display text-lg font-semibold text-ink">{h.title}</p>
              <p className="mt-1 text-sm text-muted">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Story teaser ---- */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="eyebrow">Our Story</p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
          {story.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">{story.paragraphs[0]}</p>
        <Link
          to="/our-story"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-eyebrow text-primary"
        >
          Read our story <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
