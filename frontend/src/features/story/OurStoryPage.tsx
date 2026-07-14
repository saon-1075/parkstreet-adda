import { Coffee } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";

export default function OurStoryPage() {
  const { story } = restaurant;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-center">Our Story</p>
      <h1 className="mt-3 text-center font-display text-3xl font-semibold text-ink sm:text-4xl">
        {story.heading}
      </h1>

      <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border shadow-card">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface2 to-accent/20">
          <Coffee className="h-16 w-16 text-accent/70" strokeWidth={1.25} />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-5 text-muted">
        {story.paragraphs.map((p, i) => (
          <p key={i} className="leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
