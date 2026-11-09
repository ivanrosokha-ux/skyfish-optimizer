/**
 * API Service layer for external Hypixel and Bazaar calls
 */
const BAZAAR_API = 'https://api.hypixel.net/v2/skyblock/bazaar';
const COFLNET_LBIN_API = 'https://sky.coflnet.com/api/auctions/tag';

export async function fetchBazaarPrices() {
  try {
    const res = await fetch(BAZAAR_API);
    if (!res.ok) throw new Error('Bazaar API offline');
    const data = await res.json();
    return data.products;
  } catch (error) {
    console.warn('Using fallback Bazaar cache:', error);
    return null;
  }
}

export async function fetchLowestBin(itemTag) {
  try {
    const res = await fetch(`${COFLNET_LBIN_API}/${itemTag}/active/bin`);
    if (!res.ok) throw new Error('Coflnet API offline');
    return await res.json();
  } catch (error) {
    console.warn(`Using fallback LBIN for ${itemTag}:`, error);
    return null;
  }
}
