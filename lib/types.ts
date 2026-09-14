export type LanguageCode =
  | "de"
  | "en"
  | "es"
  | "fr"
  | "it"
  | "pt"
  | "zhHans";

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
   * Optional coordinates for real map / routing integration.
   */
  lat?: number;
  lon?: number;

  /**
   * Optional compatibility field for older modules.
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
   * Optional date for event feeds.
   */
  date?: string;

  /**
   * Optional coordinates for real map / routing integration.
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
 * The model intentionally supports both:
 *
 * 1. the newer product structure:
 *    id / title / subtitle / meta / tone
 *
 * 2. the existing feed component structure:
 *    icon / title / body / priority
 *
 * This keeps the modules compatible while the architecture
 * is being consolidated.
 */
export type FeedItem = {
  id: string;

  /**
   * Main headline.
   */
  title: string;

  /**
   * Newer subtitle field.
   */
  subtitle?: string;

  /**
   * Legacy / compatibility body field used by
   * travel-feed-module.tsx.
   */
  body?: string;

  /**
   * Optional supporting metadata.
   */
  meta?: string;

  /**
   * Optional icon / emoji displayed by the feed.
   */
  icon?: string;

  /**
   * Feed priority. Higher numbers can be surfaced first.
   */
  priority?: number;

  /**
   * Visual semantic tone.
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

export type NearbyPlace = {
  id: string;
  title: string;

  /**
   * Canonical Nearby category.
   */
  kind: NearbyKind;

  /**
   * Compatibility property used by older discovery code.
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
};

export type MoneyTopic = {
  title: string;
  desc: string;
};
