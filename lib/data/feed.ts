import type { EventItem, ExploreItem, FeedItem, NearbyPlace, TravelPhase } from '../types';
function periodLabel(): string { const hour = new Date().getHours(); if (hour < 12) return 'Morning'; if (hour < 18) return 'Afternoon'; return 'Evening'; }
export function buildTravelFeed(params: { phase: TravelPhase; city?: string; rateText: string; nearby: NearbyPlace[]; explore: ExploreItem[]; events: (EventItem & { distance: number; date: string })[]; stayDays: number; }): FeedItem[] {
  const items: FeedItem[] = [];
  items.push({ id: 'phase', title: `Phase: ${params.phase}`, subtitle: params.phase === 'hotel' ? 'Hotel mode prioritizes housekeeping, breakfast and support.' : params.phase === 'trip' ? 'Trip mode prioritizes Explore Nearby and Local Events.' : 'The app adapts to the travel phase.', tone: 'accent' });
  if (params.city) items.push({ id: 'city', title: `You are in ${params.city}`, subtitle: 'Local highlights and tips are prioritized for this location.', tone: 'info' });
  items.push({ id: 'rate', title: 'Exchange rate snapshot', subtitle: `The current rate is instantly available: ${params.rateText}.`, tone: 'success' });
  if (params.events.length) { const ev = params.events[0]; items.push({ id: 'event', title: `${ev.emoji} ${ev.title}`, subtitle: `${ev.time} · ${ev.duration} · ${ev.note}`, meta: 'Local event', tone: 'warning' }); }
  if (params.explore.length) { const item = params.explore[0]; items.push({ id: 'explore', title: `${item.emoji} ${item.title}`, subtitle: `${Math.round(item.distance)} m away · ${item.note}`, meta: `${item.rating.toFixed(1)}★`, tone: 'info' }); }
  if (params.nearby.length) { const place = params.nearby[0]; items.push({ id: 'nearby', title: `Closest ${place.kind}`, subtitle: `${place.title} · ${Math.round(place.distance)} m away`, tone: 'accent' }); }
  if (params.stayDays >= 5) items.push({ id: 'stay', title: `Trip length: ${params.stayDays} days`, subtitle: 'The app should surface more events, ferries and hidden gems.', tone: 'success' });
  items.push({ id: 'time', title: `${periodLabel()} suggestion`, subtitle: periodLabel() === 'Evening' ? 'Sunset spots and local food work best now.' : 'Use Nearby and Explore to move faster.', tone: 'accent' });
  return items.slice(0, 6);
}
