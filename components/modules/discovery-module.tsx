"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { useI18n } from "@/lib/i18n";
import { defaultLocation } from "@/lib/mock-data";
import {
  fetchExploreHighlights,
  fetchLocalEvents,
  fetchNearbyPlaces,
} from "@/lib/sources";
import {
  formatDistance,
  mapsRouteUrl,
  mapsSearchUrl,
} from "@/lib/geo";

import type {
  EventItem,
  ExploreItem,
  LocationPoint,
  NearbyPlace,
} from "@/lib/types";

const MapView = dynamic(
  () =>
    import("@/components/map-view").then(
      (module) => module.MapView,
    ),
  {
    ssr: false,
  },
);

type Props = {
  location: LocationPoint | null;
  cityLabel: string;
};

type DiscoveryTab =
  | "nearby"
  | "explore"
  | "events";

function nearbyLabel(
  place: NearbyPlace,
): string {
  return (
    place.kind?.toUpperCase() ??
    "PLACE"
  );
}

function nearbyEmoji(
  place: NearbyPlace,
): string {
  switch (place.kind) {
    case "atm":
      return "🏧";

    case "food":
      return "🍽️";

    case "drink":
      return "🍸";

    case "cafe":
      return "☕";

    case "hotel":
      return "🏨";

    default:
      return "📍";
  }
}

function exploreLabel(
  item: ExploreItem,
): string {
  return (
    item.kind?.toUpperCase() ??
    "HIGHLIGHT"
  );
}

function exploreEmoji(
  item: ExploreItem,
): string {
  if (item.emoji) {
    return item.emoji;
  }

  switch (item.kind) {
    case "water":
      return "⛵";

    case "nature":
      return "🌲";

    case "culture":
      return "🎭";

    case "food":
      return "🍽️";

    case "family":
      return "👨‍👩‍👧";

    default:
      return "✨";
  }
}

function eventEmoji(
  item: EventItem,
): string {
  if (item.emoji) {
    return item.emoji;
  }

  switch (item.category) {
    case "music":
      return "🎵";

    case "sport":
      return "⚽";

    case "outdoor":
      return "🌲";

    case "family":
      return "👨‍👩‍👧";

    case "food":
      return "🍽️";

    case "culture":
      return "🎭";

    default:
      return "🎟️";
  }
}

