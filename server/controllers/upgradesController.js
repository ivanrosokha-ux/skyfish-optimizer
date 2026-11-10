import { upgrades } from '../data/mockDb.js';
import { getLiveBazaar } from '../services/hypixelService.js';

export async function getUpgrades(req, res) {
  const { category, targetStat } = req.query;
  let items = upgrades.map((u) => ({ ...u }));

  try {
    const products = await getLiveBazaar();
    if (products) {
      items = items.map((item) => {
        if (item.id === 'ench_angler_5' && products['ENCHANTED_WATER_LILY']) {
          const unitPrice = Math.round(
            products['ENCHANTED_WATER_LILY'].quick_status?.buyPrice || 19500
          );
          return {
            ...item,
            price: Math.max(350000, unitPrice * 20),
            liveMarket: true,
            marketSource: 'Bazaar (20x Enchanted Water Lily)',
          };
        }
        if (item.id === 'ench_angler_6' && products['ENCHANTED_WATER_LILY']) {
          const unitPrice = Math.round(
            products['ENCHANTED_WATER_LILY'].quick_status?.buyPrice || 19500
          );
          return {
            ...item,
            price: Math.max(1600000, unitPrice * 80),
            liveMarket: true,
            marketSource: 'Bazaar (80x Enchanted Water Lily)',
          };
        }
        if (item.id === 'armor_shark_scale' && products['ENCHANTED_SHARK_FIN']) {
          const finPrice = Math.round(
            products['ENCHANTED_SHARK_FIN'].quick_status?.buyPrice || 58000
          );
          return {
            ...item,
            price: Math.max(3800000, finPrice * 64),
            liveMarket: true,
            marketSource: 'Bazaar (64x Enchanted Shark Fin)',
          };
        }
        if (item.id === 'armor_sponge' && products['ENCHANTED_WET_SPONGE']) {
          const spongePrice = Math.round(
            products['ENCHANTED_WET_SPONGE'].quick_status?.buyPrice || 80000
          );
          return {
            ...item,
            price: Math.max(1400000, spongePrice * 24),
            liveMarket: true,
            marketSource: 'Bazaar (24x Enchanted Wet Sponge)',
          };
        }
        return item;
      });
    }
  } catch (err) {
    console.warn('[UpgradesController] Live Bazaar pricing fallback:', err.message);
  }

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
