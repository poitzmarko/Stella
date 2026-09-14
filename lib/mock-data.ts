import type {
  Currency,
  EventItem,
  ExploreItem,
  FeedItem,
  NearbyKind,
  NearbyPlace,
  Phase,
  PhraseItem,
  TimelinePhase,
  LocationPoint,
} from "@/lib/types";

import {
  distanceMeters,
  seededOffset,
} from "@/lib/geo";

export const currencyCatalog: Currency[] = [
  { code: "EUR", name: "Euro", flag: "🇪🇺", rateToEUR: 1 },
  { code: "USD", name: "US Dollar", flag: "🇺🇸", rateToEUR: 0.92 },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", rateToEUR: 1.17 },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭", rateToEUR: 1.04 },
  { code: "PLN", name: "Polish Zloty", flag: "🇵🇱", rateToEUR: 0.23 },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", rateToEUR: 0.0061 },
  { code: "SEK", name: "Swedish Krona", flag: "🇸🇪", rateToEUR: 0.088 },
  { code: "NOK", name: "Norwegian Krone", flag: "🇳🇴", rateToEUR: 0.086 },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", rateToEUR: 0.68 },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", rateToEUR: 0.61 },
  { code: "CZK", name: "Czech Koruna", flag: "🇨🇿", rateToEUR: 0.041 },
  { code: "HUF", name: "Hungarian Forint", flag: "🇭🇺", rateToEUR: 0.0026 },
  { code: "DKK", name: "Danish Krone", flag: "🇩🇰", rateToEUR: 0.134 },
  { code: "TRY", name: "Turkish Lira", flag: "🇹🇷", rateToEUR: 0.029 },
  { code: "RON", name: "Romanian Leu", flag: "🇷🇴", rateToEUR: 0.20 },
  { code: "BGN", name: "Bulgarian Lev", flag: "🇧🇬", rateToEUR: 0.51 },
  { code: "HRK", name: "Croatian Kuna", flag: "🇭🇷", rateToEUR: 0.13 },
  { code: "ISK", name: "Icelandic Krona", flag: "🇮🇸", rateToEUR: 0.0068 },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽", rateToEUR: 0.053 },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷", rateToEUR: 0.18 },
  { code: "ARS", name: "Argentine Peso", flag: "🇦🇷", rateToEUR: 0.0010 },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦", rateToEUR: 0.049 },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬", rateToEUR: 0.69 },
  { code: "HKD", name: "Hong Kong Dollar", flag: "🇭🇰", rateToEUR: 0.12 },
  { code: "NZD", name: "New Zealand Dollar", flag: "🇳🇿", rateToEUR: 0.56 },
  { code: "THB", name: "Thai Baht", flag: "🇹🇭", rateToEUR: 0.025 },
  { code: "IDR", name: "Indonesian Rupiah", flag: "🇮🇩", rateToEUR: 0.000057 },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳", rateToEUR: 0.011 },
  { code: "KRW", name: "South Korean Won", flag: "🇰🇷", rateToEUR: 0.00069 },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳", rateToEUR: 0.13 },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪", rateToEUR: 0.25 },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦", rateToEUR: 0.24 },
  { code: "ILS", name: "Israeli Shekel", flag: "🇮🇱", rateToEUR: 0.25 },
  { code: "CLP", name: "Chilean Peso", flag: "🇨🇱", rateToEUR: 0.0010 },
  { code: "COP", name: "Colombian Peso", flag: "🇨🇴", rateToEUR: 0.00022 },
  { code: "PEN", name: "Peruvian Sol", flag: "🇵🇪", rateToEUR: 0.24 },
  { code: "PHP", name: "Philippine Peso", flag: "🇵🇭", rateToEUR: 0.016 },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾", rateToEUR: 0.21 },
  { code: "VND", name: "Vietnamese Dong", flag: "🇻🇳", rateToEUR: 0.000036 },
  { code: "UAH", name: "Ukrainian Hryvnia", flag: "🇺🇦", rateToEUR: 0.023 },
];

export const baseRates: Record<string, number> =
  Object.fromEntries(
    currencyCatalog.map((currency) => [
      currency.code,
      currency.rateToEUR,
    ]),
  );