export function DiscoveryModule({
  location,
  cityLabel,
}: Props) {
  const { t } = useI18n();

  const [tab, setTab] =
    useState<DiscoveryTab>("nearby");

  const [stayDays, setStayDays] =
    useState<number>(3);

  const [nearby, setNearby] =
    useState<NearbyPlace[]>([]);

  const [explore, setExplore] =
    useState<ExploreItem[]>([]);

  const [events, setEvents] =
    useState<EventItem[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const activeLocation =
    location ?? defaultLocation;

  useEffect(() => {
    let alive = true;

    async function loadDiscoveryData() {
      setLoading(true);

      try {
        const [
          nearbyResult,
          exploreResult,
          eventsResult,
        ] = await Promise.all([
          fetchNearbyPlaces(
            activeLocation,
          ),
          fetchExploreHighlights(
            activeLocation,
          ),
          fetchLocalEvents(
            activeLocation,
            stayDays,
          ),
        ]);

        if (!alive) {
          return;
        }

        setNearby(
          nearbyResult ?? [],
        );

        setExplore(
          exploreResult ?? [],
        );

        setEvents(
          eventsResult ?? [],
        );
      } catch {
        if (!alive) {
          return;
        }

        setNearby([]);
        setExplore([]);
        setEvents([]);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    void loadDiscoveryData();

    return () => {
      alive = false;
    };
  }, [
    activeLocation.lat,
    activeLocation.lon,
    stayDays,
  ]);

  const visibleNearby =
    useMemo(
      () => nearby.slice(0, 20),
      [nearby],
    );

  const visibleExplore =
    useMemo(
      () => explore.slice(0, 20),
      [explore],
    );

  const visibleEvents =
    useMemo(
      () => events.slice(0, 20),
      [events],
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("discover")}
        </CardTitle>

        <CardDescription>
          {cityLabel ||
            t("locationHint")}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs>
            <TabsList>
              <TabsTrigger
                active={tab === "nearby"}
                onClick={() =>
                  setTab("nearby")
                }
              >
                {t("nearby")}
              </TabsTrigger>

              <TabsTrigger
                active={tab === "explore"}
                onClick={() =>
                  setTab("explore")
                }
              >
                {t("explore")}
              </TabsTrigger>

              <TabsTrigger
                active={tab === "events"}
                onClick={() =>
                  setTab("events")
                }
              >
                {t("events")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap items-center gap-2">
            {[1, 3, 5, 10].map(
              (days) => (
                <Button
                  key={days}
                  variant={
                    stayDays === days
                      ? "default"
                      : "secondary"
                  }
                  size="sm"
                  className="rounded-full"
                  onClick={() =>
                    setStayDays(days)
                  }
                >
                  {days === 1
                    ? t("today")
                    : `${days} ${t("stayLabel")}`}
                </Button>
              ),
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-[1.25rem] border border-border bg-white/60 p-3 dark:bg-slate-950/30">
            {loading && (
              <div className="mb-3 text-sm text-muted">
                {t("loading")}
              </div>
            )}

            <MapView
              center={activeLocation}
              places={
                tab === "nearby"
                  ? visibleNearby
                  : []
              }
            />
          </div>

          <div className="grid gap-3">
            {tab === "nearby" &&
              visibleNearby.map(
                (place) => (
                  <div
                    key={place.id}
                    className="rounded-[1.2rem] border border-border bg-surface p-3 shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">
                          {nearbyEmoji(place)}{" "}
                          {place.title}
                        </div>

                        <div className="mt-1 text-sm text-muted">
                          {formatDistance(
                            place.distance,
                          )}{" "}
                          ·{" "}
                          {place.rating?.toFixed(
                            1,
                          ) ?? "—"}
                        </div>
                      </div>

                      <Badge>
                        {nearbyLabel(
                          place,
                        )}
                      </Badge>
                    </div>

                    <div className="mt-2 text-sm text-muted">
                      {place.note ??
                        ""}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="rounded-full"
                        onClick={() =>
                          window.open(
                            mapsRouteUrl(
                              place.lat,
                              place.lon,
                            ),
                            "_blank",
                            "noopener,noreferrer",
                          )
                        }
                      >
                        {t("route")}
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full"
                        onClick={() =>
                          window.open(
                            mapsSearchUrl(
                              place.title,
                              place.lat,
                              place.lon,
                            ),
                            "_blank",
                            "noopener,noreferrer",
                          )
                        }
                      >
                        {t("openInMaps")}
                      </Button>
                    </div>
                  </div>
                ),
              )}

            {tab === "nearby" &&
              !loading &&
              visibleNearby.length === 0 && (
                <div className="rounded-[1.2rem] border border-border bg-surface p-4 text-sm text-muted">
                  {t("empty")}
                </div>
              )}

            {tab === "explore" &&
              visibleExplore.map(
                (item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="rounded-[1.2rem] border border-border bg-surface p-3 shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">
                          {exploreEmoji(
                            item,
                          )}{" "}
                          {item.title}
                        </div>

                        <div className="mt-1 text-sm text-muted">
                          {formatDistance(
                            item.distance,
                          )}{" "}
                          · ★{" "}
                          {item.rating.toFixed(
                            1,
                          )}
                        </div>
                      </div>

                      <Badge>
                        {exploreLabel(
                          item,
                        )}
                      </Badge>
                    </div>

                    <div className="mt-2 text-sm text-muted">
                      {item.note}
                    </div>

                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full"
                        disabled
                        title={t(
                          "openInMaps",
                        )}
                      >
                        {t("openInMaps")}
                      </Button>
                    </div>
                  </div>
                ),
              )}

            {tab === "explore" &&
              !loading &&
              visibleExplore.length === 0 && (
                <div className="rounded-[1.2rem] border border-border bg-surface p-4 text-sm text-muted">
                  {t("empty")}
                </div>
              )}

            {tab === "events" &&
              visibleEvents.map(
                (item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="rounded-[1.2rem] border border-border bg-surface p-3 shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">
                          {eventEmoji(item)}{" "}
                          {item.title}
                        </div>

                        <div className="mt-1 text-sm text-muted">
                          {item.time}
                          {item.duration
                            ? ` · ${item.duration}`
                            : ""}
                        </div>
                      </div>

                      <Badge>
                        {item.category.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="mt-2 text-sm text-muted">
                      {item.note}
                    </div>

                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full"
                        disabled
                        title={t(
                          "openInMaps",
                        )}
                      >
                        {t("openInMaps")}
                      </Button>
                    </div>
                  </div>
                ),
              )}

            {tab === "events" &&
              !loading &&
              visibleEvents.length === 0 && (
                <div className="rounded-[1.2rem] border border-border bg-surface p-4 text-sm text-muted">
                  {t("empty")}
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
