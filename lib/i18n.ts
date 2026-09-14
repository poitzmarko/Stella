"use client";

import { useEffect, useMemo, useState } from "react";
import type { LanguageCode } from "./types";

export const supportedLanguages: {
  code: LanguageCode;
  label: string;
}[] = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "zhHans", label: "中文（简体）" },
];

/**
 * Compatibility alias used by existing components.
 */
export const languageOptions = supportedLanguages;

/**
 * A dictionary is intentionally string-keyed.
 *
 * This keeps the translation layer extensible:
 * components can introduce new keys without breaking
 * the entire TypeScript build.
 */
export type TranslationDictionary = Record<
  string,
  string
>;

export const dictionaries: Record<
  LanguageCode,
  TranslationDictionary
> = {
  de: {
    brand: "FX Pro",

    appTitle: "FX Pro Travel Gold",
    appSubtitle:
      "Die intelligente Reise-App für unterwegs.",
    slogan:
      "Wechselkurse, Reisen, Navigation, lokale Tipps und Urlaubshilfe – alles in einer App.",

    currency: "Währung",
    amount: "Betrag",
    from: "Von",
    to: "Nach",

    copyRate: "Kurs kopieren",
    saveFavorite: "Favorit speichern",
    removeFavorite: "Favorit entfernen",

    quickSwitch: "Quick Switch",
    history: "Verlauf",
    favorites: "Favoriten",

    smartCurrency: "Smart Currency",
    travelFeed: "Travel Feed",
    nearby: "Nearby",
    explore: "Explore Nearby",
    events: "Local Events",
    phrases: "Travel Phrases",
    timeline: "Travel Timeline",
    emergency: "Notfall",
    money: "Money",

    loading: "Lädt ...",
    empty: "Noch keine Daten verfügbar.",
    error: "Etwas ist schiefgelaufen.",
    retry: "Erneut versuchen",

    showLocal: "Landessprache zeigen",
    speak: "Vorlesen",

    locationOff: "Standort nicht aktiv",
    locationHint:
      "GPS freigeben, um lokale Orte und Events zu sehen.",
    getLocation: "Standort holen",
    searchNearby: "Nearby suchen",

    eventsStay: "Aufenthalt",
    filterAll: "Alle",
    route: "Route",
    openMap: "Karte",
    refresh: "Aktualisieren",

    phaseHome: "Zuhause",
    phaseAirport: "Flughafen",
    phaseHotel: "Hotel",
    phaseTrip: "Urlaub",
    phaseHoliday: "Urlaub",
    phaseEmergency: "Notfall",
    phaseReturn: "Rückreise",

    themeLight: "Light",
    themeDark: "Dark",

    liveRates: "Live-Kurse",
    offlineRates: "Offline-Basis",
    rateUpdated: "Aktualisiert",

    localCurrency: "Lokale Währung",
    localCity: "Stadt",

    exploreHint:
      "Top-Orte, Geheimtipps und Urlaubsziele im Umkreis.",
    eventsHint:
      "Events passend zu deinem Aufenthalt.",
    phrasesHint:
      "50 wertvolle Kurzsätze für den Urlaub.",
    timelineHint:
      "Die App priorisiert je nach Reisephase.",
    emergencyHint:
      "Sofortzugriff auf kritische Reiseinfos.",
    moneyHint:
      "Vorbereitete Geldthemen für unterwegs.",
    feedHint:
      "Situationsabhängige Hinweise statt starrer Listen.",
  },

  en: {
    brand: "FX Pro",

    appTitle: "FX Pro Travel Gold",
    appSubtitle:
      "The intelligent travel app for the road.",
    slogan:
      "Exchange rates, travel, navigation, local tips and trip help — all in one app.",

    currency: "Currency",
    amount: "Amount",
    from: "From",
    to: "To",

    copyRate: "Copy rate",
    saveFavorite: "Save favorite",
    removeFavorite: "Remove favorite",

    quickSwitch: "Quick Switch",
    history: "History",
    favorites: "Favorites",

    smartCurrency: "Smart Currency",
    travelFeed: "Travel Feed",
    nearby: "Nearby",
    explore: "Explore Nearby",
    events: "Local Events",
    phrases: "Travel Phrases",
    timeline: "Travel Timeline",
    emergency: "Emergency",
    money: "Money",

    loading: "Loading ...",
    empty: "No data yet.",
    error: "Something went wrong.",
    retry: "Try again",

    showLocal: "Show local language",
    speak: "Speak",

    locationOff: "Location inactive",
    locationHint:
      "Allow GPS to see nearby places and events.",
    getLocation: "Get location",
    searchNearby: "Search nearby",

    eventsStay: "Stay",
    filterAll: "All",
    route: "Route",
    openMap: "Map",
    refresh: "Refresh",

    phaseHome: "Home",
    phaseAirport: "Airport",
    phaseHotel: "Hotel",
    phaseTrip: "Trip",
    phaseHoliday: "Holiday",
    phaseEmergency: "Emergency",
    phaseReturn: "Return",

    themeLight: "Light",
    themeDark: "Dark",

    liveRates: "Live rates",
    offlineRates: "Offline base",
    rateUpdated: "Updated",

    localCurrency: "Local currency",
    localCity: "City",

    exploreHint:
      "Top places, hidden gems and travel highlights nearby.",
    eventsHint:
      "Events matched to your stay.",
    phrasesHint:
      "50 valuable short travel phrases.",
    timelineHint:
      "The app prioritizes by travel phase.",
    emergencyHint:
      "Instant access to critical travel info.",
    moneyHint:
      "Prepared money topics for the road.",
    feedHint:
      "Situational hints instead of static lists.",
  },

  es: {
    brand: "FX Pro",

    appTitle: "FX Pro Travel Gold",
    appSubtitle:
      "La app de viaje inteligente para moverte.",
    slogan:
      "Tipos de cambio, viajes, navegación, tips locales y ayuda — todo en una sola app.",

    currency: "Moneda",
    amount: "Importe",
    from: "De",
    to: "A",

    copyRate: "Copiar tipo",
    saveFavorite: "Guardar favorito",
    removeFavorite: "Quitar favorito",

    quickSwitch: "Cambio rápido",
    history: "Historial",
    favorites: "Favoritos",

    smartCurrency: "Smart Currency",
    travelFeed: "Travel Feed",
    nearby: "Nearby",
    explore: "Explore Nearby",
    events: "Local Events",
    phrases: "Travel Phrases",
    timeline: "Travel Timeline",
    emergency: "Emergencia",
    money: "Money",

    loading: "Cargando ...",
    empty: "Todavía no hay datos.",
    error: "Algo salió mal.",
    retry: "Reintentar",

    showLocal: "Mostrar idioma local",
    speak: "Hablar",

    locationOff: "Ubicación inactiva",
    locationHint:
      "Permite GPS para ver lugares y eventos cercanos.",
    getLocation: "Obtener ubicación",
    searchNearby: "Buscar cerca",

    eventsStay: "Estancia",
    filterAll: "Todos",
    route: "Ruta",
    openMap: "Mapa",
    refresh: "Actualizar",

    phaseHome: "Casa",
    phaseAirport: "Aeropuerto",
    phaseHotel: "Hotel",
    phaseTrip: "Viaje",
    phaseHoliday: "Vacaciones",
    phaseEmergency: "Emergencia",
    phaseReturn: "Regreso",

    themeLight: "Light",
    themeDark: "Dark",

    liveRates: "Tipos en vivo",
    offlineRates: "Base offline",
    rateUpdated: "Actualizado",

    localCurrency: "Moneda local",
    localCity: "Ciudad",

    exploreHint:
      "Lugares top, secretos y destinos cerca de ti.",
    eventsHint:
      "Eventos según tu estancia.",
    phrasesHint:
      "50 frases de viaje útiles.",
    timelineHint:
      "La app prioriza según la fase del viaje.",
    emergencyHint:
      "Acceso instantáneo a información crítica.",
    moneyHint:
      "Temas financieros listos para el viaje.",
    feedHint:
      "Sugerencias situacionales en vez de listas estáticas.",
  },

  fr: {
    brand: "FX Pro",

    appTitle: "FX Pro Travel Gold",
    appSubtitle:
      "L’application de voyage intelligente.",
    slogan:
      "Taux de change, voyage, navigation, conseils locaux et aide pratique — tout dans une seule app.",

    currency: "Devise",
    amount: "Montant",
    from: "De",
    to: "À",

    copyRate: "Copier le taux",
    saveFavorite: "Ajouter aux favoris",
    removeFavorite: "Retirer des favoris",

    quickSwitch: "Changement rapide",
    history: "Historique",
    favorites: "Favoris",

    smartCurrency: "Smart Currency",
    travelFeed: "Travel Feed",
    nearby: "Nearby",
    explore: "Explore Nearby",
    events: "Local Events",
    phrases: "Travel Phrases",
    timeline: "Travel Timeline",
    emergency: "Urgence",
    money: "Money",

    loading: "Chargement ...",
    empty: "Aucune donnée pour le moment.",
    error: "Une erreur est survenue.",
    retry: "Réessayer",

    showLocal: "Afficher la langue locale",
    speak: "Parler",

    locationOff: "Localisation inactive",
    locationHint:
      "Autorisez le GPS pour voir les lieux et événements à proximité.",
    getLocation: "Obtenir la position",
    searchNearby: "Rechercher autour",

    eventsStay: "Séjour",
    filterAll: "Tous",
    route: "Itinéraire",
    openMap: "Carte",
    refresh: "Actualiser",

    phaseHome: "Maison",
    phaseAirport: "Aéroport",
    phaseHotel: "Hôtel",
    phaseTrip: "Voyage",
    phaseHoliday: "Vacances",
    phaseEmergency: "Urgence",
    phaseReturn: "Retour",

    themeLight: "Light",
    themeDark: "Dark",

    liveRates: "Taux live",
    offlineRates: "Base hors ligne",
    rateUpdated: "Mis à jour",

    localCurrency: "Devise locale",
    localCity: "Ville",

    exploreHint:
      "Meilleurs endroits, trésors cachés et spots de voyage à proximité.",
    eventsHint:
      "Événements adaptés à votre séjour.",
    phrasesHint:
      "50 phrases de voyage utiles.",
    timelineHint:
      "L’application priorise selon la phase du voyage.",
    emergencyHint:
      "Accès instantané aux informations critiques.",
    moneyHint:
      "Thèmes argent prévus pour le voyage.",
    feedHint:
      "Conseils contextuels plutôt que listes statiques.",
  },

  it: {
    brand: "FX Pro",

    appTitle: "FX Pro Travel Gold",
    appSubtitle:
      "L’app di viaggio intelligente.",
    slogan:
      "Valute, viaggio, navigazione, consigli locali e supporto pratico — tutto in una sola app.",

    currency: "Valuta",
    amount: "Importo",
    from: "Da",
    to: "A",

    copyRate: "Copia tasso",
    saveFavorite: "Salva preferito",
    removeFavorite: "Rimuovi preferito",

    quickSwitch: "Cambio rapido",
    history: "Cronologia",
    favorites: "Preferiti",

    smartCurrency: "Smart Currency",
    travelFeed: "Travel Feed",
    nearby: "Nearby",
    explore: "Explore Nearby",
    events: "Local Events",
    phrases: "Travel Phrases",
    timeline: "Travel Timeline",
    emergency: "Emergenza",
    money: "Money",

    loading: "Caricamento ...",
    empty: "Nessun dato ancora.",
    error: "Qualcosa è andato storto.",
    retry: "Riprova",

    showLocal: "Mostra lingua locale",
    speak: "Parla",

    locationOff: "Posizione inattiva",
    locationHint:
      "Consenti il GPS per vedere luoghi ed eventi vicini.",
    getLocation: "Ottieni posizione",
    searchNearby: "Cerca vicino",

    eventsStay: "Soggiorno",
    filterAll: "Tutti",
    route: "Percorso",
    openMap: "Mappa",
    refresh: "Aggiorna",

    phaseHome: "Casa",
    phaseAirport: "Aeroporto",
    phaseHotel: "Hotel",
    phaseTrip: "Viaggio",
    phaseHoliday: "Vacanza",
    phaseEmergency: "Emergenza",
    phaseReturn: "Ritorno",

    themeLight: "Light",
    themeDark: "Dark",

    liveRates: "Tassi live",
    offlineRates: "Base offline",
    rateUpdated: "Aggiornato",

    localCurrency: "Valuta locale",
    localCity: "Città",

    exploreHint:
      "Top spot, gemme nascoste e luoghi interessanti vicino a te.",
    eventsHint:
      "Eventi adatti al tuo soggiorno.",
    phrasesHint:
      "50 frasi utili per il viaggio.",
    timelineHint:
      "L’app dà priorità in base alla fase di viaggio.",
    emergencyHint:
      "Accesso immediato alle informazioni critiche.",
    moneyHint:
      "Temi economici pronti per il viaggio.",
    feedHint:
      "Suggerimenti contestuali invece di liste statiche.",
  },

  pt: {
    brand: "FX Pro",

    appTitle: "FX Pro Travel Gold",
    appSubtitle:
      "O app de viagem inteligente.",
    slogan:
      "Câmbio, viagem, navegação, dicas locais e ajuda — tudo em um só app.",

    currency: "Moeda",
    amount: "Valor",
    from: "De",
    to: "Para",

    copyRate: "Copiar taxa",
    saveFavorite: "Salvar favorito",
    removeFavorite: "Remover favorito",

    quickSwitch: "Troca rápida",
    history: "Histórico",
    favorites: "Favoritos",

    smartCurrency: "Smart Currency",
    travelFeed: "Travel Feed",
    nearby: "Nearby",
    explore: "Explore Nearby",
    events: "Local Events",
    phrases: "Travel Phrases",
    timeline: "Travel Timeline",
    emergency: "Emergência",
    money: "Money",

    loading: "Carregando ...",
    empty: "Ainda sem dados.",
    error: "Algo deu errado.",
    retry: "Tentar novamente",

    showLocal: "Mostrar idioma local",
    speak: "Falar",

    locationOff: "Localização inativa",
    locationHint:
      "Permita GPS para ver locais e eventos próximos.",
    getLocation: "Obter localização",
    searchNearby: "Procurar perto",

    eventsStay: "Estadia",
    filterAll: "Todos",
    route: "Rota",
    openMap: "Mapa",
    refresh: "Atualizar",

    phaseHome: "Casa",
    phaseAirport: "Aeroporto",
    phaseHotel: "Hotel",
    phaseTrip: "Viagem",
    phaseHoliday: "Férias",
    phaseEmergency: "Emergência",
    phaseReturn: "Retorno",

    themeLight: "Light",
    themeDark: "Dark",

    liveRates: "Taxas ao vivo",
    offlineRates: "Base offline",
    rateUpdated: "Atualizado",

    localCurrency: "Moeda local",
    localCity: "Cidade",

    exploreHint:
      "Pontos top, tesouros escondidos e lugares de viagem próximos.",
    eventsHint:
      "Eventos alinhados com a sua estadia.",
    phrasesHint:
      "50 frases úteis para viagem.",
    timelineHint:
      "O app prioriza conforme a fase da viagem.",
    emergencyHint:
      "Acesso instantâneo a informações críticas.",
    moneyHint:
      "Temas financeiros prontos para a viagem.",
    feedHint:
      "Dicas contextuais em vez de listas estáticas.",
  },

  zhHans: {
    brand: "FX Pro",

    appTitle: "FX Pro Travel Gold",
    appSubtitle: "面向旅行的智能应用。",
    slogan:
      "汇率、旅行、导航、本地提示与实用帮助——全部集成在一个应用里。",

    currency: "货币",
    amount: "金额",
    from: "从",
    to: "到",

    copyRate: "复制汇率",
    saveFavorite: "收藏",
    removeFavorite: "移除收藏",

    quickSwitch: "快速切换",
    history: "历史",
    favorites: "收藏",

    smartCurrency: "Smart Currency",
    travelFeed: "Travel Feed",
    nearby: "Nearby",
    explore: "Explore Nearby",
    events: "Local Events",
    phrases: "Travel Phrases",
    timeline: "Travel Timeline",
    emergency: "紧急",
    money: "Money",

    loading: "加载中 ...",
    empty: "暂无数据。",
    error: "出错了。",
    retry: "重试",

    showLocal: "显示当地语言",
    speak: "朗读",

    locationOff: "定位未启用",
    locationHint:
      "允许 GPS 以查看附近地点和活动。",
    getLocation: "获取位置",
    searchNearby: "附近搜索",

    eventsStay: "停留时长",
    filterAll: "全部",
    route: "路线",
    openMap: "地图",
    refresh: "刷新",

    phaseHome: "家中",
    phaseAirport: "机场",
    phaseHotel: "酒店",
    phaseTrip: "旅行中",
    phaseHoliday: "假期",
    phaseEmergency: "紧急",
    phaseReturn: "返程",

    themeLight: "Light",
    themeDark: "Dark",

    liveRates: "实时汇率",
    offlineRates: "离线基础",
    rateUpdated: "已更新",

    localCurrency: "当地货币",
    localCity: "城市",

    exploreHint:
      "附近最佳地点、隐藏宝藏与旅行亮点。",
    eventsHint:
      "与你停留时间匹配的活动。",
    phrasesHint:
      "50 条实用旅行短语。",
    timelineHint:
      "应用会根据旅行阶段优先显示内容。",
    emergencyHint:
      "关键旅行信息的即时访问。",
    moneyHint:
      "旅行中常用的财务主题。",
    feedHint:
      "情境化提示，而不是静态列表。",
  },
};

