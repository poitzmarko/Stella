export type LanguageCode = 'de' | 'en' | 'es' | 'fr' | 'it' | 'pt' | 'zhHans';
export type ThemeMode = 'light' | 'dark';

export type CurrencyItem = { code: string; name: string; flag: string; rateToEUR: number; region: string };
export type PhraseItem = { id: string; category: 'hotel' | 'transport' | 'food' | 'emergency'; english: string; local: Record<LanguageCode | 'en', string> };
export type ExploreKind = 'water' | 'nature' | 'culture' | 'food' | 'family';
export type ExploreItem = { title: string; kind: ExploreKind; emoji: string; distance: number; rating: number; note: string };
export type EventCategory = 'music' | 'sport' | 'outdoor' | 'family' | 'food' | 'culture';
export type EventItem = { title: string; category: EventCategory; emoji: string; time: string; duration: string; note: string };
export type FeedItem = { id: string; title: string; subtitle: string; meta?: string; tone?: 'info' | 'success' | 'warning' | 'accent' };
export type TravelPhase = 'home' | 'airport' | 'hotel' | 'trip' | 'emergency' | 'return';
export type LocationState = { lat: number; lon: number; city?: string; country?: string; label?: string };
export type NearbyPlace = { id: string; title: string; kind: 'atm' | 'food' | 'drink' | 'cafe' | 'hotel'; lat: number; lon: number; distance: number; rating?: number; note?: string; tags?: Record<string, string | undefined> };
export type MoneyTopic = { title: string; desc: string };
export type LocationPoint = {
  lat: number;
  lon: number;
  label?: string;
};
