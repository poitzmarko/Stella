export type LanguageCode =
  | "de"
  | "en"
  | "es"
  | "fr"
  | "it"
  | "pt"
  | "zhHans";

/**
 * Compatibility alias.
 *
 * Some UI modules use "Language", while the canonical
 * application type is "LanguageCode".
 */
export type Language = LanguageCode;

export type ThemeMode =
  | "light"
  | "dark";

export type CurrencyItem = {
  code: string;
  name: string;
  flag: string;
  rateToEUR: number;
  region: string;
};

export type PhraseItem = {
  id: string;
  category:
    | "hotel"
    | "transport"
    | "food"
    | "emergency";
  english: string;
  local: Record<
    LanguageCode | "en",
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
   * Optional coordinates for real map/routing integration.
   */
  lat?: number;
  lon?: number;

  /**
   * Compatibility field for older modules.
   */
  category?: string;
};

export type EventCategory =
  | "music"
  | "sport"
  | "outdoor"
  | "family"
  | "food"
  | "culture";

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
   * Optional coordinates for real map/routing integration.
   */
  lat?: number;
  lon?: number;
};

export type FeedTone =
  | "info"
  | "success"
  | "warning"
  | "accent";

/**
 * Travel Feed item.
 *
 * Supports both the newer product structure and
 * the fields currently used by the existing feed module.
 */
export type FeedItem = {
  id: string;

  title: string;

  /**
   * Newer subtitle structure.
   */
  subtitle?: string;

  /**
   * Existing Travel Feed body field.
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
   * Optional priority.
   */
  priority?: number;

  /**
   * Visual tone.
   */
  tone?: FeedTone;
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
 * Compatibility alias used by AppShell and timeline components.
 */
export type Phase = TravelPhase;

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
  | "hotel";

/**
 * Nearby / discovery data model.
 *
 * "kind" is the canonical field.
 * "category" remains available for compatibility with
 * existing discovery components.
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
};

export type MoneyTopic = {
  title: string;
  desc: string;
};
