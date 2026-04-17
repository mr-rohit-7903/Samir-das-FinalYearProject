/* ═══════════════════════════════════════════
   data.js — Event options and cost definitions
   ═══════════════════════════════════════════ */

const OPTIONS = {
  location: [
    { id: 'l1', name: 'Outdoor Garden Venue',  emoji: '🌿', cost: 45000  },
    { id: 'l2', name: 'Luxury Hotel Ballroom', emoji: '🏨', cost: 120000 },
    { id: 'l3', name: 'Beachside Pavilion',    emoji: '🏖️', cost: 75000  },
    { id: 'l4', name: 'Rooftop Terrace',       emoji: '🌆', cost: 60000  },
    { id: 'l5', name: 'Heritage Haveli',        emoji: '🏯', cost: 95000  },
    { id: 'l6', name: 'Community Hall',         emoji: '🏛️', cost: 18000  },
  ],

  decor: [
    { id: 'd1', name: 'Floral Fantasy',        emoji: '💐', cost: 35000 },
    { id: 'd2', name: 'Fairy Lights & Drapes', emoji: '✨', cost: 22000 },
    { id: 'd3', name: 'Royal Gold & Red',      emoji: '👑', cost: 55000 },
    { id: 'd4', name: 'Minimalist Modern',     emoji: '🎨', cost: 18000 },
    { id: 'd5', name: 'Boho & Rustic',         emoji: '🌻', cost: 28000 },
  ],

  food: [
    { id: 'f1', name: 'Veg Buffet (100 pax)',      emoji: '🥗', cost: 40000 },
    { id: 'f2', name: 'Non-Veg Buffet (100 pax)',  emoji: '🍗', cost: 60000 },
    { id: 'f3', name: 'Multi-Cuisine (100 pax)',   emoji: '🍽️', cost: 85000 },
    { id: 'f4', name: 'Dessert & Snacks Bar',      emoji: '🍰', cost: 20000 },
    { id: 'f5', name: 'Live Food Stations',        emoji: '👨‍🍳', cost: 35000 },
  ],

  extras: [
    { id: 'e1', name: 'Professional DJ',       emoji: '🎧', cost: 25000 },
    { id: 'e2', name: 'Photography (8hr)',     emoji: '📸', cost: 40000 },
    { id: 'e3', name: 'Videography',           emoji: '🎬', cost: 30000 },
    { id: 'e4', name: 'Event Coordinator',     emoji: '📋', cost: 15000 },
    { id: 'e5', name: 'Floral Car Decoration', emoji: '🚗', cost: 8000  },
    { id: 'e6', name: 'Photo Booth',           emoji: '🎭', cost: 12000 },
    { id: 'e7', name: 'Live Music Band',       emoji: '🎸', cost: 55000 },
  ],
};

// Flat cost lookup by name (used by calculator)
const COST_MAP = {};
[...OPTIONS.location, ...OPTIONS.decor, ...OPTIONS.food, ...OPTIONS.extras]
  .forEach(o => { COST_MAP[o.name] = o.cost; });