export const phrases: PhraseItem[] = [
  {
    id: "hello",
    category: "hotel",
    english: "Hello.",
    local: {
      de: "Hallo.",
      en: "Hello.",
      es: "Hola.",
      fr: "Bonjour.",
      it: "Ciao.",
      pt: "Olá.",
      zh: "你好。",
    },
  },
  {
    id: "morning",
    category: "hotel",
    english: "Good morning.",
    local: {
      de: "Guten Morgen.",
      en: "Good morning.",
      es: "Buenos días.",
      fr: "Bonjour.",
      it: "Buongiorno.",
      pt: "Bom dia.",
      zh: "早上好。",
    },
  },
  {
    id: "thanks",
    category: "hotel",
    english: "Thank you.",
    local: {
      de: "Danke.",
      en: "Thank you.",
      es: "Gracias.",
      fr: "Merci.",
      it: "Grazie.",
      pt: "Obrigado.",
      zh: "谢谢。",
    },
  },
  {
    id: "speak",
    category: "hotel",
    english: "Do you speak English?",
    local: {
      de: "Sprechen Sie Englisch?",
      en: "Do you speak English?",
      es: "¿Habla inglés?",
      fr: "Parlez-vous anglais ?",
      it: "Parla inglese?",
      pt: "Você fala inglês?",
      zh: "你会说英语吗？",
    },
  },
  {
    id: "slowly",
    category: "hotel",
    english: "Please speak slowly.",
    local: {
      de: "Bitte langsam sprechen.",
      en: "Please speak slowly.",
      es: "Hable despacio, por favor.",
      fr: "Parlez lentement, s’il vous plaît.",
      it: "Parli lentamente, per favore.",
      pt: "Fale devagar, por favor.",
      zh: "请说慢一点。",
    },
  },
  {
    id: "understand",
    category: "hotel",
    english: "I do not understand.",
    local: {
      de: "Ich verstehe nicht.",
      en: "I do not understand.",
      es: "No entiendo.",
      fr: "Je ne comprends pas.",
      it: "Non capisco.",
      pt: "Não entendo.",
      zh: "我不明白。",
    },
  },
  {
    id: "map",
    category: "hotel",
    english: "Can you show me on the map?",
    local: {
      de: "Können Sie es mir auf der Karte zeigen?",
      en: "Can you show me on the map?",
      es: "¿Puede mostrármelo en el mapa?",
      fr: "Pouvez-vous me le montrer sur la carte ?",
      it: "Può mostrarmelo sulla mappa?",
      pt: "Pode mostrar no mapa?",
      zh: "你能在地图上给我看吗？",
    },
  },
  {
    id: "atm",
    category: "shopping",
    english: "Where is the nearest ATM?",
    local: {
      de: "Wo ist der nächste Geldautomat?",
      en: "Where is the nearest ATM?",
      es: "¿Dónde está el cajero más cercano?",
      fr: "Où est le distributeur le plus proche ?",
      it: "Dov'è il bancomat più vicino?",
      pt: "Onde fica o caixa eletrônico mais próximo?",
      zh: "最近的ATM在哪里？",
    },
  },
  {
    id: "pharmacy",
    category: "emergency",
    english: "Where is the nearest pharmacy?",
    local: {
      de: "Wo ist die nächste Apotheke?",
      en: "Where is the nearest pharmacy?",
      es: "¿Dónde está la farmacia más cercana?",
      fr: "Où est la pharmacie la plus proche ?",
      it: "Dov'è la farmacia più vicina?",
      pt: "Onde fica a farmácia mais próxima?",
      zh: "最近的药店在哪里？",
    },
  },
  {
    id: "taxi",
    category: "taxi",
    english: "Can you call me a taxi?",
    local: {
      de: "Können Sie mir ein Taxi rufen?",
      en: "Can you call me a taxi?",
      es: "¿Puede llamarme un taxi?",
      fr: "Pouvez-vous m’appeler un taxi ?",
      it: "Può chiamarmi un taxi?",
      pt: "Pode chamar um táxi para mim?",
      zh: "你能帮我叫一辆出租车吗？",
    },
  },
  {
    id: "breakfast",
    category: "hotel",
    english: "Where is the breakfast buffet?",
    local: {
      de: "Wo ist das Frühstücksbuffet?",
      en: "Where is the breakfast buffet?",
      es: "¿Dónde está el bufé del desayuno?",
      fr: "Où est le buffet du petit-déjeuner ?",
      it: "Dov’è il buffet della colazione?",
      pt: "Onde fica o buffet do café da manhã?",
      zh: "早餐自助餐在哪里？",
    },
  },
  {
    id: "towels",
    category: "hotel",
    english: "I need new towels.",
    local: {
      de: "Ich brauche neue Handtücher.",
      en: "I need new towels.",
      es: "Necesito toallas nuevas.",
      fr: "J’ai besoin de serviettes propres.",
      it: "Ho bisogno di asciugamani nuovi.",
      pt: "Preciso de toalhas novas.",
      zh: "我需要新的毛巾。",
    },
  },
  {
    id: "ac",
    category: "hotel",
    english: "The air conditioning does not work.",
    local: {
      de: "Die Klimaanlage funktioniert nicht.",
      en: "The air conditioning does not work.",
      es: "El aire acondicionado no funciona.",
      fr: "La climatisation ne fonctionne pas.",
      it: "L'aria condizionata non funziona.",
      pt: "O ar condicionado não funciona.",
      zh: "空调坏了。",
    },
  },
  {
    id: "shower",
    category: "hotel",
    english: "The shower does not work.",
    local: {
      de: "Die Dusche funktioniert nicht.",
      en: "The shower does not work.",
      es: "La ducha no funciona.",
      fr: "La douche ne fonctionne pas.",
      it: "La doccia non funziona.",
      pt: "O chuveiro não funciona.",
      zh: "淋浴坏了。",
    },
  },
  {
    id: "wifi",
    category: "hotel",
    english: "The Wi-Fi does not work.",
    local: {
      de: "Das WLAN funktioniert nicht.",
      en: "The Wi-Fi does not work.",
      es: "El Wi-Fi no funciona.",
      fr: "Le Wi-Fi ne fonctionne pas.",
      it: "Il Wi-Fi non funziona.",
      pt: "O Wi-Fi não funciona.",
      zh: "Wi-Fi 不工作。",
    },
  },
  {
    id: "bill",
    category: "restaurant",
    english: "Can I have the bill, please?",
    local: {
      de: "Kann ich die Rechnung bekommen?",
      en: "Can I have the bill, please?",
      es: "¿Me trae la cuenta, por favor?",
      fr: "Puis-je avoir l'addition, s’il vous plaît ?",
      it: "Posso avere il conto, per favore?",
      pt: "Pode trazer a conta, por favor?",
      zh: "请给我账单。",
    },
  },
  {
    id: "card",
    category: "restaurant",
    english: "Can I pay by card?",
    local: {
      de: "Kann ich mit Karte bezahlen?",
      en: "Can I pay by card?",
      es: "¿Puedo pagar con tarjeta?",
      fr: "Puis-je payer par carte ?",
      it: "Posso pagare con carta?",
      pt: "Posso pagar com cartão?",
      zh: "我可以刷卡吗？",
    },
  },
  {
    id: "coffee",
    category: "restaurant",
    english: "I would like a coffee, please.",
    local: {
      de: "Ich hätte gern einen Kaffee.",
      en: "I would like a coffee, please.",
      es: "Quisiera un café, por favor.",
      fr: "Je voudrais un café, s’il vous plaît.",
      it: "Vorrei un caffè, per favore.",
      pt: "Quero um café, por favor.",
      zh: "我想要一杯咖啡。",
    },
  },
  {
    id: "water",
    category: "restaurant",
    english: "I would like water, please.",
    local: {
      de: "Ich hätte gern Wasser.",
      en: "I would like water, please.",
      es: "Quisiera agua, por favor.",
      fr: "Je voudrais de l’eau, s’il vous plaît.",
      it: "Vorrei dell'acqua, per favore.",
      pt: "Quero água, por favor.",
      zh: "我想要水。",
    },
  },
  {
    id: "noonions",
    category: "restaurant",
    english: "No onions, please.",
    local: {
      de: "Ohne Zwiebeln, bitte.",
      en: "No onions, please.",
      es: "Sin cebolla, por favor.",
      fr: "Sans oignons, s’il vous plaît.",
      it: "Senza cipolla, per favore.",
      pt: "Sem cebola, por favor.",
      zh: "不要洋葱。",
    },
  },
  {
    id: "allergy",
    category: "emergency",
    english: "I have an allergy.",
    local: {
      de: "Ich habe eine Allergie.",
      en: "I have an allergy.",
      es: "Tengo una alergia.",
      fr: "J’ai une allergie.",
      it: "Ho un’allergia.",
      pt: "Tenho alergia.",
      zh: "我有过敏。",
    },
  },
  {
    id: "doctor",
    category: "emergency",
    english: "I need a doctor.",
    local: {
      de: "Ich brauche einen Arzt.",
      en: "I need a doctor.",
      es: "Necesito un médico.",
      fr: "J’ai besoin d’un médecin.",
      it: "Ho bisogno di un medico.",
      pt: "Preciso de um médico.",
      zh: "我需要医生。",
    },
  },
  {
    id: "passport",
    category: "emergency",
    english: "I have lost my passport.",
    local: {
      de: "Ich habe meinen Reisepass verloren.",
      en: "I have lost my passport.",
      es: "He perdido mi pasaporte.",
      fr: "J’ai perdu mon passeport.",
      it: "Ho perso il passaporto.",
      pt: "Perdi meu passaporte.",
      zh: "我丢了护照。",
    },
  },
  {
    id: "vacuum",
    category: "hotel",
    english: "The vacuum cleaner is broken.",
    local: {
      de: "Der Staubsauger ist defekt.",
      en: "The vacuum cleaner is broken.",
      es: "La aspiradora está rota.",
      fr: "L’aspirateur est cassé.",
      it: "L'aspirapolvere è rotto.",
      pt: "O aspirador está quebrado.",
      zh: "吸尘器坏了。",
    },
  },
  {
    id: "broom",
    category: "hotel",
    english: "We need a broom.",
    local: {
      de: "Wir brauchen einen Besen.",
      en: "We need a broom.",
      es: "Necesitamos una escoba.",
      fr: "Nous avons besoin d’un balai.",
      it: "Abbiamo bisogno di una scopa.",
      pt: "Precisamos de uma vassoura.",
      zh: "我们需要一把扫帚。",
    },
  },
  {
    id: "mattress",
    category: "hotel",
    english: "The mattress squeaks.",
    local: {
      de: "Die Matratze quietscht.",
      en: "The mattress squeaks.",
      es: "El colchón cruje.",
      fr: "Le matelas grince.",
      it: "Il materasso scricchiola.",
      pt: "O colchão range.",
      zh: "床垫吱吱作响。",
    },
  },
  {
    id: "pillow",
    category: "hotel",
    english: "Can I get an extra pillow?",
    local: {
      de: "Kann ich ein zusätzliches Kissen bekommen?",
      en: "Can I get an extra pillow?",
      es: "¿Puedo tener una almohada extra?",
      fr: "Puis-je avoir un oreiller supplémentaire ?",
      it: "Posso avere un cuscino in più?",
      pt: "Posso ter um travesseiro extra?",
      zh: "可以给我一个额外的枕头吗？",
    },
  },
  {
    id: "blanket",
    category: "hotel",
    english: "Can I get an extra blanket?",
    local: {
      de: "Kann ich eine zusätzliche Decke bekommen?",
      en: "Can I get an extra blanket?",
      es: "¿Puedo tener una manta extra?",
      fr: "Puis-je avoir une couverture supplémentaire ?",
      it: "Posso avere una coperta in più?",
      pt: "Posso ter um cobertor extra?",
      zh: "可以给我一条额外的毯子吗？",
    },
  },
  {
    id: "luggage",
    category: "taxi",
    english: "Can you bring the luggage?",
    local: {
      de: "Können Sie das Gepäck bringen?",
      en: "Can you bring the luggage?",
      es: "¿Puede traer el equipaje?",
      fr: "Pouvez-vous apporter les bagages ?",
      it: "Può portare i bagagli?",
      pt: "Pode trazer a bagagem?",
      zh: "你能把行李拿来吗？",
    },
  },
  {
    id: "wake",
    category: "hotel",
    english: "Can you wake me up at 7 a.m.?",
    local: {
      de: "Können Sie mich um 7 Uhr wecken?",
      en: "Can you wake me up at 7 a.m.?",
      es: "¿Puede despertarme a las 7?",
      fr: "Pouvez-vous me réveiller à 7 h ?",
      it: "Può svegliarmi alle 7?",
      pt: "Pode me acordar às 7h?",
      zh: "你能早上7点叫醒我吗？",
    },
  },
  {
    id: "shopping",
    category: "shopping",
    english: "No meat, please.",
    local: {
      de: "Ohne Fleisch, bitte.",
      en: "No meat, please.",
      es: "Sin carne, por favor.",
      fr: "Sans viande, s’il vous plaît.",
      it: "Senza carne, per favore.",
      pt: "Sem carne, por favor.",
      zh: "不要肉。",
    },
  },
];

