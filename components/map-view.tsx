"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";

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

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => {
      window.requestAnimationFrame(() => map.invalidateSize({ pan: false }));
    };

    invalidate();

    const container = map.getContainer();
    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(invalidate)
      : null;

    observer?.observe(container);
    window.addEventListener("resize", invalidate);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", invalidate);
    };
  }, [map]);

  return null;
}

function MapViewport({ center, places }: MapViewProps) {
  const map = useMap();
  const lastCenter = useRef<string>("");
  const lastPlaces = useRef<string>("");

  useEffect(() => {
    const centerKey = `${center.lat.toFixed(5)},${center.lon.toFixed(5)}`;
    const placesKey = (places ?? [])
      .map((place) => `${place.id}:${place.lat.toFixed(5)},${place.lon.toFixed(5)}`)
      .join("|");

    const hasChanged = centerKey !== lastCenter.current || placesKey !== lastPlaces.current;

    if (!hasChanged) return;

    lastCenter.current = centerKey;
    lastPlaces.current = placesKey;

    window.requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });

      const validPlaces = (places ?? []).filter(
        (place) => Number.isFinite(place.lat) && Number.isFinite(place.lon),
      );

      if (validPlaces.length === 0) {
        map.setView([center.lat, center.lon], 14, { animate: true });
        return;
      }

      const bounds = L.latLngBounds([
        [center.lat, center.lon],
        ...validPlaces.map((place) => [place.lat, place.lon] as [number, number]),
      ]);

      map.fitBounds(bounds, {
        paddingTopLeft: [28, 28],
        paddingBottomRight: [28, 28],
        maxZoom: 15,
        animate: true,
      });
    });
  }, [center, places, map]);

  return null;
}

export function MapView({ center, places = [] }: MapViewProps) {
  const userIcon = useMemo(() => markerIcon("user", true), []);

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[1.35rem] bg-slate-100 dark:bg-slate-950 sm:h-[440px] lg:h-[520px]">
      <MapContainer
        center={[center.lat, center.lon]}
        zoom={14}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom
        touchZoom
        dragging
        className="h-full w-full"
        preferCanvas
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl position="bottomright" />
        <MapResizeHandler />
        <MapViewport center={center} places={places} />

        <CircleMarker
          center={[center.lat, center.lon]}
          radius={9}
          pathOptions={{
            color: "#0f172a",
            weight: 3,
            fillColor: "#ffffff",
            fillOpacity: 1,
          }}
        />

        <Marker position={[center.lat, center.lon]} icon={userIcon} opacity={0.001} />

        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lon]}
            icon={markerIcon(place.kind)}
            riseOnHover
          >
            <Popup closeButton>
              <div className="min-w-[190px] p-0.5">
                <div className="text-sm font-bold">{place.title}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {formatDistance(place.distance)}
                  {place.rating ? ` · ★ ${place.rating.toFixed(1)}` : ""}
                </div>
                {place.note ? (
                  <div className="mt-2 text-xs leading-5 text-slate-600">
                    {place.note}
                  </div>
                ) : null}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

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
