import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePlayerProfile } from '../hooks/usePlayerProfile';
import { usePlayerStore } from '../store/usePlayerStore';
import MinecraftItem from '../components/minecraft/MinecraftItem';
import { renderMinecraftText } from '../utils/minecraftText';
import styles from './ProfilePage.module.css';

function formatExp(num) {
  if (num === undefined || num === null) return '0';
  const val = Number(num);
  if (isNaN(val)) return '0';
  if (val >= 1000000000) return (val / 1000000000).toFixed(2) + 'B';
  if (val >= 1000000) return (val / 1000000).toFixed(2) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
  return Math.round(val).toLocaleString();
}

export default function ProfilePage() {
  const { player } = useParams();
  const navigate = useNavigate();
  const { username: savedUsername, profile: savedProfile, stats } = usePlayerStore();

  const storedSavedNick =
    typeof window !== 'undefined' ? localStorage.getItem('skyfish_saved_nickname') : null;
  const targetNickname = player || storedSavedNick || savedUsername || 'ReefRunner';
  const targetProfile = savedProfile || 'Lime';

  const {
    profileData,
    loading,
    error,
    currentUsername,
    currentProfile,
    changeProfile,
    searchNickname,
  } = usePlayerProfile(targetNickname, targetProfile);

  const [searchInput, setSearchInput] = useState(player || currentUsername);

  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const hash = (window.location.hash || '').toLowerCase();
      if (hash === '#skills') return 'skills';
      if (hash === '#pets') return 'pets';
      if (hash === '#stats' || hash === '#breakdown') return 'stats';
    }
    return 'gear';
  };
  const [activeGearTab, setActiveGearTab] = useState(getInitialTab);

  useEffect(() => {
    const handleHash = () => {
      const hash = (window.location.hash || '').toLowerCase();
      if (hash === '#skills') setActiveGearTab('skills');
      else if (hash === '#pets') setActiveGearTab('pets');
      else if (hash === '#gear') setActiveGearTab('gear');
      else if (hash === '#stats' || hash === '#breakdown') setActiveGearTab('stats');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleTabChange = (tab) => {
    setActiveGearTab(tab);
    if (typeof window !== 'undefined') {
      const hash =
        tab === 'skills'
          ? '#Skills'
          : tab === 'pets'
            ? '#Pets'
            : tab === 'stats'
              ? '#Breakdown'
              : '#Gear';
      window.history.replaceState(null, '', hash);
    }
  };

  // Gear selections
  const [selectedArmorSetId, setSelectedArmorSetId] = useState('');
  const [selectedEquipmentSetId, setSelectedEquipmentSetId] = useState('');
  const [selectedRodId, setSelectedRodId] = useState('');
  const [selectedPetId, setSelectedPetId] = useState('');
  const lastLoadedProfileKey = useRef('');

  // Keep search input synced when URL route changes
  useEffect(() => {
    if (player) {
      setSearchInput(player);
    }
  }, [player]);

  // Synchronize equipment selections ONLY when player/profile genuinely changes
  useEffect(() => {
    if (profileData) {
      const profileKey = `${profileData.username || ''}:${profileData.profile || ''}`;
      if (lastLoadedProfileKey.current !== profileKey) {
        lastLoadedProfileKey.current = profileKey;
        if (profileData.armorSets?.length) {
          setSelectedArmorSetId(
            profileData.activeEquipment?.selectedArmorSetId || profileData.armorSets[0].id
          );
        }
        if (profileData.equipmentSets?.length) {
          setSelectedEquipmentSetId(
            profileData.activeEquipment?.selectedEquipmentSetId || profileData.equipmentSets[0].id
          );
        }
        if (profileData.allRods?.length) {
          setSelectedRodId(profileData.activeEquipment?.selectedRodId || profileData.allRods[0].id);
        }
        if (profileData.fishingPets?.length) {
          setSelectedPetId(
            profileData.activeEquipment?.selectedPetId || profileData.fishingPets[0].id
          );
        }
      }
    }
  }, [profileData]);

  const handleSearch = (e) => {
    e.preventDefault();
    const clean = searchInput.trim();
    if (clean) {
      searchNickname(clean);
      navigate(`/profile/${encodeURIComponent(clean)}`);
    }
  };

  // 1. Armor Resolution
  const armorSets = profileData?.armorSets || [];
  const activeArmorSet = armorSets.find((s) => s.id === selectedArmorSetId) || armorSets[0];
  const armorItems = activeArmorSet?.pieces ||
    profileData?.armor || [
      {
        slot: 'helmet',
        name: "Diver's Mask",
        rawName: "Diver's Mask",
        meta: 'Wise · Growth V',
        texture: '/assets/minecraft/diamond_helmet.png',
        stats: { scc: 3, fishingSpeed: 10 },
      },
      {
        slot: 'chest',
        name: "Diver's Shirt",
        rawName: "Diver's Shirt",
        meta: 'Wise · Growth V',
        texture: '/assets/minecraft/diamond_chestplate.png',
        stats: { scc: 3, fishingSpeed: 10 },
      },
      {
        slot: 'legs',
        name: "Diver's Trunks",
        rawName: "Diver's Trunks",
        meta: 'Wise · Growth V',
        texture: '/assets/minecraft/diamond_leggings.png',
        stats: { scc: 3, fishingSpeed: 10 },
      },
      {
        slot: 'boots',
        name: "Diver's Boots",
        rawName: "Diver's Boots",
        meta: 'Wise · Growth V',
        texture: '/assets/minecraft/diamond_boots.png',
        stats: { scc: 3, fishingSpeed: 10 },
      },
    ];

  // 2. Equipment Resolution (Necklace, Cloak, Belt, Gloves)
  const equipmentSets = profileData?.equipmentSets || [];
  const activeEquipmentSet =
    equipmentSets.find((s) => s.id === selectedEquipmentSetId) || equipmentSets[0];
  const equipmentItems = activeEquipmentSet?.pieces ||
    profileData?.equipment || [
      {
        slot: 'necklace',
        name: 'Mangrove Locket',
        rawName: 'Mangrove Locket',
        meta: 'Wise · Growth V',
        texture: '/assets/minecraft/necklace.png',
        stats: { scc: 1, fishingSpeed: 5 },
      },
      {
        slot: 'cloak',
        name: "Strengthened David's Cloak",
        rawName: "Strengthened David's Cloak",
        meta: 'Wise · Growth V',
        texture: '/assets/minecraft/cloak.png',
        stats: { scc: 1, fishingSpeed: 5 },
      },
      {
        slot: 'belt',
        name: 'Moonglade Belt',
        rawName: 'Moonglade Belt',
        meta: 'Wise · Growth V',
        texture: '/assets/minecraft/belt.png',
        stats: { scc: 1, fishingSpeed: 5 },
      },
      {
        slot: 'gloves',
        name: 'Mangrove Grippers',
        rawName: 'Mangrove Grippers',
        meta: 'Wise · Growth V',
        texture: '/assets/minecraft/gloves.png',
        stats: { scc: 1, fishingSpeed: 5 },
      },
    ];

  // 3. Rod Resolution
  const allRods = profileData?.allRods || [];
  const activeRod = allRods.find((r) => r.id === selectedRodId) ||
    allRods[0] ||
    profileData?.rod || {
      name: 'Rod of the Sea',
      rawName: 'Rod of the Sea',
      meta: 'Expertise V · Salty',
      texture: '/assets/minecraft/fishing_rod.png',
      stats: { scc: 10, fishingSpeed: 75, treasureChance: 3 },
    };

  // 4. Pet Resolution
  const fishingPets = profileData?.fishingPets || [];
  const activePet = fishingPets.find((p) => p.id === selectedPetId) ||
    fishingPets[0] ||
    profileData?.pet || {
      name: 'Dolphin',
      displayName: '[Lvl 80] Dolphin',
      meta: 'Level 80 · Epic',
      texture: '/assets/minecraft/pets/dolphin.png',
      stats: { scc: 8, fishingSpeed: 20 },
    };

  const profilesList = profileData?.profilesList || ['Lime', 'Coconut', 'Papaya'];

  // Dynamic Real-Time Stats Computation
  const fishingLevel = stats.fishingLevel || profileData?.stats?.fishingLevel || 47;
  const armorSCC =
    activeArmorSet?.totalSCC ??
    (armorItems.reduce((acc, it) => acc + (it.stats?.scc || 0), 0) || 0);
  const armorSpeed =
    activeArmorSet?.totalSpeed ??
    (armorItems.reduce((acc, it) => acc + (it.stats?.fishingSpeed || 0), 0) || 0);

  const equipSCC =
    activeEquipmentSet?.totalSCC ??
    (equipmentItems.reduce((acc, it) => acc + (it.stats?.scc || 0), 0) || 0);
  const equipSpeed =
    activeEquipmentSet?.totalSpeed ??
    (equipmentItems.reduce((acc, it) => acc + (it.stats?.fishingSpeed || 0), 0) || 0);

  const rodSCC = activeRod?.stats?.scc || 0;
  const rodSpeed = activeRod?.stats?.fishingSpeed || 0;
  const rodTreasure = activeRod?.stats?.treasureChance || 0;

  const petSCC = activePet?.stats?.scc || 0;
  const petSpeed = activePet?.stats?.fishingSpeed || 0;
  const petWisdom = activePet?.stats?.fishingWisdom || 0;

  // Base equipment defaults
  const defaultArmorSet =
    armorSets.find(
      (s) => s.id === (profileData?.activeEquipment?.selectedArmorSetId || 'set_equipped')
    ) || armorSets[0];
  const defaultEquipSet =
    equipmentSets.find(
      (s) => s.id === (profileData?.activeEquipment?.selectedEquipmentSetId || 'equip_active')
    ) || equipmentSets[0];
  const defaultRod =
    allRods.find(
      (r) => r.id === (profileData?.activeEquipment?.selectedRodId || profileData?.rod?.id)
    ) || allRods[0];
  const defaultPet =
    fishingPets.find(
      (p) => p.id === (profileData?.activeEquipment?.selectedPetId || profileData?.pet?.id)
    ) || fishingPets[0];

  const defaultArmorSCC =
    defaultArmorSet?.totalSCC ??
    (defaultArmorSet?.pieces?.reduce((acc, it) => acc + (it.stats?.scc || 0), 0) || 0);
  const deltaArmorSCC = armorSCC - defaultArmorSCC;

  const defaultArmorSpeed =
    defaultArmorSet?.totalSpeed ??
    (defaultArmorSet?.pieces?.reduce((acc, it) => acc + (it.stats?.fishingSpeed || 0), 0) || 0);
  const deltaArmorSpeed = armorSpeed - defaultArmorSpeed;

  const defaultEquipSCC =
    defaultEquipSet?.totalSCC ??
    (defaultEquipSet?.pieces?.reduce((acc, it) => acc + (it.stats?.scc || 0), 0) || 0);
  const deltaEquipSCC = equipSCC - defaultEquipSCC;

  const defaultEquipSpeed =
    defaultEquipSet?.totalSpeed ??
    (defaultEquipSet?.pieces?.reduce((acc, it) => acc + (it.stats?.fishingSpeed || 0), 0) || 0);
  const deltaEquipSpeed = equipSpeed - defaultEquipSpeed;

  const deltaRodSCC = rodSCC - (defaultRod?.stats?.scc || 0);
  const deltaRodSpeed = rodSpeed - (defaultRod?.stats?.fishingSpeed || 0);
  const deltaRodTreasure = rodTreasure - (defaultRod?.stats?.treasureChance || 0);

  const deltaPetSCC = petSCC - (defaultPet?.stats?.scc || 0);
  const deltaPetSpeed = petSpeed - (defaultPet?.stats?.fishingSpeed || 0);
  const deltaPetWisdom = petWisdom - (defaultPet?.stats?.fishingWisdom || 0);

  const baseSCC = stats.scc ?? 64;
  const baseSpeed = stats.fishingSpeed ?? 180;
  const baseTreasure = stats.treasureChance ?? 12;
  const baseWisdom = stats.fishingWisdom ?? 30;

  const currentSCC = Math.min(
    100,
    Math.max(
      0,
      Math.round((baseSCC + deltaArmorSCC + deltaEquipSCC + deltaRodSCC + deltaPetSCC) * 10) / 10
    )
  );
  const currentSpeed = Math.min(
    350,
    Math.max(
      0,
      Math.round(baseSpeed + deltaArmorSpeed + deltaEquipSpeed + deltaRodSpeed + deltaPetSpeed)
    )
  );
  const currentTreasure = Math.max(0, Math.round(baseTreasure + deltaRodTreasure));
  const currentWisdom = Math.max(0, Math.round(baseWisdom + deltaPetWisdom));

  const defaultSkills = [
    {
      key: 'fishing',
      name: 'Fishing',
      icon: '/assets/minecraft/icons/rod.png',
      level: fishingLevel,
      progressPercent: stats.progressPercent || 24,
      totalProgressPercent: 81,
      rawExp: stats.rawExp || 44893649,
      xpCurrent: 821224,
      xpForNext: 3400000,
      maxLevel: 50,
    },
    {
      key: 'mining',
      name: 'Mining',
      icon: '/assets/minecraft/icons/diamond_pickaxe.png',
      level: 60,
      progressPercent: 100,
      totalProgressPercent: 100,
      rawExp: 193438795,
      maxLevel: 60,
    },
    {
      key: 'farming',
      name: 'Farming',
      icon: '/assets/minecraft/icons/golden_hoe.png',
      level: 50,
      progressPercent: 42,
      totalProgressPercent: 42,
      rawExp: 56513742,
      maxLevel: 60,
    },
    {
      key: 'combat',
      name: 'Combat',
      icon: '/assets/minecraft/icons/diamond_sword.png',
      level: 59,
      progressPercent: 61,
      totalProgressPercent: 96,
      rawExp: 130325678,
      maxLevel: 60,
    },
    {
      key: 'enchanting',
      name: 'Enchanting',
      icon: '/assets/minecraft/icons/enchanted_book.png',
      level: 60,
      progressPercent: 100,
      totalProgressPercent: 100,
      rawExp: 501542877,
      maxLevel: 60,
    },
    {
      key: 'taming',
      name: 'Taming',
      icon: '/assets/minecraft/icons/bone.png',
      level: 50,
      progressPercent: 100,
      totalProgressPercent: 100,
      rawExp: 40000000,
      maxLevel: 50,
    },
    {
      key: 'alchemy',
      name: 'Alchemy',
      icon: '/assets/minecraft/icons/brewing_stand.png',
      level: 50,
      progressPercent: 100,
      totalProgressPercent: 100,
      rawExp: 55172425,
      maxLevel: 50,
    },
    {
      key: 'foraging',
      name: 'Foraging',
      icon: '/assets/minecraft/icons/diamond_axe.png',
      level: 45,
      progressPercent: 70,
      totalProgressPercent: 70,
      rawExp: 28500000,
      maxLevel: 50,
    },
  ];

  const skillsList = profileData?.skills || defaultSkills;
  const featuredFishing = skillsList.find((s) => s.key === 'fishing') || skillsList[0];
  const secondarySkills = skillsList.filter((s) => s.key !== 'fishing');

  return (
    <div className={styles.container}>
      {/* Title */}
      <div>
        <h1 className={styles.title}>
          Fishing stats for <span className={styles.accent}>{currentUsername}</span> on{' '}
          <span className={styles.accent}>{currentProfile}</span>
          {loading && <span className={styles.cardSubtitle}> (Оновлення...)</span>}
          {profileData?.source && <span className={styles.apiBadge}>● {profileData.source}</span>}
        </h1>
        <p className={styles.subtitle}>Your gear, your stats. A clearer path to your next catch.</p>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span className={styles.errorDot}>!</span>
          <span>{error}</span>
        </div>
      )}

      {/* SkyCrypt-Styled Player Banner */}
      <div className={styles.skycryptBanner}>
        <img
          src={`https://mc-heads.net/avatar/${profileData?.uuid || '61637e2ed73445769e257e97652d8007'}/72`}
          alt={currentUsername}
          className={styles.bannerAvatar}
          onError={(e) => {
            e.target.src = 'https://mc-heads.net/avatar/c06f89064c8a49119c29ea1dbd1aab82/72';
          }}
        />
        <div className={styles.bannerMain}>
          <div className={styles.bannerTitleRow}>
            <span className={styles.bannerIgn}>{currentUsername}</span>
            <span className={styles.rankBadge}>VIP+</span>
            <span className={styles.profileBadge}>
              <span className={styles.profileBadgeDot}>●</span> {currentProfile}
            </span>
            {profileData?.source && (
              <span className={styles.sourceBadge}>● {profileData.source}</span>
            )}
          </div>
          <div className={styles.bannerMetaRow}>
            <div className={styles.currencyChip}>
              <img
                src="/assets/minecraft/icons/coin.png"
                alt="Purse"
                className={styles.chipPixelIcon}
              />
              <span>Purse: {(profileData?.stats?.purse ?? stats.purse ?? 0).toLocaleString()}</span>
            </div>
            <div className={`${styles.currencyChip} ${styles.currencyChipGold}`}>
              <img
                src="/assets/minecraft/icons/bank.png"
                alt="Bank"
                className={styles.chipPixelIcon}
              />
              <span>Bank: {(profileData?.stats?.bank ?? stats.bank ?? 0).toLocaleString()}</span>
            </div>
            <div className={styles.currencyChip}>
              <img
                src="/assets/minecraft/icons/rod.png"
                alt="Fishing"
                className={styles.chipPixelIcon}
              />
              <span>
                Fishing {fishingLevel} (
                {featuredFishing.totalProgressPercent || stats.progressPercent || 50}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar & Profiles */}
      <div className={styles.searchSection}>
        <form onSubmit={handleSearch}>
          <label className={styles.searchLabel}>Minecraft nickname</label>
          <div className={styles.searchBar}>
            <div className={styles.inputWrapper}>
              <svg className={styles.inputIconSvg} viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={styles.searchInput}
                placeholder="ReefRunner"
              />
            </div>
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </div>
        </form>

        {/* Profiles pills */}
        <div className={styles.pillsRow}>
          <span className={styles.pillsLabel}>Profiles</span>
          {profilesList.map((prof) => (
            <button
              key={prof}
              type="button"
              onClick={() => changeProfile(prof)}
              className={prof === currentProfile ? styles.pillActive : styles.pill}
            >
              {prof === currentProfile && <span>✓ </span>}
              {prof}
            </button>
          ))}
        </div>
      </div>

      {/* SkyCrypt Navigation Tabs */}
      <div className={styles.navTabsRow}>
        <button
          type="button"
          onClick={() => handleTabChange('gear')}
          className={activeGearTab === 'gear' ? styles.navTabBtnActive : styles.navTabBtn}
        >
          <img
            src="/assets/minecraft/diamond_chestplate.png"
            alt=""
            className={styles.tabPixelIcon}
          />
          <span>Equipment & Gear</span>
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('skills')}
          className={activeGearTab === 'skills' ? styles.navTabBtnActive : styles.navTabBtn}
        >
          <img src="/assets/minecraft/icons/rod.png" alt="" className={styles.tabPixelIcon} />
          <span>Skills (#Skills)</span>
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('pets')}
          className={activeGearTab === 'pets' ? styles.navTabBtnActive : styles.navTabBtn}
        >
          <img src="/assets/minecraft/pets/dolphin.png" alt="" className={styles.tabPixelIcon} />
          <span>Pets ({fishingPets.length})</span>
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('stats')}
          className={activeGearTab === 'stats' ? styles.navTabBtnActive : styles.navTabBtn}
        >
          <img src="/assets/minecraft/icons/scc.png" alt="" className={styles.tabPixelIcon} />
          <span>Stats Breakdown</span>
        </button>
      </div>

      {activeGearTab === 'skills' ? (
        <div className={styles.skillsSection}>
          {/* Featured Fishing Skill Card */}
          <div className={styles.featuredSkillCard}>
            <div className={styles.featuredSkillHeader}>
              <div className={styles.featuredSkillTitle}>
                {featuredFishing.icon?.startsWith('/') ||
                featuredFishing.icon?.startsWith('http') ? (
                  <img
                    src={featuredFishing.icon}
                    alt={featuredFishing.name}
                    className={styles.featuredSkillIconImg}
                  />
                ) : (
                  <span>{featuredFishing.icon || '🎣'}</span>
                )}
                <span>{featuredFishing.name}</span>
                <span className={styles.featuredSkillLevelBadge}>
                  Level {featuredFishing.level}
                </span>
                {featuredFishing.level >= (featuredFishing.maxLevel || 50) && (
                  <span className={styles.skillMaxBadge}>MAX LEVEL</span>
                )}
              </div>
              <div className={styles.featuredSkillExpRow}>
                <span>Total Experience:</span>
                <span className={styles.featuredSkillExpValues}>
                  {formatExp(featuredFishing.rawExp)} / 55.17M XP (
                  {featuredFishing.totalProgressPercent || 81}%)
                </span>
              </div>
            </div>

            <div>
              <div className={styles.featuredProgressBarTrack}>
                <div
                  className={styles.featuredProgressBarFill}
                  style={{ width: `${featuredFishing.totalProgressPercent || 81}%` }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.375rem',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span>
                  {featuredFishing.level >= (featuredFishing.maxLevel || 50)
                    ? 'Maxed out at Level 50'
                    : `${formatExp(featuredFishing.xpCurrent || 821224)} / ${formatExp(featuredFishing.xpForNext || 3400000)} XP to Level ${featuredFishing.level + 1} (${featuredFishing.progressPercent || 24}%)`}
                </span>
                <span>Progress to 50: {featuredFishing.totalProgressPercent || 81}%</span>
              </div>
            </div>

            <div className={styles.featuredPerksGrid}>
              <div className={styles.perkItem}>
                <span className={styles.perkLabel}>Sea Creature Chance</span>
                <span className={styles.perkValue}>
                  +{(featuredFishing.level * 0.4).toFixed(1)}%
                </span>
              </div>
              <div className={styles.perkItem}>
                <span className={styles.perkLabel}>Fishing Wisdom</span>
                <span className={styles.perkValue}>+{featuredFishing.level}</span>
              </div>
              <div className={styles.perkItem}>
                <span className={styles.perkLabel}>Treasure Chance</span>
                <span className={styles.perkValueGold}>+12.0%</span>
              </div>
              <div className={styles.perkItem}>
                <span className={styles.perkLabel}>Lava & Trophy Fishing</span>
                <span className={styles.perkValue}>Unlocked</span>
              </div>
            </div>
          </div>

          {/* Secondary Skills Grid */}
          <div className={styles.skillsGridTitle}>Other SkyBlock Skills</div>
          <div className={styles.skillsGrid}>
            {secondarySkills.map((s) => {
              const isMax = s.level >= (s.maxLevel || 50);
              return (
                <div key={s.key} className={styles.skillCard}>
                  <div className={styles.skillCardHeader}>
                    <div className={styles.skillCardIconName}>
                      {s.icon?.startsWith('/') || s.icon?.startsWith('http') ? (
                        <img src={s.icon} alt={s.name} className={styles.skillPixelIcon} />
                      ) : (
                        <span>{s.icon}</span>
                      )}
                      <span>{s.name}</span>
                    </div>
                    {isMax ? (
                      <span className={styles.skillMaxBadge}>MAX {s.level}</span>
                    ) : (
                      <span className={styles.skillCardLevelBadge}>Lvl {s.level}</span>
                    )}
                  </div>

                  <div className={styles.skillCardProgressTrack}>
                    <div
                      className={
                        isMax ? styles.skillCardProgressFillMax : styles.skillCardProgressFill
                      }
                      style={{
                        width: `${s.totalProgressPercent || (isMax ? 100 : s.progressPercent)}%`,
                      }}
                    />
                  </div>

                  <div className={styles.skillCardFooter}>
                    <span>{isMax ? 'MAX' : `${s.progressPercent}% to next`}</span>
                    <span>{formatExp(s.rawExp)} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Main 2-column Grid: Armor & Stats */
        <div className={styles.mainGrid}>
          {/* Armor & Gear Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Equipment</h2>
              <div className={styles.tabGroup}>
                <button
                  type="button"
                  onClick={() => handleTabChange('gear')}
                  className={activeGearTab === 'gear' ? styles.tabBtnActive : styles.tabBtn}
                >
                  Gear
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('pets')}
                  className={activeGearTab === 'pets' ? styles.tabBtnActive : styles.tabBtn}
                >
                  Pets ({fishingPets.length})
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('stats')}
                  className={activeGearTab === 'stats' ? styles.tabBtnActive : styles.tabBtn}
                >
                  Breakdown
                </button>
              </div>
            </div>

            {activeGearTab === 'gear' && (
              <>
                {/* Armor Sets Selector (Modern Set Cards UI) */}
                {armorSets.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div className={styles.gearSelectorHeader}>
                      <span className={styles.gearSelectorLabel}>Armor Sets / Wardrobe</span>
                      <span className={styles.petBadgeGain}>
                        +{armorSCC}% SCC · +{armorSpeed} Speed
                      </span>
                    </div>
                    <div className={styles.setCardGrid}>
                      {armorSets.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => setSelectedArmorSetId(s.id)}
                          className={
                            s.id === activeArmorSet?.id ? styles.setCardActive : styles.setCard
                          }
                        >
                          <div className={styles.setCardHeader}>
                            <div className={styles.setCardTitleRow}>
                              <span className={styles.setRadio}>
                                {s.id === activeArmorSet?.id ? '●' : '○'}
                              </span>
                              <span className={styles.setCardName}>{s.name}</span>
                            </div>
                            <div className={styles.setCardBadges}>
                              <span className={styles.badgeGain}>+{s.totalSCC}% SCC</span>
                              <span className={styles.badgeSpeed}>+{s.totalSpeed} Spd</span>
                            </div>
                          </div>
                          <div className={styles.setMiniPieces}>
                            {s.pieces.map((p, pIdx) => (
                              <div
                                key={p.id || pIdx}
                                className={styles.miniPieceSlot}
                                title={p.rawName || p.name}
                              >
                                <img
                                  src={p.texture || '/assets/minecraft/diamond_chestplate.png'}
                                  alt={p.rawName || p.name}
                                  className={styles.miniTexture}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment Set Selector (Modern Set Cards UI) */}
                {equipmentSets.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div className={styles.gearSelectorHeader}>
                      <span className={styles.gearSelectorLabel}>
                        Equipment Set (Necklace / Cloak / Belt / Gloves)
                      </span>
                      <span className={styles.petBadgeGain}>
                        +{equipSCC}% SCC · +{equipSpeed} Speed
                      </span>
                    </div>
                    <div className={styles.setCardGrid}>
                      {equipmentSets.map((eq) => (
                        <div
                          key={eq.id}
                          onClick={() => setSelectedEquipmentSetId(eq.id)}
                          className={
                            eq.id === activeEquipmentSet?.id ? styles.setCardActive : styles.setCard
                          }
                        >
                          <div className={styles.setCardHeader}>
                            <div className={styles.setCardTitleRow}>
                              <span className={styles.setRadio}>
                                {eq.id === activeEquipmentSet?.id ? '●' : '○'}
                              </span>
                              <span className={styles.setCardName}>{eq.name}</span>
                            </div>
                            <div className={styles.setCardBadges}>
                              <span className={styles.badgeGain}>+{eq.totalSCC}% SCC</span>
                              <span className={styles.badgeSpeed}>+{eq.totalSpeed} Spd</span>
                            </div>
                          </div>
                          <div className={styles.setMiniPieces}>
                            {eq.pieces.map((p, pIdx) => (
                              <div
                                key={p.id || pIdx}
                                className={styles.miniPieceSlot}
                                title={p.rawName || p.name}
                              >
                                <img
                                  src={p.texture || '/assets/minecraft/necklace.png'}
                                  alt={p.rawName || p.name}
                                  className={styles.miniTexture}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Rod Selector (Modern Rod Cards UI) */}
                {allRods.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div className={styles.gearSelectorHeader}>
                      <span className={styles.gearSelectorLabel}>Active Fishing Rod</span>
                      <span className={styles.petBadgeGain}>
                        +{rodSCC}% SCC · +{rodSpeed} Speed
                      </span>
                    </div>
                    <div className={styles.rodCardGrid}>
                      {allRods.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => setSelectedRodId(r.id)}
                          className={r.id === activeRod?.id ? styles.rodCardActive : styles.rodCard}
                        >
                          <div className={styles.miniPieceSlot}>
                            <img
                              src={r.texture || '/assets/minecraft/fishing_rod.png'}
                              alt={r.rawName}
                              className={styles.miniTexture}
                            />
                          </div>
                          <div className={styles.rodCardInfo}>
                            <div className={styles.rodCardName}>
                              {renderMinecraftText(r.name || r.rawName)}
                            </div>
                            <div className={styles.rodCardStats}>
                              +{r.stats?.scc || 0}% SCC · +{r.stats?.fishingSpeed || 0} Spd
                            </div>
                          </div>
                          <span className={styles.setRadio}>
                            {r.id === activeRod?.id ? '●' : '○'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4 Armor Pieces Grid */}
                <div className={styles.gearGroupTitle}>Armor (4 pieces)</div>
                <div className={styles.armorGrid}>
                  {armorItems.map((item) => (
                    <div key={item.slot || item.id || item.rawName} className={styles.armorItem}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <MinecraftItem item={item} size="md" />
                          <span
                            style={{
                              fontSize: '0.625rem',
                              color: 'var(--text-muted)',
                              textTransform: 'uppercase',
                            }}
                          >
                            {item.slot}
                          </span>
                        </div>
                        <div>
                          <div className={styles.armorName}>
                            {renderMinecraftText(item.name || item.rawName)}
                          </div>
                          <div className={styles.armorMeta}>
                            {item.stats?.scc
                              ? `+${item.stats.scc}% SCC · +${item.stats.fishingSpeed} Spd`
                              : item.meta || 'Equipped'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4 Equipment Pieces Grid (Necklace, Cloak, Belt, Gloves) */}
                <div className={styles.gearGroupTitle}>Equipment (4 pieces)</div>
                <div className={styles.armorGrid}>
                  {equipmentItems.map((item) => (
                    <div key={item.slot || item.id || item.rawName} className={styles.armorItem}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <MinecraftItem item={item} size="md" />
                          <span
                            style={{
                              fontSize: '0.625rem',
                              color: 'var(--text-muted)',
                              textTransform: 'uppercase',
                            }}
                          >
                            {item.slot}
                          </span>
                        </div>
                        <div>
                          <div className={styles.armorName}>
                            {renderMinecraftText(item.name || item.rawName)}
                          </div>
                          <div className={styles.armorMeta}>
                            {item.stats?.scc
                              ? `+${item.stats.scc}% SCC · +${item.stats.fishingSpeed} Spd`
                              : item.meta || 'Equipped'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rod & Pet Row */}
                <div className={styles.gearGroupTitle}>Active Rod & Pet</div>
                <div className={styles.weaponGrid}>
                  <div className={styles.weaponItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <MinecraftItem item={activeRod} size="md" />
                      <div>
                        <div className={styles.armorName}>
                          {renderMinecraftText(activeRod.name || activeRod.rawName)}
                        </div>
                        <div className={styles.armorMeta}>
                          +{activeRod.stats?.scc || 0}% SCC · +{activeRod.stats?.fishingSpeed || 0}{' '}
                          Spd
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.weaponItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <MinecraftItem item={activePet} size="md" />
                      <div>
                        <div className={styles.armorName}>
                          {renderMinecraftText(activePet.displayName || activePet.name)}
                        </div>
                        <div className={styles.armorMeta}>
                          {activePet.heldItem ||
                            `+${activePet.stats?.scc || 0}% SCC · +${activePet.stats?.fishingSpeed || 0} Spd`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeGearTab === 'pets' && (
              <div className={styles.petsGrid}>
                {fishingPets.map((pet) => {
                  const isSelected = pet.id === activePet?.id;
                  return (
                    <div
                      key={pet.id}
                      onClick={() => setSelectedPetId(pet.id)}
                      className={isSelected ? styles.petCardActive : styles.petCard}
                    >
                      <MinecraftItem item={pet} size="md" />
                      <div className={styles.petInfo}>
                        <div className={styles.petNameRow}>
                          <span className={styles.petItemName}>
                            {renderMinecraftText(pet.displayName || pet.name)}
                          </span>
                          <span className={styles.petBadgeGain}>+{pet.stats?.scc}% SCC</span>
                        </div>
                        <div className={styles.petSubText}>
                          {pet.heldItem
                            ? `Held: ${pet.heldItem}`
                            : `+${pet.stats?.fishingSpeed} Fishing Speed`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeGearTab === 'stats' && (
              <div className={styles.gearStatsTable}>
                <div className={styles.statBreakRow}>
                  <span>Base Skill SCC</span>
                  <span className={styles.gainText}>+{Math.round(fishingLevel * 0.4)}% SCC</span>
                </div>
                <div className={styles.statBreakRow}>
                  <span>Selected Armor Set ({activeArmorSet?.name || 'Equipped'})</span>
                  <span className={styles.gainText}>+{armorSCC}% SCC</span>
                </div>
                <div className={styles.statBreakRow}>
                  <span>Selected Equipment ({activeEquipmentSet?.name || 'Active'})</span>
                  <span className={styles.gainText}>+{equipSCC}% SCC</span>
                </div>
                <div className={styles.statBreakRow}>
                  <span>Active Rod ({activeRod.rawName})</span>
                  <span className={styles.gainText}>+{rodSCC}% SCC</span>
                </div>
                <div className={styles.statBreakRow}>
                  <span>Active Pet ({activePet.name})</span>
                  <span className={styles.gainText}>+{petSCC}% SCC</span>
                </div>
                <div className={styles.statBreakRowTotal}>
                  <span>Total Equipped SCC</span>
                  <span className={styles.gainTextTotal}>{currentSCC}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Fishing Stats Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Fishing stats</h2>
              <Link to="/optimizer" className={styles.linkAccent}>
                Open optimizer →
              </Link>
            </div>

            <div className={styles.statsGrid}>
              <div className={`${styles.statCard} ${styles.statCardSCC}`}>
                <div className={styles.statCardHeader}>
                  <div className={styles.statTitleGroup}>
                    <img
                      src="/assets/minecraft/icons/scc.png"
                      alt="Sea Creature Chance"
                      className={styles.statPixelIcon}
                    />
                    <span className={styles.statLabel}>Sea Creature Chance</span>
                  </div>
                  <span className={`${styles.statSymbolBadge} ${styles.badgeSCC}`}>α</span>
                </div>
                <div className={`${styles.statValue} ${styles.statValueSCC}`}>
                  {currentSCC} <span className={styles.statUnit}>%</span>
                </div>
                <span className={styles.statNote}>Real-time gear bonus applied</span>
              </div>

              <div className={`${styles.statCard} ${styles.statCardSpeed}`}>
                <div className={styles.statCardHeader}>
                  <div className={styles.statTitleGroup}>
                    <img
                      src="/assets/minecraft/icons/fishing_speed.png"
                      alt="Fishing Speed"
                      className={styles.statPixelIcon}
                    />
                    <span className={styles.statLabel}>Fishing Speed</span>
                  </div>
                  <span className={`${styles.statSymbolBadge} ${styles.badgeSpeed}`}>⛯</span>
                </div>
                <div className={`${styles.statValue} ${styles.statValueSpeed}`}>{currentSpeed}</div>
                <span className={styles.statNote}>Active rod + gear bonus</span>
              </div>

              <div className={`${styles.statCard} ${styles.statCardTreasure}`}>
                <div className={styles.statCardHeader}>
                  <div className={styles.statTitleGroup}>
                    <img
                      src="/assets/minecraft/icons/treasure.png"
                      alt="Treasure Chance"
                      className={styles.statPixelIcon}
                    />
                    <span className={styles.statLabel}>Treasure Chance</span>
                  </div>
                  <span className={`${styles.statSymbolBadge} ${styles.badgeTreasure}`}>☘</span>
                </div>
                <div className={`${styles.statValue} ${styles.statValueTreasure}`}>
                  {currentTreasure} <span className={styles.statUnit}>%</span>
                </div>
                <span className={styles.statNote}>Default + enchants</span>
              </div>

              <div className={`${styles.statCard} ${styles.statCardWisdom}`}>
                <div className={styles.statCardHeader}>
                  <div className={styles.statTitleGroup}>
                    <img
                      src="/assets/minecraft/icons/wisdom.png"
                      alt="Fishing Wisdom"
                      className={styles.statPixelIcon}
                    />
                    <span className={styles.statLabel}>Fishing Wisdom</span>
                  </div>
                  <span className={`${styles.statSymbolBadge} ${styles.badgeWisdom}`}>☯</span>
                </div>
                <div className={`${styles.statValue} ${styles.statValueWisdom}`}>
                  +{currentWisdom}
                </div>
                <span className={styles.statNote}>Boosts fishing skill XP</span>
              </div>
            </div>

            {/* Currencies Bar */}
            <div className={styles.currenciesBar}>
              <div className={styles.currencyItem}>
                <img
                  src="/assets/minecraft/icons/coin.png"
                  alt="Purse"
                  className={styles.currencyPixelIcon}
                />
                <div className={styles.currencyItemText}>
                  <span className={styles.currencyLabel}>Purse Coins</span>
                  <span className={styles.currencyValue}>
                    {(stats.purse || 14200000).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className={styles.currencyItem}>
                <img
                  src="/assets/minecraft/icons/bank.png"
                  alt="Bank"
                  className={styles.currencyPixelIcon}
                />
                <div className={styles.currencyItemText}>
                  <span className={styles.currencyLabel}>Bank Balance</span>
                  <span className={styles.currencyValue}>
                    {(stats.bank || 45000000).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.adviceBanner}>
              <div className={styles.adviceHeader}>
                <img
                  src="/assets/minecraft/icons/shard.png"
                  alt="Advice"
                  className={styles.advicePixelIcon}
                />
                <span className={styles.adviceTitle}>Advice</span>
              </div>
              <p className={styles.adviceText}>
                Upgrading to <strong>Shark Scale set</strong> and adding{' '}
                <strong>Angler VI / Expertise X</strong> to your rod gives the highest SCC return
                per coin spent within your current budget.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Progress Bar */}
      <div className={styles.progressCard}>
        <div className={styles.progressInfo}>
          <img
            src="/assets/minecraft/icons/rod.png"
            alt="Fishing"
            className={styles.tabPixelIcon}
          />
          <div>
            <div className={styles.levelText}>Fishing {fishingLevel}</div>
            <div className={styles.levelXp}>
              {stats.rawExp
                ? `${Math.round(stats.rawExp).toLocaleString()} Skill XP`
                : `${stats.progressPercent || 50}% progress`}
            </div>
          </div>
        </div>

        <div className={styles.progressBarWrap}>
          <div className={styles.progressBarTrack}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${stats.progressPercent || 50}%` }}
            />
          </div>
          <span className={styles.progressPercentText}>
            {fishingLevel >= 50
              ? 'Max Level (50)'
              : `${stats.progressPercent || 50}% to level ${fishingLevel + 1}`}
          </span>
        </div>
      </div>

      <div className={styles.syncNotice}>
        <svg
          className={styles.syncNoticeIcon}
          viewBox="0 0 20 20"
          fill="currentColor"
          width="14"
          height="14"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          Data retrieved via Hypixel API and Mojang Services. Cached for 10 minutes to respect
          developer rate limits.
        </span>
      </div>
    </div>
  );
}