export const timelinePhases: TimelinePhase[] = [
  {
    id: "home",
    title: "🏠 Zuhause",
    description: "Vorbereitung und Favoriten zuerst.",
    highlights: [
      "Währung wählen",
      "Packliste prüfen",
      "Daten offline speichern",
    ],
  },
  {
    id: "airport",
    title: "✈ Flughafen",
    description:
      "Schnelle Aktionen für Boarding und Navigation.",
    highlights: [
      "Taxi",
      "Gate",
      "WLAN",
      "Boarding",
    ],
  },
  {
    id: "hotel",
    title: "🏨 Hotel",
    description:
      "Rezeption, Frühstück, Housekeeping.",
    highlights: [
      "Handtücher",
      "Frühstück",
      "Zimmer",
      "WLAN",
    ],
  },
  {
    id: "holiday",
    title: "🌴 Urlaub",
    description:
      "Nearby, Explore, Events und Feed.",
    highlights: [
      "Strände",
      "Hafen",
      "Boot",
      "Hidden Gems",
    ],
  },
  {
    id: "emergency",
    title: "🚨 Notfall",
    description:
      "Sofort zugängliche Hilfsinfos.",
    highlights: [
      "Arzt",
      "Taxi",
      "Pass",
      "Standort teilen",
    ],
  },
  {
    id: "return",
    title: "✈ Rückreise",
    description:
      "Abrechnung, Transfer, letzte Hinweise.",
    highlights: [
      "Rechnung",
      "Bargeld",
      "Gate",
      "Taxi",
    ],
  },
];

