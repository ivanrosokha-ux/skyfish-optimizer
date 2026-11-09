/**
 * Calculates cost per single unit of stat.
 * Returns null if statGain is less than or equal to 0.
 */
export function calculateCostPerStat(price, statGain) {
  if (!statGain || statGain <= 0) return null;
  return Math.round(price / statGain);
}

/**
 * Multiple-choice knapsack solver for budget allocation.
 */
export function solveKnapsackBudget(availableUpgrades, budget) {
  // Sort by efficiency (cost per stat ascending)
  const sorted = [...availableUpgrades]
    .filter((item) => item.gain > 0 && item.cost <= budget)
    .sort((a, b) => a.cost / a.gain - b.cost / b.gain);

  const selected = [];
  const usedGroups = new Set();
  let totalCost = 0;
  let totalGain = 0;

  for (const item of sorted) {
    if (!usedGroups.has(item.group) && totalCost + item.cost <= budget) {
      selected.push(item);
      usedGroups.add(item.group);
      totalCost += item.cost;
      totalGain += item.gain;
    }
  }

  return {
    selectedItems: selected,
    totalCost,
    totalGain,
    remainingBudget: budget - totalCost,
  };
}
