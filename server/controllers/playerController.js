import { players } from '../data/mockDb.js';

export function getPlayerProfile(req, res) {
  const { nickname } = req.params;
  const profileName = req.query.profile || 'Lime';

  if (!nickname) {
    return res.status(400).json({ success: false, error: 'Вкажіть нікнейм гравця' });
  }

  const key = nickname.toLowerCase().trim();
  const player = players[key];

  if (player && player.profiles[profileName]) {
    return res.json({
      success: true,
      username: player.username,
      profile: profileName,
      profilesList: Object.keys(player.profiles),
      ...player.profiles[profileName],
    });
  }

  // Dynamic fallback for any search
  return res.json({
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
  });
}
