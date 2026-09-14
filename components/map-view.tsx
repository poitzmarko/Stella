'use client';

import { useEffect, useRef } from 'react';
import type { NearbyPlace, LocationPoint } from '@/lib/types';
import { mapsRouteUrl } from '@/lib/geo';

type Props = {
  center?: LocationPoint;
  places: NearbyPlace[];
};

export function MapView({ center, places }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let map: any;
    let layer: any;

    let cancelled = false;
    async function init() {
      if (!ref.current || !center) return;
      const L = await import('leaflet');
      if (cancelled) return;

      map = L.map(ref.current, { zoomControl: true, scrollWheelZoom: false }).setView([center.lat, center.lon], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      layer = L.layerGroup().addTo(map);
      L.circleMarker([center.lat, center.lon], {
        radius: 10,
        weight: 3,
        color: '#14b8a6',
        fillColor: '#5eead4',
        fillOpacity: 0.9
      }).addTo(layer).bindPopup('You are here');

      places.forEach((place) => {
        const marker = L.circleMarker([place.lat, place.lon], {
          radius: 8,
          weight: 2,
          color: '#0f172a',
          fillColor: '#f8fafc',
          fillOpacity: 0.95
        }).addTo(layer);
        marker.bindPopup(`<strong>${place.title}</strong><br/>${Math.round(place.distance)} m<br/><a href="${mapsRouteUrl(place.lat, place.lon)}" target="_blank" rel="noreferrer">Route</a>`);
      });
    }

    init();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [center?.lat, center?.lon, places]);

  return <div ref={ref} className="h-[320px] w-full rounded-[1.25rem]" />;
}
