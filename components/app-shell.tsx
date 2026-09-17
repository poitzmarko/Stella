"use client";

import dynamic from "next/dynamic";
import {
  ArrowLeftRight,
  CalendarDays,
  Check,
  ChevronRight,
  Compass,
  Copy,
  Globe2,
  Languages,
  MapPin,
  Menu,
  Moon,
  Navigation,
  Search,
  ShieldAlert,
  Sparkles,
  Star,
  Sun,
  WalletCards,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  fetchExploreHighlights,
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
  ExploreItem,
  LocationPoint,
  NearbyKind,
  NearbyPlace,
  Phase,
} from "@/lib/types";

const MapView = dynamic(
  () => import("@/components/map-view").then((module) => module.MapView),
  { ssr: false },
);

const QUICK_CURRENCIES = ["EUR", "PLN", "USD", "GBP", "CHF"];
const QUICK_PHRASE_IDS = ["towels", "breakfast", "ac", "taxi", "passport"];
const VIEWS = ["home", "money", "nearby", "phrases", "sos"] as const;
type View = (typeof VIEWS)[number];
type ThemeMode = "light" | "dark";
type LocationStatus = "idle" | "loading" | "ready" | "denied" | "error";

const STORAGE = {
  theme: "fx-pro-theme",
  from: "fx-pro-from-currency",
  to: "fx-pro-to-currency",
  favorites: "fx-pro-currency-favorites",
};

function getCurrency(code: string) {
  return currencyCatalog.find((item) => item.code === code) ?? currencyCatalog[0];
}

function normalizeRateMap(rates: Record<string, number>) {
  const result: Record<string, number> = { ...rates };
  const looksLikePerEur = Object.entries(rates).some(
    ([code, value]) => code !== "EUR" && value > 1,
  );

  if (looksLikePerEur) return result;

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

  if (!Number.isFinite(amount) || amount < 0) return 0;
  return (amount / fromRate) * toRate;
}