export const emergencyActions = [
  {
    title: "Arzt",
    note: "Medical help needed.",
    icon: "🩺",
  },
  {
    title: "Reisepass verloren",
    note: "Passport lost.",
    icon: "🛂",
  },
  {
    title: "Taxi",
    note: "Fast transfer to hotel or airport.",
    icon: "🚕",
  },
  {
    title: "Hotel",
    note: "Reception and address.",
    icon: "🏨",
  },
  {
    title: "Karte",
    note: "Show the location on the map.",
    icon: "🗺️",
  },
  {
    title: "Übersetzung",
    note: "Copy critical phrases instantly.",
    icon: "🗣️",
  },
];

export const moneyTopics = [
  {
    title: "Kreditkartengebühren",
    note: "Prepare a fee comparison before the trip.",
  },
  {
    title: "Bargeld vs. Karte",
    note: "Show a simple spend recommendation.",
  },
  {
    title: "Trinkgeld",
    note: "Local tipping guidance as a quick hint.",
  },
  {
    title: "Tax Free",
    note: "Tax refund helper structure.",
  },
  {
    title: "VAT-Rechner",
    note: "Calculate tax-inclusive and tax-free totals.",
  },
];

type ExploreTemplate = {
  title: string;
  kind: ExploreItem["kind"];
  emoji: string;
  note: string;
};

