import type { FeedItem, Phase } from '@/lib/types';
import { buildTravelFeed } from '@/lib/mock-data';

export function buildFeed(phase: Phase, cityLabel: string): FeedItem[] {
  return buildTravelFeed(phase, cityLabel);
}
