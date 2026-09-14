'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n';
import { createFallbackEvents, defaultLocation } from '@/lib/mock-data';
import { fetchExploreHighlights, fetchLocalEvents, fetchNearbyPlaces } from '@/lib/sources';
import { formatDistance, mapsRouteUrl, mapsSearchUrl } from '@/lib/geo';
import type { EventItem, ExploreItem, LocationPoint, NearbyPlace } from '@/lib/types';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/map-view').then((m) => m.MapView), { ssr: false });

type Props = {
  location: LocationPoint | null;
  cityLabel: string;
};

export function DiscoveryModule({ location, cityLabel }: Props) {
  const { t } = useI18n();
  const [tab, setTab] = useState<'nearby' | 'explore' | 'events'>('nearby');
  const [stayDays, setStayDays] = useState(3);
  const [nearby, setNearby] = useState<NearbyPlace[]>([]);
  const [explore, setExplore] = useState<ExploreItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const activeLocation = location ?? defaultLocation;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([
      fetchNearbyPlaces(activeLocation),
      fetchExploreHighlights(activeLocation),
      fetchLocalEvents(activeLocation, stayDays)
    ]).then(([nearbyRes, exploreRes, eventRes]) => {
      if (!alive) return;
      setNearby(nearbyRes);
      setExplore(exploreRes);
      setEvents(eventRes);
    }).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [activeLocation.lat, activeLocation.lon, stayDays]);

  const visibleNearby = useMemo(() => nearby.slice(0, 20), [nearby]);
  const visibleExplore = useMemo(() => explore.slice(0, 20), [explore]);
  const visibleEvents = useMemo(() => events.slice(0, 20), [events]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('discover')}</CardTitle>
        <CardDescription>{cityLabel || t('locationHint')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-wrap gap-2">
          <Tabs>
            <TabsList>
              <TabsTrigger active={tab === 'nearby'} onClick={() => setTab('nearby')}>{t('nearby')}</TabsTrigger>
              <TabsTrigger active={tab === 'explore'} onClick={() => setTab('explore')}>{t('explore')}</TabsTrigger>
              <TabsTrigger active={tab === 'events'} onClick={() => setTab('events')}>{t('events')}</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-wrap items-center gap-2">
            {[1, 3, 5, 10].map((d) => (
              <Button
                key={d}
                variant={stayDays === d ? 'default' : 'secondary'}
                size="sm"
                className="rounded-full"
                onClick={() => setStayDays(d)}
              >
                {d === 1 ? t('today') : `${d} ${t('stayLabel')}`}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-[1.25rem] border border-border bg-white/60 p-3 dark:bg-slate-950/30">
            {loading && <div className="mb-3 text-sm text-muted">{t('loading')}</div>}
            <MapView center={activeLocation} places={tab === 'nearby' ? visibleNearby : []} />
          </div>
          <div className="grid gap-3">
            {tab === 'nearby' && visibleNearby.map((place) => (
              <div key={place.id} className="rounded-[1.2rem] border border-border bg-surface p-3 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{place.title}</div>
                    <div className="mt-1 text-sm text-muted">{formatDistance(place.distance)} · {place.rating?.toFixed(1) ?? '—'}</div>
                  </div>
                  <Badge>{place.category.toUpperCase()}</Badge>
                </div>
                <div className="mt-2 text-sm text-muted">{place.note}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" className="rounded-full" onClick={() => window.open(mapsRouteUrl(place.lat, place.lon), '_blank')}>{t('route')}</Button>
                  <Button size="sm" variant="secondary" className="rounded-full" onClick={() => window.open(mapsSearchUrl(place.title, place.lat, place.lon), '_blank')}>{t('openInMaps')}</Button>
                </div>
              </div>
            ))}

            {tab === 'explore' && visibleExplore.map((item) => (
              <div key={item.id} className="rounded-[1.2rem] border border-border bg-surface p-3 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{item.title}</div>
                    <div className="mt-1 text-sm text-muted">{formatDistance(item.distance)} · ★ {item.rating.toFixed(1)}</div>
                  </div>
                  <Badge>{item.category.toUpperCase()}</Badge>
                </div>
                <div className="mt-2 text-sm text-muted">{item.note}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" className="rounded-full" onClick={() => window.open(mapsRouteUrl(item.lat, item.lon), '_blank')}>{t('route')}</Button>
                  <Button size="sm" variant="secondary" className="rounded-full" onClick={() => window.open(mapsSearchUrl(item.title, item.lat, item.lon), '_blank')}>{t('openInMaps')}</Button>
                </div>
              </div>
            ))}

            {tab === 'events' && visibleEvents.map((item) => (
              <div key={item.id} className="rounded-[1.2rem] border border-border bg-surface p-3 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{item.title}</div>
                    <div className="mt-1 text-sm text-muted">{item.date} · {item.time} · {formatDistance(item.distance)}</div>
                  </div>
                  <Badge>{item.category.toUpperCase()}</Badge>
                </div>
                <div className="mt-2 text-sm text-muted">{item.note}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" className="rounded-full" onClick={() => window.open(mapsRouteUrl(item.lat, item.lon), '_blank')}>{t('route')}</Button>
                  <Button size="sm" variant="secondary" className="rounded-full" onClick={() => window.open(mapsSearchUrl(item.title, item.lat, item.lon), '_blank')}>{t('openInMaps')}</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
