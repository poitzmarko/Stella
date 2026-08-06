'use client';

import { useEffect, useRef } from 'react';
import type { EventItem, ExploreItem, NearbyPlace, LocationState } from '@/lib/types';

type Props = {
  location: LocationState | null;
  nearbyPlaces: NearbyPlace[];
  exploreItems: ExploreItem[];
  events: (EventItem & { distance: number; date: string })[];
};

export function MapPane({ location, nearbyPlaces, exploreItems, events }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    async function renderMap() {
      if (!mapRef.current) return;
      const L = await import('leaflet');
      if (!mounted) return;

      if (!mapInstance.current) {
        mapInstance.current = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: false,
        }).setView([location?.lat ?? 54.52, location?.lon ?? 13.41], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapInstance.current);
      } else {
        mapInstance.current.setView([location?.lat ?? 54.52, location?.lon ?? 13.41], 13);
      }

      const layer = L.layerGroup().addTo(mapInstance.current);

      if (location) {
        L.circleMarker([location.lat, location.lon], {
          radius: 9,
          color: '#22c55e',
          weight: 3,
          fillColor: '#86efac',
          fillOpacity: 0.9,
        }).addTo(layer).bindPopup('You are here');
      }

      nearbyPlaces.slice(0, 6).forEach((item) => {
        L.circleMarker([item.lat, item.lon], {
          radius: 7,
          color: '#0ea5e9',
          weight: 2,
          fillColor: '#38bdf8',
          fillOpacity: 0.22,
        }).addTo(layer).bindPopup(`<strong>${item.title}</strong><br/>${item.kind.toUpperCase()} · ${Math.round(item.distance)} m`);
      });

      exploreItems.slice(0, 4).forEach((item) => {
        const lat = (location?.lat ?? 54.52) + (Math.random() - 0.5) * 0.02;
        const lon = (location?.lon ?? 13.41) + (Math.random() - 0.5) * 0.02;
        L.circleMarker([lat, lon], {
          radius: 6,
          color: '#8b5cf6',
          weight: 2,
          fillColor: '#c084fc',
          fillOpacity: 0.20,
        }).addTo(layer).bindPopup(`<strong>${item.emoji} ${item.title}</strong><br/>${Math.round(item.distance)} m · ${item.rating.toFixed(1)}★`);
      });

      events.slice(0, 4).forEach((item) => {
        const lat = (location?.lat ?? 54.52) + (Math.random() - 0.5) * 0.015;
        const lon = (location?.lon ?? 13.41) + (Math.random() - 0.5) * 0.015;
        L.circleMarker([lat, lon], {
          radius: 6,
          color: '#f59e0b',
          weight: 2,
          fillColor: '#fbbf24',
          fillOpacity: 0.18,
        }).addTo(layer).bindPopup(`<strong>${item.emoji} ${item.title}</strong><br/>${item.time} · ${item.duration}`);
      });

      return () => layer.remove();
    }

    const cleanupPromise = renderMap();

    return () => {
      mounted = false;
      cleanupPromise.then((cleanup) => cleanup?.()).catch(() => {});
    };
  }, [location, nearbyPlaces, exploreItems, events]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Map</div>
          <div className="text-lg font-black">OpenStreetMap + Live Context</div>
        </div>
        <div className="text-xs text-slate-400">
          {location?.label ?? 'No location yet'}
        </div>
      </div>
      <div ref={mapRef} className="h-80 w-full rounded-3xl border border-white/10 bg-slate-900/40" />
    </div>
  );
}