function safeOpen(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function languageToHtml(language: string) {
  return language === "zhHans" ? "zh-CN" : language;
}

const categoryLabel: Record<NearbyKind, string> = {
  atm: "Geld",
  food: "Essen",
  drink: "Drinks",
  cafe: "Café",
  hotel: "Hotel",
  restaurant: "Restaurant",
  bar: "Bar",
};

export function AppShell() {
  const { t, language, setLanguage, languages } = useI18n();

  const [view, setView] = useState<View>("home");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [phase, setPhase] = useState<Phase>("hotel");

  const [amount, setAmount] = useState("250");
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("PLN");
  const [rates, setRates] = useState<Record<string, number>>(normalizeRateMap(baseRates));
  const [ratesLoading, setRatesLoading] = useState(true);
  const [favoriteCurrencies, setFavoriteCurrencies] = useState<string[]>([]);

  const [location, setLocation] = useState<LocationPoint>(defaultLocation);
  const [cityLabel, setCityLabel] = useState("Miedzyzdroje");
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");

  const [nearby, setNearby] = useState<NearbyPlace[]>([]);
  const [explore, setExplore] = useState<ExploreItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [stayDays, setStayDays] = useState(3);
  const [nearbyFilter, setNearbyFilter] = useState<NearbyKind | "all">("all");
  const [dataLoading, setDataLoading] = useState(false);

  const [copied, setCopied] = useState<string | null>(null);
  const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);
  const [phraseSearch, setPhraseSearch] = useState("");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE.theme);
    if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);

    const storedFrom = window.localStorage.getItem(STORAGE.from);
    const storedTo = window.localStorage.getItem(STORAGE.to);
    if (storedFrom && currencyCatalog.some((item) => item.code === storedFrom)) setFromCurrency(storedFrom);
    if (storedTo && currencyCatalog.some((item) => item.code === storedTo)) setToCurrency(storedTo);

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
    document.documentElement.lang = languageToHtml(language);
    window.localStorage.setItem(STORAGE.theme, theme);
  }, [theme, language]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE.from, fromCurrency);
    window.localStorage.setItem(STORAGE.to, toCurrency);
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE.favorites, JSON.stringify(favoriteCurrencies));
  }, [favoriteCurrencies]);

  useEffect(() => {
    let alive = true;
    setRatesLoading(true);

    fetchExchangeRates()
      .then((result) => {
        if (alive) setRates(normalizeRateMap(result));
      })
      .finally(() => {
        if (alive) setRatesLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const loadLocalData = useCallback(
    async (point: LocationPoint) => {
      setDataLoading(true);
      try {
        const [nearbyResult, exploreResult, eventResult] = await Promise.all([
          fetchNearbyPlaces(point),
          fetchExploreHighlights(point),
          fetchLocalEvents(point, stayDays),
        ]);

        setNearby(nearbyResult ?? []);
        setExplore(exploreResult ?? []);
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
    return convertAmount(Number.isFinite(parsed) ? parsed : 0, fromCurrency, toCurrency, rates);
  }, [amount, fromCurrency, toCurrency, rates]);

  const currentRate = useMemo(
    () => convertAmount(1, fromCurrency, toCurrency, rates),
    [fromCurrency, toCurrency, rates],
  );

  const feed = useMemo(
    () => buildTravelFeed(phase, cityLabel).slice(0, 3),
    [phase, cityLabel],
  );

  const filteredNearby = useMemo(() => {
    if (nearbyFilter === "all") return nearby;
    return nearby.filter((item) => item.kind === nearbyFilter);
  }, [nearby, nearbyFilter]);

  const quickNearby = useMemo(() => filteredNearby.slice(0, 6), [filteredNearby]);
  const previewExplore = useMemo(() => explore.slice(0, 6), [explore]);
  const previewEvents = useMemo(() => events.slice(0, 4), [events]);

  const filteredPhrases = useMemo(() => {
    const term = phraseSearch.trim().toLowerCase();
    if (!term) return phrases;
    return phrases.filter((item) => {
      const local = item.local[language] ?? item.local.en ?? "";
      return `${item.category} ${item.english} ${local}`.toLowerCase().includes(term);
    });
  }, [language, phraseSearch]);

  const quickPhrases = useMemo(
    () => QUICK_PHRASE_IDS.map((id) => phrases.find((phrase) => phrase.id === id)).filter(Boolean),
    [],
  );

  const sharePhrase = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const copyText = async (text: string, marker: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(marker);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  const toggleFavorite = (code: string) => {
    setFavoriteCurrencies((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code],
    );
  };

  const switchView = (nextView: View) => {
    setView(nextView);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTheme = () => setTheme((current) => (current === "light" ? "dark" : "light"));

  const pageTitle = {
    home: "Heute für dich",
    money: "Money",
    nearby: "In deiner Nähe",
    phrases: "Travel Phrases",
    sos: "SOS / Soforthilfe",
  }[view];

  const destinationCurrency = getCurrency(toCurrency);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,.11),transparent_28%),linear-gradient(180deg,var(--bg2),var(--bg))] text-text">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-surface/90 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <button type="button" onClick={() => switchView("home")} className="group flex min-w-0 items-center gap-3 text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500 text-white shadow-premium transition-transform group-active:scale-95">
              <Globe2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">FX Pro</div>
              <div className="truncate text-[15px] font-bold tracking-tight sm:text-base">Travel Gold</div>
            </div>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {VIEWS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => switchView(item)}
                className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${view === item ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-muted hover:bg-slate-100 dark:hover:bg-slate-900"}`}
              >
                {item === "home" ? "Home" : item === "money" ? "Money" : item === "nearby" ? "Nearby" : item === "phrases" ? "Phrases" : "SOS"}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button type="button" onClick={requestLocation} className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm font-semibold shadow-soft">
              <MapPin className="h-4 w-4" />
              <span className="max-w-28 truncate">{cityLabel}</span>
            </button>
            <select
              aria-label="Language"
              value={language}
              onChange={(event) => setLanguage(event.target.value as typeof language)}
              className="h-10 rounded-full border border-border bg-surface px-3 text-sm font-semibold outline-none"
            >
              {languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
            </select>
            <button type="button" onClick={toggleTheme} aria-label="Theme" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface shadow-soft">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button type="button" onClick={requestLocation} className="flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-bold shadow-soft">
              <MapPin className="h-4 w-4" />
              <span className="max-w-24 truncate">{cityLabel}</span>
            </button>
            <button type="button" onClick={toggleTheme} aria-label="Theme" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <button type="button" onClick={() => setMobileMenu(true)} aria-label="Menü" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface">
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-5 pb-28 lg:px-6 lg:pb-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted">{cityLabel}</div>
            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{pageTitle}</h1>
          </div>
          <button type="button" onClick={requestLocation} className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-bold shadow-soft sm:inline-flex">
            <Navigation className="h-4 w-4" />
            {locationStatus === "loading" ? "Standort…" : "Standort"}
          </button>
        </div>

        {view === "home" && (
          <div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
            <section className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-[1.1fr_.9fr]">
                <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4" />Heute für dich</div>
                    <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-bold">{phase === "hotel" ? "Hotel" : phase === "holiday" ? "Urlaub" : phase}</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{cityLabel}</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted">Relevante Reiseinfos, lokale Highlights und schnelle Hilfe genau dort, wo du sie brauchst.</p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {feed.map((item) => (
                      <button key={item.id} type="button" onClick={() => switchView("nearby")} className="group flex items-start gap-3 rounded-2xl border border-border bg-white/55 p-3.5 text-left shadow-soft dark:bg-slate-950/20">
                        <span className="text-xl">{item.icon ?? "✨"}</span>
                        <span className="min-w-0 flex-1"><span className="block text-sm font-bold">{item.title}</span><span className="mt-1 block text-xs leading-5 text-muted">{item.body}</span></span>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted" />
                      </button>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button type="button" onClick={() => switchView("money")} className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-950"><WalletCards className="h-4 w-4" />Währung</button>
                    <button type="button" onClick={() => switchView("phrases")} className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-bold"><Languages className="h-4 w-4" />Schnellphrase</button>
                  </div>
                </section>

                <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-6">
                  <div className="flex items-center justify-between"><div><div className="text-sm font-bold">Reisemodus</div><div className="mt-1 text-xs text-muted">Kontext für deine nächsten Schritte.</div></div><Compass className="h-5 w-5 text-muted" /></div>
                  <div className="mt-5 grid gap-2">
                    {timelinePhases.filter((item) => ["hotel", "holiday", "emergency", "return"].includes(item.id)).map((item) => (
                      <button key={item.id} type="button" onClick={() => setPhase(item.id)} className={`flex items-center justify-between rounded-2xl border px-3.5 py-3 text-left transition ${phase === item.id ? "border-transparent bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border-border bg-surface"}`}>
                        <span><span className="block text-sm font-bold">{item.title}</span><span className={`mt-0.5 block text-xs ${phase === item.id ? "opacity-70" : "text-muted"}`}>{item.description}</span></span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-6">
                <div className="flex items-center justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-bold"><WalletCards className="h-4 w-4" />Smart Currency</div><div className="mt-1 text-xs text-muted">Nur der aktuelle Kurs. Offline-Fallback inklusive.</div></div><button type="button" onClick={() => switchView("money")} className="text-xs font-bold text-muted">Mehr →</button></div>
                <div className="mt-4 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
                  <div className="rounded-2xl border border-border bg-white/55 p-3 dark:bg-slate-950/20"><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Von</div><div className="mt-2 flex items-center gap-2"><select value={fromCurrency} onChange={(event) => setFromCurrency(event.target.value)} className="min-w-0 flex-1 bg-transparent text-base font-black outline-none">{currencyCatalog.map((item) => <option key={item.code} value={item.code}>{item.flag} {item.code}</option>)}</select><input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" className="w-28 bg-transparent text-right text-2xl font-black outline-none" aria-label="Betrag" /></div></div>
                  <button type="button" onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }} aria-label="Währungen tauschen" className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface shadow-soft"><ArrowLeftRight className="h-4 w-4" /></button>
                  <div className="rounded-2xl border border-border bg-white/55 p-3 dark:bg-slate-950/20"><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Nach</div><div className="mt-2 flex items-center gap-2"><select value={toCurrency} onChange={(event) => setToCurrency(event.target.value)} className="min-w-0 flex-1 bg-transparent text-base font-black outline-none">{currencyCatalog.map((item) => <option key={item.code} value={item.code}>{item.flag} {item.code}</option>)}</select><div className="w-28 text-right text-2xl font-black">{new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", { maximumFractionDigits: 2 }).format(resultAmount)}</div></div></div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3"><div className="text-sm font-semibold text-muted">1 {fromCurrency} = <span className="text-text">{currentRate.toFixed(4)} {toCurrency}</span></div><span className="text-xs font-bold text-muted">{ratesLoading ? "Aktualisiere…" : "Live / Offline"}</span></div>
              </section>

              <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-6">
                <div className="flex items-center justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-bold"><Navigation className="h-4 w-4" />In deiner Nähe</div><div className="mt-1 text-xs text-muted">Lokale Treffer, Karte und direkte Route.</div></div><button type="button" onClick={() => switchView("nearby")} className="text-xs font-bold text-muted">Alle →</button></div>
                <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-border"><MapView center={location} places={quickNearby.slice(0, 4)} /></div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">{quickNearby.slice(0, 4).map((place) => <button key={place.id} type="button" onClick={() => switchView("nearby")} className="rounded-2xl border border-border bg-white/50 p-3 text-left shadow-soft dark:bg-slate-950/20"><div className="flex items-center justify-between gap-2"><div className="text-sm font-bold">{place.title}</div><span className="rounded-full border border-border px-2 py-1 text-[10px] font-bold">{categoryLabel[place.kind]}</span></div><div className="mt-1 text-xs text-muted">{formatDistance(place.distance)}{place.rating ? ` · ★ ${place.rating.toFixed(1)}` : ""}</div></button>)}</div>
              </section>
            </section>

            <aside className="grid gap-5">
              <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-6">
                <div className="flex items-center justify-between"><div><div className="flex items-center gap-2 text-sm font-bold"><Languages className="h-4 w-4" />Schnell helfen</div><div className="mt-1 text-xs text-muted">Die wichtigsten Sätze in einem Tap.</div></div><span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-bold">50</span></div>
                <div className="mt-4 grid gap-2">{quickPhrases.slice(0, 5).map((phrase) => { if (!phrase) return null; const local = phrase.local[language] ?? phrase.local.en ?? phrase.english; return <button key={phrase.id} type="button" onClick={() => { setSelectedPhrase(phrase.id); switchView("phrases"); }} className="rounded-2xl border border-border bg-white/50 p-3 text-left shadow-soft dark:bg-slate-950/20"><div className="text-sm font-bold">{local}</div><div className="mt-1 text-xs text-muted">{phrase.english}</div></button>; })}</div>
              </section>

              <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-6"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2 text-sm font-bold"><CalendarDays className="h-4 w-4" />Was läuft heute?</div><div className="mt-1 text-xs text-muted">Lokale Events in deinem Zeitraum.</div></div><button type="button" onClick={() => switchView("nearby")} className="text-xs font-bold text-muted">Mehr →</button></div><div className="mt-4 grid gap-2">{previewEvents.slice(0, 3).map((event, index) => <div key={`${event.title}-${index}`} className="rounded-2xl border border-border bg-white/50 p-3 dark:bg-slate-950/20"><div className="flex items-start gap-3"><div className="text-xl">{event.emoji}</div><div className="min-w-0 flex-1"><div className="text-sm font-bold">{event.title}</div><div className="mt-1 text-xs text-muted">{event.date ? `${event.date} · ` : ""}{event.time} · {event.duration}</div></div></div></div>)}</div></section>

              <section className="rounded-[2rem] border border-rose-500/20 bg-rose-500/[0.04] p-5 shadow-premium sm:p-6"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300"><ShieldAlert className="h-4 w-4" />SOS</div><div className="mt-1 text-xs text-muted">Kritische Reisehilfe sofort erreichbar.</div></div><button type="button" onClick={() => switchView("sos")} className="rounded-full border border-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">Öffnen</button></div><div className="mt-4 grid grid-cols-2 gap-2">{emergencyActions.slice(0, 4).map((action) => <button key={action.title} type="button" onClick={() => switchView("sos")} className="rounded-2xl border border-rose-500/10 bg-surface p-3 text-left shadow-soft"><div className="text-xl">{action.icon}</div><div className="mt-1 text-sm font-bold">{action.title}</div></button>)}</div></section>
            </aside>
          </div>
        )}

        {view === "money" && (
          <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-7">
              <div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-sm font-bold"><WalletCards className="h-4 w-4" />Smart Currency</div><div className="mt-1 text-xs text-muted">170+ Währungen vorbereitet · Live/Offline-Fallback</div></div><span className="rounded-full border border-border px-3 py-1 text-[11px] font-bold">{ratesLoading ? "Update" : "Bereit"}</span></div>
              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr]">
                <div className="rounded-3xl border border-border bg-white/55 p-4 dark:bg-slate-950/20"><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Von</div><div className="mt-3 flex items-center gap-2"><select value={fromCurrency} onChange={(event) => setFromCurrency(event.target.value)} className="flex-1 bg-transparent text-lg font-black outline-none">{currencyCatalog.map((item) => <option key={item.code} value={item.code}>{item.flag} {item.code}</option>)}</select><input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" className="w-36 bg-transparent text-right text-4xl font-black outline-none" aria-label={t("amount")} /></div></div>
                <button type="button" onClick={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); }} aria-label="Währungen tauschen" className="mx-auto self-center flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface shadow-soft"><ArrowLeftRight className="h-4 w-4" /></button>
                <div className="rounded-3xl border border-border bg-white/55 p-4 dark:bg-slate-950/20"><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Nach</div><div className="mt-3 flex items-center gap-2"><select value={toCurrency} onChange={(event) => setToCurrency(event.target.value)} className="flex-1 bg-transparent text-lg font-black outline-none">{currencyCatalog.map((item) => <option key={item.code} value={item.code}>{item.flag} {item.code}</option>)}</select><div className="w-36 text-right text-4xl font-black">{new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", { maximumFractionDigits: 2 }).format(resultAmount)}</div></div></div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="text-sm font-semibold text-muted">1 {fromCurrency} = <span className="text-text">{currentRate.toFixed(4)} {toCurrency}</span></div><div className="flex gap-2"><button type="button" onClick={() => void copyText(`${amount} ${fromCurrency} = ${resultAmount.toFixed(2)} ${toCurrency}`, "money")} className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-950"><Copy className="h-4 w-4" />{copied === "money" ? "Kopiert" : "Kurs kopieren"}</button><button type="button" onClick={() => toggleFavorite(toCurrency)} className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-bold"><Star className={`h-4 w-4 ${favoriteCurrencies.includes(toCurrency) ? "fill-current" : ""}`} />{favoriteCurrencies.includes(toCurrency) ? "Gespeichert" : "Merken"}</button></div></div>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{QUICK_CURRENCIES.map((code) => { const item = getCurrency(code); return <button key={code} type="button" onClick={() => setToCurrency(code)} className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-bold ${toCurrency === code ? "border-transparent bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border-border bg-surface"}`}>{item.flag} {code}</button>; })}</div>
            </section>
            <aside className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-6"><div className="text-sm font-bold">Geld unterwegs</div><div className="mt-1 text-xs text-muted">Vorbereitete Hinweise für die Reise.</div><div className="mt-4 grid gap-2">{["Karte vs. Bargeld", "Trinkgeld", "Kreditkartengebühren", "Tax Free", "VAT-Rechner"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-border p-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900"><WalletCards className="h-4 w-4" /></div><div className="text-sm font-bold">{item}</div></div>)}</div></aside>
          </div>
        )}

        {view === "nearby" && (
          <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <section className="rounded-[2rem] border border-border bg-surface p-4 shadow-premium sm:p-5"><div className="flex flex-wrap items-end justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-bold"><Navigation className="h-4 w-4" />Nearby</div><div className="mt-1 text-xs text-muted">Karte, echte Entfernungen, Route und lokale Treffer.</div></div><button type="button" onClick={requestLocation} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-bold"><MapPin className="h-4 w-4" />{locationStatus === "loading" ? "Standort…" : cityLabel}</button></div><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{(["all", "atm", "restaurant", "cafe", "bar", "hotel"] as const).map((id) => <button key={id} type="button" onClick={() => setNearbyFilter(id)} className={`shrink-0 rounded-full border px-3 py-2 text-xs font-bold ${nearbyFilter === id ? "border-transparent bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border-border bg-surface"}`}>{id === "all" ? "Alles" : id === "atm" ? "Geld" : id === "restaurant" ? "Essen" : id === "cafe" ? "Café" : id === "bar" ? "Bar" : "Hotel"}</button>)}</div><div className="mt-4 overflow-hidden rounded-[1.5rem] border border-border"><MapView center={location} places={quickNearby} /></div></section>
            <section className="grid gap-2">{dataLoading && <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted">Lokale Treffer werden geladen…</div>}{!dataLoading && quickNearby.length === 0 && <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted">Keine Treffer für diesen Filter.</div>}{quickNearby.map((place) => <article key={place.id} className="rounded-[1.5rem] border border-border bg-surface p-4 shadow-premium"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-bold">{place.title}</div><div className="mt-1 text-xs text-muted">{formatDistance(place.distance)}{place.rating ? ` · ★ ${place.rating.toFixed(1)}` : ""}</div></div><span className="rounded-full border border-border px-2 py-1 text-[10px] font-bold">{categoryLabel[place.kind]}</span></div><div className="mt-2 text-xs leading-5 text-muted">{place.note}</div><div className="mt-3 flex gap-2"><button type="button" onClick={() => safeOpen(mapsRouteUrl(place.lat, place.lon))} className="rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white dark:bg-white dark:text-slate-950">Route</button><button type="button" onClick={() => safeOpen(mapsSearchUrl(place.title, place.lat, place.lon))} className="rounded-full border border-border px-3 py-2 text-xs font-bold">Maps</button></div></article>)}</section>
            <section className="lg:col-span-2 rounded-[2rem] border border-border bg-surface p-5 shadow-premium"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4" />Explore Nearby</div><div className="mt-1 text-xs text-muted">Lokale Highlights und Hidden Gems aus derselben Datenbasis.</div></div></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{previewExplore.map((item) => <article key={item.id ?? item.title} className="rounded-2xl border border-border p-4"><div className="text-2xl">{item.emoji}</div><div className="mt-2 text-sm font-bold">{item.title}</div><div className="mt-1 text-xs text-muted">{formatDistance(item.distance)} · ★ {item.rating.toFixed(1)}</div><div className="mt-2 text-xs leading-5 text-muted">{item.note}</div><button type="button" onClick={() => { if (typeof item.lat === "number" && typeof item.lon === "number") safeOpen(mapsRouteUrl(item.lat, item.lon)); }} className="mt-3 rounded-full border border-border px-3 py-2 text-xs font-bold">Route</button></article>)}</div></section>
            <section className="lg:col-span-2 rounded-[2rem] border border-border bg-surface p-5 shadow-premium"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-bold"><CalendarDays className="h-4 w-4" />Local Events</div><div className="mt-1 text-xs text-muted">Urlaubszeitraum: {stayDays} Tage.</div></div><div className="flex gap-1">{[1, 3, 5, 10].map((days) => <button key={days} type="button" onClick={() => setStayDays(days)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${stayDays === days ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border border-border"}`}>{days === 1 ? "Heute" : `${days} Tage`}</button>)}</div></div><div className="mt-4 grid gap-3 md:grid-cols-2">{previewEvents.map((event, index) => <article key={`${event.title}-${index}`} className="rounded-2xl border border-border p-4"><div className="flex items-start gap-3"><div className="text-2xl">{event.emoji}</div><div className="min-w-0 flex-1"><div className="text-sm font-bold">{event.title}</div><div className="mt-1 text-xs text-muted">{event.date ? `${event.date} · ` : ""}{event.time} · {event.duration}</div><div className="mt-2 text-xs leading-5 text-muted">{event.note}</div></div></div></article>)}</div></section>
          </div>
        )}

        {view === "phrases" && (
          <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-sm font-bold"><Languages className="h-4 w-4" />Travel Phrases</div><div className="mt-1 text-xs text-muted">50 wertvolle Kurzsätze. Englisch immer verfügbar.</div></div><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input value={phraseSearch} onChange={(event) => setPhraseSearch(event.target.value)} placeholder="Phrase suchen…" className="h-10 w-full rounded-full border border-border bg-surface pl-9 pr-4 text-sm outline-none sm:w-64" /></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{filteredPhrases.map((phrase) => { const local = phrase.local[language] ?? phrase.local.en ?? phrase.english; const active = selectedPhrase === phrase.id; return <article key={phrase.id} className={`rounded-2xl border p-4 shadow-soft ${active ? "border-transparent bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border-border bg-white/50 dark:bg-slate-950/20"}`}><div className="flex items-center justify-between gap-2"><span className={`text-[10px] font-bold uppercase tracking-[0.14em] ${active ? "opacity-70" : "text-muted"}`}>{phrase.category}</span>{active && <Check className="h-4 w-4" />}</div><button type="button" onClick={() => setSelectedPhrase(active ? null : phrase.id)} className="mt-2 text-left"><div className="text-base font-black leading-6">{local}</div><div className="mt-1 text-xs opacity-70">{phrase.english}</div></button>{active && <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => sharePhrase(phrase.english)} className="rounded-full border border-white/20 px-3 py-2 text-xs font-bold">Vorlesen</button><button type="button" onClick={() => void copyText(local, `phrase-${phrase.id}`)} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-950 dark:bg-slate-950 dark:text-white"><Copy className="h-3.5 w-3.5" />{copied === `phrase-${phrase.id}` ? "Kopiert" : "Kopieren"}</button></div>}</article>; })}</div></section>
        )}

        {view === "sos" && (
          <div className="grid gap-5 lg:grid-cols-[1fr_.65fr]">
            <section className="rounded-[2rem] border border-rose-500/20 bg-rose-500/[0.04] p-5 shadow-premium sm:p-7"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300"><ShieldAlert className="h-4 w-4" />SOS / Soforthilfe</div><div className="mt-1 text-xs text-muted">Kritische Reisehilfe ohne Suchen.</div></div><span className="rounded-full border border-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">SOS</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{emergencyActions.map((action) => <button key={action.title} type="button" onClick={() => setSelectedPhrase("passport")} className="flex min-h-24 items-center gap-3 rounded-2xl border border-rose-500/10 bg-surface p-4 text-left shadow-soft"><div className="text-2xl">{action.icon}</div><div className="min-w-0 flex-1"><div className="text-sm font-bold">{action.title}</div><div className="mt-1 text-xs leading-5 text-muted">{action.note}</div></div><ChevronRight className="h-4 w-4 text-muted" /></button>)}</div></section>
            <aside className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-6"><div className="text-sm font-bold">Sofort erreichbar</div><div className="mt-4 grid gap-2"><button type="button" onClick={() => switchView("nearby")} className="flex items-center gap-3 rounded-2xl border border-border p-3 text-left"><Navigation className="h-4 w-4" /><div><div className="text-sm font-bold">Nächste Hilfe</div><div className="text-xs text-muted">Karte und lokale Treffer</div></div></button><button type="button" onClick={() => switchView("phrases")} className="flex items-center gap-3 rounded-2xl border border-border p-3 text-left"><Languages className="h-4 w-4" /><div><div className="text-sm font-bold">Notfallphrase</div><div className="text-xs text-muted">Schnell vorlesen und kopieren</div></div></button><button type="button" onClick={requestLocation} className="flex items-center gap-3 rounded-2xl border border-border p-3 text-left"><MapPin className="h-4 w-4" /><div><div className="text-sm font-bold">Standort aktualisieren</div><div className="text-xs text-muted">{locationStatus === "ready" ? "GPS aktiv" : "GPS anfordern"}</div></div></button></div></aside>
          </div>
        )}
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-3xl border border-border bg-surface/95 p-2 shadow-premium backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {VIEWS.map((item) => {
            const labels: Record<View, string> = { home: "Home", money: "Money", nearby: "Nearby", phrases: "Phrases", sos: "SOS" };
            const icons: Record<View, string> = { home: "⌂", money: "€", nearby: "⌖", phrases: "A", sos: "!" };
            return <button key={item} type="button" onClick={() => switchView(item)} className={`flex min-h-12 flex-col items-center justify-center rounded-2xl text-[10px] font-bold ${view === item ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-muted"}`}><span className="text-base leading-none">{icons[item]}</span><span className="mt-1">{labels[item]}</span></button>;
          })}
        </div>
      </nav>

      {mobileMenu && <div className="fixed inset-0 z-[60] bg-slate-950/45 p-4 lg:hidden"><div className="ml-auto max-w-sm rounded-3xl bg-surface p-4 shadow-premium"><div className="flex items-center justify-between"><div className="font-black">FX Pro Travel Gold</div><button type="button" onClick={() => setMobileMenu(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border"><X className="h-4 w-4" /></button></div><div className="mt-4 grid gap-2">{VIEWS.map((item) => <button key={item} type="button" onClick={() => switchView(item)} className="h-11 rounded-2xl border border-border px-3 text-left text-sm font-semibold">{item === "home" ? "Home" : item === "money" ? "Money" : item === "nearby" ? "Nearby & Events" : item === "phrases" ? "Travel Phrases" : "SOS / Soforthilfe"}</button>)}<select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} className="h-11 rounded-2xl border border-border bg-surface px-3 font-semibold outline-none">{languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select></div></div></div>}
    </div>
  );
}
