"use client";

import dynamic from "next/dynamic";
import {
  ArrowLeftRight,
  CalendarDays,
  ChevronRight,
  Globe2,
  Languages,
  LocateFixed,
  MapPin,
  Moon,
  Navigation,
  Search,
  ShieldAlert,
  Sparkles,
  Star,
  Sun,
  Volume2,
  WalletCards,
  Copy,
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
  fetchLocalEvents,
  fetchNearbyPlaces,
  reverseGeocode,
} from "@/lib/sources";
import { formatDistance, mapsRouteUrl, mapsSearchUrl } from "@/lib/geo";
import type { EventItem, LocationPoint, NearbyPlace, Phase } from "@/lib/types";

const MapView = dynamic(
  () => import("@/components/map-view").then((m) => m.MapView),
  { ssr: false },
);

type Tab = "home" | "money" | "nearby" | "phrases" | "sos";
type Theme = "light" | "dark";
type Lang = "de" | "en" | "es" | "fr" | "it" | "pt" | "zhHans";

const LABELS: Record<Lang, Record<string, string>> = {
  de: {
    home: "Home", money: "Money", nearby: "Nearby", phrases: "Phrases", sos: "SOS",
    today: "Heute für dich", location: "Standort", smartCurrency: "Smart Currency",
    currentRate: "Nur aktueller Kurs · Offline-Fallback inklusive.", from: "Von", to: "Nach",
    copyRate: "Kurs kopieren", copied: "Kopiert", remember: "Merken", favorite: "Favorit",
    nearbyTitle: "In deiner Nähe", nearbySub: "Lokale Treffer, Karte und direkte Route.", all: "Alles",
    cash: "Geld", food: "Essen", cafe: "Café", hotel: "Hotel", route: "Route", maps: "Maps",
    noPlaces: "Noch keine lokalen Treffer. Standort freigeben und erneut versuchen.",
    phrasesTitle: "Schnell helfen", phrasesSub: "Die wichtigsten Sätze in einem Tap.",
    eventsTitle: "Was läuft heute?", eventsSub: "Lokale Events in deinem Zeitraum.",
    stay1: "Heute", stay3: "3 Tage", stay5: "5 Tage", stay10: "10 Tage",
    exploreTitle: "Explore Nearby", exploreSub: "Top-Orte, Hidden Gems und lokale Highlights.",
    sosTitle: "SOS", sosSub: "Kritische Reisehilfe sofort erreichbar.",
    speak: "Vorlesen", copy: "Kopieren", search: "Phrasen durchsuchen", noPhrase: "Keine passende Phrase gefunden.",
    locationBusy: "Standort wird gesucht…", myLocation: "Meinen Standort", gpsOn: "GPS aktiv",
    holiday: "Urlaub", emergency: "Notfall", return: "Rückreise",
    hotelDesc: "Rezeption, Frühstück, Housekeeping.", holidayDesc: "Nearby, Explore, Events und Feed.",
    emergencyDesc: "Sofort zugängliche Hilfsinfos.", returnDesc: "Abrechnung, Transfer, letzte Hinweise.",
    more: "Mehr", noData: "Keine Daten vorhanden.",
  },
  en: {
    home: "Home", money: "Money", nearby: "Nearby", phrases: "Phrases", sos: "SOS",
    today: "Today for you", location: "Location", smartCurrency: "Smart Currency",
    currentRate: "Current rate only · offline fallback included.", from: "From", to: "To",
    copyRate: "Copy rate", copied: "Copied", remember: "Save", favorite: "Favorite",
    nearbyTitle: "Nearby", nearbySub: "Local places, map and direct route.", all: "All",
    cash: "Money", food: "Food", cafe: "Café", hotel: "Hotel", route: "Route", maps: "Maps",
    noPlaces: "No local places yet. Allow location and try again.",
    phrasesTitle: "Quick help", phrasesSub: "The most useful sentences in one tap.",
    eventsTitle: "What's on?", eventsSub: "Local events within your stay.",
    stay1: "Today", stay3: "3 days", stay5: "5 days", stay10: "10 days",
    exploreTitle: "Explore Nearby", exploreSub: "Top spots, hidden gems and local highlights.",
    sosTitle: "SOS", sosSub: "Critical travel help, instantly reachable.",
    speak: "Speak", copy: "Copy", search: "Search phrases", noPhrase: "No matching phrase found.",
    locationBusy: "Finding your location…", myLocation: "My location", gpsOn: "GPS active",
    holiday: "Holiday", emergency: "Emergency", return: "Return",
    hotelDesc: "Reception, breakfast, housekeeping.", holidayDesc: "Nearby, Explore, Events and Feed.",
    emergencyDesc: "Instantly accessible help.", returnDesc: "Checkout, transfer, final hints.",
    more: "More", noData: "No data available.",
  },
  es: {}, fr: {}, it: {}, pt: {}, zhHans: {},
};
for (const lang of ["es", "fr", "it", "pt", "zhHans"] as Lang[]) LABELS[lang] = { ...LABELS.en };

