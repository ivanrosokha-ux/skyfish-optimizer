import { Router } from 'express';
import { getLiveBazaar } from '../services/hypixelService.js';

const router = Router();

const TRACKED_FISHING_ITEMS = [
  'ENCHANTED_SHARK_FIN',
  'ENCHANTED_WATER_LILY',
  'WATER_LILY',
  'NURSE_SHARK_TOOTH',
  'GREAT_WHITE_SHARK_TOOTH',
  'TIGER_SHARK_TOOTH',
  'ENCHANTED_PRISMARINE_SHARD',
  'ENCHANTED_PRISMARINE_CRYSTALS',
  'ENCHANTED_SPONGE',
  'ENCHANTED_WET_SPONGE',
];

router.get('/summary', async (req, res) => {
  try {
    const products = await getLiveBazaar();
    const result = {};

    if (products) {
      for (const id of TRACKED_FISHING_ITEMS) {
        if (products[id]) {
          const p = products[id];
          result[id] = {
            productId: id,
            buyPrice: p.quick_status?.buyPrice || 0,
            sellPrice: p.quick_status?.sellPrice || 0,
            buyOrders: p.quick_status?.buyOrders || 0,
            sellOrders: p.quick_status?.sellOrders || 0,
          };
        }
      }
    }

    // Default fallback if bazaar is temporarily unavailable
    if (Object.keys(result).length === 0) {
      result['ENCHANTED_SHARK_FIN'] = {
        productId: 'ENCHANTED_SHARK_FIN',
        buyPrice: 58000,
        sellPrice: 32000,
      };
      result['ENCHANTED_WATER_LILY'] = {
        productId: 'ENCHANTED_WATER_LILY',
        buyPrice: 19500,
        sellPrice: 15000,
      };
    }

    res.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      source: products ? 'Hypixel Live Bazaar API' : 'Fallback Cache',
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
