import type { TravelPhase } from '../types';
export const travelPhases: { id: TravelPhase; title: string; summary: string; highlights: string[] }[] = [
  {
    "id": "home",
    "title": "🏠 Zuhause",
    "summary": "Planen, speichern und prüfen.",
    "highlights": [
      "Währung auswählen",
      "Favoriten anlegen",
      "Packliste prüfen",
      "Wettercheck"
    ]
  },
  {
    "id": "airport",
    "title": "✈️ Flughafen",
    "summary": "Schnelle Infos rund um Check-in und Gate.",
    "highlights": [
      "Taxi",
      "Boarding",
      "WLAN / Roaming",
      "Gate / Check-in"
    ]
  },
  {
    "id": "hotel",
    "title": "🏨 Hotel",
    "summary": "Phrasen, Support und Nearby rund ums Zimmer.",
    "highlights": [
      "Handtücher",
      "Frühstück",
      "Rezeption",
      "Klimaanlage"
    ]
  },
  {
    "id": "trip",
    "title": "🌴 Urlaub",
    "summary": "Karte, Explore und Events für den Ort.",
    "highlights": [
      "Nearby",
      "Explore",
      "Events",
      "Restaurant-Tipps"
    ]
  },
  {
    "id": "emergency",
    "title": "🚨 Notfall",
    "summary": "Sofortzugriff auf kritische Inhalte.",
    "highlights": [
      "Arzt",
      "Reisepass",
      "Taxi",
      "Standort teilen"
    ]
  },
  {
    "id": "return",
    "title": "✈️ Rückreise",
    "summary": "Letzte Checks vor der Heimfahrt.",
    "highlights": [
      "Bargeld",
      "Gepäck",
      "Zeitplan",
      "Route"
    ]
  }
];
