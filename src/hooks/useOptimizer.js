import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchUpgradesCatalog } from '../services/api';
import { calculateCostPerStat, solveKnapsackBudget } from '../utils/calculations';
import { usePlayerStore } from '../store/usePlayerStore';

/**
 * Custom Hook for computing optimal gear upgrades based on budget and target stats
 */
export function useOptimizer() {
  const { targetStat, setTargetStat, budget, setBudget, addSavedBuild, stats } = usePlayerStore();
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([
    'Enchantments',
    'Armor',
    'Reforges',
    'Pet',
    'Accessory',
  ]);

  // Load catalog on mount
  useEffect(() => {
    let isMounted = true;
    fetchUpgradesCatalog().then((items) => {
      if (isMounted) {
        setCatalog(items);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and rank upgrades
  const rankedUpgrades = useMemo(() => {
    return catalog
      .filter((item) => selectedFilters.includes(item.category))
      .filter((item) => {
        if (targetStat === 'SCC') return item.statType === 'scc';
        if (targetStat === 'Fishing Speed') return item.statType === 'speed';
        return true; // Mixed
      })
      .map((item) => {
        const costPerStat = calculateCostPerStat(item.price, item.gain);
        return {
          ...item,
          cost: item.price,
          costPerStat: costPerStat ? costPerStat.toLocaleString() : 'N/A',
          costPerStatNum: costPerStat || Infinity,
          displayGain: `+${item.gain} ${item.statType === 'scc' ? 'pp SCC' : 'Speed'}`,
        };
      })
      .sort((a, b) => a.costPerStatNum - b.costPerStatNum);
  }, [catalog, selectedFilters, targetStat]);

  // Calculate budget allocation
  const budgetAllocation = useMemo(() => {
    const knapsackItems = rankedUpgrades.map((u) => ({
      id: u.id,
      name: u.name,
      group: u.group,
      cost: u.price,
      gain: u.gain,
    }));

    const result = solveKnapsackBudget(knapsackItems, budget);
    const currentSCC = stats.scc || 64;
    const projectedSCC =
      currentSCC + (targetStat === 'SCC' ? result.totalGain : Math.round(result.totalGain * 0.7));

    return {
      selectedItems: result.selectedItems,
      totalCost: result.totalCost,
      remainingBudget: result.remainingBudget,
      totalGain: result.totalGain,
      currentSCC,
      projectedSCC,
    };
  }, [rankedUpgrades, budget, stats.scc, targetStat]);

  const toggleFilter = useCallback((filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  }, []);

  const saveCurrentBuild = useCallback(() => {
    const planName = `${targetStat} · ${(budgetAllocation.totalCost / 1000000).toFixed(1)}M plan`;
    addSavedBuild({
      id: Date.now().toString(),
      name: planName,
      scc: budgetAllocation.projectedSCC,
      speed: stats.fishingSpeed || 180,
      treasure: stats.treasureChance || 12,
      wisdom: stats.fishingWisdom || 30,
      cost: budgetAllocation.totalCost,
      upgradesCount: budgetAllocation.selectedItems.length,
      meta: `${budgetAllocation.selectedItems.length} upgrades · ${budgetAllocation.totalCost.toLocaleString()} coins`,
    });
    return planName;
  }, [
    targetStat,
    budgetAllocation,
    addSavedBuild,
    stats.fishingSpeed,
    stats.treasureChance,
    stats.fishingWisdom,
  ]);

  return {
    rankedUpgrades,
    budgetAllocation,
    loading,
    selectedFilters,
    toggleFilter,
    targetStat,
    setTargetStat,
    budget,
    setBudget,
    saveCurrentBuild,
  };
}
