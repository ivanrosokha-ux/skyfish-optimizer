import { upgrades } from '../data/mockDb.js';

export function getUpgrades(req, res) {
  const { category, targetStat } = req.query;
  let items = [...upgrades];

  if (category) {
    items = items.filter((i) => i.category.toLowerCase() === category.toLowerCase());
  }

  if (targetStat && targetStat !== 'Mixed') {
    const key = targetStat === 'SCC' ? 'scc' : 'speed';
    items = items.filter((i) => i.statType === key);
  }

  return res.json({
    success: true,
    count: items.length,
    data: items,
  });
}
