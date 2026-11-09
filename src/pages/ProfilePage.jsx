import { useEffect, useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { player } = useParams();
  const navigate = useNavigate();
  const { username, profile, stats, setUsername } = usePlayerStore();
  const [searchInput, setSearchInput] = useState(player || username);

  useEffect(() => {
    if (player && player !== username) {
      setUsername(player);
      setSearchInput(player);
    }
  }, [player, username, setUsername]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setUsername(searchInput.trim());
      navigate(`/profile/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className={styles.container}>
      {/* Title */}
      <div>
        <h1 className={styles.title}>
          Fishing stats for <span className={styles.accent}>{username}</span> on{' '}
          <span className={styles.accent}>{profile}</span>
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
          <button className={styles.pillActive}>
            <span>✓</span> Lime
          </button>
          <button className={styles.pill}>Coconut</button>
          <button className={styles.pill}>Papaya</button>
        </div>
      </div>

      {/* Main 2-column Grid: Armor & Stats */}
      <div className={styles.mainGrid}>
        {/* Armor & Gear Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Armor</h2>
            <div className={styles.tabGroup}>
              <button className={styles.tabBtnActive}>Gear</button>
              <button className={styles.tabBtn}>Pets</button>
              <button className={styles.tabBtn}>Stats</button>
            </div>
          </div>

          {/* 4 Armor Pieces Grid */}
          <div className={styles.armorGrid}>
            {[
              { slot: 'helmet', name: "Diver's Mask", icon: '⛑️' },
              { slot: 'chest', name: "Diver's Shirt", icon: '👕' },
              { slot: 'legs', name: "Diver's Trunks", icon: '🛡️' },
              { slot: 'boots', name: "Diver's Boots", icon: '🥾' },
            ].map((item) => (
              <div key={item.name} className={styles.armorItem}>
                <div className={styles.armorIcon}>{item.icon}</div>
                <div>
                  <div className={styles.armorName}>{item.name}</div>
                  <div className={styles.armorMeta}>Wise · Growth V</div>
                </div>
              </div>
            ))}
          </div>

          {/* Rod & Pet Row */}
          <div className={styles.weaponGrid}>
            <div className={styles.weaponItem}>
              <div className={styles.armorIcon}>🎣</div>
              <div>
                <div className={styles.armorName}>Rod of the Sea</div>
                <div className={styles.armorMeta}>Expertise V · Salty</div>
              </div>
            </div>

            <div className={styles.weaponItem}>
              <div className={styles.armorIcon}>🐬</div>
              <div>
                <div className={styles.armorName}>Dolphin</div>
                <div className={styles.armorMeta}>Level 80 · Epic</div>
              </div>
            </div>
          </div>
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
              <div className={styles.statValueMono}>{stats.purse.toLocaleString()}</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Bank</div>
              <div className={styles.statValueMono}>{stats.bank.toLocaleString()}</div>
            </div>
          </div>

          {/* Big Stats: SCC & Fishing Speed */}
          <div className={styles.stats2Col}>
            <div className={styles.bigStatBox}>
              <span className={`${styles.bigStatIcon} ${styles.gainColor}`}>🐟</span>
              <div className={styles.bigStatTitle}>Sea Creature Chance</div>
              <div className={`${styles.bigStatValue} ${styles.gainColor}`}>
                {stats.scc} <span className={styles.bigStatUnit}>%</span>
              </div>
              <div className={styles.bigStatDesc}>Chance to hook a sea creature</div>
            </div>

            <div className={styles.bigStatBox}>
              <span className={`${styles.bigStatIcon} ${styles.accentColor}`}>⏱️</span>
              <div className={styles.bigStatTitle}>Fishing Speed</div>
              <div className={`${styles.bigStatValue} ${styles.accentColor}`}>
                {stats.fishingSpeed}
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
                {stats.treasureChance} <span className={styles.bigStatUnit}>%</span>
              </div>
              <div className={styles.bigStatDesc}>Chance to find fishing treasure</div>
            </div>

            <div className={styles.bigStatBox}>
              <span className={styles.bigStatIcon}>📖</span>
              <div className={styles.bigStatTitle}>Fishing Wisdom</div>
              <div className={styles.bigStatValue}>{stats.fishingWisdom}</div>
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
            <div className={styles.levelText}>Fishing {stats.fishingLevel}</div>
            <div className={styles.levelXp}>1,240 / 2,500 XP</div>
          </div>
        </div>

        <div className={styles.progressBarWrap}>
          <div className={styles.progressBarTrack}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>
          <span className={styles.progressPercentText}>{stats.progressPercent}% to level 48</span>
        </div>
      </div>

      <div className={styles.syncNotice}>
        Last synced just now · Stats reflect your selected profile and equipped items.
      </div>
    </div>
  );
}
