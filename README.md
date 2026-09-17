# FX Pro Travel Gold 5.0 – Premium UX

Premium UX rebuild for the existing Stella Next.js repository.

## What changes

- Mobile-first iPhone layout with compact bottom navigation
- Premium contextual home instead of a long stacked dashboard
- Compact two-currency converter with current rate only
- Live / offline FX fallback with normalized rate direction
- GPS request + reverse geocoding fallback
- Leaflet/OpenStreetMap Nearby integration retained
- Local event window selector: today / 3 / 5 / 10 days
- Travel Phrases as quick actions with speech + copy
- SOS quick access
- Language switch: DE / EN / ES / FR / IT / PT / zh-Hans
- Persistent language, theme, currency pair and favorites
- Desktop retains denser cards while mobile stays thumb-friendly

## Files to replace

1. `components/app-shell.tsx`
2. `lib/i18n.ts`
3. `lib/sources.ts`
4. `lib/types.ts`
5. `app/globals.css`

`app/page.tsx` does not need to change because it already renders `AppShell`.

## Recommended GitHub sequence

Create a new branch first, for example:

`premium-ux-5`

Then replace the five files above. Commit once:

`FX Pro Travel Gold 5.0 premium UX rebuild`

Wait for Vercel Preview to finish. Do not merge to `main` until the preview has been checked on desktop and iPhone.

## Vercel

Keep:

- Framework: Next.js
- Root Directory: `./`
- Build command: automatic / `next build`
- Output directory: Next.js default
- No manual overrides unless the project explicitly requires them

## Notes

The UX rebuild intentionally leaves live third-party data behind explicit adapters. OSM/Overpass, Nominatim and the FX provider can be swapped later without rebuilding the page architecture.

The Explore and Local Events UI is prepared for richer live data but does not invent ratings, event facts or routes that are not present in the current data model.
