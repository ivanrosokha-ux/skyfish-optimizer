/**
 * API Service Layer for SkyFish Optimizer
 * Integrates Hypixel player profile data, market prices, and authentication endpoints.
 */

// Simulated network delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock database of players and profiles
 */
const PLAYERS_DATABASE = {
  reefrunner: {
    username: 'ReefRunner',
    profiles: {
      Lime: {
        stats: {
          purse: 14200000,
          bank: 45000000,
          scc: 64,
          fishingSpeed: 180,
          treasureChance: 12,
          fishingWisdom: 30,
          fishingLevel: 47,
          progressPercent: 50,
        },
        armor: [
          { slot: 'helmet', name: "Diver's Mask", meta: 'Wise · Growth V', icon: '⛑️' },
          { slot: 'chest', name: "Diver's Shirt", meta: 'Wise · Growth V', icon: '👕' },
          { slot: 'legs', name: "Diver's Trunks", meta: 'Wise · Growth V', icon: '🛡️' },
          { slot: 'boots', name: "Diver's Boots", meta: 'Wise · Growth V', icon: '🥾' },
        ],
        rod: { name: 'Rod of the Sea', meta: 'Expertise V · Salty', icon: '🎣' },
        pet: { name: 'Dolphin', meta: 'Level 80 · Epic', icon: '🐬' },
      },
      Coconut: {
        stats: {
          purse: 8500000,
          bank: 12000000,
          scc: 48,
          fishingSpeed: 140,
          treasureChance: 8,
          fishingWisdom: 22,
          fishingLevel: 36,
          progressPercent: 78,
        },
        armor: [
          { slot: 'helmet', name: 'Water Hydra Head', meta: 'Clean', icon: '⛑️' },
          { slot: 'chest', name: 'Salmon Chestplate', meta: 'Growth IV', icon: '👕' },
          { slot: 'legs', name: 'Salmon Leggings', meta: 'Growth IV', icon: '🛡️' },
          { slot: 'boots', name: 'Salmon Boots', meta: 'Growth IV', icon: '🥾' },
        ],
        rod: { name: 'Chum Rod', meta: 'Lure V', icon: '🎣' },
        pet: { name: 'Flying Fish', meta: 'Level 60 · Rare', icon: '🐟' },
      },
      Papaya: {
        stats: {
          purse: 2100000,
          bank: 5000000,
          scc: 35,
          fishingSpeed: 110,
          treasureChance: 5,
          fishingWisdom: 15,
          fishingLevel: 24,
          progressPercent: 32,
        },
        armor: [
          { slot: 'helmet', name: 'Angler Helmet', meta: 'Protection IV', icon: '⛑️' },
          { slot: 'chest', name: 'Angler Chestplate', meta: 'Protection IV', icon: '👕' },
          { slot: 'legs', name: 'Angler Leggings', meta: 'Protection IV', icon: '🛡️' },
          { slot: 'boots', name: 'Angler Boots', meta: 'Protection IV', icon: '🥾' },
        ],
        rod: { name: 'Farmer Rod', meta: 'Magnet V', icon: '🎣' },
        pet: { name: 'Squid', meta: 'Level 40 · Common', icon: '🦑' },
      },
    },
  },
  technoblade: {
    username: 'Technoblade',
    profiles: {
      Lime: {
        stats: {
          purse: 125000000,
          bank: 500000000,
          scc: 92,
          fishingSpeed: 285,
          treasureChance: 25,
          fishingWisdom: 50,
          fishingLevel: 50,
          progressPercent: 100,
        },
        armor: [
          { slot: 'helmet', name: 'Thunder Helmet', meta: 'Festive · Legion V', icon: '⛑️' },
          { slot: 'chest', name: 'Thunder Chestplate', meta: 'Festive · Legion V', icon: '👕' },
          { slot: 'legs', name: 'Thunder Leggings', meta: 'Festive · Legion V', icon: '🛡️' },
          { slot: 'boots', name: 'Thunder Boots', meta: 'Festive · Legion V', icon: '🥾' },
        ],
        rod: { name: 'Hellfire Rod', meta: 'Expertise X · Pitchin', icon: '🎣' },
        pet: { name: 'Flying Fish', meta: 'Level 100 · Mythic', icon: '🐟' },
      },
    },
  },
};

/**
 * Asynchronously fetch player fishing profile data
 */
