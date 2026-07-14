# Image Assets Guide

What to create/source to make the demo look production-real, and exactly where each
file goes. Everything degrades gracefully — the app shows warm placeholders until the
real files exist, so you can add them incrementally.

## Golden rule
**One consistent treatment across every image.** Warm natural light, a similar angle
(top-down or ~45°), a similar surface (wood / marble / cane). Consistency reads as
"real brand" far more than any single perfect photo.

## Always run the optimiser after adding images
Source photos arrive far larger than we render them (a 2.7 MB photo in a 96px thumb).
Drop files in at any size, then:

```bash
cd frontend && npm run optimize:images
```

It resizes + re-encodes everything to WebP in place (dishes → 800×800, banner → 1600w,
logo → 512, ambience → 1600×900). It's re-runnable, and originals stay in git history.
First pass took the demo from **16.19 MB → 1.05 MB (−94%)**.

## What's needed

| Asset | Count | Size | Drop at |
|---|---|---|---|
| **Dish photos** | 20 (min ~8) | 800×800 (1:1) | `frontend/public/menu/<slug>.webp` |
| **Banner / hero image** | 1 ✅ | ~1920×1280 (3:2) | `frontend/public/brand/banner.png` → `hero.imageUrl` in config *(in place)* |
| **Ambiance** | 1–2 | 1600×900 (16:9) | `frontend/public/brand/story.webp` |
| **Logo** | 1 ✅ | circular seal | `frontend/public/brand/logo.png` → `logoUrl` in config *(in place)* |
| **Social / OG** | 1 | 1200×630 | `frontend/public/brand/og.webp` |
| **Favicon** | 1 | 512×512 | `frontend/public/brand/favicon.png` |

## Dish photo filenames (menu slugs)
Drop each as `frontend/public/menu/<slug>.webp`. Missing files fall back to the icon
placeholder automatically.

```
bhaar-er-cha            elaichi-malai-chai       cold-coffee
kochuri-aloor-dom       ghugni-chaat             butter-toast-omelette
beguni                  mughlai-paratha          fish-fry-bhetki
kosha-mangsho-roll      chicken-egg-roll         paneer-roll
double-egg-chicken-roll kosha-mangsho-luchi      chicken-kasha-rice
shorshe-bhetki-rice     nolen-gur-rosogolla      mishti-doi
aam-pora-shorbot        gondhoraj-ghol
```

## Sourcing (fictional cafe)
- **Free stock:** Unsplash / Pexels — search *kathi roll, masala chai, Bengali food,
  biryani, mughlai paratha, mishti doi, warm cafe interior, Kolkata street food*.
- **AI-generated:** fine and often better for consistency — generate all dishes with
  the same prompt scaffold (same lighting, surface, camera angle), then batch-export.
- Keep licensing clean for anything shown to prospects.

## How wiring works
- **Menu photos** are referenced by the mock data at `/menu/<slug>.webp` already, so a
  dropped file appears instantly (no code change).
- **Hero / story / logo** are config-driven: set `hero.imageUrl`, `story` image, and
  `logoUrl` in `frontend/src/config/restaurant.config.ts`.
- Once the Supabase DB is live, owner-uploaded photos (M8) go to Supabase Storage; the
  static `public/menu` files remain the quick path for the seeded demo.
