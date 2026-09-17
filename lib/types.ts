export type LanguageCode =
  | "de"
  | "en"
  | "es"
  | "fr"
  | "it"
  | "pt"
  | "zhHans";

export type Language = LanguageCode;
export type ThemeMode = "light" | "dark";

export type Currency = {
  code: string;
  name: string;
  flag: string;
  rateToEUR: number;
};

export type CurrencyItem = Currency & { region?: string };

export type PhraseCategory =
  | "hotel"
  | "transport"
  | "food"
  | "emergency"
  | "restaurant"
  | "taxi"
  | "shopping";

export type PhraseItem = {
  id: string;
  category: PhraseCategory;
  english: string;
  local: Record<string, string>;
};

export type ExploreKind = "water" | "nature" | "culture" | "food" | "family";

export type ExploreItem = {
  id?: string;
  title: string;
  kind: ExploreKind;
  emoji: string;
  distance: number;
  rating: number;
  note: string;
  lat?: number;
  lon?: number;
  category?: string;
  source?: string;
};

export type EventCategory =
  | "music"
  | "sport"
  | "outdoor"
  | "family"
  | "food"
  | "culture"
  | "market"
  | "cinema"
  | "festival"
  | "harbour";

export type EventItem = {
  id?: string;
  title: string;
  category: EventCategory;
  emoji: string;
  time: string;
  duration: string;
  note: string;
  date?: string;
  distance?: number;
  lat?: number;
  lon?: number;
  source?: string;
};

export type FeedTone = "info" | "success" | "warning" | "accent";

export type FeedItem = {
  id: string;
  title: string;
  subtitle?: string;
  body?: string;
  meta?: string;
  icon?: string;
  priority?: number;
  tone?: FeedTone;
  category?: string;
};

export type TravelPhase =
  | "home"
  | "airport"
  | "hotel"
  | "trip"
  | "holiday"
  | "emergency"
  | "return";

export type Phase = TravelPhase;

export type TimelinePhase = {
  id: TravelPhase;
  title: string;
  description: string;
  highlights: string[];
};

export type LocationState = {
  lat: number;
  lon: number;
  city?: string;
  country?: string;
  label?: string;
};

export type LocationPoint = {
  lat: number;
  lon: number;
  label?: string;
};

export type NearbyKind =
  | "atm"
  | "food"
  | "drink"
  | "cafe"
  | "hotel"
  | "restaurant"
  | "bar";

export type NearbyPlace = {
  id: string;
  title: string;
  kind: NearbyKind;
  category?: NearbyKind;
  lat: number;
  lon: number;
  distance: number;
  rating?: number;
  note?: string;
  tags?: Record<string, string | undefined>;
  source?: string;
};

export type MoneyTopic = {
  title: string;
  desc: string;
};
