/* ═══════════════════════════════════════════
   events.js — Event storage and CRUD logic
   ═══════════════════════════════════════════ */

const STORAGE_KEY = 'seo_events';

/**
 * Load all saved events from localStorage.
 * @returns {Array}
 */
function loadEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Persist events array to localStorage.
 * @param {Array} events
 */
function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

/**
 * Create a new event object and add it to storage.
 *
 * @param {Object} formData - { name, location, decor, food, extras[] }
 * @returns {Object} the saved event
 */
function createEvent(formData) {
  const { total } = calculateTotal({
    location: formData.location,
    decor: formData.decor,
    food: formData.food,
    extras: new Set(formData.extras),
  });

  const event = {
    id: Date.now(),
    name: formData.name,
    location: formData.location,
    decor: formData.decor,
    food: formData.food,
    extras: [...formData.extras],
    total,
    date: new Date().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    }),
  };

  const events = loadEvents();
  events.unshift(event);   // newest first
  saveEvents(events);

  return event;
}

/**
 * Delete an event by id.
 * @param {number} id
 * @returns {Array} updated events list
 */
function deleteEvent(id) {
  const events = loadEvents().filter(e => e.id !== id);
  saveEvents(events);
  return events;
}

/* ── Django API helpers (used when backend is running) ──────────────────── */

/**
 * POST event data to Django backend.
 * Falls back silently if the backend is unavailable (e.g. static-only demo).
 * Uses API_BASE from config.js.
 *
 * @param {Object} eventData
 * @returns {Promise<Object|null>}
 */
async function postEventToAPI(eventData) {
  if (!API_BASE) return null;   // skip if no backend configured

  try {
    const response = await fetch(`${API_BASE}/events/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: eventData.name,
        location: eventData.location,
        decoration: eventData.decor,
        food: eventData.food,
        extras: eventData.extras,
      }),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    // Backend not available — app works offline via localStorage
    return null;
  }
}

/**
 * DELETE an event from Django backend.
 * Falls back silently if unavailable.
 * Uses API_BASE from config.js.
 *
 * @param {number} id
 * @returns {Promise<boolean>}
 */
async function deleteEventFromAPI(id) {
  if (!API_BASE) return false;   // skip if no backend configured

  try {
    const response = await fetch(`${API_BASE}/events/delete/${id}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
