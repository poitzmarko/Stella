import type { LocationPoint } from '@/lib/types';

export function distanceMeters(a: LocationPoint, b: LocationPoint): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const hav =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(hav));
}

export function seededOffset(seed: number, min: number, max: number): number {
  const x = Math.sin(seed) * 10000;
  const f = x - Math.floor(x);
  return min + (max - min) * f;
}

export function formatDistance(distance: number): string {
  if (distance < 1000) return `${Math.round(distance)} m`;
  return `${(distance / 1000).toFixed(1)} km`;
}

export function mapsRouteUrl(lat: number, lon: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
}

export function mapsSearchUrl(title: string, lat: number, lon: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}%20${lat},${lon}`;
}