export async function fetchPlayerProfile(nickname = 'ReefRunner', profileName = 'Lime') {
  await delay(250); // simulate network latency
  const key = nickname.toLowerCase().trim();
  const player = PLAYERS_DATABASE[key];

  if (player && player.profiles[profileName]) {
    return {
      success: true,
      username: player.username,
      profile: profileName,
      profilesList: Object.keys(player.profiles),
      ...player.profiles[profileName],
    };
  }

  // Fallback dynamic profile generator for any unknown username
  return {
    success: true,
    username: nickname,
    profile: profileName,
    profilesList: ['Lime', 'Coconut', 'Papaya'],
    stats: {
      purse: 5000000,
      bank: 20000000,
      scc: 55,
      fishingSpeed: 160,
      treasureChance: 10,
      fishingWisdom: 25,
      fishingLevel: 40,
      progressPercent: 42,
    },
    armor: [
      { slot: 'helmet', name: "Diver's Mask", meta: 'Wise · Growth V', icon: '⛑️' },
      { slot: 'chest', name: "Diver's Shirt", meta: 'Wise · Growth V', icon: '👕' },
      { slot: 'legs', name: "Diver's Trunks", meta: 'Wise · Growth V', icon: '🛡️' },
      { slot: 'boots', name: "Diver's Boots", meta: 'Wise · Growth V', icon: '🥾' },
    ],
    rod: { name: 'Rod of the Sea', meta: 'Expertise V', icon: '🎣' },
    pet: { name: 'Dolphin', meta: 'Level 75 · Rare', icon: '🐬' },
  };
}

/**
 * Fetch catalog of fishing upgrades with live-market prices
 */
export async function fetchUpgradesCatalog() {
  await delay(200);
  return [
    {
      id: 'ench_angler_5',
      name: 'Angler V',
      note: 'Apply to fishing rod',
      type: 'Enchantment',
      category: 'Enchantments',
      gain: 1,
      statType: 'scc',
      price: 400000,
      group: 'enchant_angler',
    },
    {
      id: 'reforge_submerged',
      name: 'Submerged',
      note: 'Reforge one armor piece',
      type: 'Reforge',
      category: 'Reforges',
      gain: 2,
      statType: 'scc',
      price: 1200000,
      group: 'reforge_armor',
    },
    {
      id: 'acc_deep_sea_orb',
      name: 'Deep Sea Orb',
      note: 'Accessory talisman',
      type: 'Accessory',
      category: 'Accessory',
      gain: 3,
      statType: 'scc',
      price: 2400000,
      group: 'acc_orb',
    },
    {
      id: 'armor_shark_scale',
      name: 'Shark Scale set',
      note: "Replace Diver's armor",
      type: 'Armor',
      category: 'Armor',
      gain: 4,
      statType: 'scc',
      price: 4000000,
      group: 'armor_set',
    },
    {
      id: 'pet_ammonite_100',
      name: 'Ammonite',
      note: 'Level 100 · Replace Dolphin',
      type: 'Pet',
      category: 'Pet',
      gain: 5,
      statType: 'scc',
      price: 7500000,
      group: 'pet_slot',
    },
    {
      id: 'ench_blessing_5',
      name: 'Blessing V',
      note: 'Increases Fishing Speed',
      type: 'Enchantment',
      category: 'Enchantments',
      gain: 15,
      statType: 'speed',
      price: 650000,
      group: 'enchant_blessing',
    },
    {
      id: 'reforge_festive',
      name: 'Festive Reforge',
      note: 'Armor reforge for Fishing Speed',
      type: 'Reforge',
      category: 'Reforges',
      gain: 20,
      statType: 'speed',
      price: 1800000,
      group: 'reforge_festive',
    },
  ];
}

/**
 * Authentication API Service (Simulation of backend auth endpoint)
 */
export async function loginUserApi(email, password) {
  await delay(350);
  if (!email || !email.includes('@')) {
    throw new Error('Введіть коректну адресу електронної пошти.');
  }
  if (!password || password.length < 6) {
    throw new Error('Пароль повинен містити щонайменше 6 символів.');
  }

  const token = 'skyfish_jwt_' + Math.random().toString(36).substring(2);
  const user = {
    id: 'usr_angler_1',
    email: email.toLowerCase().trim(),
    name: email.split('@')[0],
  };

  return { token, user };
}

export async function registerUserApi(email, password) {
  await delay(400);
  return loginUserApi(email, password);
}