export const exploreTemplates: ExploreTemplate[] = [
  {
    title: "Harbour Walk",
    kind: "water",
    emoji: "⚓",
    note: "Waterfront and easy walking route.",
  },
  {
    title: "Sunset Point",
    kind: "nature",
    emoji: "🌅",
    note: "High-value sunset spot.",
  },
  {
    title: "Hidden Harbour Gem",
    kind: "culture",
    emoji: "✨",
    note: "Quiet local tip off the main road.",
  },
  {
    title: "Nature Reserve Trail",
    kind: "nature",
    emoji: "🌲",
    note: "Low-stress route with fresh air.",
  },
  {
    title: "Beach Line",
    kind: "water",
    emoji: "🏖️",
    note: "Easy access and tourist friendly.",
  },
  {
    title: "Museum Stop",
    kind: "culture",
    emoji: "🏛️",
    note: "Culture with short transfer.",
  },
  {
    title: "Local Fish Place",
    kind: "food",
    emoji: "🐟",
    note: "Good for a simple lunch.",
  },
  {
    title: "Boat Tour Dock",
    kind: "water",
    emoji: "⛴️",
    note: "Route to ship and ferry departures.",
  },
  {
    title: "Photo Pier",
    kind: "water",
    emoji: "📸",
    note: "Clean view and strong lighting.",
  },
  {
    title: "Family Harbour Zone",
    kind: "family",
    emoji: "👨‍👩‍👧",
    note: "Good for kids and slow travel.",
  },
];

