export type LanguageCode =
  | "de"
  | "en"
  | "es"
  | "fr"
  | "it"
  | "pt"
  | "zhHans";

/**
 * Compatibility alias used by existing UI modules.
 */
export type Language = LanguageCode;

export type ThemeMode =
  | "light"
  | "dark";

/**
 * Generic currency definition used by the catalog.
 */
export type Currency = {
  code: string;
  name: string;
  flag: string;
  rateToEUR: number;
};

/**
 * Extended currency model for future regional grouping.
 */
export type CurrencyItem = Currency & {
  region?: string;
};

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
  local: Record<
    string,
    string
  >;
};

export type ExploreKind =
  | "water"
  | "nature"
  | "culture"
  | "food"
  | "family";

export type ExploreItem = {
  id?: string;

  title: string;

  kind: ExploreKind;

  emoji: string;

  distance: number;

  rating: number;

  note: string;

  /**
   * Optional map coordinates.
   */
  lat?: number;
  lon?: number;

  /**
   * Compatibility field used by some discovery
   * and data-source implementations.
   */
  category?: string;

  /**
   * Optional external source identifier.
   */
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

  /**
   * Optional event date.
   */
  date?: string;

  /**
   * Optional map coordinates.
   */
  lat?: number;
  lon?: number;

  /**
   * Optional external source identifier.
   */
  source?: string;
};

export type FeedTone =
  | "info"
  | "success"
  | "warning"
  | "accent";

/**
 * Travel Feed model.
 *
 * Supports both the current product structure
 * and the fields used by the original mock data.
 */
export type FeedItem = {
  id: string;

  title: string;

  subtitle?: string;

  body?: string;

  meta?: string;

  icon?: string;

  priority?: number;

  tone?: FeedTone;

  /**
   * Optional source/category used by
   * the live/mock feed.
   */
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

/**
 * Compatibility alias used by AppShell.
 */
export type Phase = TravelPhase;

/**
 * Individual travel timeline item.
 *
 * This is the missing type that caused the current
 * implicit-any error in travel-timeline-module.tsx.
 */
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

  /**
   * Canonical category used by map components.
   */
  kind: NearbyKind;

  /**
   * Compatibility category used by the
   * discovery data source.
   */
  category?: NearbyKind;

  lat: number;

  lon: number;

  distance: number;

  rating?: number;

  note?: string;

  tags?: Record<
    string,
    string | undefined
  >;

  source?: string;
};

export type MoneyTopic = {
  title: string;
  desc: string;
};
