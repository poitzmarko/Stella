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
 * Base currency model.
 */
export type Currency = {
  code: string;
  name: string;
  flag: string;
  rateToEUR: number;
};

/**
 * Extended currency model for optional regional grouping.
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
  local: Record<string, string>;
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
   * Compatibility property for older modules.
   */
  category?: string;

  /**
   * Optional external data source.
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
   * Distance from the current user location.
   */
  distance?: number;

  /**
   * Optional map coordinates.
   */
  lat?: number;
  lon?: number;

  /**
   * Optional external data source.
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
 * Supports the current product structure and
 * the fields used by the existing mock feed.
 */
export type FeedItem = {
  id: string;
  title: string;

  /**
   * Modern supporting text.
   */
  subtitle?: string;

  /**
   * Existing feed body.
   */
  body?: string;

  /**
   * Optional metadata.
   */
  meta?: string;

  /**
   * Optional icon / emoji.
   */
  icon?: string;

  /**
   * Priority used for contextual sorting.
   */
  priority?: number;

  /**
   * Visual semantic tone.
   */
  tone?: FeedTone;

  /**
   * Optional feed category.
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
 * Compatibility alias used by AppShell
 * and timeline components.
 */
export type Phase = TravelPhase;

/**
 * Travel Timeline phase definition.
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

/**
 * Lightweight location object used by maps and
 * discovery modules.
 */
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

/**
 * Nearby / discovery place.
 *
 * "kind" is the canonical property.
 * "category" remains available for compatibility.
 */
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