type EventTemplate = {
  title: string;
  category: EventItem["category"];
  emoji: string;
  time: string;
  duration: string;
  note: string;
};

export const eventTemplates: EventTemplate[] = [
  {
    title: "Harbour Live Night",
    category: "music",
    emoji: "🎵",
    time: "18:30",
    duration: "2 h",
    note: "Open-air sets and local bands.",
  },
  {
    title: "Beach DJ Session",
    category: "music",
    emoji: "🎧",
    time: "20:00",
    duration: "3 h",
    note: "Sunset beats by the marina.",
  },
  {
    title: "Local Sports Showcase",
    category: "sport",
    emoji: "🚴",
    time: "16:00",
    duration: "2 h",
    note: "Community sports near the promenade.",
  },
  {
    title: "Nature Reserve Walk",
    category: "family",
    emoji: "🌲",
    time: "10:00",
    duration: "2 h",
    note: "Easy route for the day.",
  },
  {
    title: "Mole Food Market",
    category: "market",
    emoji: "🍽️",
    time: "17:00",
    duration: "4 h",
    note: "Street food and local drinks.",
  },
  {
    title: "Open-Air Cinema",
    category: "cinema",
    emoji: "🎬",
    time: "21:00",
    duration: "2 h",
    note: "Evening screening near the center.",
  },
  {
    title: "Town Stage Concert",
    category: "festival",
    emoji: "🎪",
    time: "19:00",
    duration: "3 h",
    note: "Culture close to the main square.",
  },
  {
    title: "Ferry Departure View",
    category: "harbour",
    emoji: "⛴️",
    time: "12:15",
    duration: "1 h",
    note: "Boat connection and waterfront vibe.",
  },
];

export const feedTemplates: FeedItem[] = [
  {
    id: "sunset",
    title: "Perfekter Sonnenuntergang",
    body: "Best spot is 12 min away by the water.",
    icon: "🌅",
    priority: 98,
    category: "sunset",
  },
  {
    id: "music",
    title: "Live-Musik in der Nähe",
    body: "A small harbor set starts this evening.",
    icon: "🎵",
    priority: 96,
    category: "music",
  },
  {
    id: "sport",
    title: "Sportevent heute",
    body: "A local race or stage finish is nearby.",
    icon: "🚴",
    priority: 94,
    category: "sport",
  },
  {
    id: "ferry",
    title: "Fähre fährt bald",
    body: "Boarding window opens soon.",
    icon: "⛴️",
    priority: 93,
    category: "ferry",
  },
  {
    id: "rating",
    title: "Top-bewertetes Restaurant",
    body: "Good reviews and short walking distance.",
    icon: "⭐",
    priority: 90,
    category: "rating",
  },
  {
    id: "weather",
    title: "Regen in Kürze",
    body: "An indoor backup is recommended.",
    icon: "🌧️",
    priority: 88,
    category: "weather",
  },
  {
    id: "currency",
    title: "Wechselkurs besser als gestern",
    body: "A small but useful travel win.",
    icon: "💱",
    priority: 86,
    category: "currency",
  },
  {
    id: "hotel",
    title: "Hotel-Quick-Action",
    body: "Need towels or reception? Open quick phrases.",
    icon: "🏨",
    priority: 84,
    category: "hotel",
  },
];

export const defaultLocation: LocationPoint = {
  lat: 54.095,
  lon: 14.25,
  label: "Default travel location",
};

