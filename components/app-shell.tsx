"use client";

import dynamic from "next/dynamic";
import {
  ArrowLeftRight,
  CalendarDays,
  ChevronRight,
  Compass,
  Copy,
  Globe2,
  Languages,
  MapPin,
  Menu,
  Moon,
  Navigation,
  ShieldAlert,
  Sparkles,
  Star,
  Sun,
  WalletCards,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useI18n } from "@/lib/i18n";
import {
  baseRates,
  buildTravelFeed,
  currencyCatalog,
  defaultLocation,
  emergencyActions,
  eventTemplates,
  phrases,
  timelinePhases,
} from "@/lib/mock-data";
import {
  fetchExchangeRates,
  fetchLocalEvents,
  fetchNearbyPlaces,
  reverseGeocode,
} from "@/lib/sources";
import {
  formatDistance,
  mapsRouteUrl,
  mapsSearchUrl,
} from "@/lib/geo";
import type {
  EventItem,
  LocationPoint,
  NearbyPlace,
  Phase,
} from "@/lib/types";

const MapView = dynamic(
  () =>
    import("@/components/map-view").then(
      (module) => module.MapView,
    ),
  { ssr: false },
);

const QUICK_CURRENCIES = ["EUR", "PLN", "USD", "GBP", "CHF"];
const QUICK_PHRASE_IDS = ["towels", "breakfast", "ac", "taxi", "passport"];

type ThemeMode = "light" | "dark";
type MobileTab = "home" | "money" | "nearby" | "phrases" | "sos";

const STORAGE = {
  language: "fx-pro-language",
  theme: "fx-pro-theme",
  favorites: "fx-pro-currency-favorites",
  from: "fx-pro-from-currency",
  to: "fx-pro-to-currency",
};

function getCurrency(code: string) {
  return (
    currencyCatalog.find((item) => item.code === code) ??
    currencyCatalog[0]
  );
}

function normalizeRateMap(rates: Record<string, number>) {
  const result: Record<string, number> = { ...rates };

  const looksLikePerEur = Object.entries(rates).some(
    ([code, value]) => code !== "EUR" && value > 1,
  );

  if (looksLikePerEur) {
    return result;
  }

  for (const currency of currencyCatalog) {
    if (currency.code === "EUR") {
      result.EUR = 1;
      continue;
    }

    if (currency.rateToEUR > 0) {
      result[currency.code] = 1 / currency.rateToEUR;
    }
  }

  return result;
}

function convertAmount(
  amount: number,
  from: string,
  to: string,
  ratesPerEur: Record<string, number>,
) {
  const fromRate = ratesPerEur[from] ?? 1;
  const toRate = ratesPerEur[to] ?? 1;

  if (!Number.isFinite(amount) || amount < 0) {
    return 0;
  }

  return (amount / fromRate) * toRate;
}

