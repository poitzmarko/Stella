import type { LocationState, EventItem } from '../types';
import { demoEventCatalog } from '../data/events';
export async function fetchLocalEvents(location: LocationState | null, stayDays: number): Promise<(EventItem & { distance: number; date: string })[]> {
  const base = demoEventCatalog.map((event, index) => { const date = new Date(); date.setDate(date.getDate() + (index % Math.max(1, stayDays))); return { ...event, date: date.toISOString(), distance: 280 + index * 110 }; });
  if (!location) return base.slice(0, 8);
  const lat = location.lat; const lon = location.lon;
  return base.map((event, index) => ({ ...event, distance: Math.round(180 + Math.abs(Math.sin(index + lat + lon)) * 2200) })).slice(0, 20);
}
