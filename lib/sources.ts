import type { Currency, ExploreItem, EventItem, NearbyPlace, LocationPoint } from '@/lib/types';
import { baseRates, createFallbackEvents, createFallbackExplore, createFallbackNearby, defaultLocation } from '@/lib/mock-data';
import { distanceMeters } from '@/lib/geo';

export async function fetchExchangeRates(): Promise<Record<string, number>> {
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=EUR', { cache: 'no-store' });
    if (!response.ok) throw new Error('FX provider failed');
    const data = await response.json();
    return { EUR: 1, ...(data.rates as Record<string, number>) };
  } catch {
    return { ...baseRates };
  }
}

export async function reverseGeocode(point: LocationPoint): Promise<string> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${point.lat}&lon=${point.lon}`, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('reverse failed');
    const data = await response.json();
    const addr = data.address || {};
    return [addr.city || addr.town || addr.village, addr.state, addr.country].filter(Boolean).join(', ') || 'Local area';
  } catch {
    return 'Local area';
  }
}

export async function fetchNearbyPlaces(point: LocationPoint): Promise<NearbyPlace[]> {
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
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.openstreetmap.fr/api/interpreter'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: `data=${encodeURIComponent(query)}`,
        cache: 'no-store'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const items = (data.elements || [])
        .map((el: any) => {
          const lat = el.type === 'node' ? el.lat : el.center?.lat;
          const lon = el.type === 'node' ? el.lon : el.center?.lon;
          if (typeof lat !== 'number' || typeof lon !== 'number') return null;
          const tags = el.tags || {};
          const category = (tags.tourism === 'hotel'
            ? 'hotel'
            : tags.amenity === 'atm'
              ? 'atm'
              : tags.amenity === 'cafe'
                ? 'cafe'
                : tags.amenity === 'bar'
                  ? 'bar'
                  : 'restaurant') as NearbyPlace['category'];
          const title = tags.name || (category === 'atm' ? 'ATM' : category);
          const distance = distanceMeters(point, { lat, lon });
          return {
            id: `${category}-${lat}-${lon}`,
            title,
            category,
            lat,
            lon,
            distance,
            rating: tags.stars ? Number(tags.stars) : 4.3,
            note: tags.description || tags.opening_hours || 'OpenStreetMap place',
            source: 'osm'
          } satisfies NearbyPlace;
        })
        .filter(Boolean)
        .sort((a: NearbyPlace, b: NearbyPlace) => a.distance - b.distance);

      if (items.length) return items.slice(0, 20);
    } catch {
      // continue to next endpoint
    }
  }
  return createFallbackNearby(point);
}

export async function fetchExploreHighlights(point: LocationPoint): Promise<ExploreItem[]> {
  try {
    const items = await fetchNearbyPlaces(point);
    return items.map((item, index) => ({
      id: `explore-live-${index}`,
      title: item.title,
      category: index % 5 === 0 ? 'harbour' : index % 5 === 1 ? 'nature' : index % 5 === 2 ? 'viewpoint' : index % 5 === 3 ? 'food' : 'photo',
      lat: item.lat,
      lon: item.lon,
      distance: item.distance,
      rating: item.rating ?? 4.4,
      note: item.note || 'Local highlight',
      source: item.source === 'osm' ? 'osm' : 'mock'
    })).slice(0, 20);
  } catch {
    return createFallbackExplore(point);
  }
}

export async function fetchLocalEvents(point: LocationPoint, stayDays: number): Promise<EventItem[]> {
  try {
    return createFallbackEvents(point, stayDays);
  } catch {
    return createFallbackEvents(defaultLocation, stayDays);
  }
}