export function createFallbackNearby(
  origin: LocationPoint,
): NearbyPlace[] {
  const base: Array<
    [
      string,
      NearbyKind,
      number,
      string,
    ]
  > = [
    [
      "ATM by the Harbor",
      "atm",
      1,
      "Good for quick cash.",
    ],
    [
      "Sea View Restaurant",
      "restaurant",
      2,
      "High-rated local food.",
    ],
    [
      "Morning Café",
      "cafe",
      3,
      "Coffee and light breakfast.",
    ],
    [
      "Harbour Bar",
      "bar",
      4,
      "Evening drinks with a view.",
    ],
    [
      "Central Hotel",
      "hotel",
      5,
      "Reception and city access.",
    ],
  ];

  return base
    .map(
      ([
        title,
        kind,
        seed,
        note,
      ]) => {
        const lat =
          origin.lat +
          seededOffset(
            seed,
            -0.01,
            0.01,
          );

        const lon =
          origin.lon +
          seededOffset(
            seed + 10,
            -0.01,
            0.01,
          );

        return {
          id: `${kind}-${seed}`,
          title,

          /**
           * Canonical property.
           */
          kind,

          /**
           * Compatibility property.
           */
          category: kind,

          lat,
          lon,

          distance:
            distanceMeters(
              origin,
              {
                lat,
                lon,
              },
            ),

          rating:
            4.2 +
            (seed % 4) * 0.2,

          note,

          source: "mock",
        } satisfies NearbyPlace;
      },
    )
    .sort(
      (a, b) =>
        a.distance -
        b.distance,
    );
}

export function createFallbackExplore(
  origin: LocationPoint,
): ExploreItem[] {
  return exploreTemplates
    .map(
      (
        item,
        index,
      ) => {
        const lat =
          origin.lat +
          seededOffset(
            index + 50,
            -0.02,
            0.02,
          );

        const lon =
          origin.lon +
          seededOffset(
            index + 60,
            -0.02,
            0.02,
          );

        return {
          id: `explore-${index}`,
          title: item.title,
          kind: item.kind,
          category: item.kind,
          emoji: item.emoji,
          lat,
          lon,
          distance:
            distanceMeters(
              origin,
              {
                lat,
                lon,
              },
            ),
          rating:
            4.3 +
            (index % 5) * 0.1,
          note: item.note,
          source: "mock",
        } satisfies ExploreItem;
      },
    )
    .sort(
      (a, b) =>
        a.distance -
        b.distance,
    )
    .slice(0, 20);
}

export function createFallbackEvents(
  origin: LocationPoint,
  stayDays: number,
): EventItem[] {
  const today = new Date();

  return eventTemplates
    .map(
      (
        item,
        index,
      ) => {
        const lat =
          origin.lat +
          seededOffset(
            index + 100,
            -0.02,
            0.02,
          );

        const lon =
          origin.lon +
          seededOffset(
            index + 110,
            -0.02,
            0.02,
          );

        const date =
          new Date(today);

        date.setDate(
          today.getDate() +
            (index %
              Math.max(
                stayDays,
                1,
              )),
        );

        return {
          id: `event-${index}`,
          title: item.title,
          category:
            item.category,
          emoji: item.emoji,
          lat,
          lon,
          distance:
            distanceMeters(
              origin,
              {
                lat,
                lon,
              },
            ),
          date:
            date
              .toISOString()
              .slice(0, 10),
          time: item.time,
          duration:
            item.duration,
          note: item.note,
          source: "mock",
        } satisfies EventItem;
      },
    )
    .sort((a, b) => {
      const dateA =
        a.date ?? "";

      const dateB =
        b.date ?? "";

      if (
        dateA !== dateB
      ) {
        return dateA.localeCompare(
          dateB,
        );
      }

      return (
        a.time.localeCompare(
          b.time,
        )
      );
    })
    .slice(0, 20);
}

export function buildTravelFeed(
  phase: Phase,
  cityLabel: string,
  contextScore = 0,
): FeedItem[] {
  const phaseBoost: Record<
    Phase,
    number
  > = {
    home: 0,
    airport: 1,
    hotel: 2,
    trip: 3,
    holiday: 3,
    emergency: 4,
    return: 5,
  };

  return feedTemplates
    .map((item) => ({
      ...item,

      priority:
        (item.priority ?? 0) +
        phaseBoost[phase] * 2 +
        contextScore,
    }))
    .sort(
      (a, b) =>
        (b.priority ?? 0) -
        (a.priority ?? 0),
    )
    .map((item) => ({
      ...item,

      body:
        cityLabel &&
        item.body
          ? `${item.body} · ${cityLabel}`
          : item.body,
    }));
}
