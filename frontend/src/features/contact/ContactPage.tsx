import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";
import { whatsappLink } from "@/lib/whatsapp";

export default function ContactPage() {
  const { contact } = restaurant;
  const telHref = `tel:${contact.phoneDisplay.replace(/\s+/g, "")}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-center">Contact</p>
      <h1 className="mt-3 text-center font-display text-3xl font-semibold text-ink sm:text-4xl">
        Find us & say hello
      </h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {/* Address */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center gap-2 text-accent">
            <MapPin className="h-5 w-5" />
            <span className="eyebrow text-ink">Location</span>
          </div>
          <div className="mt-3 text-muted">
            {contact.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex items-center gap-2 text-accent">
            <Clock className="h-5 w-5" />
            <span className="eyebrow text-ink">Hours</span>
          </div>
          <ul className="mt-3 space-y-1 text-muted">
            {contact.hours.map((h) => (
              <li key={h.days}>
                <span className="text-ink">{h.days}</span> · {h.time}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={telHref}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold text-ink hover:bg-surface2"
        >
          <Phone className="h-4 w-4 text-accent" />
          {contact.phoneDisplay}
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-5 py-3 text-sm font-semibold uppercase tracking-eyebrow text-white hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp us
        </a>
      </div>

      {/* Map */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        {contact.mapEmbedUrl ? (
          <iframe
            title="Map"
            src={contact.mapEmbedUrl}
            className="h-64 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-48 items-center justify-center bg-surface2 text-sm text-muted">
            <MapPin className="mr-2 h-4 w-4 text-accent" />
            Map coming soon
          </div>
        )}
      </div>
    </div>
  );
}
