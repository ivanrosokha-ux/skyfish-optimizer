import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePlayerProfile } from '../hooks/usePlayerProfile';
import { usePlayerStore } from '../store/usePlayerStore';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { player } = useParams();
  const navigate = useNavigate();
  const { stats } = usePlayerStore();
  const { profileData, loading, currentUsername, currentProfile, changeProfile, searchNickname } =
    usePlayerProfile(player || 'ReefRunner', 'Lime');

  const [searchInput, setSearchInput] = useState(player || currentUsername);
  const [activeGearTab, setActiveGearTab] = useState('gear');

  useEffect(() => {
    if (player && player !== currentUsername) {
      searchNickname(player);
      setSearchInput(player);
    }
  }, [player, currentUsername, searchNickname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchNickname(searchInput.trim());
      navigate(`/profile/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const armorItems = profileData?.armor || [
    { slot: 'helmet', name: "Diver's Mask", meta: 'Wise · Growth V', icon: '⛑️' },
    { slot: 'chest', name: "Diver's Shirt", meta: 'Wise · Growth V', icon: '👕' },
    { slot: 'legs', name: "Diver's Trunks", meta: 'Wise · Growth V', icon: '🛡️' },
    { slot: 'boots', name: "Diver's Boots", meta: 'Wise · Growth V', icon: '🥾' },
  ];

  const rodItem = profileData?.rod || {
    name: 'Rod of the Sea',
    meta: 'Expertise V · Salty',
    icon: '🎣',
  };
  const petItem = profileData?.pet || {
    name: 'Dolphin',
    meta: 'Level 80 · Epic',
    icon: '🐬',
  };
  const profilesList = profileData?.profilesList || ['Lime', 'Coconut', 'Papaya'];

  return (
    <div className={styles.container}>
      {/* Title */}
      <div>
        <h1 className={styles.title}>
          Fishing stats for <span className={styles.accent}>{currentUsername}</span> on{' '}
          <span className={styles.accent}>{currentProfile}</span>
          {loading && <span className={styles.cardSubtitle}> (Оновлення...)</span>}
        </h1>
        <p className={styles.subtitle}>Your gear, your stats. A clearer path to your next catch.</p>
      </div>

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
                Pets
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
              {/* 4 Armor Pieces Grid */}
              <div className={styles.armorGrid}>
                {armorItems.map((item) => (
                  <div key={item.slot || item.name} className={styles.armorItem}>
                    <div className={styles.armorIcon}>{item.icon}</div>
                    <div>
                      <div className={styles.armorName}>{item.name}</div>
                      <div className={styles.armorMeta}>{item.meta}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rod & Pet Row */}
              <div className={styles.weaponGrid}>
                <div className={styles.weaponItem}>
                  <div className={styles.armorIcon}>{rodItem.icon}</div>
                  <div>
                    <div className={styles.armorName}>{rodItem.name}</div>
                    <div className={styles.armorMeta}>{rodItem.meta}</div>
                  </div>
                </div>

                <div className={styles.weaponItem}>
                  <div className={styles.armorIcon}>{petItem.icon}</div>
                  <div>
                    <div className={styles.armorName}>{petItem.name}</div>
                    <div className={styles.armorMeta}>{petItem.meta}</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeGearTab === 'pets' && (
            <div className={styles.petDetailCard}>
              <div className={styles.petHeader}>
                <span className={styles.petLargeIcon}>{petItem.icon}</span>
                <div>
                  <div className={styles.petFullName}>{petItem.name}</div>
                  <div className={styles.petRarity}>{petItem.meta}</div>
                </div>
              </div>
              <div className={styles.perksList}>
                <div className={styles.perkItem}>
                  <span className={styles.perkBullet}>🐟</span>
                  <span>Pod Finder: +25% Sea Creature spawn rate in groups</span>
                </div>
                <div className={styles.perkItem}>
                  <span className={styles.perkBullet}>⏱️</span>
                  <span>Wave Speed: +15 Fishing Speed when surrounded by water</span>
                </div>
                <div className={styles.perkItem}>
                  <span className={styles.perkBullet}>🍀</span>
                  <span>Held Item: Lucky Clover (+7% Sea Creature Chance)</span>
                </div>
              </div>
            </div>
          )}

          {activeGearTab === 'stats' && (
            <div className={styles.gearStatsTable}>
              <div className={styles.statBreakRow}>
                <span>Armor Base SCC</span>
                <span className={styles.gainText}>+32% SCC</span>
              </div>
              <div className={styles.statBreakRow}>
                <span>Submerged Reforges</span>
                <span className={styles.gainText}>+8% SCC</span>
              </div>
              <div className={styles.statBreakRow}>
                <span>Rod Enchantments & Reforge</span>
                <span className={styles.gainText}>+14% SCC</span>
              </div>
              <div className={styles.statBreakRow}>
                <span>Pet Bonus & Item</span>
                <span className={styles.gainText}>+10% SCC</span>
              </div>
              <div className={styles.statBreakRowTotal}>
                <span>Total Equipped SCC</span>
                <span className={styles.gainTextTotal}>{stats.scc || 64}%</span>
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
                {stats.scc || 64} <span className={styles.bigStatUnit}>%</span>
              </div>
              <div className={styles.bigStatDesc}>Chance to hook a sea creature</div>
            </div>

            <div className={styles.bigStatBox}>
              <span className={`${styles.bigStatIcon} ${styles.accentColor}`}>⏱️</span>
              <div className={styles.bigStatTitle}>Fishing Speed</div>
              <div className={`${styles.bigStatValue} ${styles.accentColor}`}>
                {stats.fishingSpeed || 180}
              </div>
              <div className={styles.bigStatDesc}>Reduces time between catches</div>
            </div>
          </div>

          {/* Treasure Chance & Fishing Wisdom */}
          <div className={styles.stats2Col}>
            <div className={styles.bigStatBox}>
              <span className={`${styles.bigStatIcon} ${styles.goldColor}`}>💎</span>
              <div className={styles.bigStatTitle}>Treasure Chance</div>
              <div className={styles.bigStatValue}>
                {stats.treasureChance || 12} <span className={styles.bigStatUnit}>%</span>
              </div>
              <div className={styles.bigStatDesc}>Chance to find fishing treasure</div>
            </div>

            <div className={styles.bigStatBox}>
              <span className={styles.bigStatIcon}>📖</span>
              <div className={styles.bigStatTitle}>Fishing Wisdom</div>
              <div className={styles.bigStatValue}>{stats.fishingWisdom || 30}</div>
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
            <div className={styles.levelText}>Fishing {stats.fishingLevel || 47}</div>
            <div className={styles.levelXp}>1,240 / 2,500 XP</div>
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
            {stats.progressPercent || 50}% to level 48
          </span>
        </div>
      </div>

      <div className={styles.syncNotice}>
        Last synced just now · Stats reflect your selected profile and equipped items.
      </div>
    </div>
  );
}
