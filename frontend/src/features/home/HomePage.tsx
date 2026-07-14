import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Coffee, ArrowRight } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";
import { useMenu } from "@/hooks/useMenu";
import { formatPaise } from "@/lib/money";
import type { MenuItem } from "@/types/db";
import { ItemImage } from "@/features/menu/ItemImage";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        <Container className="grid items-center gap-12 py-16 sm:py-24 md:grid-cols-2">
          <div className="reveal">
            <p className="eyebrow eyebrow-invert">{restaurant.tagline}</p>
            <h1 className="mt-4 whitespace-pre-line text-balance font-display text-[2.5rem] font-semibold leading-[1.06] sm:text-6xl">
              {hero.headline}
            </h1>
            <p className="mt-6 max-w-md text-pretty leading-relaxed text-white/80">
              {hero.subcopy}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link to="/menu" className={buttonVariants({ variant: "inverse", size: "lg" })}>
                {hero.ctaLabel}
              </Link>
              <Link
                to="/our-story"
                className="text-sm font-medium text-white/90 underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
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
                  alt={`${restaurant.name} — signature dishes`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/40 to-primary/30">
                  <Coffee className="h-16 w-16 text-white/80" strokeWidth={1.25} />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ---- Guest favourites ---- */}
      {featured.length > 0 && (
        <section>
          <Container className="py-16 sm:py-20">
            <div className="flex items-end justify-between gap-4">
              <SectionHeading eyebrow="Guest favourites" title="Most-loved at the adda" />
              <Link
                to="/menu"
                className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold uppercase tracking-eyebrow text-primary hover:opacity-80 sm:inline-flex"
              >
                Full menu <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {featured.map((item) => (
                <Link
                  key={item.id}
                  to="/menu"
                  className="lift block overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
                >
                  <div className="aspect-square">
                    <ItemImage src={item.image_url} alt={item.name} category={item.category} />
                  </div>
                  <div className="p-3.5">
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
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-eyebrow text-primary sm:hidden"
            >
              Full menu <ArrowRight className="h-4 w-4" />
            </Link>
          </Container>
        </section>
      )}

      {/* ---- Highlights ---- */}
      <section className="border-y border-border bg-surface2/50">
        <Container className="grid gap-8 py-12 sm:grid-cols-3">
          {highlights.map((h) => (
            <div key={h.title} className="text-center sm:text-left">
              <p className="font-display text-lg font-semibold text-ink">{h.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{h.text}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* ---- Story teaser ---- */}
      <section>
        <Container className="max-w-2xl py-16 text-center sm:py-20">
          <SectionHeading eyebrow="Our Story" title={story.heading} align="center" />
          <p className="mt-5 text-pretty leading-relaxed text-muted">{story.paragraphs[0]}</p>
          <Link
            to="/our-story"
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-eyebrow text-primary hover:opacity-80"
          >
            Read our story <ArrowRight className="h-4 w-4" />
          </Link>
        </Container>
      </section>
    </div>
  );
}
