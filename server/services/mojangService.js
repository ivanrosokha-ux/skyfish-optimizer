/**
 * Mojang API Service
 * Resolves Minecraft player nicknames to Mojang UUIDs.
 * Free public API from Mojang/Microsoft (no API key required).
 */

const uuidCache = new Map();

export async function fetchPlayerUuid(nickname) {
  if (!nickname) return null;
  const cleanNick = nickname.trim().toLowerCase();

  if (uuidCache.has(cleanNick)) {
    return uuidCache.get(cleanNick);
  }

  try {
    const res = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(nickname)}`,
      {
        headers: { 'User-Agent': 'SkyFish-Optimizer/1.0' },
      }
    );

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Mojang API HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data && data.id) {
      const record = { uuid: data.id, name: data.name };
      uuidCache.set(cleanNick, record);
      return record;
    }
    return null;
  } catch (err) {
    console.warn(`[MojangService] Failed to resolve UUID for ${nickname}:`, err.message);
    return null;
  }
}
