import type { LocationState, NearbyPlace } from '../types';
const demoNearby: NearbyPlace[] = [
  { id: 'atm-1', title: 'Harbour ATM', kind: 'atm', lat: 54.522, lon: 13.412, distance: 220, rating: 4.6, note: 'Quick cash access near the waterfront.' },
  { id: 'food-1', title: 'Mole Seafood Kitchen', kind: 'food', lat: 54.524, lon: 13.414, distance: 350, rating: 4.9, note: 'Highly rated and right by the harbour.' },
  { id: 'cafe-1', title: 'Pier Coffee Bar', kind: 'cafe', lat: 54.52, lon: 13.408, distance: 190, rating: 4.7, note: 'Coffee, pastries and Wi-Fi.' },
  { id: 'drink-1', title: 'Marina Sunset Bar', kind: 'drink', lat: 54.523, lon: 13.418, distance: 480, rating: 4.8, note: 'Best for a sundowner.' },
  { id: 'hotel-1', title: 'Harbour View Hotel', kind: 'hotel', lat: 54.518, lon: 13.406, distance: 620, rating: 4.5, note: 'Easy to reach from the promenade.' },
];
export async function fetchNearbyPlaces(location: LocationState | null): Promise<NearbyPlace[]> {
  if (!location) return demoNearby;
  const around = 3500;
  const query = `[out:json][timeout:25];(node(around:${around},${location.lat},${location.lon})[amenity~"atm|restaurant|cafe|bar"];way(around:${around},${location.lat},${location.lon})[amenity~"atm|restaurant|cafe|bar"];relation(around:${around},${location.lat},${location.lon})[amenity~"atm|restaurant|cafe|bar"];node(around:${around},${location.lat},${location.lon})[tourism="hotel"];way(around:${around},${location.lat},${location.lon})[tourism="hotel"];relation(around:${around},${location.lat},${location.lon})[tourism="hotel"];);out center tags;`;
  const endpoints = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.openstreetmap.fr/api/interpreter'];
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: `data=${encodeURIComponent(query)}` });
      if (!response.ok) continue;
      const data = await response.json();
      const items = (data.elements ?? []).map((el: any) => {
        const lat = el.type === 'node' ? el.lat : el.center?.lat;
        const lon = el.type === 'node' ? el.lon : el.center?.lon;
        if (typeof lat !== 'number' || typeof lon !== 'number') return null;
        const tags = el.tags ?? {};
        const kind = tags.amenity === 'atm' ? 'atm' : tags.amenity === 'restaurant' ? 'food' : tags.amenity === 'bar' ? 'drink' : tags.amenity === 'cafe' ? 'cafe' : 'hotel';
        const dist = Math.sqrt((lat - location.lat) ** 2 + (lon - location.lon) ** 2) * 111000;
        return { id: `${kind}-${el.id}`, title: tags.name ?? kind.toUpperCase(), kind, lat, lon, distance: dist, rating: tags.stars ? Number(tags.stars) : undefined, note: tags.description ?? '', tags };
      }).filter(Boolean).sort((a: NearbyPlace, b: NearbyPlace) => a.distance - b.distance).slice(0, 20);
      if (items.length) return items;
    } catch {}
  }
  return demoNearby;
}
