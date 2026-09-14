import type { LocationState, ExploreItem } from '../types';
import { exploreCatalog } from '../data/explore';
export async function fetchExploreHighlights(location: LocationState | null): Promise<ExploreItem[]> {
  if (!location) return exploreCatalog.slice(0, 8);
  const lat = location.lat;
  const lon = location.lon;
  const query = `[out:json][timeout:25];(node(around:5000,${lat},${lon})[tourism~"attraction|museum|viewpoint|gallery|zoo"];way(around:5000,${lat},${lon})[tourism~"attraction|museum|viewpoint|gallery|zoo"];relation(around:5000,${lat},${lon})[tourism~"attraction|museum|viewpoint|gallery|zoo"];node(around:5000,${lat},${lon})[natural~"beach|water|sand|reef|wood|tree"];way(around:5000,${lat},${lon})[natural~"beach|water|sand|reef|wood|tree"];relation(around:5000,${lat},${lon})[natural~"beach|water|sand|reef|wood|tree"];node(around:5000,${lat},${lon})[amenity~"restaurant|cafe|bar|pub"];way(around:5000,${lat},${lon})[amenity~"restaurant|cafe|bar|pub"];relation(around:5000,${lat},${lon})[amenity~"restaurant|cafe|bar|pub"];node(around:5000,${lat},${lon})[route=ferry];way(around:5000,${lat},${lon})[route=ferry];relation(around:5000,${lat},${lon})[route=ferry];);out center tags;`;
  const endpoints = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.openstreetmap.fr/api/interpreter'];
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: `data=${encodeURIComponent(query)}` });
      if (!response.ok) continue;
      const data = await response.json();
      const items = (data.elements ?? []).map((el: any) => {
        const elLat = el.type === 'node' ? el.lat : el.center?.lat;
        const elLon = el.type === 'node' ? el.lon : el.center?.lon;
        if (typeof elLat !== 'number' || typeof elLon !== 'number') return null;
        const tags = el.tags ?? {};
        const title = tags.name ?? tags.tourism ?? tags.natural ?? tags.amenity ?? 'Highlight';
        const kind = tags.route === 'ferry' ? 'water' : /beach|water/.test(tags.natural ?? '') ? 'water' : /museum|gallery|zoo|attraction|viewpoint/.test(tags.tourism ?? '') ? 'culture' : /restaurant|cafe|bar|pub/.test(tags.amenity ?? '') ? 'food' : /tree|wood|reef/.test(tags.natural ?? '') ? 'nature' : 'family';
        const distance = Math.sqrt((elLat - location.lat) ** 2 + (elLon - location.lon) ** 2) * 111000;
        return { title, kind, emoji: kind === 'water' ? '⛵' : kind === 'nature' ? '🌲' : kind === 'food' ? '🍽' : kind === 'culture' ? '🎭' : '👨‍👩‍👧', distance, rating: tags.stars ? Number(tags.stars) : 4.6, note: tags.description ?? 'Local travel highlight.' };
      }).filter(Boolean).sort((a: ExploreItem, b: ExploreItem) => (b.rating - a.rating) || (a.distance - b.distance)).slice(0, 20);
      if (items.length) return items;
    } catch {}
  }
  return exploreCatalog.slice(0, 12);
}