/**
 * Translation keys are intentionally open.
 *
 * This prevents a single missing UI key from stopping
 * the entire production build.
 */
export type TranslationKey = string;

/**
 * Translation helper for non-React code.
 */
export function t(
  lang: LanguageCode,
  key: TranslationKey,
): string {
  return (
    dictionaries[lang]?.[key] ??
    dictionaries.en[key] ??
    key
  );
}

/**
 * React i18n hook.
 *
 * Supports both naming conventions:
 * - language / setLanguage
 * - locale / setLocale
 *
 * Also provides:
 * - dictionary
 * - languages
 * - languageOptions
 */
export function useI18n() {
  const [language, setLanguageState] =
    useState<LanguageCode>("de");

  useEffect(() => {
    const stored =
      window.localStorage.getItem(
        "fx-pro-language",
      );

    if (
      stored &&
      supportedLanguages.some(
        (item) => item.code === stored,
      )
    ) {
      setLanguageState(
        stored as LanguageCode,
      );

      return;
    }

    const browserLanguage =
      navigator.language.split("-")[0];

    if (
      supportedLanguages.some(
        (item) => item.code === browserLanguage,
      )
    ) {
      setLanguageState(
        browserLanguage as LanguageCode,
      );
    }
  }, []);

  const setLanguage = (
    nextLanguage: LanguageCode,
  ) => {
    setLanguageState(nextLanguage);

    window.localStorage.setItem(
      "fx-pro-language",
      nextLanguage,
    );
  };

  const dictionary = useMemo(
    () =>
      dictionaries[language] ??
      dictionaries.en,
    [language],
  );

  const translate = (
    key: TranslationKey,
  ): string => {
    return (
      dictionary[key] ??
      dictionaries.en[key] ??
      key
    );
  };

  return {
    language,
    setLanguage,

    /**
     * Compatibility API used by AppShell.
     */
    locale: language,
    setLocale: setLanguage,

    dictionary,

    t: translate,

    languages: supportedLanguages,
    languageOptions,
  };
}
