/**
 * Service for calculating SkyBlock Pet levels, perks, textures, and fishing stats
 */

const KNOWN_LOCAL_PETS = new Set([
  'dolphin',
  'ammonite',
  'flying_fish',
  'megalodon',
  'baby_yeti',
  'blue_whale',
  'squid',
  'penguin',
  'jade_dragon',
  'golden_dragon',
  'guardian',
  'ghoul',
  'reindeer',
  'bal',
  'black_cat',
  'blaze',
  'grandma_wolf',
  'silverfish',
]);

const PET_SKIN_HASHES = {
  DOLPHIN: '1415d2c543e34bb88ede94d79b9427691fc9be72daad8831a9ef297180546e18',
  AMMONITE: 'a074a7bd976fe6aba1624161793be547d54c835cf422243a851ba09d1e650553',
  FLYING_FISH: 'b8b1bc70136d620a822d08dfc2b04abe927e1c432b256139624b00c7bf4d3c1e',
  MEGALODON: 'a94ae433b301c7fb7c68cba625b0bd36b0b14190f20e34a7c8ee0d9de06d53b9',
  BABY_YETI: 'ef9f6a57d8f686fedd5185d178550913f48f91b57c9162d70d368b1fd9fe2b52',
  BLUE_WHALE: '9ee72d3435c183dbdda2290cc8fcc9054b6e4d6e8f5338db4f4c1d9a30854b5d',
  SQUID: '01433be242366af126da434b8735df1eb5b3cb2cede39145974e9c483607bac',
  PENGUIN: '37534e97f36e5a8335928e171ec99608bee7fb16e260afb301025b3b17eeefc4',
  JADE_DRAGON: '4099589796de185787ab92c3066d0d0af832ffad7153a42bb2e2d23598e7ea60',
  GOLDEN_DRAGON: '2e9f9b1fc014166cb46a093e5349b2bf6edd201b680d62e48dbf3af9b0459116',
  GUARDIAN: '221025434045bda7025b3e514b316a4b770c6faa4ba9adb4be3809526db77f9d',
  GHOUL: '1e1109bbd1f82c182363ed53b624b688924447f9f68b929674ad37f3cef762a8',
  REINDEER: 'a2df65c6fd19a58bee38252192ac7ce2cf1dc8632c3547a9228b6b697240d098',
  BAL: 'c469ba2047122e0a2de3c7437ad3dd5d31f1ac2d27abde9f8841e1d92a8c5b75',
  BLACK_CAT: '8282b5a9bbe2cd3223724023cd4f6ad413f5bb9e0edef81700b8afc3072d04a5',
  BLAZE: 'b78ef2e4cf2c41a2d14bfde9caff10219f5b1bf5b35a49eb51c6467882cb5f0',
  GRANDMA_WOLF: '4e794274c1bb197ad306540286a7aa952974f5661bccf2b725424f6ed79c7884',
  SILVERFISH: '811a1173af3bead305e6339f555662e990d5faadb87e07299fa68ca828a6d2fb',
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
  'GUARDIAN',
  'GHOUL',
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
  const key = rawType.toLowerCase();
  const hash = PET_SKIN_HASHES[rawType] || PET_SKIN_HASHES.DOLPHIN;
  const texture = KNOWN_LOCAL_PETS.has(key)
    ? `/assets/minecraft/pets/${key}.png`
    : `https://skinrender.dev/render/texture:${hash}/head`;

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
