# FX Pro Travel Gold 5.1 - Premium Deluxe

Premium UX rebuild for the existing Stella Next.js repository.

## Ziel

Eine mobile-first Reise-PWA mit klaren Primary Views:

- Home
- Money
- Nearby
- Travel Phrases
- SOS

Die Startseite priorisiert nur die wichtigsten Informationen; Detailfunktionen liegen in fokussierten Views.

## Technische Änderungen

- kompakte mobile-first Navigation
- echte interaktive Nearby-Filter
- Explore Nearby aus derselben Datenbasis
- Local Events mit 1/3/5/10 Tagen
- Travel Phrases mit Suche, Vorlesen und Kopieren
- SOS mit dediziertem View
- persistenter Theme- und Währungszustand
- dynamisches HTML-Language-Attribut
- vorhandene Next.js-/Leaflet-/Overpass-/Frankfurter-Struktur bleibt erhalten

## Import

1. Branch vom funktionierenden `nextjs-rebuild` erstellen.
2. `components/app-shell.tsx` ersetzen.
3. `lib/i18n.ts`, `lib/types.ts` und `lib/sources.ts` durch die mitgelieferten Dateien ersetzen.
4. `app/globals.css` durch die mitgelieferte Datei ersetzen.
5. Keine bestehenden `package.json`, `next.config.mjs`, `app/page.tsx`, `app/layout.tsx` oder `lib/mock-data.ts` überschreiben, sofern sie im Ziel-Repo bereits funktionieren.
6. Vercel Preview prüfen.
7. Erst nach erfolgreichem Preview in `main` mergen.

## Hinweis zu Live-Daten

Exchange Rates, Nearby und Reverse Geocoding sind über austauschbare Service-Grenzen vorbereitet. Local Events nutzen weiterhin den bestehenden Fallback-Datensatz und sind für eine echte Event-API vorbereitet.
