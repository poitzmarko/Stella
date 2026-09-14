import type { EventItem } from '../types';
export const eventCategories = [
  { key: 'all', label: 'All' }, { key: 'music', label: 'Music' }, { key: 'sport', label: 'Sport' }, { key: 'outdoor', label: 'Outdoor' }, { key: 'family', label: 'Family' }, { key: 'food', label: 'Food' }, { key: 'culture', label: 'Culture' },
] as const;
export const demoEventCatalog: EventItem[] = [
  {
    "title": "Harbour Live Night",
    "category": "music",
    "emoji": "🎵",
    "time": "18:30",
    "duration": "3h",
    "note": "Open-air sets and local bands by the waterfront."
  },
  {
    "title": "Beach DJ Session",
    "category": "music",
    "emoji": "🎧",
    "time": "20:00",
    "duration": "2h",
    "note": "Sunset beats close to the marina."
  },
  {
    "title": "Local Sports Showcase",
    "category": "sport",
    "emoji": "⚽",
    "time": "16:00",
    "duration": "2h",
    "note": "Community sports and active local vibes."
  },
  {
    "title": "Ride / Stage Finish",
    "category": "sport",
    "emoji": "🚴",
    "time": "14:30",
    "duration": "1h",
    "note": "Cycling or running event near the promenade."
  },
  {
    "title": "Nature Reserve Walk",
    "category": "outdoor",
    "emoji": "🌲",
    "time": "10:00",
    "duration": "3h",
    "note": "Low-stress route with viewpoints and fresh air."
  },
  {
    "title": "Sunset Mole Meetup",
    "category": "outdoor",
    "emoji": "🌅",
    "time": "19:45",
    "duration": "1h",
    "note": "Classic sunset spot with a local crowd."
  },
  {
    "title": "Harbour Family Day",
    "category": "family",
    "emoji": "🎡",
    "time": "11:00",
    "duration": "4h",
    "note": "Kid-friendly stalls, boats and simple food options."
  },
  {
    "title": "Short Ferry Tour",
    "category": "family",
    "emoji": "🚢",
    "time": "12:15",
    "duration": "1h",
    "note": "A short ship trip to a nearby town."
  },
  {
    "title": "Mole Food Market",
    "category": "food",
    "emoji": "🍽",
    "time": "17:00",
    "duration": "3h",
    "note": "Street food, fish dishes and local drinks."
  },
  {
    "title": "Chef's Local Tasting",
    "category": "food",
    "emoji": "🥨",
    "time": "13:00",
    "duration": "2h",
    "note": "Small tasting plates with a strong local angle."
  },
  {
    "title": "Open-Air Cinema",
    "category": "culture",
    "emoji": "🎬",
    "time": "21:00",
    "duration": "2h",
    "note": "Weather dependent, but often a great evening pick."
  },
  {
    "title": "Town Stage & Concert",
    "category": "culture",
    "emoji": "🎭",
    "time": "19:00",
    "duration": "2h",
    "note": "Culture with a short route from the center."
  }
];
