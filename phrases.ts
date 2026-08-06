import type { PhraseItem } from '../types';
export const phraseCategories = [
  [
    "all",
    "All"
  ],
  [
    "hotel",
    "Hotel"
  ],
  [
    "transport",
    "Transport"
  ],
  [
    "food",
    "Food"
  ],
  [
    "emergency",
    "Emergency"
  ]
] as const;
export const phrases: PhraseItem[] = [
  {
    "id": "hello",
    "category": "hotel",
    "english": "Hello.",
    "local": {
      "de": "Hallo.",
      "en": "Hello.",
      "es": "Hola.",
      "fr": "Bonjour.",
      "it": "Ciao.",
      "pt": "Olá.",
      "zhHans": "Hello."
    }
  },
  {
    "id": "goodMorning",
    "category": "hotel",
    "english": "Good morning.",
    "local": {
      "de": "Guten Morgen.",
      "en": "Good morning.",
      "es": "Buenos días.",
      "fr": "Bonjour.",
      "it": "Buongiorno.",
      "pt": "Bom dia.",
      "zhHans": "Good morning."
    }
  },
  {
    "id": "goodAfternoon",
    "category": "hotel",
    "english": "Good afternoon.",
    "local": {
      "de": "Guten Tag.",
      "en": "Good afternoon.",
      "es": "Buenas tardes.",
      "fr": "Bon après-midi.",
      "it": "Buon pomeriggio.",
      "pt": "Boa tarde.",
      "zhHans": "Good afternoon."
    }
  },
  {
    "id": "goodEvening",
    "category": "hotel",
    "english": "Good evening.",
    "local": {
      "de": "Guten Abend.",
      "en": "Good evening.",
      "es": "Buenas noches.",
      "fr": "Bonsoir.",
      "it": "Buona sera.",
      "pt": "Boa noite.",
      "zhHans": "Good evening."
    }
  },
  {
    "id": "thankYou",
    "category": "hotel",
    "english": "Thank you.",
    "local": {
      "de": "Danke.",
      "en": "Thank you.",
      "es": "Gracias.",
      "fr": "Merci.",
      "it": "Grazie.",
      "pt": "Obrigado.",
      "zhHans": "Thank you."
    }
  },
  {
    "id": "youAreWelcome",
    "category": "hotel",
    "english": "You are welcome.",
    "local": {
      "de": "Gern geschehen.",
      "en": "You are welcome.",
      "es": "De nada.",
      "fr": "De rien.",
      "it": "Prego.",
      "pt": "De nada.",
      "zhHans": "You are welcome."
    }
  },
  {
    "id": "please",
    "category": "hotel",
    "english": "Please.",
    "local": {
      "de": "Bitte.",
      "en": "Please.",
      "es": "Por favor.",
      "fr": "S'il vous plaît.",
      "it": "Per favore.",
      "pt": "Por favor.",
      "zhHans": "Please."
    }
  },
  {
    "id": "excuseMe",
    "category": "hotel",
    "english": "Excuse me.",
    "local": {
      "de": "Entschuldigung.",
      "en": "Excuse me.",
      "es": "Disculpe.",
      "fr": "Excusez-moi.",
      "it": "Mi scusi.",
      "pt": "Com licença.",
      "zhHans": "Excuse me."
    }
  },
  {
    "id": "sorry",
    "category": "hotel",
    "english": "Sorry.",
    "local": {
      "de": "Tut mir leid.",
      "en": "Sorry.",
      "es": "Lo siento.",
      "fr": "Désolé.",
      "it": "Scusa.",
      "pt": "Desculpe.",
      "zhHans": "Sorry."
    }
  },
  {
    "id": "goodbye",
    "category": "hotel",
    "english": "Goodbye.",
    "local": {
      "de": "Auf Wiedersehen.",
      "en": "Goodbye.",
      "es": "Adiós.",
      "fr": "Au revoir.",
      "it": "Arrivederci.",
      "pt": "Adeus.",
      "zhHans": "Goodbye."
    }
  },
  {
    "id": "speakEnglish",
    "category": "hotel",
    "english": "Do you speak English?",
    "local": {
      "de": "Sprechen Sie Englisch?",
      "en": "Do you speak English?",
      "es": "¿Habla inglés?",
      "fr": "Parlez-vous anglais ?",
      "it": "Parla inglese?",
      "pt": "Fala inglês?",
      "zhHans": "Do you speak English?"
    }
  },
  {
    "id": "helpMe",
    "category": "hotel",
    "english": "Can you help me?",
    "local": {
      "de": "Können Sie mir helfen?",
      "en": "Can you help me?",
      "es": "¿Puede ayudarme?",
      "fr": "Pouvez-vous m'aider ?",
      "it": "Può aiutarmi?",
      "pt": "Pode me ajudar?",
      "zhHans": "Can you help me?"
    }
  },
  {
    "id": "slowly",
    "category": "hotel",
    "english": "Please speak slowly.",
    "local": {
      "de": "Bitte langsam sprechen.",
      "en": "Please speak slowly.",
      "es": "Hable despacio, por favor.",
      "fr": "Parlez lentement, s'il vous plaît.",
      "it": "Parli lentamente, per favore.",
      "pt": "Fale devagar, por favor.",
      "zhHans": "Please speak slowly."
    }
  },
  {
    "id": "dontUnderstand",
    "category": "hotel",
    "english": "I do not understand.",
    "local": {
      "de": "Ich verstehe nicht.",
      "en": "I do not understand.",
      "es": "No entiendo.",
      "fr": "Je ne comprends pas.",
      "it": "Non capisco.",
      "pt": "Não entendo.",
      "zhHans": "I do not understand."
    }
  },
  {
    "id": "repeat",
    "category": "hotel",
    "english": "Could you repeat that?",
    "local": {
      "de": "Könnten Sie das wiederholen?",
      "en": "Could you repeat that?",
      "es": "¿Puede repetirlo?",
      "fr": "Pouvez-vous répéter ?",
      "it": "Può ripeterlo?",
      "pt": "Pode repetir?",
      "zhHans": "Could you repeat that?"
    }
  },
  {
    "id": "map",
    "category": "hotel",
    "english": "Can you show me on the map?",
    "local": {
      "de": "Können Sie es mir auf der Karte zeigen?",
      "en": "Can you show me on the map?",
      "es": "¿Puede mostrarme en el mapa?",
      "fr": "Pouvez-vous me le montrer sur la carte ?",
      "it": "Può mostrarmelo sulla mappa?",
      "pt": "Pode me mostrar no mapa?",
      "zhHans": "Can you show me on the map?"
    }
  },
  {
    "id": "atm",
    "category": "hotel",
    "english": "Where is the nearest ATM?",
    "local": {
      "de": "Wo ist der nächste Geldautomat?",
      "en": "Where is the nearest ATM?",
      "es": "¿Dónde está el cajero más cercano?",
      "fr": "Où est le distributeur le plus proche ?",
      "it": "Dov'è il bancomat più vicino?",
      "pt": "Onde fica o caixa eletrônico mais próximo?",
      "zhHans": "Where is the nearest ATM?"
    }
  },
  {
    "id": "pharmacy",
    "category": "hotel",
    "english": "Where is the nearest pharmacy?",
    "local": {
      "de": "Wo ist die nächste Apotheke?",
      "en": "Where is the nearest pharmacy?",
      "es": "¿Dónde está la farmacia más cercana?",
      "fr": "Où est la pharmacie la plus proche ?",
      "it": "Dov'è la farmacia più vicina?",
      "pt": "Onde fica a farmácia mais próxima?",
      "zhHans": "Where is the nearest pharmacy?"
    }
  },
  {
    "id": "busStop",
    "category": "hotel",
    "english": "Where is the nearest bus stop?",
    "local": {
      "de": "Wo ist die nächste Bushaltestelle?",
      "en": "Where is the nearest bus stop?",
      "es": "¿Dónde está la parada de autobús más cercana?",
      "fr": "Où est l'arrêt de bus le plus proche ?",
      "it": "Dov'è la fermata dell'autobus più vicina?",
      "pt": "Onde fica o ponto de ônibus mais próximo?",
      "zhHans": "Where is the nearest bus stop?"
    }
  },
  {
    "id": "taxi",
    "category": "hotel",
    "english": "Can you call a taxi for me?",
    "local": {
      "de": "Können Sie mir ein Taxi rufen?",
      "en": "Can you call a taxi for me?",
      "es": "¿Puede llamarme un taxi?",
      "fr": "Pouvez-vous m'appeler un taxi ?",
      "it": "Può chiamarmi un taxi?",
      "pt": "Pode chamar um táxi para mim?",
      "zhHans": "Can you call a taxi for me?"
    }
  },
  {
    "id": "reception",
    "category": "transport",
    "english": "Where is the hotel reception?",
    "local": {
      "de": "Wo ist die Hotelrezeption?",
      "en": "Where is the hotel reception?",
      "es": "¿Dónde está la recepción del hotel?",
      "fr": "Où est la réception de l'hôtel ?",
      "it": "Dov'è la reception dell'hotel?",
      "pt": "Onde fica a recepção do hotel?",
      "zhHans": "Where is the hotel reception?"
    }
  },
  {
    "id": "breakfast",
    "category": "transport",
    "english": "Where is the breakfast buffet?",
    "local": {
      "de": "Wo ist das Frühstücksbuffet?",
      "en": "Where is the breakfast buffet?",
      "es": "¿Dónde está el bufé del desayuno?",
      "fr": "Où est le buffet du petit-déjeuner ?",
      "it": "Dov'è il buffet della colazione?",
      "pt": "Onde fica o buffet de café da manhã?",
      "zhHans": "Where is the breakfast buffet?"
    }
  },
  {
    "id": "breakfastTime",
    "category": "transport",
    "english": "What time is breakfast?",
    "local": {
      "de": "Wann ist Frühstück?",
      "en": "What time is breakfast?",
      "es": "¿A qué hora es el desayuno?",
      "fr": "À quelle heure est le petit-déjeuner ?",
      "it": "A che ora è la colazione?",
      "pt": "A que horas é o café da manhã?",
      "zhHans": "What time is breakfast?"
    }
  },
  {
    "id": "towels",
    "category": "transport",
    "english": "I need new towels.",
    "local": {
      "de": "Ich brauche neue Handtücher.",
      "en": "I need new towels.",
      "es": "Necesito toallas nuevas.",
      "fr": "J'ai besoin de serviettes propres.",
      "it": "Ho bisogno di asciugamani puliti.",
      "pt": "Preciso de toalhas novas.",
      "zhHans": "I need new towels."
    }
  },
  {
    "id": "cleaning",
    "category": "transport",
    "english": "The room needs cleaning.",
    "local": {
      "de": "Das Zimmer muss gereinigt werden.",
      "en": "The room needs cleaning.",
      "es": "La habitación necesita limpieza.",
      "fr": "La chambre a besoin d'être nettoyée.",
      "it": "La camera ha bisogno di essere pulita.",
      "pt": "O quarto precisa ser limpo.",
      "zhHans": "The room needs cleaning."
    }
  },
  {
    "id": "mattress",
    "category": "transport",
    "english": "The mattress squeaks.",
    "local": {
      "de": "Die Matratze quietscht.",
      "en": "The mattress squeaks.",
      "es": "El colchón cruje.",
      "fr": "Le matelas grince.",
      "it": "Il materasso scricchiola.",
      "pt": "O colchão range.",
      "zhHans": "The mattress squeaks."
    }
  },
  {
    "id": "ac",
    "category": "transport",
    "english": "The air conditioning does not work.",
    "local": {
      "de": "Die Klimaanlage funktioniert nicht.",
      "en": "The air conditioning does not work.",
      "es": "El aire acondicionado no funciona.",
      "fr": "La climatisation ne fonctionne pas.",
      "it": "L'aria condizionata non funziona.",
      "pt": "O ar-condicionado não funciona.",
      "zhHans": "The air conditioning does not work."
    }
  },
  {
    "id": "shower",
    "category": "transport",
    "english": "The shower does not work.",
    "local": {
      "de": "Die Dusche funktioniert nicht.",
      "en": "The shower does not work.",
      "es": "La ducha no funciona.",
      "fr": "La douche ne fonctionne pas.",
      "it": "La doccia non funziona.",
      "pt": "O chuveiro não funciona.",
      "zhHans": "The shower does not work."
    }
  },
  {
    "id": "toilet",
    "category": "transport",
    "english": "The toilet is blocked.",
    "local": {
      "de": "Die Toilette ist verstopft.",
      "en": "The toilet is blocked.",
      "es": "El inodoro está atascado.",
      "fr": "Les toilettes sont bouchées.",
      "it": "Il water è intasato.",
      "pt": "O vaso está entupido.",
      "zhHans": "The toilet is blocked."
    }
  },
  {
    "id": "hotWater",
    "category": "transport",
    "english": "There is no hot water.",
    "local": {
      "de": "Es gibt kein heißes Wasser.",
      "en": "There is no hot water.",
      "es": "No hay agua caliente.",
      "fr": "Il n'y a pas d'eau chaude.",
      "it": "Non c'è acqua calda.",
      "pt": "Não há água quente.",
      "zhHans": "There is no hot water."
    }
  },
  {
    "id": "wifi",
    "category": "food",
    "english": "The Wi-Fi does not work.",
    "local": {
      "de": "Das WLAN funktioniert nicht.",
      "en": "The Wi-Fi does not work.",
      "es": "El Wi-Fi no funciona.",
      "fr": "Le Wi-Fi ne fonctionne pas.",
      "it": "Il Wi-Fi non funziona.",
      "pt": "O Wi‑Fi não funciona.",
      "zhHans": "The Wi-Fi does not work."
    }
  },
  {
    "id": "room",
    "category": "food",
    "english": "I need another room.",
    "local": {
      "de": "Ich brauche ein anderes Zimmer.",
      "en": "I need another room.",
      "es": "Necesito otra habitación.",
      "fr": "J'ai besoin d'une autre chambre.",
      "it": "Ho bisogno di un'altra stanza.",
      "pt": "Preciso de outro quarto.",
      "zhHans": "I need another room."
    }
  },
  {
    "id": "vacuum",
    "category": "food",
    "english": "The vacuum cleaner is broken.",
    "local": {
      "de": "Der Staubsauger ist defekt.",
      "en": "The vacuum cleaner is broken.",
      "es": "La aspiradora está rota.",
      "fr": "L'aspirateur est cassé.",
      "it": "L'aspirapolvere è rotto.",
      "pt": "O aspirador está quebrado.",
      "zhHans": "The vacuum cleaner is broken."
    }
  },
  {
    "id": "broom",
    "category": "food",
    "english": "We need a broom.",
    "local": {
      "de": "Wir brauchen einen Besen.",
      "en": "We need a broom.",
      "es": "Necesitamos una escoba.",
      "fr": "Nous avons besoin d'un balai.",
      "it": "Abbiamo bisogno di una scopa.",
      "pt": "Precisamos de uma vassoura.",
      "zhHans": "We need a broom."
    }
  },
  {
    "id": "pillow",
    "category": "food",
    "english": "Can I get an extra pillow?",
    "local": {
      "de": "Kann ich ein extra Kissen bekommen?",
      "en": "Can I get an extra pillow?",
      "es": "¿Puedo tener una almohada extra?",
      "fr": "Puis-je avoir un oreiller supplémentaire ?",
      "it": "Posso avere un cuscino in più?",
      "pt": "Posso ter um travesseiro extra?",
      "zhHans": "Can I get an extra pillow?"
    }
  },
  {
    "id": "blanket",
    "category": "food",
    "english": "Can I get an extra blanket?",
    "local": {
      "de": "Kann ich eine zusätzliche Decke bekommen?",
      "en": "Can I get an extra blanket?",
      "es": "¿Puedo tener una manta extra?",
      "fr": "Puis-je avoir une couverture supplémentaire ?",
      "it": "Posso avere una coperta in più?",
      "pt": "Posso ter um cobertor extra?",
      "zhHans": "Can I get an extra blanket?"
    }
  },
  {
    "id": "luggage",
    "category": "food",
    "english": "Can you bring the luggage?",
    "local": {
      "de": "Können Sie das Gepäck bringen?",
      "en": "Can you bring the luggage?",
      "es": "¿Puede traer el equipaje?",
      "fr": "Pouvez-vous apporter les bagages ?",
      "it": "Può portare i bagagli?",
      "pt": "Pode trazer as malas?",
      "zhHans": "Can you bring the luggage?"
    }
  },
  {
    "id": "wakeUp",
    "category": "food",
    "english": "Can you wake me up at 7 a.m.?",
    "local": {
      "de": "Können Sie mich um 7 Uhr wecken?",
      "en": "Can you wake me up at 7 a.m.?",
      "es": "¿Puede despertarme a las 7?",
      "fr": "Pouvez-vous me réveiller à 7h ?",
      "it": "Può svegliarmi alle 7?",
      "pt": "Pode me acordar às 7h?",
      "zhHans": "Can you wake me up at 7 a.m.?"
    }
  },
  {
    "id": "bill",
    "category": "food",
    "english": "Can I have the bill, please?",
    "local": {
      "de": "Kann ich die Rechnung bekommen?",
      "en": "Can I have the bill, please?",
      "es": "¿Me trae la cuenta, por favor?",
      "fr": "Puis-je avoir l'addition, s'il vous plaît ?",
      "it": "Posso avere il conto, per favore?",
      "pt": "Pode me trazer a conta, por favor?",
      "zhHans": "Can I have the bill, please?"
    }
  },
  {
    "id": "card",
    "category": "food",
    "english": "Can I pay by card?",
    "local": {
      "de": "Kann ich mit Karte bezahlen?",
      "en": "Can I pay by card?",
      "es": "¿Puedo pagar con tarjeta?",
      "fr": "Puis-je payer par carte ?",
      "it": "Posso pagare con carta?",
      "pt": "Posso pagar com cartão?",
      "zhHans": "Can I pay by card?"
    }
  },
  {
    "id": "coffee",
    "category": "food",
    "english": "I would like a coffee, please.",
    "local": {
      "de": "Ich hätte gern einen Kaffee.",
      "en": "I would like a coffee, please.",
      "es": "Quisiera un café, por favor.",
      "fr": "Je voudrais un café, s'il vous plaît.",
      "it": "Vorrei un caffè, per favore.",
      "pt": "Quero um café, por favor.",
      "zhHans": "I would like a coffee, please."
    }
  },
  {
    "id": "water",
    "category": "food",
    "english": "I would like water, please.",
    "local": {
      "de": "Ich hätte gern Wasser.",
      "en": "I would like water, please.",
      "es": "Quisiera agua, por favor.",
      "fr": "Je voudrais de l'eau, s'il vous plaît.",
      "it": "Vorrei dell'acqua, per favore.",
      "pt": "Quero água, por favor.",
      "zhHans": "I would like water, please."
    }
  },
  {
    "id": "tapWater",
    "category": "food",
    "english": "Tap water, please.",
    "local": {
      "de": "Leitungswasser, bitte.",
      "en": "Tap water, please.",
      "es": "Agua del grifo, por favor.",
      "fr": "De l'eau du robinet, s'il vous plaît.",
      "it": "Acqua del rubinetto, per favore.",
      "pt": "Água da torneira, por favor.",
      "zhHans": "Tap water, please."
    }
  },
  {
    "id": "noOnions",
    "category": "food",
    "english": "No onions, please.",
    "local": {
      "de": "Ohne Zwiebeln, bitte.",
      "en": "No onions, please.",
      "es": "Sin cebolla, por favor.",
      "fr": "Sans oignons, s'il vous plaît.",
      "it": "Senza cipolla, per favore.",
      "pt": "Sem cebola, por favor.",
      "zhHans": "No onions, please."
    }
  },
  {
    "id": "noMeat",
    "category": "food",
    "english": "No meat, please.",
    "local": {
      "de": "Ohne Fleisch, bitte.",
      "en": "No meat, please.",
      "es": "Sin carne, por favor.",
      "fr": "Sans viande, s'il vous plaît.",
      "it": "Senza carne, per favore.",
      "pt": "Sem carne, por favor.",
      "zhHans": "No meat, please."
    }
  },
  {
    "id": "allergy",
    "category": "food",
    "english": "I have an allergy.",
    "local": {
      "de": "Ich habe eine Allergie.",
      "en": "I have an allergy.",
      "es": "Tengo una alergia.",
      "fr": "J'ai une allergie.",
      "it": "Ho un'allergia.",
      "pt": "Tenho alergia.",
      "zhHans": "I have an allergy."
    }
  },
  {
    "id": "sick",
    "category": "emergency",
    "english": "I feel sick.",
    "local": {
      "de": "Mir ist übel.",
      "en": "I feel sick.",
      "es": "Me siento mal.",
      "fr": "Je me sens malade.",
      "it": "Mi sento male.",
      "pt": "Estou enjoado.",
      "zhHans": "I feel sick."
    }
  },
  {
    "id": "doctor",
    "category": "emergency",
    "english": "I need a doctor.",
    "local": {
      "de": "Ich brauche einen Arzt.",
      "en": "I need a doctor.",
      "es": "Necesito un médico.",
      "fr": "J'ai besoin d'un médecin.",
      "it": "Ho bisogno di un medico.",
      "pt": "Preciso de um médico.",
      "zhHans": "I need a doctor."
    }
  },
  {
    "id": "luggageMissing",
    "category": "emergency",
    "english": "My luggage is missing.",
    "local": {
      "de": "Mein Gepäck fehlt.",
      "en": "My luggage is missing.",
      "es": "Mi equipaje falta.",
      "fr": "Mes bagages ont disparu.",
      "it": "Il mio bagaglio manca.",
      "pt": "Minhas malas sumiram.",
      "zhHans": "My luggage is missing."
    }
  },
  {
    "id": "passport",
    "category": "emergency",
    "english": "I have lost my passport.",
    "local": {
      "de": "Ich habe meinen Reisepass verloren.",
      "en": "I have lost my passport.",
      "es": "He perdido mi pasaporte.",
      "fr": "J'ai perdu mon passeport.",
      "it": "Ho perso il passaporto.",
      "pt": "Perdi meu passaporte.",
      "zhHans": "I have lost my passport."
    }
  }
];
export function phrasesByCategory(category: string) { return phrases.filter((p) => category === 'all' ? true : p.category === category); }
