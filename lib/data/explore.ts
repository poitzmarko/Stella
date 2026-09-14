import type { ExploreItem, ExploreKind } from '../types';
export const exploreCatalog: ExploreItem[] = [
  {
    "title": "Harbour Walk",
    "kind": "water",
    "emoji": "⛵",
    "distance": 420,
    "rating": 4.8,
    "note": "Am Hafen entlang mit Aussicht und kurzen Pausen."
  },
  {
    "title": "Hidden Sunset Point",
    "kind": "nature",
    "emoji": "🌅",
    "distance": 780,
    "rating": 4.9,
    "note": "Bester Spot, wenn der Tag langsam endet."
  },
  {
    "title": "Nature Reserve Trail",
    "kind": "nature",
    "emoji": "🌲",
    "distance": 1450,
    "rating": 4.7,
    "note": "Ruhiger Weg mit wenig Verkehr und viel Grün."
  },
  {
    "title": "Local Museum",
    "kind": "culture",
    "emoji": "🖼",
    "distance": 980,
    "rating": 4.6,
    "note": "Kompakt, wetterfest und gut bewertet."
  },
  {
    "title": "Food Market by the Mole",
    "kind": "food",
    "emoji": "🍽",
    "distance": 610,
    "rating": 4.9,
    "note": "Lokale Küche direkt am Wasser."
  },
  {
    "title": "Ferry to Ahlbeck",
    "kind": "water",
    "emoji": "🚢",
    "distance": 1120,
    "rating": 4.7,
    "note": "Kurztrip mit Schiff oder Fähre."
  },
  {
    "title": "Harbour Family Day",
    "kind": "family",
    "emoji": "🎡",
    "distance": 550,
    "rating": 4.5,
    "note": "Familientauglich, entspannt und leicht erreichbar."
  },
  {
    "title": "Photo Spot Pier",
    "kind": "water",
    "emoji": "📸",
    "distance": 300,
    "rating": 4.8,
    "note": "Klassischer Fotospot mit Blick auf den Hafen."
  },
  {
    "title": "Beach Promenade",
    "kind": "nature",
    "emoji": "🏖",
    "distance": 1600,
    "rating": 4.6,
    "note": "Für einen langen Spaziergang am Meer."
  },
  {
    "title": "Small Harbor Concert",
    "kind": "culture",
    "emoji": "🎵",
    "distance": 720,
    "rating": 4.9,
    "note": "Lokale Musik in der Nähe der Mole."
  },
  {
    "title": "Best Seafood Spot",
    "kind": "food",
    "emoji": "🐟",
    "distance": 530,
    "rating": 4.9,
    "note": "Top bewertet und nah am Wasser."
  },
  {
    "title": "Boat Rental Point",
    "kind": "water",
    "emoji": "🛶",
    "distance": 860,
    "rating": 4.4,
    "note": "Für kurze Touren auf dem Wasser."
  }
];
export const exploreTabs: { key: 'all' | ExploreKind; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'water', label: 'Water' }, { key: 'nature', label: 'Nature' }, { key: 'food', label: 'Food' }, { key: 'culture', label: 'Culture' }, { key: 'family', label: 'Family' },
];
