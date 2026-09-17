"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import L from "leaflet";

import { formatDistance } from "@/lib/geo";
import type { LocationPoint, NearbyPlace } from "@/lib/types";

type MapViewProps = {
  center: LocationPoint;
  places?: NearbyPlace[];
};

const CATEGORY_ICON: Record<string, string> = {
  atm: "€",
  food: "🍴",
  cafe: "☕",
  drink: "🍸",
  hotel: "⌂",
};

function markerIcon(kind: string, active = false) {
  const glyph = CATEGORY_ICON[kind] ?? "•";

  return L.divIcon({
    className: "fx-map-marker",
    html: `<span class="fx-map-marker__pin${active ? " fx-map-marker__pin--active" : ""}"><span>${glyph}</span></span>`,
    iconSize: [38, 46],
    iconAnchor: [19, 42],
    popupAnchor: [0, -38],
  });
}

function validPoint(point: LocationPoint) {
  return Number.isFinite(point.lat) && Number.isFinite(point.lon);
}

function validPlace(place: NearbyPlace) {
  return Number.isFinite(place.lat) && Number.isFinite(place.lon);
}

export function MapView({ center, places = [] }: MapViewProps) {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const userMarkerRef = useRef<LeafletMarker | null>(null);
  const poiLayerRef = useRef<L.LayerGroup | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) {
      return;
    }

    const map = L.map(mapNodeRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      touchZoom: true,
      dragging: true,
      preferCanvas: true,
      attributionControl: true,
    });

    mapRef.current = map;

    L.control
      .zoom({ position: "bottomright" })
      .addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      detectRetina: true,
      updateWhenIdle: true,
      keepBuffer: 2,
    }).addTo(map);

    poiLayerRef.current = L.layerGroup().addTo(map);

    if (validPoint(center)) {
      map.setView([center.lat, center.lon], 14, { animate: false });
    } else {
      map.setView([52.39, 13.06], 12, { animate: false });
    }

    const invalidate = () => {
      window.requestAnimationFrame(() => {
        map.invalidateSize({ pan: false });
      });
    };

    invalidate();
    window.setTimeout(invalidate, 100);
    window.setTimeout(invalidate, 350);

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(invalidate);
      observer.observe(mapNodeRef.current);
      resizeObserverRef.current = observer;
    }

    window.addEventListener("resize", invalidate);

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      window.removeEventListener("resize", invalidate);

      userMarkerRef.current?.remove();
      userMarkerRef.current = null;

      poiLayerRef.current?.clearLayers();
      poiLayerRef.current = null;

      map.remove();
      mapRef.current = null;
    };
    // The map instance must only be created once. Location/POI updates are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !validPoint(center)) {
      return;
    }

    const nextCenter: [number, number] = [center.lat, center.lon];

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker(nextCenter, {
        icon: markerIcon("user", true),
        keyboard: false,
        interactive: false,
      }).addTo(map);
    } else {
      userMarkerRef.current.setLatLng(nextCenter);
    }

    const validPlaces = places.filter(validPlace).slice(0, 20);

    if (poiLayerRef.current) {
      poiLayerRef.current.clearLayers();

      for (const place of validPlaces) {
        const marker = L.marker([place.lat, place.lon], {
          icon: markerIcon(place.kind),
          riseOnHover: true,
          title: place.title,
        });

        const rating =
          typeof place.rating === "number" && Number.isFinite(place.rating)
            ? ` · ★ ${place.rating.toFixed(1)}`
            : "";

        const note = place.note
          ? `<div class="mt-2 text-xs leading-5 text-slate-600">${place.note}</div>`
          : "";

        marker.bindPopup(
          `<div class="min-w-[190px] p-0.5"><div class="text-sm font-bold">${place.title}</div><div class="mt-1 text-xs text-slate-500">${formatDistance(place.distance)}${rating}</div>${note}</div>`,
          { closeButton: true },
        );

        marker.addTo(poiLayerRef.current);
      }
    }

    map.invalidateSize({ pan: false });

    if (validPlaces.length === 0) {
      map.setView(nextCenter, 14, { animate: true });
      return;
    }

    const bounds = L.latLngBounds([
      nextCenter,
      ...validPlaces.map((place) => [place.lat, place.lon] as [number, number]),
    ]);

    map.fitBounds(bounds, {
      paddingTopLeft: [28, 28],
      paddingBottomRight: [28, 28],
      maxZoom: 15,
      animate: false,
    });
  }, [center.lat, center.lon, places]);

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[1.35rem] bg-slate-100 dark:bg-slate-950 sm:h-[440px] lg:h-[520px]">
      <div ref={mapNodeRef} className="h-full w-full" />

      <div className="pointer-events-none absolute left-3 top-3 z-[500] rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/90 dark:text-slate-200">
        {places.length > 0 ? `${Math.min(places.length, 20)} Orte` : "Standort"}
      </div>

      {places.length === 0 ? (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[500] rounded-2xl border border-white/70 bg-white/90 p-3 shadow-soft backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/90">
          <div className="text-sm font-bold">Noch keine Orte geladen</div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Standort aktivieren oder später erneut versuchen.
          </div>
        </div>
      ) : null}

      <style>{`
        .fx-map-marker {
          background: transparent !important;
          border: 0 !important;
        }
        .fx-map-marker__pin {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: 999px 999px 999px 6px;
          transform: rotate(-45deg);
          background: rgba(15, 23, 42, 0.96);
          color: white;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.22);
          border: 2px solid rgba(255,255,255,0.96);
        }
        .fx-map-marker__pin > span {
          transform: rotate(45deg);
          font-size: 15px;
          line-height: 1;
        }
        .fx-map-marker__pin--active {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #0ea5e9, #14b8a6);
        }
        .leaflet-container {
          font-family: inherit;
        }
        .leaflet-control-zoom {
          border: 0 !important;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12) !important;
          overflow: hidden;
          border-radius: 12px !important;
        }
        .leaflet-control-zoom a {
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          border: 0 !important;
          font-size: 18px !important;
        }
        .leaflet-popup-content-wrapper,
        .leaflet-popup-tip {
          background: rgba(255,255,255,0.98);
        }
        .dark .leaflet-popup-content-wrapper,
        .dark .leaflet-popup-tip {
          background: rgba(15,23,42,0.98);
          color: white;
        }
      `}</style>
    </div>
  );
}
