import type { EventItem, ExploreItem, LocationPoint, NearbyKind, NearbyPlace } from "@/lib/types";
import {
  baseRates,
  createFallbackEvents,
  createFallbackExplore,
  createFallbackNearby,
  defaultLocation,
} from "@/lib/mock-data";
import { distanceMeters } from "@/lib/geo";

export async function fetchExchangeRates(): Promise<Record<string, number>> {
  try {
    const response = await fetch(
      "https://api.frankfurter.app/latest?from=EUR",
      { cache: "no-store" },
    );
    if (!response.ok) throw new Error("FX provider failed");

    const data = (await response.json()) as { rates?: Record<string, number> };
    return { EUR: 1, ...(data.rates ?? {}) };
  } catch {
    const fallback: Record<string, number> = { EUR: 1 };
    for (const [code, value] of Object.entries(baseRates)) {
      fallback[code] = code === "EUR" ? 1 : value > 0 ? 1 / value : 1;
    }
    return fallback;
  }
}

export async function reverseGeocode(point: LocationPoint): Promise<string> {
  try {
    const url =
      "https://nominatim.openstreetmap.org/reverse" +
      `?format=jsonv2&lat=${encodeURIComponent(point.lat)}&lon=${encodeURIComponent(point.lon)}`;

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("reverse failed");

    const data = (await response.json()) as {
      address?: {
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        country?: string;
      };
    };

    const address = data.address ?? {};
    return [
      address.city ?? address.town ?? address.village,
      address.state,
      address.country,
    ]
      .filter(Boolean)
      .join(", ") || "Local area";
  } catch {
    return "Local area";
  }
}

type OSMElement = {
  type: "node" | "way" | "relation";
  id?: number;
  lat?: number;
  lon?: number;
  center?: { lat?: number; lon?: number };
  tags?: Record<string, string | undefined>;
};

type OSMResponse = { elements?: OSMElement[] };

function mapKind(tags: Record<string, string | undefined>): NearbyKind {
  if (tags.tourism === "hotel") return "hotel";
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

function titleFor(tags: Record<string, string | undefined>, kind: NearbyKind) {
  if (tags.name) return tags.name;
  return {
    atm: "ATM",
    cafe: "Café",
    bar: "Bar",
    restaurant: "Restaurant",
    hotel: "Hotel",
    food: "Food",
    drink: "Drink",
  }[kind];
}

export async function fetchNearbyPlaces(point: LocationPoint): Promise<NearbyPlace[]> {
  const query = `
    [out:json][timeout:20];
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

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: `data=${encodeURIComponent(query)}`,
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = (await response.json()) as OSMResponse;
      const items = (data.elements ?? [])
        .map((element): NearbyPlace | null => {
          const lat = element.type === "node" ? element.lat : element.center?.lat;
          const lon = element.type === "node" ? element.lon : element.center?.lon;
          if (typeof lat !== "number" || typeof lon !== "number") return null;

          const tags = element.tags ?? {};
          const kind = mapKind(tags);
          const distance = distanceMeters(point, { lat, lon });
          const rawStars = tags.stars ? Number(tags.stars) : NaN;

          return {
            id: `${element.type}-${element.id ?? `${lat}-${lon}`}`,
            title: titleFor(tags, kind),
            kind,
            category: kind,
            lat,
            lon,
            distance,
            rating: Number.isFinite(rawStars) ? rawStars : 4.3,
            note: tags.description ?? tags.opening_hours ?? "OpenStreetMap place",
            source: "osm",
          };
        })
        .filter((item): item is NearbyPlace => item !== null)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 20);

      if (items.length > 0) return items;
    } catch {
      // Try next endpoint.
    }
  }

  return createFallbackNearby(point);
}

export async function fetchExploreHighlights(point: LocationPoint): Promise<ExploreItem[]> {
  try {
    const nearby = await fetchNearbyPlaces(point);
    if (!nearby.length) return createFallbackExplore(point);

    return nearby.slice(0, 20).map((item, index) => {
      const kind: ExploreItem["kind"] = [
        "water",
        "nature",
        "culture",
        "food",
        "family",
      ][index % 5] as ExploreItem["kind"];

      return {
        id: `explore-live-${index}`,
        title: item.title,
        kind,
        emoji: ["⛵", "🌲", "🏛️", "🍽️", "👨‍👩‍👧"][index % 5],
        category: kind,
        lat: item.lat,
        lon: item.lon,
        distance: item.distance,
        rating: item.rating ?? 4.4,
        note: item.note ?? "Local highlight",
        source: item.source ?? "osm",
      };
    });
  } catch {
    return createFallbackExplore(point);
  }
}

export async function fetchLocalEvents(
  point: LocationPoint,
  stayDays: number,
): Promise<EventItem[]> {
  try {
    return createFallbackEvents(point, stayDays);
  } catch {
    return createFallbackEvents(defaultLocation, stayDays);
  }
}
