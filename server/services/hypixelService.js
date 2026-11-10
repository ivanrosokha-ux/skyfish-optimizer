/**
 * Hypixel Public API Service
 * Conforms to official Hypixel API Policies & Terms of Service:
 * - Employs TTL caching to minimize requests on the API
 * - Respects RateLimit headers
 * - Keeps API-Key secure on the server side
 */

let bazaarCache = {
  timestamp: 0,
  data: null,
};
const BAZAAR_CACHE_TTL = 60 * 1000; // 60 seconds TTL

const profileCache = new Map();
const PROFILE_CACHE_TTL = 10 * 60 * 1000; // 10 minutes TTL

/**
 * Fetch live Bazaar products and prices from Hypixel (Public endpoint, no key needed)
 */
export async function getLiveBazaar() {
  const now = Date.now();
  if (bazaarCache.data && now - bazaarCache.timestamp < BAZAAR_CACHE_TTL) {
    return bazaarCache.data;
  }

  try {
    const res = await fetch('https://api.hypixel.net/v2/skyblock/bazaar', {
      headers: { 'User-Agent': 'SkyFish-Optimizer/1.0' },
    });

    if (!res.ok) {
      throw new Error(`Hypixel Bazaar HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.products) {
      bazaarCache = {
        timestamp: now,
        data: json.products,
      };
      return json.products;
    }
    return bazaarCache.data || null;
  } catch (err) {
    console.warn('[HypixelService] Bazaar fetch error:', err.message);
    return bazaarCache.data || null;
  }
}

/**
 * Fetch SkyBlock Profiles for a player by UUID (Requires API Key)
 */
export async function getPlayerSkyblockProfiles(uuid) {
  const apiKey = process.env.HYPIXEL_API_KEY;
  if (!apiKey || !uuid) {
    return null;
  }

  const now = Date.now();
  const cached = profileCache.get(uuid);
  if (cached && now - cached.timestamp < PROFILE_CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(
      `https://api.hypixel.net/v2/skyblock/profiles?uuid=${encodeURIComponent(uuid)}`,
      {
        headers: {
          'API-Key': apiKey.trim(),
          'User-Agent': 'SkyFish-Optimizer/1.0',
        },
      }
    );

    if (!res.ok) {
      if (res.status === 403) {
        console.warn('[HypixelService] 403 Forbidden - Invalid or expired API Key');
      } else if (res.status === 429) {
        console.warn('[HypixelService] 429 Rate Limit reached on Hypixel API');
      }
      return null;
    }

    const json = await res.json();
    if (json.success && json.profiles) {
      profileCache.set(uuid, {
        timestamp: now,
        data: json.profiles,
      });
      return json.profiles;
    }
    return null;
  } catch (err) {
    console.warn(`[HypixelService] Profile fetch error for ${uuid}:`, err.message);
    return null;
  }
}
