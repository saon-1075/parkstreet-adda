import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";
import { whatsappLink } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const { contact } = restaurant;
  const telHref = `tel:${contact.phoneDisplay.replace(/\s+/g, "")}`;

  return (
    <Container className="max-w-3xl py-14 sm:py-20">
      <SectionHeading eyebrow="Contact" title="Find us & say hello" align="center" as="h1" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {/* Address */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="flex items-center gap-2 text-accent">
            <MapPin className="h-5 w-5" />
            <span className="eyebrow text-ink">Location</span>
          </div>
          <div className="mt-3 leading-relaxed text-muted">
            {contact.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="flex items-center gap-2 text-accent">
            <Clock className="h-5 w-5" />
            <span className="eyebrow text-ink">Hours</span>
          </div>
          <ul className="mt-3 space-y-1.5 text-muted">
            {contact.hours.map((h) => (
              <li key={h.days}>
                <span className="text-ink">{h.days}</span> · {h.time}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-3">
        <a href={telHref} className={buttonVariants({ variant: "ghost", size: "md" })}>
          <Phone className="h-4 w-4 text-accent" />
          {contact.phoneDisplay}
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ variant: "whatsapp", size: "md" })}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp us
        </a>
      </div>

      {/* Map */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        {contact.mapEmbedUrl ? (
          <iframe
            title="Map to Park Street Adda"
            src={contact.mapEmbedUrl}
            className="h-64 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className={cn("flex h-48 items-center justify-center bg-surface2 text-sm text-muted")}>
            <MapPin className="mr-2 h-4 w-4 text-accent" />
            Map coming soon
          </div>
        )}
      </div>
    </Container>
  );
}