function safeOpen(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function AppShell() {
  const { t, language, setLanguage, languages } = useI18n();

  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("home");
  const [phase, setPhase] = useState<Phase>("hotel");

  const [amount, setAmount] = useState("250");
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("PLN");

  const [rates, setRates] = useState<Record<string, number>>(
    normalizeRateMap(baseRates),
  );

  const [ratesLoading, setRatesLoading] = useState(true);

  const [favoriteCurrencies, setFavoriteCurrencies] = useState<string[]>([]);

  const [location, setLocation] = useState<LocationPoint>(defaultLocation);
  const [cityLabel, setCityLabel] = useState("Miedzyzdroje");

  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "ready" | "denied" | "error"
  >("idle");

  const [nearby, setNearby] = useState<NearbyPlace[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [stayDays, setStayDays] = useState(3);
  const [dataLoading, setDataLoading] = useState(false);

  const [copied, setCopied] = useState<string | null>(null);
  const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);

  const currencyRef = useRef<HTMLElement | null>(null);
  const nearbyRef = useRef<HTMLElement | null>(null);
  const phrasesRef = useRef<HTMLElement | null>(null);
  const sosRef = useRef<HTMLElement | null>(null);
  const feedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE.theme);

    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    }

    const storedFrom = window.localStorage.getItem(STORAGE.from);
    const storedTo = window.localStorage.getItem(STORAGE.to);

    if (
      storedFrom &&
      currencyCatalog.some((item) => item.code === storedFrom)
    ) {
      setFromCurrency(storedFrom);
    }

    if (
      storedTo &&
      currencyCatalog.some((item) => item.code === storedTo)
    ) {
      setToCurrency(storedTo);
    }

    const storedFavorites = window.localStorage.getItem(STORAGE.favorites);

    if (storedFavorites) {
      try {
        setFavoriteCurrencies(JSON.parse(storedFavorites));
      } catch {
        setFavoriteCurrencies([]);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE.theme, theme);
  }, [theme]);

  useEffect(() => {
    let alive = true;

    setRatesLoading(true);

    fetchExchangeRates()
      .then((result) => {
        if (!alive) {
          return;
        }

        setRates(normalizeRateMap(result));
      })
      .finally(() => {
        if (alive) {
          setRatesLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE.from, fromCurrency);
    window.localStorage.setItem(STORAGE.to, toCurrency);
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE.favorites,
      JSON.stringify(favoriteCurrencies),
    );
  }, [favoriteCurrencies]);

  const loadLocalData = useCallback(
    async (point: LocationPoint) => {
      setDataLoading(true);

      try {
        const [nearbyResult, eventResult] = await Promise.all([
          fetchNearbyPlaces(point),
          fetchLocalEvents(point, stayDays),
        ]);

        setNearby(nearbyResult ?? []);
        setEvents(eventResult ?? []);
      } finally {
        setDataLoading(false);
      }
    },
    [stayDays],
  );

  useEffect(() => {
    void loadLocalData(location);
  }, [location, loadLocalData]);

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("error");
      return;
    }

    setLocationStatus("loading");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        setLocation(nextLocation);
        setLocationStatus("ready");

        const resolvedCity = await reverseGeocode(nextLocation);

        if (resolvedCity && resolvedCity !== "Local area") {
          setCityLabel(resolvedCity.split(",")[0]);
        }
      },
      () => setLocationStatus("denied"),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }, []);

  const resultAmount = useMemo(() => {
    const parsed = Number(String(amount).replace(",", "."));

    return convertAmount(
      Number.isFinite(parsed) ? parsed : 0,
      fromCurrency,
      toCurrency,
      rates,
    );
  }, [amount, fromCurrency, toCurrency, rates]);

  const currentRate = useMemo(() => {
    return convertAmount(1, fromCurrency, toCurrency, rates);
  }, [fromCurrency, toCurrency, rates]);

  const feed = useMemo(
    () => buildTravelFeed(phase, cityLabel).slice(0, 4),
    [phase, cityLabel],
  );

  const quickPhrases = useMemo(
    () =>
      QUICK_PHRASE_IDS.map((id) =>
        phrases.find((phrase) => phrase.id === id),
      ).filter(Boolean),
    [],
  );

  const eventPreview = useMemo(() => events.slice(0, 3), [events]);

  const nearbyPreview = useMemo(() => nearby.slice(0, 4), [nearby]);

  const scrollTo = (target: React.RefObject<HTMLElement | null>) => {
    target.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const toggleFavorite = (code: string) => {
    setFavoriteCurrencies((current) =>
      current.includes(code)
        ? current.filter((item) => item !== code)
        : [...current, code],
    );
  };

  const copyText = async (text: string, marker: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(marker);

      window.setTimeout(() => {
        setCopied(null);
      }, 1600);
    } catch {
      setCopied(null);
    }
  };

  const sharePhrase = (phrase: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = "en-US";

      window.speechSynthesis.speak(utterance);
    }
  };

  const goToMobileTab = (tab: MobileTab) => {
    setMobileTab(tab);
    setMobileMenu(false);

    const mapping: Record<
      MobileTab,
      React.RefObject<HTMLElement | null> | null
    > = {
      home: feedRef,
      money: currencyRef,
      nearby: nearbyRef,
      phrases: phrasesRef,
      sos: sosRef,
    };

    const target = mapping[tab];

    if (target) {
      window.setTimeout(() => scrollTo(target), 40);
    }
  };

  const destinationCurrency = getCurrency(toCurrency);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,.10),transparent_30%),linear-gradient(180deg,var(--bg2),var(--bg))] text-text pb-24 md:pb-8">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-surface/90 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <button
            type="button"
            onClick={() => goToMobileTab("home")}
            className="group flex min-w-0 items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500 text-white shadow-premium transition-transform group-active:scale-95">
              <Globe2 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                FX Pro
              </div>

              <div className="truncate text-[15px] font-bold tracking-tight sm:text-base">
                Travel Gold
              </div>
            </div>
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={requestLocation}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm font-semibold shadow-soft transition hover:-translate-y-0.5"
            >
              <MapPin className="h-4 w-4" />
              <span className="max-w-28 truncate">{cityLabel}</span>
            </button>

            <select
              aria-label="Language"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as typeof language)
              }
              className="h-10 rounded-full border border-border bg-surface px-3 text-sm font-semibold outline-none"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() =>
                setTheme((current) =>
                  current === "light" ? "dark" : "light",
                )
              }
              aria-label={theme === "light" ? "Dark mode" : "Light mode"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface shadow-soft transition hover:-translate-y-0.5"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenu(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface shadow-soft md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={requestLocation}
              className="flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-bold shadow-soft"
            >
              <MapPin className="h-4 w-4" />
              <span className="max-w-24 truncate">{cityLabel}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setTheme((current) =>
                  current === "light" ? "dark" : "light",
                )
              }
              aria-label="Theme"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 lg:px-6">
        <section className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface shadow-premium">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

            <div className="relative p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Heute für dich
                </span>

                <span className="rounded-full border border-border px-3 py-1.5">
                  {destinationCurrency.flag} {destinationCurrency.code}
                </span>

                {locationStatus === "ready" && (
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-700 dark:text-emerald-300">
                    GPS aktiv
                  </span>
                )}
              </div>

              <div className="mt-5 max-w-3xl">
                <div className="text-sm font-semibold text-muted">
                  {t("phaseHotel")}
                </div>

                <h1 className="mt-1 text-3xl font-black tracking-[-0.03em] sm:text-5xl">
                  {cityLabel}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                  Alles Wichtige für deinen nächsten Schritt – kompakt, lokal
                  und mit einem Tap erreichbar.
                </p>
              </div>

              <div
                ref={feedRef as React.RefObject<HTMLDivElement>}
                className="mt-6 grid gap-2 sm:grid-cols-2"
              >
                {feed.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollTo(nearbyRef)}
                    className="group flex items-start gap-3 rounded-2xl border border-border bg-white/55 p-3.5 text-left shadow-soft transition hover:-translate-y-0.5 dark:bg-slate-950/20"
                  >
                    <span className="mt-0.5 text-xl">{item.icon ?? "✨"}</span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">
                        {item.title}
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-muted">
                        {item.body}
                      </span>
                    </span>

                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={requestLocation}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                >
                  <Navigation className="h-4 w-4" />

                  {locationStatus === "loading"
                    ? "Standort wird gesucht…"
                    : "Meinen Standort"}
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo(phrasesRef)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-bold shadow-soft"
                >
                  <Languages className="h-4 w-4" />
                  Schnellphrase
                </button>
              </div>
            </div>
          </div>

          <aside className="hidden rounded-[2rem] border border-border bg-surface p-5 shadow-premium lg:block">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">Reisemodus</div>
                <div className="mt-1 text-xs text-muted">
                  Was ist gerade relevant?
                </div>
              </div>

              <Compass className="h-5 w-5 text-muted" />
            </div>

            <div className="mt-5 grid gap-2">
              {timelinePhases
                .filter((item) =>
                  ["hotel", "holiday", "emergency", "return"].includes(item.id),
                )
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPhase(item.id)}
                    className={`flex items-center justify-between rounded-2xl border px-3.5 py-3 text-left transition ${
                      phase === item.id
                        ? "border-transparent bg-slate-950 text-white shadow-soft dark:bg-white dark:text-slate-950"
                        : "border-border bg-surface"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-bold">
                        {item.title}
                      </span>

                      <span
                        className={`mt-0.5 block text-xs ${
                          phase === item.id ? "opacity-70" : "text-muted"
                        }`}
                      >
                        {item.description}
                      </span>
                    </span>

                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
            </div>
          </aside>
        </section>

        <section
          ref={currencyRef}
          className="rounded-[2rem] border border-border bg-surface p-4 shadow-premium sm:p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <WalletCards className="h-4 w-4" />
                {t("smartCurrency")}
              </div>

              <div className="mt-1 text-xs text-muted">
                {ratesLoading
                  ? "Kurs wird aktualisiert…"
                  : "Aktueller Kurs · ohne Verlauf"}
              </div>
            </div>

            <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
              {ratesLoading ? "Update" : "Live / Offline"}
            </span>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-border bg-white/55 p-3 dark:bg-slate-950/20">
            <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-2xl bg-surface p-3 shadow-soft">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                  Von
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <select
                    value={fromCurrency}
                    onChange={(event) => setFromCurrency(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-base font-black outline-none"
                  >
                    {currencyCatalog.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.flag} {item.code}
                      </option>
                    ))}
                  </select>

                  <input
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    inputMode="decimal"
                    aria-label="Amount"
                    className="w-28 bg-transparent text-right text-2xl font-black outline-none sm:w-36 sm:text-3xl"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={swapCurrencies}
                aria-label="Währungen tauschen"
                className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface shadow-soft transition hover:rotate-180"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>

              <div className="rounded-2xl bg-surface p-3 shadow-soft">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                  Nach
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <select
                    value={toCurrency}
                    onChange={(event) => setToCurrency(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent text-base font-black outline-none"
                  >
                    {currencyCatalog.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.flag} {item.code}
                      </option>
                    ))}
                  </select>

                  <div className="w-28 text-right text-2xl font-black sm:w-36 sm:text-3xl">
                    {new Intl.NumberFormat(
                      language === "de" ? "de-DE" : "en-US",
                      {
                        maximumFractionDigits: 2,
                      },
                    ).format(resultAmount)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-semibold text-muted">
                1 {fromCurrency} ={" "}
                <span className="text-text">
                  {currentRate.toFixed(4)} {toCurrency}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    void copyText(
                      `${amount} ${fromCurrency} = ${resultAmount.toFixed(
                        2,
                      )} ${toCurrency}`,
                      "currency",
                    )
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
                >
                  <Copy className="h-4 w-4" />

                  {copied === "currency" ? "Kopiert" : "Kurs kopieren"}
                </button>

                <button
                  type="button"
                  onClick={() => toggleFavorite(toCurrency)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-bold"
                >
                  <Star
                    className={`h-4 w-4 ${
                      favoriteCurrencies.includes(toCurrency)
                        ? "fill-current"
                        : ""
                    }`}
                  />

                  {favoriteCurrencies.includes(toCurrency)
                    ? "Favorit"
                    : "Merken"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {QUICK_CURRENCIES.map((code) => {
              const item = getCurrency(code);

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setToCurrency(code)}
                  className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-bold transition ${
                    toCurrency === code
                      ? "border-transparent bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "border-border bg-surface"
                  }`}
                >
                  {item.flag} {code}
                </button>
              );
            })}
          </div>
        </section>

        <section
          ref={nearbyRef}
          className="rounded-[2rem] border border-border bg-surface p-4 shadow-premium sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <Navigation className="h-4 w-4" />
                In deiner Nähe
              </div>

              <div className="mt-1 text-xs text-muted">
                Karte, echte Entfernungen und direkte Route.
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                ["all", "Alles"],
                ["atm", "Geld"],
                ["restaurant", "Essen"],
                ["cafe", "Café"],
                ["hotel", "Hotel"],
              ].map(([id, label]) => (
                <span
                  key={id}
                  className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-bold"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
            <div className="overflow-hidden rounded-[1.5rem] border border-border bg-slate-100 dark:bg-slate-950">
              <MapView center={location} places={nearbyPreview} />
            </div>

            <div className="grid gap-2">
              {dataLoading && (
                <div className="rounded-2xl border border-border p-4 text-sm text-muted">
                  Lokale Treffer werden geladen…
                </div>
              )}

              {!dataLoading && nearbyPreview.length === 0 && (
                <div className="rounded-2xl border border-border p-4 text-sm text-muted">
                  Noch keine lokalen Treffer. Standort freigeben und erneut
                  versuchen.
                </div>
              )}

              {nearbyPreview.map((place) => (
                <div
                  key={place.id}
                  className="rounded-2xl border border-border bg-white/50 p-3.5 shadow-soft dark:bg-slate-950/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold">{place.title}</div>

                      <div className="mt-1 text-xs text-muted">
                        {formatDistance(place.distance)}
                        {place.rating
                          ? ` · ★ ${place.rating.toFixed(1)}`
                          : ""}
                      </div>
                    </div>

                    <span className="rounded-full border border-border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em]">
                      {place.kind}
                    </span>
                  </div>

                  <div className="mt-2 text-xs leading-5 text-muted">
                    {place.note}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        safeOpen(mapsRouteUrl(place.lat, place.lon))
                      }
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-950 px-3 text-xs font-bold text-white dark:bg-white dark:text-slate-950"
                    >
                      Route
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        safeOpen(
                          mapsSearchUrl(place.title, place.lat, place.lon),
                        )
                      }
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-bold"
                    >
                      Maps
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={phrasesRef}
          className="rounded-[2rem] border border-border bg-surface p-4 shadow-premium sm:p-5"
        >
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <Languages className="h-4 w-4" />
                Travel Phrases
              </div>

              <div className="mt-1 text-xs text-muted">
                Die wichtigsten Sätze zuerst. Englisch immer verfügbar.
              </div>
            </div>

            <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-bold">
              50 vorbereitet
            </span>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {quickPhrases.slice(0, 5).map((phrase) => {
              if (!phrase) {
                return null;
              }

              const local =
                phrase.local[language] ?? phrase.local.en ?? phrase.english;

              return (
                <button
                  key={phrase.id}
                  type="button"
                  onClick={() => setSelectedPhrase(phrase.id)}
                  className="rounded-2xl border border-border bg-white/50 p-3 text-left shadow-soft transition hover:-translate-y-0.5 dark:bg-slate-950/20"
                >
                  <div className="text-xs font-bold text-muted">
                    {phrase.category}
                  </div>

                  <div className="mt-1 text-sm font-bold leading-5">
                    {local}
                  </div>

                  <div className="mt-1 text-xs text-muted">
                    {phrase.english}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedPhrase && (
            <div className="mt-4 rounded-[1.5rem] border border-border bg-slate-950 p-4 text-white shadow-soft dark:bg-white dark:text-slate-950">
              {(() => {
                const phrase = phrases.find(
                  (item) => item.id === selectedPhrase,
                );

                if (!phrase) {
                  return null;
                }

                const local =
                  phrase.local[language] ?? phrase.local.en ?? phrase.english;

                return (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-lg font-black">{local}</div>

                      <div className="mt-1 text-sm opacity-70">
                        {phrase.english}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => sharePhrase(phrase.english)}
                        className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-bold text-white dark:border-slate-950/15 dark:bg-slate-950/10 dark:text-slate-950"
                      >
                        Vorlesen
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void copyText(local, `phrase-${phrase.id}`)
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-slate-950 dark:bg-slate-950 dark:text-white"
                      >
                        <Copy className="h-4 w-4" />

                        {copied === `phrase-${phrase.id}`
                          ? "Kopiert"
                          : "Kopieren"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPhrase(null)}
                        aria-label="Schließen"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] border border-border bg-surface p-4 shadow-premium sm:p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <CalendarDays className="h-4 w-4" />
                  Heute & dein Aufenthalt
                </div>

                <div className="mt-1 text-xs text-muted">
                  Lokale Events nach Zeitfenster priorisieren.
                </div>
              </div>

              <div className="flex gap-1">
                {[1, 3, 5, 10].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setStayDays(days)}
                    className={`rounded-full px-2.5 py-1.5 text-xs font-bold ${
                      stayDays === days
                        ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                        : "border border-border"
                    }`}
                  >
                    {days === 1 ? "Heute" : `${days} Tage`}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {(eventPreview.length
                ? eventPreview
                : eventTemplates.slice(0, 3)
              ).map((event, index) => (
                <div
                  key={`${event.title}-${index}`}
                  className="rounded-2xl border border-border bg-white/50 p-3.5 dark:bg-slate-950/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl">{event.emoji}</div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="text-sm font-bold">{event.title}</div>

                        <span className="rounded-full border border-border px-2 py-1 text-[10px] font-bold uppercase">
                          {event.category}
                        </span>
                      </div>

                      <div className="mt-1 text-xs text-muted">
                        {"date" in event && event.date
                          ? `${event.date} · `
                          : ""}
                        {event.time} · {event.duration}
                      </div>

                      <div className="mt-1 text-xs leading-5 text-muted">
                        {event.note}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-surface p-4 shadow-premium sm:p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Sparkles className="h-4 w-4" />
                  Explore Nearby
                </div>

                <div className="mt-1 text-xs text-muted">
                  Top-Orte, Hidden Gems und lokale Highlights.
                </div>
              </div>

              <button
                type="button"
                onClick={() => scrollTo(nearbyRef)}
                className="text-xs font-bold text-muted underline-offset-4 hover:underline"
              >
                Karte öffnen
              </button>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                "Harbour Walk",
                "Sunset Point",
                "Nature Reserve",
                "Boat Tour Dock",
              ].map((item, index) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => scrollTo(nearbyRef)}
                  className="rounded-2xl border border-border bg-white/50 p-3.5 text-left shadow-soft dark:bg-slate-950/20"
                >
                  <div className="text-lg">
                    {["⚓", "🌅", "🌲", "⛴️"][index]}
                  </div>

                  <div className="mt-2 text-sm font-bold">{item}</div>

                  <div className="mt-1 text-xs leading-5 text-muted">
                    Lokales Highlight · Route in der Karte
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          ref={sosRef}
          className="rounded-[2rem] border border-rose-500/20 bg-rose-500/[0.04] p-4 shadow-premium sm:p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300">
                <ShieldAlert className="h-4 w-4" />
                SOS / Soforthilfe
              </div>

              <div className="mt-1 text-xs text-muted">
                Kritische Reisehilfe ohne Suchen.
              </div>
            </div>

            <span className="rounded-full border border-rose-500/20 px-2.5 py-1 text-[11px] font-bold text-rose-700 dark:text-rose-300">
              SOS
            </span>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {emergencyActions.map((action) => (
              <button
                type="button"
                key={action.title}
                onClick={() => scrollTo(phrasesRef)}
                className="flex items-center gap-3 rounded-2xl border border-rose-500/10 bg-surface p-3.5 text-left shadow-soft"
              >
                <div className="text-xl">{action.icon}</div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold">{action.title}</div>

                  <div className="mt-0.5 text-xs text-muted">
                    {action.note}
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-muted" />
              </button>
            ))}
          </div>
        </section>
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-3xl border border-border bg-surface/95 p-2 shadow-premium backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {[
            ["home", "⌂", "Home"],
            ["money", "€", "Money"],
            ["nearby", "⌖", "Nearby"],
            ["phrases", "A", "Phrases"],
            ["sos", "!", "SOS"],
          ].map(([id, icon, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => goToMobileTab(id as MobileTab)}
              className={`flex min-h-12 flex-col items-center justify-center rounded-2xl text-[10px] font-bold ${
                mobileTab === id
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "text-muted"
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              <span className="mt-1">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {mobileMenu && (
        <div className="fixed inset-0 z-[60] bg-slate-950/45 p-4 md:hidden">
          <div className="ml-auto max-w-sm rounded-3xl bg-surface p-4 shadow-premium">
            <div className="flex items-center justify-between">
              <div className="font-black">FX Pro Travel Gold</div>

              <button
                type="button"
                onClick={() => setMobileMenu(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              <select
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as typeof language)
                }
                className="h-11 rounded-2xl border border-border bg-surface px-3 font-semibold outline-none"
              >
                {languages.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={requestLocation}
                className="h-11 rounded-2xl border border-border px-3 text-left font-semibold"
              >
                {locationStatus === "loading"
                  ? "Standort wird gesucht…"
                  : "Standort aktualisieren"}
              </button>

              <button
                type="button"
                onClick={() => setPhase("hotel")}
                className="h-11 rounded-2xl border border-border px-3 text-left font-semibold"
              >
                Hotel-Modus
              </button>

              <button
                type="button"
                onClick={() => setPhase("holiday")}
                className="h-11 rounded-2xl border border-border px-3 text-left font-semibold"
              >
                Urlaubs-Modus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
