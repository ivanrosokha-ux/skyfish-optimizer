/**
 * Service for calculating SkyBlock Pet levels, perks, textures, and fishing stats
 */

const PET_SKIN_HASHES = {
  JADE_DRAGON: 'b2ad235b9458cc26c9dd794a35c1100e1b5bbe4a0c6c3da6ffd4830006683cb9',
  GOLDEN_DRAGON: '1fc3268472ce8ec8a5717e34ef3ec9c5040ff9b14243b9188d3d9fe2374e64f0',
  MEGALODON: '12188ab6bc6784d00874e4c29c8e10e74b3ab3b03f0b2f5b5f257bf3fe8705',
  AMMONITE: 'a5ffc17d3d7cae51f8a2f4dd12b2e9e62319c5c707d885a03e6206c4b2eb01e3',
  DOLPHIN: '8e4443772f932f2ec52e27e460e0300c7baa803e1cb1cc6f4cf8b6ddb565d33a',
  FLYING_FISH: '3abb9449856f6ffc6b5e0ee0979bf4dd8ea9d10e53f1ef1a49ab1385f0962308',
  SQUID: '01433be30843599c279d6955a5d4771e7d7373f1d8c199e8d3fbfa9713e2f',
  PENGUIN: '9a2b53b8fc7f3f1e94d8cb845ea07e8ef8eb605c2a12ad35cb35b2e3ffbbf5',
  BLUE_WHALE: 'dab70ea9c6a1cf8a6234b7f43394c8e762ec8ff90d565ff9bc6a445cb4aa',
  BABY_YETI: 'ab4740e53a921d743a6d4889c256561f7db1f9db7c37fc36d93427181fc187',
  GHOUL: '85f528fae9cae5e197da96df6aef0c84c7e6c99c80520a2e584344db7e89e9d',
  REINDEER: '819d9b4b0051e70d47e70ea2257e3f8983fb087a3cb98e9462b4897f26d4be04',
};

const FISHING_PET_TYPES = new Set([
  'JADE_DRAGON',
  'GOLDEN_DRAGON',
  'MEGALODON',
  'AMMONITE',
  'DOLPHIN',
  'FLYING_FISH',
  'SQUID',
  'PENGUIN',
  'BLUE_WHALE',
  'BABY_YETI',
  'REINDEER',
]);

/**
 * Calculate Pet level from raw experience
 */
export function calculatePetLevel(exp = 0) {
  // Legendary / Mythic level 100 cap ~25.3M exp
  const expTiers = [
    100, 210, 330, 460, 605, 765, 940, 1130, 1340, 1570, 1820, 2095, 2395, 2725, 3085, 3485, 3925,
    4410, 4950, 5550, 6220, 6960, 7770, 8660, 9640, 10730, 11950, 13320, 14860, 16580, 18500, 20650,
    23050, 25720, 28700, 32020, 35720, 39840, 44430, 49550, 55250, 61600, 68670, 76540, 85300,
    95060, 105930, 118040, 131530, 146550, 163280, 181910, 202650, 225730, 251410, 280000, 311820,
    347240, 386660, 430540, 479380, 533740, 594240, 661580, 736520, 819920, 912720, 1016000,
    1130940, 1258860, 1401240, 1559740, 1736160, 1932520, 2151100, 2394400, 2665200, 2966600,
    3302100, 3675500, 4091000, 4553400, 5068000, 5640700, 6278100, 6987400, 7776700, 8655000,
    9632300, 10719700, 11929700, 13276100, 14774300, 16441300, 18296000, 20359700, 22656300,
    25212300,
  ];

  let level = 1;
  for (let i = 0; i < expTiers.length; i++) {
    if (exp >= expTiers[i]) {
      level = i + 2;
    } else {
      break;
    }
  }
  return Math.min(100, Math.max(1, level));
}

/**
 * Format raw pet object into enriched Pet item with stats, perks, and tooltip lore
 */
