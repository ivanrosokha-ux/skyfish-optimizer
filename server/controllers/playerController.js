import { players } from '../data/mockDb.js';
import { fetchPlayerUuid } from '../services/mojangService.js';
import { getPlayerSkyblockProfiles, calculateSkillLevel } from '../services/hypixelService.js';
import { parseNbtBuffer, formatSkyblockItem } from '../services/nbtParser.js';
import { extractFishingPets } from '../services/petsService.js';

const SKILL_MAX_LEVELS = {
  fishing: 50,
  mining: 60,
  farming: 60,
  combat: 60,
  enchanting: 60,
  taming: 50,
  alchemy: 50,
  foraging: 50,
};

function buildSkillsList(expObj = {}) {
  const definitions = [
    {
      key: 'fishing',
      name: 'Fishing',
      icon: '/assets/minecraft/icons/rod.png',
      defaultExp: 25000000,
      apiKey: 'SKILL_FISHING',
    },
    {
      key: 'mining',
      name: 'Mining',
      icon: '/assets/minecraft/icons/diamond_pickaxe.png',
      defaultExp: 55000000,
      apiKey: 'SKILL_MINING',
    },
    {
      key: 'farming',
      name: 'Farming',
      icon: '/assets/minecraft/icons/golden_hoe.png',
      defaultExp: 35000000,
      apiKey: 'SKILL_FARMING',
    },
    {
      key: 'combat',
      name: 'Combat',
      icon: '/assets/minecraft/icons/diamond_sword.png',
      defaultExp: 75000000,
      apiKey: 'SKILL_COMBAT',
    },
    {
      key: 'enchanting',
      name: 'Enchanting',
      icon: '/assets/minecraft/icons/enchanted_book.png',
      defaultExp: 135372425,
      apiKey: 'SKILL_ENCHANTING',
    },
    {
      key: 'taming',
      name: 'Taming',
      icon: '/assets/minecraft/icons/bone.png',
      defaultExp: 40000000,
      apiKey: 'SKILL_TAMING',
    },
    {
      key: 'alchemy',
      name: 'Alchemy',
      icon: '/assets/minecraft/icons/brewing_stand.png',
      defaultExp: 55172425,
      apiKey: 'SKILL_ALCHEMY',
    },
    {
      key: 'foraging',
      name: 'Foraging',
      icon: '/assets/minecraft/icons/diamond_axe.png',
      defaultExp: 10000000,
      apiKey: 'SKILL_FORAGING',
    },
  ];

  return definitions.map((def) => {
    const rawExp = expObj[def.apiKey] !== undefined ? expObj[def.apiKey] : def.defaultExp;
    const maxLevel = SKILL_MAX_LEVELS[def.key] || 50;
    const info = calculateSkillLevel(rawExp, maxLevel);
    return {
      key: def.key,
      name: def.name,
      icon: def.icon,
      ...info,
    };
  });
}

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
      texture: '/assets/minecraft/pets/dolphin.png',
      stats: { scc: 10, fishingSpeed: 25, fishingWisdom: 0 },
      lore: [
        `§6[Lvl 100] ${data.pet?.name || 'Dolphin'}`,
        '§7Sea Creature Chance: §3+10%',
        '§7Fishing Speed: §b+25',
        '§6§lLEGENDARY PET',
      ],
    };

    const defaultEquipPieces = [
      {
        id: 'mock_necklace',
        name: 'Mangrove Locket',
        rawName: 'Mangrove Locket',
        slot: 'necklace',
        rarity: 'RARE',
        lore: ['Mangrove Locket', '§7Sea Creature Chance: §3+1%', '§7Fishing Speed: §b+5'],
        stats: { scc: 1, fishingSpeed: 5, treasureChance: 0, fishingWisdom: 0 },
        texture: '/assets/minecraft/necklace.png',
      },
      {
        id: 'mock_cloak',
        name: "Strengthened David's Cloak",
        rawName: "Strengthened David's Cloak",
        slot: 'cloak',
        rarity: 'RARE',
        lore: [
          "Strengthened David's Cloak",
          '§7Sea Creature Chance: §3+1%',
          '§7Fishing Speed: §b+5',
        ],
        stats: { scc: 1, fishingSpeed: 5, treasureChance: 0, fishingWisdom: 0 },
        texture: '/assets/minecraft/cloak.png',
      },
      {
        id: 'mock_belt',
        name: 'Moonglade Belt',
        rawName: 'Moonglade Belt',
        slot: 'belt',
        rarity: 'RARE',
        lore: ['Moonglade Belt', '§7Sea Creature Chance: §3+1%', '§7Fishing Speed: §b+5'],
        stats: { scc: 1, fishingSpeed: 5, treasureChance: 0, fishingWisdom: 0 },
        texture: '/assets/minecraft/belt.png',
      },
      {
        id: 'mock_gloves',
        name: 'Mangrove Grippers',
        rawName: 'Mangrove Grippers',
        slot: 'gloves',
        rarity: 'RARE',
        lore: ['Mangrove Grippers', '§7Sea Creature Chance: §3+1%', '§7Fishing Speed: §b+5'],
        stats: { scc: 1, fishingSpeed: 5, treasureChance: 0, fishingWisdom: 0 },
        texture: '/assets/minecraft/gloves.png',
      },
    ];

    const finwaveEquipPieces = [
      {
        id: 'fin_necklace',
        name: 'Ichthyic Necklace',
        rawName: 'Ichthyic Necklace',
        slot: 'necklace',
        rarity: 'EPIC',
        lore: ['§5Ichthyic Necklace', '§7Sea Creature Chance: §3+2.5%', '§7Fishing Speed: §b+12'],
        stats: { scc: 2.5, fishingSpeed: 12, treasureChance: 1, fishingWisdom: 2 },
        texture: '/assets/minecraft/necklace.png',
      },
      {
        id: 'fin_cloak',
        name: 'Finwave Cloak',
        rawName: 'Finwave Cloak',
        slot: 'cloak',
        rarity: 'EPIC',
        lore: ['§5Finwave Cloak', '§7Sea Creature Chance: §3+2.5%', '§7Fishing Speed: §b+12'],
        stats: { scc: 2.5, fishingSpeed: 12, treasureChance: 1, fishingWisdom: 2 },
        texture: '/assets/minecraft/cloak.png',
      },
      {
        id: 'fin_belt',
        name: 'Gillsplash Belt',
        rawName: 'Gillsplash Belt',
        slot: 'belt',
        rarity: 'EPIC',
        lore: ['§5Gillsplash Belt', '§7Sea Creature Chance: §3+2.5%', '§7Fishing Speed: §b+12'],
        stats: { scc: 2.5, fishingSpeed: 12, treasureChance: 1, fishingWisdom: 2 },
        texture: '/assets/minecraft/belt.png',
      },
      {
        id: 'fin_gloves',
        name: 'Glowstone Gauntlet',
        rawName: 'Glowstone Gauntlet',
        slot: 'gloves',
        rarity: 'EPIC',
        lore: ['§5Glowstone Gauntlet', '§7Sea Creature Chance: §3+2.5%', '§7Fishing Speed: §b+12'],
        stats: { scc: 2.5, fishingSpeed: 12, treasureChance: 1, fishingWisdom: 2 },
        texture: '/assets/minecraft/gloves.png',
      },
    ];

    const mockArmorSets = [
      {
        id: 'set_equipped',
        name: `Equipped Set (${defaultArmor[0]?.rawName?.replace(/(Wise|Growth|Pure|Submerged)\s+/i, '') || 'Armor'})`,
        category: 'Equipped',
        pieces: defaultArmor,
        totalSCC: 12,
        totalSpeed: 40,
      },
      {
        id: 'set_shark_scale',
        name: 'Shark Scale Set (Storage)',
        category: 'Fishing',
        pieces: defaultArmor.map((a) => ({
          ...a,
          id: `shark_${a.slot}`,
          rawName: `Shark Scale ${a.slot === 'helmet' ? 'Helmet' : a.slot === 'chest' ? 'Chestplate' : a.slot === 'legs' ? 'Leggings' : 'Boots'}`,
          name: `§6Shark Scale ${a.slot === 'helmet' ? 'Helmet' : a.slot === 'chest' ? 'Chestplate' : a.slot === 'legs' ? 'Leggings' : 'Boots'}`,
          rarity: 'LEGENDARY',
          stats: { scc: 3.4, fishingSpeed: 7.5 },
        })),
        totalSCC: 13.6,
        totalSpeed: 30,
      },
    ];

    const mockEquipmentSets = [
      {
        id: 'equip_active',
        name: 'Active Equipment (Standard)',
        pieces: defaultEquipPieces,
        totalSCC: 4,
        totalSpeed: 20,
      },
      {
        id: 'equip_finwave',
        name: 'Finwave Fishing Equipment (+10% SCC)',
        pieces: finwaveEquipPieces,
        totalSCC: 10,
        totalSpeed: 48,
      },
    ];

    const mockRods = [
      defaultRod,
      {
        id: 'rod_legends',
        rawName: 'Rod of Legends',
        name: '§6Rod of Legends',
        slot: 'rod',
        rarity: 'LEGENDARY',
        lore: [
          '§6Rod of Legends',
          '§7Fishing Speed: §b+70',
          '§7Sea Creature Chance: §3+12%',
          '§6§lLEGENDARY FISHING ROD',
        ],
        stats: { scc: 12, fishingSpeed: 70, treasureChance: 2, fishingWisdom: 0 },
        texture: '/assets/minecraft/fishing_rod.png',
      },
      {
        id: 'rod_lava',
        rawName: 'Chomp Starter Lava Rod',
        name: '§9Chomp Starter Lava Rod',
        slot: 'rod',
        rarity: 'RARE',
        lore: [
          '§9Chomp Starter Lava Rod',
          '§7Fishing Speed: §b+45',
          '§7Sea Creature Chance: §3+5%',
          '§9§lRARE FISHING ROD',
        ],
        stats: { scc: 5, fishingSpeed: 45, treasureChance: 1, fishingWisdom: 0 },
        texture: '/assets/minecraft/fishing_rod.png',
      },
    ];

    return res.json({
      success: true,
      username: localPlayer.username,
      uuid: localPlayer.uuid || 'c06f89064c8a49119c29ea1dbd1aab82',
      profile: matchedProfileName,
      profilesList: Object.keys(localPlayer.profiles),
      armorSets: mockArmorSets,
      equipmentSets: mockEquipmentSets,
      allRods: mockRods,
      fishingPets: [defaultPet],
      skills: buildSkillsList({ SKILL_FISHING: 25000000 }),
      activeEquipment: {
        selectedArmorSetId: 'set_equipped',
        selectedEquipmentSetId: 'equip_active',
        selectedRodId: defaultRod.id,
        selectedPetId: defaultPet.id,
      },
      ...data,
      armor: defaultArmor,
      equipment: defaultEquipPieces,
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

          // 2.1 Currencies & Skills
          const skillsList = buildSkillsList(memberData?.player_data?.experience || {});
          const fishingSkill = skillsList.find((s) => s.key === 'fishing') || {
            level: 1,
            progressPercent: 0,
            rawExp: 0,
          };
          const fishingLevel = fishingSkill.level;
          const progressPercent = fishingSkill.progressPercent;
          const rawExp = fishingSkill.rawExp;
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
              'https://skinrender.dev/render/texture:b2ad235b9458cc26c9dd794a35c1100e1b5bbe4a0c6c3da6ffd4830006683cb9/head',
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

          const formattedStorageItems = allStorageItems
            .map((it) => formatSkyblockItem(it))
            .filter(Boolean);

          const knownFamilies = [
            {
              key: 'shark_scale',
              name: 'Shark Scale Set',
              pattern: /shark\s*scale/i,
              category: 'Fishing',
            },
            {
              key: 'young_dragon',
              name: 'Young Dragon Set',
              pattern: /young\s*dragon/i,
              category: 'Dragon',
            },
            {
              key: 'silver_hunter',
              name: 'Silver Hunter Set',
              pattern: /silver\s*hunter/i,
              category: 'Hunter',
            },
            {
              key: 'thunder',
              name: 'Thunder Armor Set',
              pattern: /thunder|terror/i,
              category: 'Fishing',
            },
            { key: 'diver', name: "Diver's Armor Set", pattern: /diver/i, category: 'Fishing' },
            { key: 'sponge', name: 'Sponge Armor Set', pattern: /sponge/i, category: 'Fishing' },
            { key: 'angler', name: 'Angler Armor Set', pattern: /angler/i, category: 'Fishing' },
          ];

          const armorSets = [equippedArmorSet];

          for (const fam of knownFamilies) {
            const matches = formattedStorageItems.filter((it) =>
              fam.pattern.test(it.rawName || it.name || '')
            );
            if (matches.length >= 2) {
              const helm =
                matches.find((m) => /helmet|head|mask|cap/i.test(m.rawName || m.slot)) ||
                matches[0];
              const chest =
                matches.find((m) => /chestplate|tunic|shirt/i.test(m.rawName || m.slot)) ||
                matches[1];
              const legs =
                matches.find((m) => /leggings|pants|trunks/i.test(m.rawName || m.slot)) ||
                matches[2];
              const boots = matches.find((m) => /boots/i.test(m.rawName || m.slot)) || matches[3];
              const pieces = [helm, chest, legs, boots].filter(Boolean);
              const totalSCC = pieces.reduce((sum, p) => sum + (p?.stats?.scc || 0), 0);
              const totalSpeed = pieces.reduce((sum, p) => sum + (p?.stats?.fishingSpeed || 0), 0);

              armorSets.push({
                id: `set_${fam.key}`,
                name: `${fam.name} (Storage)`,
                category: fam.category,
                pieces,
                totalSCC: Math.round(totalSCC * 10) / 10,
                totalSpeed: Math.round(totalSpeed),
              });
            }
          }

          // 2.5 Parse Equipment (Necklace, Cloak, Belt, Gloves)
          const rawEquip = await parseNbtBuffer(memberData?.inventory?.equipment_contents?.data);
          const equipSlots = ['necklace', 'cloak', 'belt', 'gloves'];
          const liveEquipPieces = rawEquip.map((it, idx) =>
            formatSkyblockItem(it, equipSlots[idx] || 'equipment')
          );

          const liveNecklace = liveEquipPieces[0] || {
            id: 'live_necklace',
            name: 'Mangrove Locket',
            rawName: 'Mangrove Locket',
            slot: 'necklace',
            rarity: 'RARE',
            stats: { scc: 1, fishingSpeed: 5 },
            texture: '/assets/minecraft/necklace.png',
            lore: ['Mangrove Locket', '§7Equipped Necklace'],
          };
          const liveCloak = liveEquipPieces[1] || {
            id: 'live_cloak',
            name: "Strengthened David's Cloak",
            rawName: "Strengthened David's Cloak",
            slot: 'cloak',
            rarity: 'RARE',
            stats: { scc: 1, fishingSpeed: 5 },
            texture: '/assets/minecraft/cloak.png',
            lore: ["Strengthened David's Cloak", '§7Equipped Cloak'],
          };
          const liveBelt = liveEquipPieces[2] || {
            id: 'live_belt',
            name: 'Moonglade Belt',
            rawName: 'Moonglade Belt',
            slot: 'belt',
            rarity: 'RARE',
            stats: { scc: 1, fishingSpeed: 5 },
            texture: '/assets/minecraft/belt.png',
            lore: ['Moonglade Belt', '§7Equipped Belt'],
          };
          const liveGloves = liveEquipPieces[3] || {
            id: 'live_gloves',
            name: 'Mangrove Grippers',
            rawName: 'Mangrove Grippers',
            slot: 'gloves',
            rarity: 'RARE',
            stats: { scc: 1, fishingSpeed: 5 },
            texture: '/assets/minecraft/gloves.png',
            lore: ['Mangrove Grippers', '§7Equipped Grippers'],
          };

          const equippedEquipSet = {
            id: 'equip_active',
            name: 'Active Equipment (Equipped)',
            pieces: [liveNecklace, liveCloak, liveBelt, liveGloves],
            totalSCC:
              (liveNecklace.stats?.scc || 0) +
              (liveCloak.stats?.scc || 0) +
              (liveBelt.stats?.scc || 0) +
              (liveGloves.stats?.scc || 0),
            totalSpeed:
              (liveNecklace.stats?.fishingSpeed || 0) +
              (liveCloak.stats?.fishingSpeed || 0) +
              (liveBelt.stats?.fishingSpeed || 0) +
              (liveGloves.stats?.fishingSpeed || 0),
          };

          const finwaveEquipSet = {
            id: 'equip_finwave',
            name: 'Finwave Fishing Equipment (+10% SCC)',
            pieces: [
              {
                id: 'fin_necklace',
                name: '§5Ichthyic Necklace',
                rawName: 'Ichthyic Necklace',
                slot: 'necklace',
                rarity: 'EPIC',
                stats: { scc: 2.5, fishingSpeed: 12 },
                texture: '/assets/minecraft/necklace.png',
                lore: ['§5Ichthyic Necklace', '§7Sea Creature Chance: §3+2.5%'],
              },
              {
                id: 'fin_cloak',
                name: '§5Finwave Cloak',
                rawName: 'Finwave Cloak',
                slot: 'cloak',
                rarity: 'EPIC',
                stats: { scc: 2.5, fishingSpeed: 12 },
                texture: '/assets/minecraft/cloak.png',
                lore: ['§5Finwave Cloak', '§7Sea Creature Chance: §3+2.5%'],
              },
              {
                id: 'fin_belt',
                name: '§5Gillsplash Belt',
                rawName: 'Gillsplash Belt',
                slot: 'belt',
                rarity: 'EPIC',
                stats: { scc: 2.5, fishingSpeed: 12 },
                texture: '/assets/minecraft/belt.png',
                lore: ['§5Gillsplash Belt', '§7Sea Creature Chance: §3+2.5%'],
              },
              {
                id: 'fin_gloves',
                name: '§5Glowstone Gauntlet',
                rawName: 'Glowstone Gauntlet',
                slot: 'gloves',
                rarity: 'EPIC',
                stats: { scc: 2.5, fishingSpeed: 12 },
                texture: '/assets/minecraft/gloves.png',
                lore: ['§5Glowstone Gauntlet', '§7Sea Creature Chance: §3+2.5%'],
              },
            ],
            totalSCC: 10,
            totalSpeed: 48,
          };
          const equipmentSets = [equippedEquipSet, finwaveEquipSet];

          // 2.6 Extract all fishing pets
          const fishingPets = extractFishingPets(memberData?.pets_data?.pets || []);
          const activePet = fishingPets.find((p) => p.active) || fishingPets[0];
          const activeRod = allRods[0];

          // 2.7 Calculate combined stats with active gear
          const calculatedSCC = Math.min(
            100,
            Math.round(
              50 +
                fishingLevel * 0.4 +
                (equippedArmorSet.totalSCC || 0) +
                (equippedEquipSet.totalSCC || 0) +
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
                (equippedEquipSet.totalSpeed || 0) +
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
            equipmentSets,
            allRods,
            fishingPets,
            skills: skillsList,
            activeEquipment: {
              selectedArmorSetId: equippedArmorSet.id,
              selectedEquipmentSetId: equippedEquipSet.id,
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
            equipment: equippedEquipSet.pieces,
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

  const fallbackEquipPieces = [
    {
      id: 'fb_necklace',
      name: 'Mangrove Locket',
      rawName: 'Mangrove Locket',
      slot: 'necklace',
      rarity: 'RARE',
      stats: { scc: 1, fishingSpeed: 5 },
      texture: '/assets/minecraft/necklace.png',
      lore: ['Mangrove Locket', '§7Equipped Necklace'],
    },
    {
      id: 'fb_cloak',
      name: "Strengthened David's Cloak",
      rawName: "Strengthened David's Cloak",
      slot: 'cloak',
      rarity: 'RARE',
      stats: { scc: 1, fishingSpeed: 5 },
      texture: '/assets/minecraft/cloak.png',
      lore: ["Strengthened David's Cloak", '§7Equipped Cloak'],
    },
    {
      id: 'fb_belt',
      name: 'Moonglade Belt',
      rawName: 'Moonglade Belt',
      slot: 'belt',
      rarity: 'RARE',
      stats: { scc: 1, fishingSpeed: 5 },
      texture: '/assets/minecraft/belt.png',
      lore: ['Moonglade Belt', '§7Equipped Belt'],
    },
    {
      id: 'fb_gloves',
      name: 'Mangrove Grippers',
      rawName: 'Mangrove Grippers',
      slot: 'gloves',
      rarity: 'RARE',
      stats: { scc: 1, fishingSpeed: 5 },
      texture: '/assets/minecraft/gloves.png',
      lore: ['Mangrove Grippers', '§7Equipped Grippers'],
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
    texture: '/assets/minecraft/pets/dolphin.png',
    stats: { scc: 8, fishingSpeed: 20, fishingWisdom: 0 },
    lore: ['[Lvl 80] Dolphin', '§7Sea Creature Chance: §3+8%', '§7Fishing Speed: §b+20'],
  };

  return res.json({
    success: true,
    username: nickname,
    uuid: '61637e2ed73445769e257e97652d8007',
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
      {
        id: 'set_shark',
        name: 'Shark Scale Set (+13.6% SCC)',
        pieces: fallbackArmor,
        totalSCC: 13.6,
        totalSpeed: 30,
      },
    ],
    equipmentSets: [
      {
        id: 'equip_active',
        name: 'Active Equipment (Standard)',
        pieces: fallbackEquipPieces,
        totalSCC: 4,
        totalSpeed: 20,
      },
      {
        id: 'equip_finwave',
        name: 'Finwave Fishing Equipment (+10% SCC)',
        pieces: fallbackEquipPieces,
        totalSCC: 10,
        totalSpeed: 48,
      },
    ],
    allRods: [fallbackRod],
    fishingPets: [fallbackPet],
    skills: buildSkillsList({}),
    activeEquipment: {
      selectedArmorSetId: 'set_equipped',
      selectedEquipmentSetId: 'equip_active',
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
    equipment: fallbackEquipPieces,
    rod: fallbackRod,
    pet: fallbackPet,
  });
}
