import { players } from '../data/mockDb.js';
import { fetchPlayerUuid } from '../services/mojangService.js';
import {
  getPlayerSkyblockProfiles,
  decodeNbtItemNames,
  calculateFishingLevel,
} from '../services/hypixelService.js';

export async function getPlayerProfile(req, res) {
  const { nickname } = req.params;
  const profileName = req.query.profile || 'Lime';

  if (!nickname) {
    return res.status(400).json({ success: false, error: 'Вкажіть нікнейм гравця' });
  }

  const key = nickname.toLowerCase().trim();

  // 1. If player exists in local database (ReefRunner, Technoblade in local mock), prioritize unless live requested
  const localPlayer = players[key];
  if (localPlayer && key !== 'lord1k_xx') {
    const matchedProfileName = localPlayer.profiles[profileName]
      ? profileName
      : Object.keys(localPlayer.profiles)[0];
    const data = localPlayer.profiles[matchedProfileName];

    return res.json({
      success: true,
      username: localPlayer.username,
      profile: matchedProfileName,
      profilesList: Object.keys(localPlayer.profiles),
      ...data,
    });
  }

  // 2. Perform live Mojang + Hypixel API lookup if HYPIXEL_API_KEY is configured
  if (process.env.HYPIXEL_API_KEY) {
    try {
      const mojangData = await fetchPlayerUuid(nickname);
      if (mojangData && mojangData.uuid) {
        const hypixelProfiles = await getPlayerSkyblockProfiles(mojangData.uuid);
        if (hypixelProfiles && hypixelProfiles.length > 0) {
          const profileNames = hypixelProfiles.map((p) => p.cute_name || 'Profile');
          const activeProfile =
            hypixelProfiles.find(
              (p) => (p.cute_name || '').toLowerCase() === profileName.toLowerCase()
            ) ||
            hypixelProfiles.find((p) => p.selected) ||
            hypixelProfiles[0];

          const memberData = activeProfile?.members?.[mojangData.uuid] || {};

          // 2.1 Calculate Fishing Level
          const rawExp = memberData?.player_data?.experience?.SKILL_FISHING || 0;
          const { level: fishingLevel, progressPercent } = calculateFishingLevel(rawExp);

          // 2.2 Currencies
          const purse = Math.round(memberData?.currencies?.coin_purse || 0);
          const bank = Math.round(activeProfile?.banking?.balance || 0);

          // 2.3 Parse Armor
          const rawArmorB64 = memberData?.inventory?.inv_armor?.data;
          const armorNames = decodeNbtItemNames(rawArmorB64);
          // In Minecraft, armor slots: [0] boots, [1] legs, [2] chest, [3] helmet
          const bootsName = armorNames[0] || "Diver's Boots";
          const legsName = armorNames[1] || "Diver's Trunks";
          const chestName = armorNames[2] || "Diver's Shirt";
          const helmetName = armorNames[3] || "Diver's Mask";

          const armor = [
            { slot: 'helmet', name: helmetName, meta: 'Equipped Armor', icon: '⛑️' },
            { slot: 'chest', name: chestName, meta: 'Equipped Armor', icon: '👕' },
            { slot: 'legs', name: legsName, meta: 'Equipped Armor', icon: '🛡️' },
            { slot: 'boots', name: bootsName, meta: 'Equipped Armor', icon: '🥾' },
          ];

          // 2.4 Parse Pet
          const pets = memberData?.pets_data?.pets || [];
          const activePet = pets.find((p) => p.active) || pets[0];
          let petObj = { name: 'Dolphin', meta: 'Level 80 · Epic', icon: '🐬' };
          if (activePet) {
            const rawType = (activePet.type || 'DOLPHIN').replace(/_/g, ' ');
            const petName = rawType
              .toLowerCase()
              .split(' ')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
            const tier = (activePet.tier || 'EPIC').toLowerCase();
            const petTier = tier.charAt(0).toUpperCase() + tier.slice(1);
            petObj = {
              name: petName,
              meta: `Level 100 · ${petTier}`,
              icon: rawType.includes('DRAGON') ? '🐉' : rawType.includes('FISH') ? '🐟' : '🐬',
            };
          }

          // 2.5 Parse Rod
          const rawInvB64 = memberData?.inventory?.inv_contents?.data;
          const invNames = decodeNbtItemNames(rawInvB64);
          const foundRod = invNames.find((n) => /Rod|Chum|Hellfire|Magma/i.test(n));
          const rodObj = {
            name: foundRod || 'Rod of the Sea',
            meta: 'Expertise V · Salty',
            icon: '🎣',
          };

          return res.json({
            success: true,
            username: mojangData.name,
            uuid: mojangData.uuid,
            profile: activeProfile.cute_name || profileName,
            profilesList: profileNames,
            source: 'Hypixel Public API (Live)',
            stats: {
              purse,
              bank,
              scc: Math.min(100, 50 + Math.round(fishingLevel * 0.4) + (activePet ? 8 : 0)),
              fishingSpeed: Math.min(300, 140 + Math.round(fishingLevel * 1.2)),
              treasureChance: 12,
              fishingWisdom: 30 + (fishingLevel >= 40 ? 15 : 0),
              fishingLevel,
              progressPercent,
              rawExp,
            },
            armor,
            rod: rodObj,
            pet: petObj,
          });
        }
      }
    } catch (err) {
      console.warn('[PlayerController] Live Hypixel fetch fallback:', err.message);
    }
  }

  // 3. Fallback for custom search
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
