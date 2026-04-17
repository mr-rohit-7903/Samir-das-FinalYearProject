/* ═══════════════════════════════════════════
   calculator.js — Real-time cost calculation
   ═══════════════════════════════════════════ */

/**
 * Calculate the total cost and breakdown from the current selection state.
 *
 * @param {Object} state - { location, decor, food, extras }
 *   - location {string|null}  selected location name
 *   - decor    {string|null}  selected decoration name
 *   - food     {string|null}  selected food name
 *   - extras   {Set<string>}  set of selected extra names
 *
 * @returns {{ total: number, parts: Array<{label:string, value:number}> }}
 */
function calculateTotal(state) {
  let total = 0;
  const parts = [];

  if (state.location) {
    const cost = COST_MAP[state.location] || 0;
    total += cost;
    parts.push({ label: 'Location', value: cost });
  }

  if (state.decor) {
    const cost = COST_MAP[state.decor] || 0;
    total += cost;
    parts.push({ label: 'Decor', value: cost });
  }

  if (state.food) {
    const cost = COST_MAP[state.food] || 0;
    total += cost;
    parts.push({ label: 'Food', value: cost });
  }

  let extrasCost = 0;
  state.extras.forEach(name => {
    extrasCost += COST_MAP[name] || 0;
  });

  if (extrasCost > 0) {
    total += extrasCost;
    parts.push({ label: 'Extras', value: extrasCost });
  }

  return { total, parts };
}

/**
 * Recalculate and update the cost bar in the DOM.
 * Call this whenever selection state changes.
 *
 * @param {Object} state
 */
function refreshCostBar(state) {
  const { total, parts } = calculateTotal(state);
  renderCostBar(total, parts);
}
