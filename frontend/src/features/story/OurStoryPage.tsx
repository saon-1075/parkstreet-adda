import { Coffee } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function OurStoryPage() {
  const { story } = restaurant;

  return (
    <Container className="max-w-3xl py-14 sm:py-20">
      <SectionHeading eyebrow="Our Story" title={story.heading} align="center" as="h1" />

      <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border shadow-card">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface2 to-accent/25">
          <Coffee className="h-16 w-16 text-accent" strokeWidth={1.25} />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-5 text-pretty leading-relaxed text-muted">
        {story.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </Container>
  );
}
