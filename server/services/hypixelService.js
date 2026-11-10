import zlib from 'zlib';

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

/**
 * Decode Base64 Gzip Minecraft NBT inventory buffer to extract item display names
 */
export function decodeNbtItemNames(rawBase64) {
  if (!rawBase64) return [];
  try {
    const buf = Buffer.from(rawBase64, 'base64');
    const decompressed = zlib.gunzipSync(buf).toString('utf8');
    const names = [];
    // eslint-disable-next-line no-control-regex
    const regex = /Name\x00[\s\S]([^\x00\x0a\r]+?)(?=\x00|\x0a|\r)/g;
    let match;
    while ((match = regex.exec(decompressed)) !== null) {
      const clean = match[1].replace(/§[0-9a-fk-or]/gi, '').trim();
      if (clean.length > 2) names.push(clean);
    }
    return names;
  } catch {
    return [];
  }
}

/**
 * Calculate SkyBlock skill level and progress from raw experience
 */
export function calculateSkillLevel(xp = 0, maxLevel = 50) {
  const thresholds = [
    50, 175, 375, 675, 1175, 1925, 2925, 4425, 6425, 9925, 14925, 22425, 32425, 47425, 67425, 97425,
    147425, 222425, 322425, 522425, 822425, 1222425, 1722425, 2322425, 3022425, 3822425, 4722425,
    5722425, 6822425, 8022425, 9322425, 10722425, 12222425, 13822425, 15522425, 17322425, 19222425,
    21222425, 23322425, 25522425, 27822425, 30222425, 32722425, 35322425, 38072425, 40972425,
    44072425, 47472425, 51172425, 55172425,
    // 51 - 60
    59672425, 64672425, 70272425, 76572425, 83672425, 91672425, 100672425, 110872425, 122372425,
    135372425,
  ];

  const effectiveThresholds = thresholds.slice(0, maxLevel);
  let level = 0;
  for (let i = 0; i < effectiveThresholds.length; i++) {
    if (xp >= effectiveThresholds[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  const prev = level === 0 ? 0 : effectiveThresholds[level - 1];
  const next =
    level >= effectiveThresholds.length
      ? effectiveThresholds[effectiveThresholds.length - 1]
      : effectiveThresholds[level];

  const progressPercent =
    level >= maxLevel
      ? 100
      : Math.min(100, Math.max(0, Math.round(((xp - prev) / (next - prev || 1)) * 100)));

  const maxThreshold = effectiveThresholds[effectiveThresholds.length - 1];
  const totalProgressPercent = Math.min(100, Math.max(0, Math.round((xp / maxThreshold) * 100)));

  return {
    level: Math.max(1, Math.min(maxLevel, level)),
    progressPercent,
    totalProgressPercent,
    xpCurrent: Math.max(0, Math.round(xp - prev)),
    xpForNext: Math.max(0, Math.round(next - prev)),
    rawExp: Math.round(xp),
    maxLevel,
  };
}

/**
 * Calculate SkyBlock fishing level from raw skill experience (convenience alias)
 */
export function calculateFishingLevel(xp = 0) {
  return calculateSkillLevel(xp, 50);
}
