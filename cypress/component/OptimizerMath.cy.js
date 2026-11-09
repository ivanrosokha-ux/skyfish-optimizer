import { calculateCostPerStat, solveKnapsackBudget } from '../../src/utils/calculations';

describe('Unit / Component Logic Tests: Math & Knapsack', () => {
  it('correctly calculates cost per stat', () => {
    // 1,200,000 coins for +2 SCC => 600,000 per 1%
    const costPerStat = calculateCostPerStat(1200000, 2);
    expect(costPerStat).to.equal(600000);
  });

  it('returns null / zero efficiency if stat gain is <= 0', () => {
    const zeroGain = calculateCostPerStat(1000000, 0);
    expect(zeroGain).to.be.null;

    const negativeGain = calculateCostPerStat(1000000, -1);
    expect(negativeGain).to.be.null;
  });

  it('selects best items within budget without group conflict', () => {
    const items = [
      { id: '1', name: 'Angler V', group: 'enchant_angler', cost: 400000, gain: 1 },
      { id: '2', name: 'Angler VI', group: 'enchant_angler', cost: 1500000, gain: 2 },
      { id: '3', name: 'Submerged', group: 'reforge_helm', cost: 1200000, gain: 2 },
    ];
    // Budget 2M: should pick Angler VI (1.5M, +2) or Angler V + Submerged (1.6M, +3)
    const result = solveKnapsackBudget(items, 2000000);
    expect(result.totalCost).to.be.lessThan(2000001);
    expect(result.totalGain).to.equal(3); // 1 + 2 = 3
  });
});
