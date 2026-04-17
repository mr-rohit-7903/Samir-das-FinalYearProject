/* ═══════════════════════════════════════════
   app.js — Main controller
   Wires data.js + ui.js + calculator.js + events.js
   ═══════════════════════════════════════════ */

/* ── Selection state ─────────────────────────────────────── */
const state = {
  location: null,
  decor:    null,
  food:     null,
  extras:   new Set(),
};

/* ── Boot ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildOptionGrids();
  refreshCostBar(state);
  refreshEventsList();
  updateBadge(loadEvents().length);
  bindFormSubmit();
});

/* ── Build all option grids ──────────────────────────────── */
function buildOptionGrids() {
  renderOptionGrid('locationGrid', OPTIONS.location, (opt, card) => {
    state.location = opt.name;
    selectCardInGroup('locationGrid', card);
    refreshCostBar(state);
  });

  renderOptionGrid('decorGrid', OPTIONS.decor, (opt, card) => {
    state.decor = opt.name;
    selectCardInGroup('decorGrid', card);
    refreshCostBar(state);
  });

  renderOptionGrid('foodGrid', OPTIONS.food, (opt, card) => {
    state.food = opt.name;
    selectCardInGroup('foodGrid', card);
    refreshCostBar(state);
  });

  renderOptionGrid('extrasGrid', OPTIONS.extras, (opt, card) => {
    const isNowSelected = toggleCard(card);
    if (isNowSelected) {
      state.extras.add(opt.name);
    } else {
      state.extras.delete(opt.name);
    }
    refreshCostBar(state);
  });
}

/* ── Form validation ─────────────────────────────────────── */
function validateForm(name) {
  if (!name) {
    showAlert('Please enter an event name.', 'error');
    document.getElementById('eventName').classList.add('invalid');
    return false;
  }
  if (!state.location) {
    showAlert('Please select a location.', 'error');
    return false;
  }
  if (!state.decor) {
    showAlert('Please select a decoration style.', 'error');
    return false;
  }
  if (!state.food) {
    showAlert('Please select a food option.', 'error');
    return false;
  }
  return true;
}

/* ── Form submit ─────────────────────────────────────────── */
function bindFormSubmit() {
  document.getElementById('eventForm').addEventListener('submit', async e => {
    e.preventDefault();

    const nameInput = document.getElementById('eventName');
    nameInput.classList.remove('invalid');

    const name = nameInput.value.trim();

    if (!validateForm(name)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Save locally
    const formData = {
      name,
      location: state.location,
      decor:    state.decor,
      food:     state.food,
      extras:   [...state.extras],
    };

    createEvent(formData);

    // Also try to sync with Django backend (non-blocking)
    postEventToAPI(formData);

    // Reset state
    resetForm();

    showAlert(`Event "${name}" saved successfully!`, 'success');
    refreshEventsList();
    updateBadge(loadEvents().length);

    setTimeout(() => showTab('events'), 900);
  });

  // Clear invalid style on input
  document.getElementById('eventName').addEventListener('input', () => {
    document.getElementById('eventName').classList.remove('invalid');
  });
}

/* ── Reset form ──────────────────────────────────────────── */
function resetForm() {
  state.location = null;
  state.decor    = null;
  state.food     = null;
  state.extras   = new Set();

  document.getElementById('eventName').value = '';

  document.querySelectorAll('.option-card.selected').forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-pressed', 'false');
  });

  refreshCostBar(state);
}

/* ── Refresh events list ─────────────────────────────────── */
function refreshEventsList() {
  const events = loadEvents();
  renderEventsList(events, async id => {
    deleteEvent(id);
    deleteEventFromAPI(id);   // non-blocking backend sync
    refreshEventsList();
    updateBadge(loadEvents().length);
  });
}