export function formatPetItem(pet) {
  if (!pet) return null;
  const rawType = pet.type || 'DOLPHIN';
  const name = rawType
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const tier = (pet.tier || 'LEGENDARY').toUpperCase();
  const level = calculatePetLevel(pet.exp || 0);
  const hash = PET_SKIN_HASHES[rawType] || PET_SKIN_HASHES.DOLPHIN;
  const texture = `https://mc-heads.net/head/${hash}`;

  let scc = 0;
  let fishingSpeed = 0;
  let fishingWisdom = 0;

  // Base pet perks based on type and level
  if (rawType === 'DOLPHIN') {
    scc += Math.round(level * 0.1 * 10) / 10; // +10% SCC at lvl 100
    fishingSpeed += Math.round(level * 0.25);
  } else if (rawType === 'AMMONITE') {
    scc += Math.round(level * 0.08 * 10) / 10;
    fishingSpeed += Math.round(level * 0.4);
  } else if (rawType === 'MEGALODON') {
    scc += Math.round(level * 0.05 * 10) / 10;
    fishingSpeed += Math.round(level * 0.2);
  } else if (rawType === 'FLYING_FISH') {
    fishingSpeed += Math.round(level * 0.5); // +50 Fishing Speed at lvl 100
  } else if (rawType === 'SQUID') {
    fishingWisdom += Math.round(level * 0.3); // +30 Fishing Wisdom at lvl 100
  } else if (rawType === 'JADE_DRAGON') {
    scc += 8;
    fishingSpeed += 25;
  } else if (rawType === 'GOLDEN_DRAGON') {
    scc += 5;
    fishingSpeed += 20;
  }

  // Held Item bonus
  let heldItemName = null;
  if (pet.heldItem) {
    if (pet.heldItem.includes('WASHED_UP_SOUVENIR')) {
      heldItemName = 'Washed-up Souvenir (+5 SCC · +5 Speed)';
      scc += 5;
      fishingSpeed += 5;
    } else if (pet.heldItem.includes('LUCKY_CLOVER')) {
      heldItemName = 'Lucky Clover (+7% SCC)';
      scc += 7;
    } else {
      heldItemName = pet.heldItem.replace(/_/g, ' ').toLowerCase();
    }
  }

  const colorCode =
    tier === 'MYTHIC'
      ? '§d'
      : tier === 'LEGENDARY'
        ? '§6'
        : tier === 'EPIC'
          ? '§5'
          : tier === 'RARE'
            ? '§9'
            : '§a';

  const lore = [
    `§7Level ${level}`,
    '',
    `§7Sea Creature Chance: §3+${scc}%`,
    `§7Fishing Speed: §b+${fishingSpeed}`,
  ];
  if (fishingWisdom > 0) lore.push(`§7Fishing Wisdom: §b+${fishingWisdom}`);
  if (heldItemName) lore.push('', `§6Held Item: §a${heldItemName}`);
  lore.push('', `${colorCode}§l${tier} PET`);

  return {
    id: pet.uuid || `${rawType}_${level}`,
    type: rawType,
    name: `${name}`,
    displayName: `${colorCode}[Lvl ${level}] ${name}`,
    tier,
    level,
    exp: pet.exp || 0,
    active: Boolean(pet.active),
    heldItem: heldItemName,
    texture,
    stats: {
      scc: Math.round(scc * 10) / 10,
      fishingSpeed: Math.round(fishingSpeed * 10) / 10,
      fishingWisdom: Math.round(fishingWisdom * 10) / 10,
    },
    lore,
  };
}

/**
 * Filter and enrich all fishing pets from a player's pets list
 */
export function extractFishingPets(rawPets = []) {
  if (!Array.isArray(rawPets) || rawPets.length === 0) {
    return [
      formatPetItem({
        type: 'DOLPHIN',
        tier: 'LEGENDARY',
        exp: 25300000,
        active: true,
        heldItem: 'POIGNANT_LUCKY_CLOVER',
      }),
    ];
  }

  const fishingPets = rawPets
    .filter(
      (p) =>
        p &&
        (FISHING_PETS_TYPES.has(p.type) ||
          /fish|dolphin|squid|dragon|whale|ammonite|yeti|megalodon/i.test(p.type))
    )
    .map(formatPetItem)
    .sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0) || b.stats.scc - a.stats.scc);

  if (fishingPets.length === 0) {
    // If player has no fishing pets, fallback to first pet or default
    return [
      formatPetItem(rawPets[0] || { type: 'DOLPHIN', tier: 'EPIC', exp: 5000000, active: true }),
    ];
  }

  return fishingPets;
}

const FISHING_PETS_TYPES = FISHING_PET_TYPES;
