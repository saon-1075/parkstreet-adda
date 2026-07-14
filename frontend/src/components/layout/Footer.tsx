import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";
import { whatsappLink } from "@/lib/whatsapp";

export function Footer() {
  const { contact, social } = restaurant;

  return (
    <footer className="mt-16 border-t border-border bg-surface2/60">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        {/* Brand */}
        <div>
          <p className="font-display text-lg font-semibold text-ink">{restaurant.name}</p>
          <p className="mt-2 text-sm text-muted">{restaurant.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {social.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-ink hover:bg-surface"
              >
                Instagram
              </a>
            )}
            {social.facebook && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-ink hover:bg-surface"
              >
                Facebook
              </a>
            )}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-ink hover:bg-surface"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Visit */}
        <div>
          <p className="eyebrow mb-3">Visit</p>
          <p className="flex items-start gap-2 text-sm text-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>
              {contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </span>
          </p>
        </div>

        {/* Hours */}
        <div>
          <p className="eyebrow mb-3">Hours</p>
          <ul className="space-y-1 text-sm text-muted">
            {contact.hours.map((h) => (
              <li key={h.days} className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  <span className="text-ink">{h.days}</span> · {h.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:px-6">
          <span>
            © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
          </span>
          <Link to="/menu" className="uppercase tracking-eyebrow text-primary">
            {restaurant.hero.ctaLabel}
          </Link>
        </div>
      </div>
    </footer>
  );
}
