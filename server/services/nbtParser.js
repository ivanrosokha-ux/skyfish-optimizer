import nbt from 'prismarine-nbt';

/**
 * Clean Minecraft formatting codes (§0-§f, §k-§r) from text
 */
export function stripMinecraftColors(str = '') {
  return (str || '').replace(/§[0-9a-fk-or]/gi, '').trim();
}

/**
 * Extract stats (SCC, Fishing Speed, Treasure Chance) from item Lore
 */
export function extractStatsFromLore(lore = []) {
  let scc = 0;
  let fishingSpeed = 0;
  let treasureChance = 0;
  let fishingWisdom = 0;

  for (const line of lore) {
    const sccMatch = line.match(/Sea Creature Chance:\s*§[0-9a-fk-or]\+?([0-9.]+)/i);
    if (sccMatch) scc += parseFloat(sccMatch[1]) || 0;

    const speedMatch = line.match(/Fishing Speed:\s*§[0-9a-fk-or]\+?([0-9.]+)/i);
    if (speedMatch) fishingSpeed += parseFloat(speedMatch[1]) || 0;

    const treasureMatch = line.match(/Treasure Chance:\s*§[0-9a-fk-or]\+?([0-9.]+)/i);
    if (treasureMatch) treasureChance += parseFloat(treasureMatch[1]) || 0;

    const wisdomMatch = line.match(/Fishing Wisdom:\s*§[0-9a-fk-or]\+?([0-9.]+)/i);
    if (wisdomMatch) fishingWisdom += parseFloat(wisdomMatch[1]) || 0;
  }

  return {
    scc: Math.round(scc * 10) / 10,
    fishingSpeed: Math.round(fishingSpeed * 10) / 10,
    treasureChance: Math.round(treasureChance * 10) / 10,
    fishingWisdom: Math.round(fishingWisdom * 10) / 10,
  };
}

/**
 * Determine texture URL for item
 */
export function getItemTexture(item, slotHint = '') {
  // Check for custom head skin
  const textureVal = item.tag?.SkullOwner?.Properties?.textures?.[0]?.Value;
  if (textureVal) {
    try {
      const decoded = Buffer.from(textureVal, 'base64').toString('utf8');
      const json = JSON.parse(decoded);
      const skinUrl = json?.textures?.SKIN?.url;
      if (skinUrl) {
        const hash = skinUrl.split('/').pop();
        return `https://mc-heads.net/head/${hash}`;
      }
    } catch {
      // fallback
    }
  }

  const name = (item.tag?.display?.Name || '').toLowerCase();
  const id = (item.tag?.ExtraAttributes?.id || '').toLowerCase();

  if (slotHint === 'rod' || /rod/i.test(name) || /rod/i.test(id)) {
    return '/assets/minecraft/fishing_rod.png';
  }
  if (slotHint === 'helmet' || /helmet|mask|head/i.test(name) || /helmet/i.test(id)) {
    return '/assets/minecraft/diamond_helmet.png';
  }
  if (slotHint === 'chest' || /chestplate|shirt/i.test(name) || /chestplate/i.test(id)) {
    if (/shark|young|blaze|dragon/i.test(name)) return '/assets/minecraft/diamond_chestplate.png';
    return '/assets/minecraft/iron_chestplate.png';
  }
  if (slotHint === 'legs' || /leggings|trunks/i.test(name) || /leggings/i.test(id)) {
    if (/shark|young|blaze|dragon/i.test(name)) return '/assets/minecraft/diamond_leggings.png';
    return '/assets/minecraft/iron_leggings.png';
  }
  if (slotHint === 'boots' || /boots/i.test(name) || /boots/i.test(id)) {
    if (/shark|young|blaze|dragon/i.test(name)) return '/assets/minecraft/diamond_boots.png';
    return '/assets/minecraft/iron_boots.png';
  }

  return '/assets/minecraft/fishing_rod.png';
}

/**
 * Parse Base64 GZip NBT container buffer into list of item objects
 */
export async function parseNbtBuffer(base64Data) {
  if (!base64Data) return [];
  try {
    const buf = Buffer.from(base64Data, 'base64');
    const parsed = await nbt.parse(buf);
    const simplified = nbt.simplify(parsed.parsed);
    const items = simplified.i || simplified.value?.i?.value || [];
    return (Array.isArray(items) ? items : []).filter((it) => it && it.tag);
  } catch {
    return [];
  }
}

/**
 * Format single NBT item for frontend consumption
 */
export function formatSkyblockItem(item, slotHint = '') {
  if (!item || !item.tag) return null;
  const rawFormattedName = item.tag.display?.Name || 'Unknown Item';
  const rawName = stripMinecraftColors(rawFormattedName);
  const rawLore = Array.isArray(item.tag.display?.Lore) ? item.tag.display.Lore : [];
  const extra = item.tag.ExtraAttributes || {};
  const stats = extractStatsFromLore(rawLore);
  const texture = getItemTexture(item, slotHint);

  // Guess rarity from lore last line
  let rarity = 'COMMON';
  for (let i = rawLore.length - 1; i >= 0; i--) {
    const cleanLine = stripMinecraftColors(rawLore[i]);
    if (/SPECIAL|MYTHIC|LEGENDARY|EPIC|RARE|UNCOMMON|COMMON/i.test(cleanLine)) {
      const match = cleanLine.match(/SPECIAL|MYTHIC|LEGENDARY|EPIC|RARE|UNCOMMON|COMMON/i);
      if (match) {
        rarity = match[0].toUpperCase();
        break;
      }
    }
  }

  return {
    id: extra.uuid || extra.id || `${rawName.replace(/\s+/g, '_')}_${Date.now()}`,
    itemId: extra.id || '',
    name: rawFormattedName,
    rawName,
    slot: slotHint,
    rarity,
    lore: rawLore,
    enchantments: extra.enchantments || {},
    stats,
    texture,
  };
}
