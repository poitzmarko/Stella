# FX Pro Travel Gold

A premium, mobile-first travel companion built as a Next.js PWA.

## What it does
- Smart currency conversion
- Live rates with offline fallback
- 170+ prepared currency entries
- Language switching: DE / EN / ES / FR / IT / PT / ZH
- GPS and local city detection
- Nearby places: ATMs, restaurants, cafés, bars, hotels
- Explore Nearby: top highlights, hidden gems and travel spots
- Local Events: stay-length aware event suggestions
- Travel Phrases: 50 key short phrases with copy and speak
- Travel Timeline: context-aware travel phases
- Emergency mode
- Money tools: fees, cash vs card, tipping, tax-free, VAT
- Situational Travel Feed
- Offline PWA shell

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run start
```

## API upgrade points
- `lib/services/nearby.ts`
- `lib/services/explore.ts`
- `lib/services/events.ts`
- `lib/data/currencies.ts`
- `lib/data/feed.ts`
