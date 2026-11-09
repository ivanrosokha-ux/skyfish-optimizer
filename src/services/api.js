/**
 * API Service Layer for SkyFish Optimizer
 * Communicates with Node/Express backend on /api/* with local fallback.
 */

const API_BASE = '/api';

/**
 * Fetch player profile from Express backend
 */
export async function fetchPlayerProfile(nickname = 'ReefRunner', profileName = 'Lime') {
  try {
    const res = await fetch(
      `${API_BASE}/player/${encodeURIComponent(nickname)}?profile=${encodeURIComponent(profileName)}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('API fallback for fetchPlayerProfile:', error.message);
    return {
      success: true,
      username: nickname,
      profile: profileName,
      profilesList: ['Lime', 'Coconut', 'Papaya'],
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
    };
  }
}

/**
 * Fetch catalog of fishing upgrades from Express backend
 */
export async function fetchUpgradesCatalog() {
  try {
    const res = await fetch(`${API_BASE}/upgrades`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn('API fallback for fetchUpgradesCatalog:', error.message);
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
}

/**
 * Authentication API Service
 */
export async function loginUserApi(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Помилка авторизації');
    }
    return data;
  } catch (error) {
    if (error.message.includes('HTTP') || error.message.includes('Failed to fetch')) {
      // Local demo fallback
      if (!email || !email.includes('@')) throw new Error('Введіть коректну адресу пошти');
      if (!password || password.length < 6)
        throw new Error('Пароль повинен містити щонайменше 6 символів');
      return {
        token: 'skyfish_local_jwt_' + Date.now(),
        user: { id: 'usr_local', email: email.toLowerCase(), name: email.split('@')[0] },
      };
    }
    throw error;
  }
}

export async function registerUserApi(email, password) {
  return loginUserApi(email, password);
}