const QUICK_CURRENCIES = ["EUR", "PLN", "USD", "GBP", "CHF"];
const CATEGORY_LABEL: Record<string, string> = {
  atm: "cash", restaurant: "food", cafe: "cafe", hotel: "hotel", bar: "food",
};

function labels(lang: string) { return LABELS[(lang as Lang) in LABELS ? (lang as Lang) : "en"]; }
function getCurrency(code: string) { return currencyCatalog.find((x) => x.code === code) ?? currencyCatalog[0]; }
function normalizeRates(rates: Record<string, number>) {
  const hasTypicalFx = Object.entries(rates).some(([code, v]) => code !== "EUR" && v > 1);
  if (hasTypicalFx) return { EUR: 1, ...rates };
  const result: Record<string, number> = { EUR: 1 };
  for (const c of currencyCatalog) if (c.code !== "EUR" && c.rateToEUR > 0) result[c.code] = 1 / c.rateToEUR;
  return result;
}
function convert(amount: number, from: string, to: string, rates: Record<string, number>) {
  const fr = rates[from] ?? 1;
  const tr = rates[to] ?? 1;
  return amount / fr * tr;
}

export function AppShell() {
  const { language, setLanguage, languages } = useI18n();
  const ui = labels(language);
  const [tab, setTab] = useState<Tab>("home");
  const [theme, setTheme] = useState<Theme>("light");
  const [phase, setPhase] = useState<Phase>("hotel");
  const [amount, setAmount] = useState("250");
  const [from, setFrom] = useState("EUR");
  const [to, setTo] = useState("PLN");
  const [rates, setRates] = useState<Record<string, number>>(normalizeRates(baseRates));
  const [location, setLocation] = useState<LocationPoint>(defaultLocation);
  const [city, setCity] = useState("Miedzyzdroje");
  const [locationState, setLocationState] = useState<"idle" | "loading" | "ready" | "denied">("idle");
  const [nearby, setNearby] = useState<NearbyPlace[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [stayDays, setStayDays] = useState(3);
  const [nearbyFilter, setNearbyFilter] = useState("all");
  const [phraseQuery, setPhraseQuery] = useState("");
  const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("fx-theme");
    if (stored === "dark" || stored === "light") setTheme(stored);
    const f = window.localStorage.getItem("fx-favorites");
    if (f) try { setFavorites(JSON.parse(f)); } catch {}
    const storedFrom = window.localStorage.getItem("fx-from");
    const storedTo = window.localStorage.getItem("fx-to");
    if (storedFrom && currencyCatalog.some((x) => x.code === storedFrom)) setFrom(storedFrom);
    if (storedTo && currencyCatalog.some((x) => x.code === storedTo)) setTo(storedTo);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.lang = language === "zhHans" ? "zh-CN" : language;
    window.localStorage.setItem("fx-theme", theme);
  }, [theme, language]);

  useEffect(() => {
    window.localStorage.setItem("fx-favorites", JSON.stringify(favorites));
    window.localStorage.setItem("fx-from", from);
    window.localStorage.setItem("fx-to", to);
  }, [favorites, from, to]);

  useEffect(() => {
    let alive = true;
    fetchExchangeRates().then((r) => alive && setRates(normalizeRates(r)));
    return () => { alive = false; };
  }, []);

  const loadLocal = useCallback(async () => {
    setLoading(true);
    try {
      const [places, eventData] = await Promise.all([fetchNearbyPlaces(location), fetchLocalEvents(location, stayDays)]);
      setNearby(places ?? []);
      setEvents(eventData ?? []);
    } finally { setLoading(false); }
  }, [location, stayDays]);

  useEffect(() => { void loadLocal(); }, [loadLocal]);

  const requestLocation = useCallback(() => {
    if (!("geolocation" in navigator)) return;
    setLocationState("loading");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const next = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setLocation(next);
        setLocationState("ready");
        const text = await reverseGeocode(next);
        if (text && text !== "Local area") setCity(text.split(",")[0]);
      },
      () => setLocationState("denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  const numericAmount = Number(String(amount).replace(",", ".")) || 0;
  const result = convert(numericAmount, from, to, rates);
  const rate = convert(1, from, to, rates);
  const feed = useMemo(() => buildTravelFeed(phase, city).slice(0, 3), [phase, city]);
  const filteredNearby = useMemo(() => nearby.filter((x) => nearbyFilter === "all" || x.kind === nearbyFilter).slice(0, 20), [nearby, nearbyFilter]);
  const filteredPhrases = useMemo(() => {
    const q = phraseQuery.toLowerCase().trim();
    return phrases.filter((p) => !q || `${p.english} ${p.category}`.toLowerCase().includes(q));
  }, [phraseQuery]);

  const selectTab = (next: Tab) => setTab(next);
  const copy = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); window.setTimeout(() => setCopied(null), 1600); } catch {}
  };
  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  };
  const openMaps = (place: NearbyPlace) => window.open(mapsSearchUrl(place.title, place.lat, place.lon), "_blank", "noopener,noreferrer");
  const route = (place: NearbyPlace) => window.open(mapsRouteUrl(place.lat, place.lon), "_blank", "noopener,noreferrer");

  const Nav = () => (
    <>
      <nav className="hidden md:flex items-center gap-1">
        {(["home", "money", "nearby", "phrases", "sos"] as Tab[]).map((id) => (
          <button key={id} type="button" onClick={() => selectTab(id)} className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${tab === id ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-muted hover:bg-slate-100 dark:hover:bg-slate-900"}`}>
            {ui[id]}
          </button>
        ))}
      </nav>
      <nav className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-3xl border border-border bg-surface/95 p-2 shadow-premium backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {(["home", "money", "nearby", "phrases", "sos"] as Tab[]).map((id) => (
            <button key={id} type="button" onClick={() => selectTab(id)} className={`flex min-h-12 flex-col items-center justify-center rounded-2xl text-[10px] font-bold ${tab === id ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-muted"}`}>
              <span className="text-base leading-none">{id === "home" ? "⌂" : id === "money" ? "€" : id === "nearby" ? "⌖" : id === "phrases" ? "A" : "!"}</span>
              <span className="mt-1">{ui[id]}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,.11),transparent_28%),linear-gradient(180deg,var(--bg2),var(--bg))] text-text pb-24 md:pb-8">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-surface/90 backdrop-blur-2xl">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <button type="button" onClick={() => selectTab("home")} className="group flex min-w-0 items-center gap-3 text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500 text-white shadow-premium group-active:scale-95"><Globe2 className="h-5 w-5" /></div>
            <div className="min-w-0"><div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">FX Pro</div><div className="truncate text-[15px] font-bold tracking-tight">Travel Gold</div></div>
          </button>
          <Nav />
          <div className="flex items-center gap-2">
            <button type="button" onClick={requestLocation} className="hidden lg:inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm font-semibold shadow-soft"><MapPin className="h-4 w-4" /><span className="max-w-28 truncate">{city}</span></button>
            <select aria-label="Language" value={language} onChange={(e) => setLanguage(e.target.value as typeof language)} className="hidden lg:block h-10 rounded-full border border-border bg-surface px-3 text-sm font-semibold outline-none">
              {languages.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
            </select>
            <button type="button" aria-label="Theme" onClick={() => setTheme((x) => x === "light" ? "dark" : "light")} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface shadow-soft">{theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</button>
            <button type="button" onClick={requestLocation} className="flex lg:hidden h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-xs font-bold"><LocateFixed className="h-4 w-4" /><span className="max-w-20 truncate">{city}</span></button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-5 lg:px-6">
        {tab === "home" && (
          <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
            <section className="grid gap-5">
              <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-6">
                <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4" />{ui.today}</div><span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-bold">{city}</span></div>
                <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{city}</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Relevante Reiseinfos, lokale Highlights und schnelle Hilfe – genau dort, wo du sie brauchst.</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-3">{feed.map((item) => <button key={item.id} type="button" onClick={() => selectTab("nearby")} className="rounded-2xl border border-border bg-white/55 p-3.5 text-left shadow-soft dark:bg-slate-950/20"><div className="text-xl">{item.icon ?? "✨"}</div><div className="mt-2 text-sm font-bold">{item.title}</div><div className="mt-1 text-xs leading-5 text-muted">{item.body}</div></button>)}</div>
                <div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => selectTab("money")} className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-950"><WalletCards className="h-4 w-4" />{ui.money}</button><button type="button" onClick={() => selectTab("phrases")} className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-bold"><Languages className="h-4 w-4" />{ui.phrases}</button></div>
              </section>
              <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-6">
                <div className="flex items-center justify-between"><div><div className="text-sm font-bold">Reisemodus</div><div className="mt-1 text-xs text-muted">Kontext für deine nächsten Schritte.</div></div></div>
                <div className="mt-4 flex flex-wrap gap-2">{(["hotel", "holiday", "emergency", "return"] as Phase[]).map((p) => { const info = p === "hotel" ? ["🏨", ui.hotel, ui.hotelDesc] : p === "holiday" ? ["🌴", ui.holiday, ui.holidayDesc] : p === "emergency" ? ["🚨", ui.emergency, ui.emergencyDesc] : ["✈", ui.return, ui.returnDesc]; return <button key={p} type="button" onClick={() => setPhase(p)} className={`rounded-full border px-3.5 py-2 text-xs font-bold ${phase === p ? "border-transparent bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border-border bg-surface"}`}>{info[0]} {info[1]}</button>; })}</div>
              </section>
            </section>
            <aside className="grid gap-5">
              <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-6"><div className="flex items-end justify-between"><div><div className="flex items-center gap-2 text-sm font-bold"><Navigation className="h-4 w-4" />{ui.nearbyTitle}</div><div className="mt-1 text-xs text-muted">{ui.nearbySub}</div></div><button type="button" onClick={() => selectTab("nearby")} className="text-xs font-bold text-muted">{ui.more} →</button></div><div className="mt-4 overflow-hidden rounded-[1.5rem] border border-border"><MapView center={location} places={nearby.slice(0, 4)} /></div></section>
              <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-6"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2 text-sm font-bold"><CalendarDays className="h-4 w-4" />{ui.eventsTitle}</div><div className="mt-1 text-xs text-muted">{ui.eventsSub}</div></div><button type="button" onClick={() => selectTab("nearby")} className="text-xs font-bold text-muted">{ui.more} →</button></div><div className="mt-4 grid gap-2">{events.slice(0, 3).map((e, i) => <div key={`${e.title}-${i}`} className="rounded-2xl border border-border p-3"><div className="flex items-start gap-3"><div className="text-xl">{e.emoji}</div><div className="min-w-0 flex-1"><div className="text-sm font-bold">{e.title}</div><div className="mt-1 text-xs text-muted">{"date" in e && e.date ? `${e.date} · ` : ""}{e.time} · {e.duration}</div></div></div></div>)}</div></section>
              <section className="rounded-[2rem] border border-rose-500/20 bg-rose-500/[0.04] p-5 shadow-premium sm:p-6"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300"><ShieldAlert className="h-4 w-4" />{ui.sosTitle}</div><div className="mt-1 text-xs text-muted">{ui.sosSub}</div></div><button type="button" onClick={() => selectTab("sos")} className="rounded-full border border-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">Öffnen</button></div></section>
            </aside>
          </div>
        )}

        {tab === "money" && (
          <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-7">
            <div className="flex items-center justify-between"><div><div className="flex items-center gap-2 text-sm font-bold"><WalletCards className="h-4 w-4" />{ui.smartCurrency}</div><div className="mt-1 text-xs text-muted">{ui.currentRate}</div></div><span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-bold">{getCurrency(to).flag} {to}</span></div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto_1fr]"><div className="rounded-3xl border border-border bg-white/55 p-4 dark:bg-slate-950/20"><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{ui.from}</div><div className="mt-2 flex items-center gap-3"><select value={from} onChange={(e) => setFrom(e.target.value)} className="min-w-0 flex-1 bg-transparent text-base font-black outline-none">{currencyCatalog.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}</select><input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" className="w-36 bg-transparent text-right text-3xl font-black outline-none" /></div></div><button type="button" onClick={() => { const tmp = from; setFrom(to); setTo(tmp); }} className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface shadow-soft"><ArrowLeftRight className="h-5 w-5" /></button><div className="rounded-3xl border border-border bg-white/55 p-4 dark:bg-slate-950/20"><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{ui.to}</div><div className="mt-2 flex items-center gap-3"><select value={to} onChange={(e) => setTo(e.target.value)} className="min-w-0 flex-1 bg-transparent text-base font-black outline-none">{currencyCatalog.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}</select><div className="w-36 text-right text-3xl font-black">{new Intl.NumberFormat(language === "de" ? "de-DE" : "en-US", { maximumFractionDigits: 2 }).format(result)}</div></div></div></div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="text-sm font-semibold text-muted">1 {from} = <span className="text-text">{rate.toFixed(4)} {to}</span></div><div className="flex gap-2"><button type="button" onClick={() => void copy(`${amount} ${from} = ${result.toFixed(2)} ${to}`, "fx")} className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-950"><Copy className="h-4 w-4" />{copied === "fx" ? ui.copied : ui.copyRate}</button><button type="button" onClick={() => setFavorites((x) => x.includes(to) ? x.filter((c) => c !== to) : [...x, to])} className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-bold"><Star className={`h-4 w-4 ${favorites.includes(to) ? "fill-current" : ""}`} />{favorites.includes(to) ? ui.favorite : ui.remember}</button></div></div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{QUICK_CURRENCIES.map((code) => { const c = getCurrency(code); return <button key={code} type="button" onClick={() => setTo(code)} className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-bold ${to === code ? "border-transparent bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border-border"}`}>{c.flag} {code}</button>; })}</div>
          </section>
        )}

        {tab === "nearby" && (
          <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-sm font-bold"><Navigation className="h-4 w-4" />{ui.nearbyTitle}</div><div className="mt-1 text-xs text-muted">{city} · {ui.nearbySub}</div></div><div className="flex gap-2 overflow-x-auto pb-1">{[["all", ui.all],["atm", ui.cash],["restaurant", ui.food],["cafe", ui.cafe],["hotel", ui.hotel]].map(([id, label]) => <button key={id} type="button" onClick={() => setNearbyFilter(id)} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold ${nearbyFilter === id ? "border-transparent bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border-border"}`}>{label}</button>)}</div></div>
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_.75fr]"><div className="overflow-hidden rounded-[1.5rem] border border-border bg-slate-100 dark:bg-slate-950"><MapView center={location} places={filteredNearby.slice(0, 20)} /></div><div className="grid gap-2">{loading && <div className="rounded-2xl border border-border p-4 text-sm text-muted">Lade lokale Treffer…</div>}{!loading && filteredNearby.length === 0 && <div className="rounded-2xl border border-border p-4 text-sm text-muted">{ui.noPlaces}</div>}{filteredNearby.map((p) => <div key={p.id} className="rounded-2xl border border-border p-3.5 shadow-soft"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-bold">{p.title}</div><div className="mt-1 text-xs text-muted">{formatDistance(p.distance)}{p.rating ? ` · ★ ${p.rating.toFixed(1)}` : ""}</div></div><span className="rounded-full border border-border px-2 py-1 text-[10px] font-bold uppercase">{ui[CATEGORY_LABEL[p.kind] ?? "all"]}</span></div><div className="mt-2 text-xs leading-5 text-muted">{p.note}</div><div className="mt-3 flex gap-2"><button type="button" onClick={() => route(p)} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-950 px-3 text-xs font-bold text-white dark:bg-white dark:text-slate-950"><Navigation className="h-3.5 w-3.5" />{ui.route}</button><button type="button" onClick={() => openMaps(p)} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-bold">{ui.maps}</button></div></div>)}</div></div>
            <div className="mt-6 rounded-3xl border border-border p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="text-sm font-bold">{ui.eventsTitle}</div><div className="mt-1 text-xs text-muted">{ui.eventsSub}</div></div><div className="flex gap-2">{[[1, ui.stay1],[3, ui.stay3],[5, ui.stay5],[10, ui.stay10]].map(([d, label]) => <button key={d} type="button" onClick={() => setStayDays(d as number)} className={`rounded-full border px-3 py-1.5 text-xs font-bold ${stayDays === d ? "border-transparent bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border-border"}`}>{label}</button>)}</div></div><div className="mt-4 grid gap-2 md:grid-cols-3">{events.slice(0, 3).map((e, i) => <div key={`${e.title}-${i}`} className="rounded-2xl border border-border p-3"><div className="text-xl">{e.emoji}</div><div className="mt-2 text-sm font-bold">{e.title}</div><div className="mt-1 text-xs text-muted">{"date" in e && e.date ? `${e.date} · ` : ""}{e.time} · {e.duration}</div><div className="mt-2 text-xs leading-5 text-muted">{e.note}</div></div>)}</div></div>
          </section>
        )}

        {tab === "phrases" && (
          <section className="rounded-[2rem] border border-border bg-surface p-5 shadow-premium sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-sm font-bold"><Languages className="h-4 w-4" />{ui.phrasesTitle}</div><div className="mt-1 text-xs text-muted">{ui.phrasesSub}</div></div><span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-bold">{phrases.length}</span></div>
            <div className="relative mt-4"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input value={phraseQuery} onChange={(e) => setPhraseQuery(e.target.value)} placeholder={ui.search} className="h-12 w-full rounded-2xl border border-border bg-surface pl-10 pr-4 outline-none" /></div>
            <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">{filteredPhrases.map((p) => { const local = p.local[language] ?? p.local.en ?? p.english; return <button key={p.id} type="button" onClick={() => setSelectedPhrase(p.id)} className="rounded-2xl border border-border bg-white/50 p-4 text-left shadow-soft dark:bg-slate-950/20"><div className="text-xs font-bold text-muted">{p.category}</div><div className="mt-1 text-sm font-bold leading-5">{local}</div><div className="mt-1 text-xs text-muted">{p.english}</div></button>; })}</div>
            {filteredPhrases.length === 0 && <div className="mt-4 rounded-2xl border border-border p-4 text-sm text-muted">{ui.noPhrase}</div>}
            {selectedPhrase && (() => { const p = phrases.find((x) => x.id === selectedPhrase); if (!p) return null; const local = p.local[language] ?? p.local.en ?? p.english; return <div className="fixed inset-0 z-[60] grid place-items-end bg-slate-950/45 p-3 sm:place-items-center"><div className="w-full max-w-2xl rounded-[2rem] border border-border bg-surface p-5 shadow-premium"><div className="flex items-start justify-between gap-3"><div><div className="text-xs font-bold text-muted">{p.category}</div><div className="mt-2 text-xl font-black">{local}</div><div className="mt-1 text-sm text-muted">{p.english}</div></div><button type="button" onClick={() => setSelectedPhrase(null)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border"><X className="h-4 w-4" /></button></div><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => speak(p.english)} className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-bold text-white dark:bg-white dark:text-slate-950"><Volume2 className="h-4 w-4" />{ui.speak}</button><button type="button" onClick={() => void copy(local, `phrase-${p.id}`)} className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-bold"><Copy className="h-4 w-4" />{copied === `phrase-${p.id}` ? ui.copied : ui.copy}</button></div></div></div>; })()}
          </section>
        )}

        {tab === "sos" && (
          <section className="rounded-[2rem] border border-rose-500/20 bg-rose-500/[0.04] p-5 shadow-premium sm:p-7"><div><div className="flex items-center gap-2 text-base font-black text-rose-700 dark:text-rose-300"><ShieldAlert className="h-5 w-5" />{ui.sosTitle}</div><div className="mt-1 text-sm text-muted">{ui.sosSub}</div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{emergencyActions.map((a) => <button key={a.title} type="button" onClick={() => setTab("phrases")} className="rounded-2xl border border-rose-500/10 bg-surface p-4 text-left shadow-soft"><div className="text-2xl">{a.icon}</div><div className="mt-2 text-sm font-bold">{a.title}</div><div className="mt-1 text-xs leading-5 text-muted">{a.note}</div><div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-300">Soforthilfe <ChevronRight className="h-3.5 w-3.5" /></div></button>)}</div><div className="mt-5 rounded-3xl border border-rose-500/10 bg-surface p-4"><div className="text-sm font-bold">Standort</div><div className="mt-1 text-xs text-muted">{locationState === "loading" ? ui.locationBusy : locationState === "ready" ? ui.gpsOn : `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`}</div><button type="button" onClick={requestLocation} className="mt-3 inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-bold"><LocateFixed className="h-4 w-4" />{ui.myLocation}</button></div></section>
        )}
      </main>
    </div>
  );
}
