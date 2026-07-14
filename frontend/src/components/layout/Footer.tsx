import { Link } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import { restaurant } from "@/config/restaurant.config";
import { whatsappLink } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container";
import { BrandMark } from "@/components/ui/BrandMark";

const socialPill =
  "inline-flex min-h-[36px] items-center rounded-full border border-border px-3 text-xs font-medium text-ink transition-colors hover:bg-surface";

export function Footer() {
  const { contact, social } = restaurant;

  return (
    <footer className="mt-20 border-t border-border bg-surface2/60">
      <Container className="grid gap-10 py-14 sm:grid-cols-3">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <BrandMark className="h-14 w-14" />
            <p className="font-display text-lg font-semibold text-ink">{restaurant.name}</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{restaurant.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noreferrer" className={socialPill}>
                Instagram
              </a>
            )}
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noreferrer" className={socialPill}>
                Facebook
              </a>
            )}
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className={socialPill}>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Visit */}
        <div>
          <p className="eyebrow mb-3">Visit</p>
          <p className="flex items-start gap-2 text-sm leading-relaxed text-muted">
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
          <ul className="space-y-1.5 text-sm text-muted">
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
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <span>
            © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
          </span>
          <Link to="/menu" className="font-semibold uppercase tracking-eyebrow text-primary">
            {restaurant.hero.ctaLabel}
          </Link>
        </Container>
      </div>
    </footer>
  );
}
