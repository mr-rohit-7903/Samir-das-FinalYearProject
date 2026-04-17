/* ═══════════════════════════════════════════
   ui.js — DOM rendering helpers
   ═══════════════════════════════════════════ */

/**
 * Build one option card element.
 * @param {Object} option  - { id, name, emoji, cost }
 * @param {Function} onClick
 * @returns {HTMLElement}
 */
function createOptionCard(option, onClick) {
  const card = document.createElement('div');
  card.className = 'option-card';
  card.dataset.id = option.id;
  card.dataset.name = option.name;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-pressed', 'false');

  card.innerHTML = `
    <div class="check-ring" aria-hidden="true">✓</div>
    <span class="option-emoji">${option.emoji}</span>
    <div class="option-name">${option.name}</div>
    <div class="option-cost">₹${option.cost.toLocaleString('en-IN')}</div>
  `;

  card.addEventListener('click', () => onClick(option, card));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(option, card);
    }
  });

  return card;
}

/**
 * Render a group of option cards into a container.
 * @param {string}   containerId
 * @param {Array}    options
 * @param {Function} onClick
 */
function renderOptionGrid(containerId, options, onClick) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  options.forEach(opt => {
    container.appendChild(createOptionCard(opt, onClick));
  });
}

/**
 * Deselect all cards in a container, then select the target.
 * @param {string}      containerId
 * @param {HTMLElement} selectedCard
 */
function selectCardInGroup(containerId, selectedCard) {
  document.querySelectorAll(`#${containerId} .option-card`).forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-pressed', 'false');
  });
  selectedCard.classList.add('selected');
  selectedCard.setAttribute('aria-pressed', 'true');
}

/**
 * Toggle a card's selected state (for multi-select groups).
 * @param {HTMLElement} card
 * @returns {boolean} new selected state
 */
function toggleCard(card) {
  const isSelected = card.classList.toggle('selected');
  card.setAttribute('aria-pressed', String(isSelected));
  return isSelected;
}

/**
 * Update the cost bar display.
 * @param {number}  total
 * @param {Array}   parts  - [{ label, value }]
 */
function renderCostBar(total, parts) {
  document.getElementById('totalDisplay').textContent =
    '₹' + total.toLocaleString('en-IN');

  const breakdown = document.getElementById('costBreakdown');
  breakdown.innerHTML = parts
    .map(p => `<div class="cost-item">${p.label}: <strong>₹${p.value.toLocaleString('en-IN')}</strong></div>`)
    .join('');
}

/**
 * Show an inline alert message.
 * @param {string} message
 * @param {'error'|'success'} type
 * @param {number} [duration=3500]  ms before auto-hide (0 = persistent)
 */
function showAlert(message, type = 'error', duration = 3500) {
  const el = document.getElementById('js-alert');
  el.textContent = message;
  el.className = `alert ${type}`;

  if (duration > 0) {
    setTimeout(() => {
      el.className = 'alert';
      el.textContent = '';
    }, duration);
  }
}

/**
 * Switch between tabs.
 * @param {'create'|'events'} tabName
 */
function showTab(tabName) {
  const createSection = document.getElementById('tab-create');
  const eventsSection = document.getElementById('tab-events');
  const createBtn     = document.getElementById('tab-create-btn');
  const eventsBtn     = document.getElementById('tab-events-btn');

  if (tabName === 'create') {
    createSection.hidden = false;
    eventsSection.hidden = true;
    createBtn.classList.add('active');
    eventsBtn.classList.remove('active');
    createBtn.setAttribute('aria-selected', 'true');
    eventsBtn.setAttribute('aria-selected', 'false');
  } else {
    createSection.hidden = true;
    eventsSection.hidden = false;
    createBtn.classList.remove('active');
    eventsBtn.classList.add('active');
    createBtn.setAttribute('aria-selected', 'false');
    eventsBtn.setAttribute('aria-selected', 'true');
  }
}

/**
 * Render the saved events list.
 * @param {Array}    events
 * @param {Function} onDelete  - called with event id
 */
function renderEventsList(events, onDelete) {
  const container = document.getElementById('eventsList');

  if (!events.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎊</div>
        <p>No events yet. Create your first one!</p>
      </div>`;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'events-grid';

  events.forEach(evt => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.dataset.id = evt.id;

    const extraRow = evt.extras.length
      ? `<div class="ec-row"><div class="ec-icon">✚</div><span>${evt.extras.join(', ')}</span></div>`
      : '';

    card.innerHTML = `
      <div class="ec-header">
        <div class="ec-name">${escapeHtml(evt.name)}</div>
        <div class="ec-date">${evt.date}</div>
      </div>
      <div class="ec-details">
        <div class="ec-row"><div class="ec-icon">📍</div><span>${escapeHtml(evt.location)}</span></div>
        <div class="ec-row"><div class="ec-icon">🎀</div><span>${escapeHtml(evt.decor)}</span></div>
        <div class="ec-row"><div class="ec-icon">🍽️</div><span>${escapeHtml(evt.food)}</span></div>
        ${extraRow}
      </div>
      <div class="ec-total">₹${evt.total.toLocaleString('en-IN')}</div>
      <button class="delete-btn" aria-label="Delete ${escapeHtml(evt.name)}">Remove Event</button>
    `;

    card.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm(`Delete "${evt.name}"?`)) onDelete(evt.id);
    });

    grid.appendChild(card);
  });

  container.innerHTML = '';
  container.appendChild(grid);
}

/**
 * Update the My Events tab badge count.
 * @param {number} count
 */
function updateBadge(count) {
  document.getElementById('count-badge').textContent = count;
}

/** Escape HTML to prevent XSS when inserting user data into innerHTML. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
