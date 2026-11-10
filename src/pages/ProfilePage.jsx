import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePlayerProfile } from '../hooks/usePlayerProfile';
import { usePlayerStore } from '../store/usePlayerStore';
import MinecraftItem from '../components/minecraft/MinecraftItem';
import { renderMinecraftText } from '../utils/minecraftText';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { player } = useParams();
  const navigate = useNavigate();
  const { stats } = usePlayerStore();
  const {
    profileData,
    loading,
    error,
    currentUsername,
    currentProfile,
    changeProfile,
    searchNickname,
  } = usePlayerProfile(player || 'ReefRunner', 'Lime');

  const [searchInput, setSearchInput] = useState(player || currentUsername);
  const [activeGearTab, setActiveGearTab] = useState('gear');
  const [selectedArmorSetId, setSelectedArmorSetId] = useState('');
  const [selectedRodId, setSelectedRodId] = useState('');
  const [selectedPetId, setSelectedPetId] = useState('');

  useEffect(() => {
    if (player && player !== currentUsername) {
      searchNickname(player);
      setSearchInput(player);
    }
  }, [player, currentUsername, searchNickname]);

  // Synchronize equipment selections when profile data arrives
  useEffect(() => {
    if (profileData) {
      if (profileData.armorSets?.length) {
        setSelectedArmorSetId(
          profileData.activeEquipment?.selectedArmorSetId || profileData.armorSets[0].id
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
  }, [profileData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchNickname(searchInput.trim());
      navigate(`/profile/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Active Gear Resolution
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
      },
      {
        slot: 'chest',
        name: "Diver's Shirt",
        rawName: "Diver's Shirt",
        meta: 'Wise · Growth V',
        texture: '/assets/minecraft/diamond_chestplate.png',
      },
      {
        slot: 'legs',
        name: "Diver's Trunks",
        rawName: "Diver's Trunks",
        meta: 'Wise · Growth V',
        texture: '/assets/minecraft/diamond_leggings.png',
      },
      {
        slot: 'boots',
        name: "Diver's Boots",
        rawName: "Diver's Boots",
        meta: 'Wise · Growth V',
        texture: '/assets/minecraft/diamond_boots.png',
      },
    ];

  const allRods = profileData?.allRods || [];
  const activeRod = allRods.find((r) => r.id === selectedRodId) ||
    allRods[0] ||
    profileData?.rod || {
      name: 'Rod of the Sea',
      rawName: 'Rod of the Sea',
      meta: 'Expertise V · Salty',
      texture: '/assets/minecraft/fishing_rod.png',
    };

  const fishingPets = profileData?.fishingPets || [];
  const activePet = fishingPets.find((p) => p.id === selectedPetId) ||
    fishingPets[0] ||
    profileData?.pet || {
      name: 'Dolphin',
      displayName: '[Lvl 80] Dolphin',
      meta: 'Level 80 · Epic',
      texture:
        'https://mc-heads.net/head/8e4443772f932f2ec52e27e460e0300c7baa803e1cb1cc6f4cf8b6ddb565d33a',
    };

  const profilesList = profileData?.profilesList || ['Lime', 'Coconut', 'Papaya'];

  // Dynamic Real-Time Stats Computation (relative to base active equipment)
  const fishingLevel = stats.fishingLevel || profileData?.stats?.fishingLevel || 47;
  const armorSCC =
    activeArmorSet?.totalSCC ??
    (armorItems.reduce((acc, it) => acc + (it.stats?.scc || 0), 0) || 0);
  const armorSpeed =
    activeArmorSet?.totalSpeed ??
    (armorItems.reduce((acc, it) => acc + (it.stats?.fishingSpeed || 0), 0) || 0);
  const rodSCC = activeRod?.stats?.scc || 0;
  const rodSpeed = activeRod?.stats?.fishingSpeed || 0;
  const rodTreasure = activeRod?.stats?.treasureChance || 0;
  const petSCC = activePet?.stats?.scc || 0;
  const petSpeed = activePet?.stats?.fishingSpeed || 0;
  const petWisdom = activePet?.stats?.fishingWisdom || 0;

  const defaultArmorSet =
    armorSets.find(
      (s) => s.id === (profileData?.activeEquipment?.selectedArmorSetId || 'set_equipped')
    ) || armorSets[0];
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
    Math.max(0, Math.round((baseSCC + deltaArmorSCC + deltaRodSCC + deltaPetSCC) * 10) / 10)
  );
  const currentSpeed = Math.min(
    350,
    Math.max(0, Math.round(baseSpeed + deltaArmorSpeed + deltaRodSpeed + deltaPetSpeed))
  );
  const currentTreasure = Math.max(0, Math.round(baseTreasure + deltaRodTreasure));
  const currentWisdom = Math.max(0, Math.round(baseWisdom + deltaPetWisdom));

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

      {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

      {/* Search Bar & Profiles */}
      <div className={styles.searchSection}>
        <form onSubmit={handleSearch}>
          <label className={styles.searchLabel}>Minecraft nickname</label>
          <div className={styles.searchBar}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🔍</span>
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

      {/* Main 2-column Grid: Armor & Stats */}
      <div className={styles.mainGrid}>
        {/* Armor & Gear Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Equipment</h2>
            <div className={styles.tabGroup}>
              <button
                type="button"
                onClick={() => setActiveGearTab('gear')}
                className={activeGearTab === 'gear' ? styles.tabBtnActive : styles.tabBtn}
              >
                Gear
              </button>
              <button
                type="button"
                onClick={() => setActiveGearTab('pets')}
                className={activeGearTab === 'pets' ? styles.tabBtnActive : styles.tabBtn}
              >
                Pets ({fishingPets.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveGearTab('stats')}
                className={activeGearTab === 'stats' ? styles.tabBtnActive : styles.tabBtn}
              >
                Stats
              </button>
            </div>
          </div>

          {activeGearTab === 'gear' && (
            <>
              {/* Armor Set Selector */}
              {armorSets.length > 1 && (
                <div className={styles.gearSelectorRow}>
                  <div className={styles.gearSelectorHeader}>
                    <span className={styles.gearSelectorLabel}>Armor Set / Wardrobe</span>
                    <span className={styles.petBadgeGain}>
                      +{armorSCC}% SCC · +{armorSpeed} Speed
                    </span>
                  </div>
                  <div className={styles.gearSelectorPills}>
                    {armorSets.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedArmorSetId(s.id)}
                        className={
                          s.id === activeArmorSet?.id ? styles.gearPillActive : styles.gearPill
                        }
                      >
                        {s.id === activeArmorSet?.id && <span>✓ </span>}
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Rod Selector */}
              {allRods.length > 1 && (
                <div className={styles.gearSelectorRow}>
                  <div className={styles.gearSelectorHeader}>
                    <span className={styles.gearSelectorLabel}>Active Fishing Rod</span>
                    <span className={styles.petBadgeGain}>
                      +{rodSCC}% SCC · +{rodSpeed} Speed
                    </span>
                  </div>
                  <div className={styles.gearSelectorPills}>
                    {allRods.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRodId(r.id)}
                        className={r.id === activeRod?.id ? styles.gearPillActive : styles.gearPill}
                      >
                        {r.id === activeRod?.id && <span>✓ </span>}
                        {r.rawName} (+{r.stats?.scc || 0}% SCC)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4 Armor Pieces Grid */}
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

              {/* Rod & Pet Row */}
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
            <span className={styles.cardSubtitle}>With equipped gear</span>
          </div>

          {/* Purse & Bank */}
          <div className={styles.stats2Col}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Purse</div>
              <div className={styles.statValueMono}>{(stats.purse || 0).toLocaleString()}</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Bank</div>
              <div className={styles.statValueMono}>{(stats.bank || 0).toLocaleString()}</div>
            </div>
          </div>

          {/* Big Stats: SCC & Fishing Speed */}
          <div className={styles.stats2Col}>
            <div className={styles.bigStatBox}>
              <span className={`${styles.bigStatIcon} ${styles.gainColor}`}>🐟</span>
              <div className={styles.bigStatTitle}>Sea Creature Chance</div>
              <div className={`${styles.bigStatValue} ${styles.gainColor}`}>
                {currentSCC} <span className={styles.bigStatUnit}>%</span>
              </div>
              <div className={styles.bigStatDesc}>Chance to hook a sea creature</div>
            </div>

            <div className={styles.bigStatBox}>
              <span className={`${styles.bigStatIcon} ${styles.accentColor}`}>⏱️</span>
              <div className={styles.bigStatTitle}>Fishing Speed</div>
              <div className={`${styles.bigStatValue} ${styles.accentColor}`}>{currentSpeed}</div>
              <div className={styles.bigStatDesc}>Reduces time between catches</div>
            </div>
          </div>

          {/* Treasure Chance & Fishing Wisdom */}
          <div className={styles.stats2Col}>
            <div className={styles.bigStatBox}>
              <span className={`${styles.bigStatIcon} ${styles.goldColor}`}>💎</span>
              <div className={styles.bigStatTitle}>Treasure Chance</div>
              <div className={styles.bigStatValue}>
                {currentTreasure} <span className={styles.bigStatUnit}>%</span>
              </div>
              <div className={styles.bigStatDesc}>Chance to find fishing treasure</div>
            </div>

            <div className={styles.bigStatBox}>
              <span className={styles.bigStatIcon}>📖</span>
              <div className={styles.bigStatTitle}>Fishing Wisdom</div>
              <div className={styles.bigStatValue}>{currentWisdom}</div>
              <div className={styles.bigStatDesc}>Boosts fishing experience earned</div>
            </div>
          </div>

          {/* Bottom Link */}
          <div className={styles.linkRow}>
            <span className={styles.cardSubtitle}>Find the best value for your next upgrade.</span>
            <Link to="/optimizer" className={styles.linkAccent}>
              Open optimizer →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className={styles.progressCard}>
        <div className={styles.progressInfo}>
          <span className={styles.progressIcon}>🎣</span>
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
              ? 'Max Level 🌟'
              : `${stats.progressPercent || 50}% to level ${fishingLevel + 1}`}
          </span>
        </div>
      </div>

      <div className={styles.syncNotice}>
        Last synced just now · Stats reflect your selected gear and equipped items.
      </div>
    </div>
  );
}
