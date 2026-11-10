import { players } from '../data/mockDb.js';
import { fetchPlayerUuid } from '../services/mojangService.js';
import { getPlayerSkyblockProfiles, calculateFishingLevel } from '../services/hypixelService.js';
import { parseNbtBuffer, formatSkyblockItem } from '../services/nbtParser.js';
import { extractFishingPets } from '../services/petsService.js';

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

    // Mock enriched rods, sets, and pets for local tests
    const defaultArmor = (data.armor || []).map((a) => ({
      id: `mock_${a.slot}`,
      rawName: a.name,
      name: a.name,
      slot: a.slot,
      rarity: 'EPIC',
      lore: [a.name, a.meta || '', '§7Sea Creature Chance: §3+3%', '§7Fishing Speed: §b+10'],
      stats: { scc: 3, fishingSpeed: 10, treasureChance: 0, fishingWisdom: 0 },
      texture:
        a.slot === 'helmet'
          ? '/assets/minecraft/diamond_helmet.png'
          : a.slot === 'chest'
            ? '/assets/minecraft/diamond_chestplate.png'
            : a.slot === 'legs'
              ? '/assets/minecraft/diamond_leggings.png'
              : '/assets/minecraft/diamond_boots.png',
    }));

    const defaultRod = {
      id: 'rod_sea',
      rawName: data.rod?.name || 'Rod of the Sea',
      name: data.rod?.name || 'Rod of the Sea',
      slot: 'rod',
      rarity: 'LEGENDARY',
      lore: [
        data.rod?.name || 'Rod of the Sea',
        data.rod?.meta || 'Expertise V · Salty',
        '§7Fishing Speed: §b+75',
        '§7Sea Creature Chance: §3+10%',
        '§7Treasure Chance: §6+3%',
        '§6§lLEGENDARY FISHING ROD',
      ],
      stats: { scc: 10, fishingSpeed: 75, treasureChance: 3, fishingWisdom: 0 },
      texture: '/assets/minecraft/fishing_rod.png',
    };

    const defaultPet = {
      id: 'pet_dolphin',
      name: data.pet?.name || 'Dolphin',
      displayName: `[Lvl 100] ${data.pet?.name || 'Dolphin'}`,
      tier: 'LEGENDARY',
      level: 100,
      texture:
        'https://mc-heads.net/head/8e4443772f932f2ec52e27e460e0300c7baa803e1cb1cc6f4cf8b6ddb565d33a',
      stats: { scc: 10, fishingSpeed: 25, fishingWisdom: 0 },
      lore: [
        `§6[Lvl 100] ${data.pet?.name || 'Dolphin'}`,
        '§7Sea Creature Chance: §3+10%',
        '§7Fishing Speed: §b+25',
        '§6§lLEGENDARY PET',
      ],
    };

    return res.json({
      success: true,
      username: localPlayer.username,
      profile: matchedProfileName,
      profilesList: Object.keys(localPlayer.profiles),
      armorSets: [
        {
          id: 'set_equipped',
          name: 'Equipped Armor Set',
          pieces: defaultArmor,
          totalSCC: 12,
          totalSpeed: 40,
        },
      ],
      allRods: [defaultRod],
      fishingPets: [defaultPet],
      activeEquipment: {
        selectedArmorSetId: 'set_equipped',
        selectedRodId: defaultRod.id,
        selectedPetId: defaultPet.id,
      },
      ...data,
      armor: defaultArmor,
      rod: defaultRod,
      pet: defaultPet,
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

          // 2.3 Parse Equipped Armor (slots: 0=boots, 1=legs, 2=chest, 3=helmet)
          const rawEquipped = await parseNbtBuffer(memberData?.inventory?.inv_armor?.data);
          const slots = ['boots', 'legs', 'chest', 'helmet'];
          const rawPieces = rawEquipped.map((it, idx) =>
            formatSkyblockItem(it, slots[idx] || 'armor')
          );

          // Standardize order to [helmet, chest, legs, boots]
          const bootsPiece = rawPieces[0] || {
            id: 'helix_boots',
            name: 'Helix Boots',
            rawName: 'Helix Boots',
            slot: 'boots',
            stats: { scc: 0, fishingSpeed: 0 },
            texture: '/assets/minecraft/iron_boots.png',
            lore: ['Helix Boots', '§7Equipped Boots'],
          };
          const legsPiece = rawPieces[1] || {
            id: 'helix_legs',
            name: 'Helix Leggings',
            rawName: 'Helix Leggings',
            slot: 'legs',
            stats: { scc: 0, fishingSpeed: 0 },
            texture: '/assets/minecraft/iron_leggings.png',
            lore: ['Helix Leggings', '§7Equipped Leggings'],
          };
          const chestPiece = rawPieces[2] || {
            id: 'helix_chest',
            name: 'Helix Chestplate',
            rawName: 'Helix Chestplate',
            slot: 'chest',
            stats: { scc: 0, fishingSpeed: 0 },
            texture: '/assets/minecraft/iron_chestplate.png',
            lore: ['Helix Chestplate', '§7Equipped Chestplate'],
          };
          const helmetPiece = rawPieces[3] || {
            id: 'helix_helm',
            name: 'Groovy Helix Helmet',
            rawName: 'Groovy Helix Helmet',
            slot: 'helmet',
            stats: { scc: 0, fishingSpeed: 0 },
            texture:
              'https://mc-heads.net/head/b2ad235b9458cc26c9dd794a35c1100e1b5bbe4a0c6c3da6ffd4830006683cb9',
            lore: ['Groovy Helix Helmet', '§7Equipped Helmet'],
          };

          const equippedArmorSet = {
            id: 'set_equipped',
            name: `Equipped (${helmetPiece.rawName.replace(/(Groovy|Pure|Ancient|Wise)\s+/i, '') || 'Custom Set'})`,
            pieces: [helmetPiece, chestPiece, legsPiece, bootsPiece],
            totalSCC:
              (helmetPiece.stats?.scc || 0) +
              (chestPiece.stats?.scc || 0) +
              (legsPiece.stats?.scc || 0) +
              (bootsPiece.stats?.scc || 0),
            totalSpeed:
              (helmetPiece.stats?.fishingSpeed || 0) +
              (chestPiece.stats?.fishingSpeed || 0) +
              (legsPiece.stats?.fishingSpeed || 0) +
              (bootsPiece.stats?.fishingSpeed || 0),
          };

          // 2.4 Parse All Rods & Additional Armor from Inventory, Ender Chest & Backpacks
          const rawInv = await parseNbtBuffer(memberData?.inventory?.inv_contents?.data);
          const rawEc = await parseNbtBuffer(memberData?.inventory?.ender_chest_contents?.data);
          const bp = memberData?.inventory?.backpack_contents || {};
          let rawBp = [];
          for (const bpVal of Object.values(bp)) {
            const items = await parseNbtBuffer(bpVal.data);
            rawBp.push(...items);
          }
          const allStorageItems = [...rawInv, ...rawEc, ...rawBp];

          // Collect all rods
          const foundRods = allStorageItems
            .filter((it) => {
              const name = it.tag?.display?.Name || '';
              const id = it.tag?.ExtraAttributes?.id || '';
              return /rod/i.test(name) || /rod/i.test(id);
            })
            .map((it) => formatSkyblockItem(it, 'rod'))
            .filter(Boolean);

          // Deduplicate and prioritize rods (Rod of Legends first)
          const allRods = [];
          const seenRodNames = new Set();
          for (const rod of foundRods) {
            if (!seenRodNames.has(rod.rawName)) {
              seenRodNames.add(rod.rawName);
              allRods.push(rod);
            }
          }
          allRods.sort(
            (a, b) =>
              (b.stats?.scc || 0) +
              (b.stats?.fishingSpeed || 0) -
              ((a.stats?.scc || 0) + (a.stats?.fishingSpeed || 0))
          );

          // Fallback rod if none in storage
          if (allRods.length === 0) {
            allRods.push({
              id: 'rod_of_the_sea',
              name: '§6Rod of the Sea',
              rawName: 'Rod of the Sea',
              slot: 'rod',
              rarity: 'LEGENDARY',
              lore: [
                '§6Rod of the Sea',
                '§7Fishing Speed: §b+75',
                '§7Sea Creature Chance: §3+10%',
                '§7Treasure Chance: §6+3%',
                '§6§lLEGENDARY FISHING ROD',
              ],
              stats: { scc: 10, fishingSpeed: 75, treasureChance: 3, fishingWisdom: 0 },
              texture: '/assets/minecraft/fishing_rod.png',
            });
          }

          // Check for Shark Scale armor in backpacks
          const sharkPieces = allStorageItems
            .filter((it) =>
              /shark.*(helmet|chestplate|leggings|boots)/i.test(it.tag?.display?.Name || '')
            )
            .map((it) => {
              const name = (it.tag?.display?.Name || '').toLowerCase();
              const slot = /helmet/i.test(name)
                ? 'helmet'
                : /chestplate/i.test(name)
                  ? 'chest'
                  : /leggings/i.test(name)
                    ? 'legs'
                    : 'boots';
              return formatSkyblockItem(it, slot);
            });

          const armorSets = [equippedArmorSet];

          if (sharkPieces.length >= 4) {
            const sHelmet = sharkPieces.find((p) => p.slot === 'helmet') || sharkPieces[0];
            const sChest = sharkPieces.find((p) => p.slot === 'chest') || sharkPieces[1];
            const sLegs = sharkPieces.find((p) => p.slot === 'legs') || sharkPieces[2];
            const sBoots = sharkPieces.find((p) => p.slot === 'boots') || sharkPieces[3];

            armorSets.push({
              id: 'set_shark_scale',
              name: 'Submerged Shark Scale Set (Storage)',
              pieces: [sHelmet, sChest, sLegs, sBoots],
              totalSCC: 13.6,
              totalSpeed: 30,
            });
          }

          // 2.5 Extract all fishing pets
          const fishingPets = extractFishingPets(memberData?.pets_data?.pets || []);
          const activePet = fishingPets.find((p) => p.active) || fishingPets[0];
          const activeRod = allRods[0];

          // 2.6 Calculate combined stats with active gear
          const calculatedSCC = Math.min(
            100,
            Math.round(
              50 +
                fishingLevel * 0.4 +
                (equippedArmorSet.totalSCC || 0) +
                (activeRod.stats?.scc || 0) +
                (activePet.stats?.scc || 0)
            )
          );

          const calculatedSpeed = Math.min(
            350,
            Math.round(
              140 +
                fishingLevel * 1.2 +
                (equippedArmorSet.totalSpeed || 0) +
                (activeRod.stats?.fishingSpeed || 0) +
                (activePet.stats?.fishingSpeed || 0)
            )
          );

          const calculatedTreasure = 12 + (activeRod.stats?.treasureChance || 0);
          const calculatedWisdom = 30 + (activePet.stats?.fishingWisdom || 0);

          return res.json({
            success: true,
            username: mojangData.name || nickname,
            uuid: mojangData.uuid,
            profile: activeProfile.cute_name || profileName,
            profilesList: profileNames,
            source: 'Hypixel Public API (Live)',
            armorSets,
            allRods,
            fishingPets,
            activeEquipment: {
              selectedArmorSetId: equippedArmorSet.id,
              selectedRodId: activeRod.id,
              selectedPetId: activePet.id,
            },
            stats: {
              purse,
              bank,
              scc: calculatedSCC,
              fishingSpeed: calculatedSpeed,
              treasureChance: calculatedTreasure,
              fishingWisdom: calculatedWisdom,
              fishingLevel,
              progressPercent,
              rawExp,
            },
            armor: equippedArmorSet.pieces,
            rod: activeRod,
            pet: activePet,
          });
        }
      }
    } catch (err) {
      console.warn('[PlayerController] Live Hypixel fetch fallback:', err.message);
    }
  }

  // 3. Fallback for custom search
  const fallbackArmor = [
    {
      slot: 'helmet',
      name: "Diver's Mask",
      rawName: "Diver's Mask",
      meta: 'Wise · Growth V',
      texture: '/assets/minecraft/diamond_helmet.png',
      stats: { scc: 3, fishingSpeed: 10 },
      lore: ["Diver's Mask", '§7Sea Creature Chance: §3+3%'],
    },
    {
      slot: 'chest',
      name: "Diver's Shirt",
      rawName: "Diver's Shirt",
      meta: 'Wise · Growth V',
      texture: '/assets/minecraft/diamond_chestplate.png',
      stats: { scc: 3, fishingSpeed: 10 },
      lore: ["Diver's Shirt", '§7Sea Creature Chance: §3+3%'],
    },
    {
      slot: 'legs',
      name: "Diver's Trunks",
      rawName: "Diver's Trunks",
      meta: 'Wise · Growth V',
      texture: '/assets/minecraft/diamond_leggings.png',
      stats: { scc: 3, fishingSpeed: 10 },
      lore: ["Diver's Trunks", '§7Sea Creature Chance: §3+3%'],
    },
    {
      slot: 'boots',
      name: "Diver's Boots",
      rawName: "Diver's Boots",
      meta: 'Wise · Growth V',
      texture: '/assets/minecraft/diamond_boots.png',
      stats: { scc: 3, fishingSpeed: 10 },
      lore: ["Diver's Boots", '§7Sea Creature Chance: §3+3%'],
    },
  ];

  const fallbackRod = {
    id: 'fallback_rod',
    name: 'Rod of the Sea',
    rawName: 'Rod of the Sea',
    meta: 'Expertise V · Salty',
    slot: 'rod',
    texture: '/assets/minecraft/fishing_rod.png',
    stats: { scc: 10, fishingSpeed: 75, treasureChance: 3 },
    lore: ['Rod of the Sea', '§7Fishing Speed: §b+75', '§7Sea Creature Chance: §3+10%'],
  };

  const fallbackPet = {
    id: 'fallback_pet',
    name: 'Dolphin',
    displayName: '[Lvl 80] Dolphin',
    tier: 'EPIC',
    level: 80,
    meta: 'Level 80 · Epic',
    texture:
      'https://mc-heads.net/head/8e4443772f932f2ec52e27e460e0300c7baa803e1cb1cc6f4cf8b6ddb565d33a',
    stats: { scc: 8, fishingSpeed: 20, fishingWisdom: 0 },
    lore: ['[Lvl 80] Dolphin', '§7Sea Creature Chance: §3+8%', '§7Fishing Speed: §b+20'],
  };

  return res.json({
    success: true,
    username: nickname,
    profile: profileName,
    profilesList: ['Lime', 'Coconut', 'Papaya'],
    armorSets: [
      {
        id: 'set_equipped',
        name: "Equipped (Diver's Set)",
        pieces: fallbackArmor,
        totalSCC: 12,
        totalSpeed: 40,
      },
    ],
    allRods: [fallbackRod],
    fishingPets: [fallbackPet],
    activeEquipment: {
      selectedArmorSetId: 'set_equipped',
      selectedRodId: fallbackRod.id,
      selectedPetId: fallbackPet.id,
    },
    stats: {
      purse: 5000000,
      bank: 20000000,
      scc: 72,
      fishingSpeed: 220,
      treasureChance: 15,
      fishingWisdom: 30,
      fishingLevel: 40,
      progressPercent: 42,
    },
    armor: fallbackArmor,
    rod: fallbackRod,
    pet: fallbackPet,
  });
}
