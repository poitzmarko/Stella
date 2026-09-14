import type {
  EventItem,
  ExploreItem,
  LocationPoint,
  NearbyKind,
  NearbyPlace,
} from "@/lib/types";

import {
  baseRates,
  createFallbackEvents,
  createFallbackExplore,
  createFallbackNearby,
  defaultLocation,
} from "@/lib/mock-data";

import { distanceMeters } from "@/lib/geo";

/**
 * Fetch live exchange rates.
 *
 * Primary source:
 * Frankfurter API
 *
 * Fallback:
 * locally stored base rates
 */
export async function fetchExchangeRates(): Promise<
  Record<string, number>
> {
  try {
    const response = await fetch(
      "https://api.frankfurter.app/latest?from=EUR",
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        "FX provider failed",
      );
    }

    const data = (await response.json()) as {
      rates?: Record<string, number>;
    };

    return {
      EUR: 1,
      ...(data.rates ?? {}),
    };
  } catch {
    return {
      ...baseRates,
    };
  }
}

/**
 * Reverse geocoding via OpenStreetMap Nominatim.
 */
export async function reverseGeocode(
  point: LocationPoint,
): Promise<string> {
  try {
    const url =
      "https://nominatim.openstreetmap.org/reverse" +
      `?format=jsonv2` +
      `&lat=${encodeURIComponent(point.lat)}` +
      `&lon=${encodeURIComponent(point.lon)}`;

    const response = await fetch(
      url,
      {
        headers: {
          Accept:
            "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        "Reverse geocoding failed",
      );
    }

    const data = (await response.json()) as {
      address?: {
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        country?: string;
      };
    };

    const address =
      data.address ?? {};

    return [
      address.city ??
        address.town ??
        address.village,
      address.state,
      address.country,
    ]
      .filter(
        (
          value,
        ): value is string =>
          Boolean(value),
      )
      .join(", ") ||
      "Local area";
  } catch {
    return "Local area";
  }
}

type OSMElement = {
  type:
    | "node"
    | "way"
    | "relation";

  id?: number;

  lat?: number;

  lon?: number;

  center?: {
    lat?: number;
    lon?: number;
  };

  tags?: Record<
    string,
    string | undefined
  >;
};

type OSMResponse = {
  elements?: OSMElement[];
};

function getNearbyKind(
  tags: Record<
    string,
    string | undefined
  >,
): NearbyKind {
  if (
    tags.tourism ===
    "hotel"
  ) {
    return "hotel";
  }

  switch (tags.amenity) {
    case "atm":
      return "atm";

    case "cafe":
      return "cafe";

    case "bar":
      return "bar";

    case "restaurant":
      return "restaurant";

    default:
      return "restaurant";
  }
}

function getNearbyTitle(
  tags: Record<
    string,
    string | undefined
  >,
  kind: NearbyKind,
): string {
  if (tags.name) {
    return tags.name;
  }

  switch (kind) {
    case "atm":
      return "ATM";

    case "hotel":
      return "Hotel";

    case "cafe":
      return "Café";

    case "bar":
      return "Bar";

    case "restaurant":
      return "Restaurant";

    case "food":
      return "Food";

    case "drink":
      return "Drink";
  }
}

/**
 * Load Nearby places from OpenStreetMap /
 * Overpass API.
 *
 * Multiple endpoints are tried in sequence.
 * Local mock data is used as fallback.
 */
export async function fetchNearbyPlaces(
  point: LocationPoint,
): Promise<NearbyPlace[]> {
  const query = `
    [out:json][timeout:25];
    (
      node(around:3500,${point.lat},${point.lon})[amenity~"atm|restaurant|cafe|bar"];
      way(around:3500,${point.lat},${point.lon})[amenity~"atm|restaurant|cafe|bar"];
      relation(around:3500,${point.lat},${point.lon})[amenity~"atm|restaurant|cafe|bar"];

      node(around:3500,${point.lat},${point.lon})[tourism="hotel"];
      way(around:3500,${point.lat},${point.lon})[tourism="hotel"];
      relation(around:3500,${point.lat},${point.lon})[tourism="hotel"];
    );
    out center tags;
  `;

  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.fr/api/interpreter",
  ];

  for (
    const endpoint of endpoints
  ) {
    try {
      const response =
        await fetch(
          endpoint,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body:
              `data=${encodeURIComponent(
                query,
              )}`,
            cache: "no-store",
          },
        );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`,
        );
      }

      const data =
        (await response.json()) as OSMResponse;

      const elements =
        data.elements ?? [];

      const items =
        elements
          .map(
            (
              element,
            ): NearbyPlace | null => {
              const lat =
                element.type ===
                "node"
                  ? element.lat
                  : element.center?.lat;

              const lon =
                element.type ===
                "node"
                  ? element.lon
                  : element.center?.lon;

              if (
                typeof lat !==
                  "number" ||
                typeof lon !==
                  "number"
              ) {
                return null;
              }

              const tags =
                element.tags ?? {};

              const kind =
                getNearbyKind(
                  tags,
                );

              const title =
                getNearbyTitle(
                  tags,
                  kind,
                );

              const distance =
                distanceMeters(
                  point,
                  {
                    lat,
                    lon,
                  },
                );

              const ratingRaw =
                tags.stars;

              const parsedRating =
                ratingRaw
                  ? Number(
                      ratingRaw,
                    )
                  : NaN;

              const rating =
                Number.isFinite(
                  parsedRating,
                )
                  ? parsedRating
                  : 4.3;

              return {
                id: `${
                  element.type
                }-${
                  element.id ??
                  `${lat}-${lon}`
                }`,

                title,

                /**
                 * Canonical data property.
                 */
                kind,

                /**
                 * Compatibility property.
                 */
                category: kind,

                lat,
                lon,

                distance,

                rating,

                note:
                  tags.description ??
                  tags.opening_hours ??
                  "OpenStreetMap place",

                source: "osm",
              };
            },
          )
          .filter(
            (
              item,
            ): item is NearbyPlace =>
              item !== null,
          )
          .sort(
            (
              a,
              b,
            ) =>
              a.distance -
              b.distance,
          );

      if (
        items.length >
        0
      ) {
        return items.slice(
          0,
          20,
        );
      }
    } catch {
      /*
       * Try the next Overpass endpoint.
       */
    }
  }

  return createFallbackNearby(
    point,
  );
}

function mapExploreKind(
  index: number,
): ExploreItem["kind"] {
  switch (index % 5) {
    case 0:
      return "water";

    case 1:
      return "nature";

    case 2:
      return "culture";

    case 3:
      return "food";

    default:
      return "family";
  }
}

function mapExploreEmoji(
  kind: ExploreItem["kind"],
): string {
  switch (kind) {
    case "water":
      return "⛵";

    case "nature":
      return "🌲";

    case "culture":
      return "🏛️";

    case "food":
      return "🍽️";

    case "family":
      return "👨‍👩‍👧";

    default:
      return "✨";
  }
}

/**
 * Creates Explore highlights based on Nearby data.
 *
 * Live OSM places are transformed into the canonical
 * ExploreItem structure.
 *
 * If Nearby is unavailable, the local Explore fallback
 * is used.
 */
export async function fetchExploreHighlights(
  point: LocationPoint,
): Promise<ExploreItem[]> {
  try {
    const items =
      await fetchNearbyPlaces(
        point,
      );

    if (
      items.length ===
      0
    ) {
      return createFallbackExplore(
        point,
      );
    }

    return items
      .map(
        (
          item,
          index,
        ): ExploreItem => {
          const kind =
            mapExploreKind(
              index,
            );

          return {
            id: `explore-live-${index}`,

            title: item.title,

            kind,

            emoji:
              mapExploreEmoji(
                kind,
              ),

            /**
             * Compatibility category.
             */
            category:
              item.kind,

            lat: item.lat,

            lon: item.lon,

            distance:
              item.distance,

            rating:
              item.rating ??
              4.4,

            note:
              item.note ??
              "Local highlight",

            source:
              item.source ??
              "osm",
          };
        },
      )
      .slice(0, 20);
  } catch {
    return createFallbackExplore(
      point,
    );
  }
}

/**
 * Local Events currently use the prepared fallback
 * data model.
 *
 * This keeps the API boundary ready for a real
 * event provider later.
 */
export async function fetchLocalEvents(
  point: LocationPoint,
  stayDays: number,
): Promise<EventItem[]> {
  try {
    return createFallbackEvents(
      point,
      stayDays,
    );
  } catch {
    return createFallbackEvents(
      defaultLocation,
      stayDays,
    );
  }
}
