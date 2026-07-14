import { Link } from "react-router-dom";
import { Coffee, ArrowRight } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";

export default function HomePage() {
  const { hero, highlights, story } = restaurant;

  return (
    <div>
      {/* ---- Hero ---- */}
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 sm:pt-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="eyebrow">{restaurant.tagline}</p>
            <h1 className="mt-4 whitespace-pre-line font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
              {hero.headline}
            </h1>
            <p className="mt-5 max-w-md text-muted">{hero.subcopy}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-eyebrow text-white transition-opacity hover:opacity-90"
              >
                {hero.ctaLabel}
              </Link>
              <Link
                to="/our-story"
                className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold uppercase tracking-eyebrow text-ink transition-colors hover:bg-surface2"
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* Hero visual: image if configured, else a warm gradient panel */}
          <div className="order-first md:order-last">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-card">
              {hero.imageUrl ? (
                <img
                  src={hero.imageUrl}
                  alt={restaurant.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface2 to-accent/20">
                  <Coffee className="h-16 w-16 text-accent/70" strokeWidth={1.25} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---- Highlights strip ---- */}
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
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Our Story</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
            {story.heading}
          </h2>
          <p className="mt-4 text-muted">{story.paragraphs[0]}</p>
          <Link
            to="/our-story"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-eyebrow text-primary"
          >
            Read our story
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ---- Order CTA band ---- */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="rounded-2xl bg-primary px-6 py-10 text-center">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Hungry? Order in a tap.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
            Browse the menu, build your order, and send it straight to us on WhatsApp —
            or scan the QR at your table for dine-in.
          </p>
          <Link
            to="/menu"
            className="mt-6 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold uppercase tracking-eyebrow text-primary transition-opacity hover:opacity-90"
          >
            {hero.ctaLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
