import { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import styles from './OptimizerPage.module.css';

export default function OptimizerPage() {
  const { targetStat, setTargetStat, budget, setBudget, addSavedBuild, username, profile } =
    usePlayerStore();
  const [selectedFilters, setSelectedFilters] = useState([
    'Enchantments',
    'Armor',
    'Reforges',
    'Pet',
    'Accessory',
  ]);

  const upgrades = [
    {
      name: 'Angler V',
      note: 'Apply to fishing rod',
      type: 'Enchantment',
      gain: '+1 pp SCC',
      price: 400000,
      costPerStat: '400,000',
    },
    {
      name: 'Submerged',
      note: 'Reforge one armor piece',
      type: 'Reforge',
      gain: '+2 pp SCC',
      price: 1200000,
      costPerStat: '600,000',
    },
    {
      name: 'Deep Sea Orb',
      note: 'Accessory',
      type: 'Accessory',
      gain: '+3 pp SCC',
      price: 2400000,
      costPerStat: '800,000',
    },
    {
      name: 'Shark Scale set',
      note: "Replace Diver's armor",
      type: 'Armor',
      gain: '+4 pp SCC',
      price: 4000000,
      costPerStat: '1,000,000',
    },
    {
      name: 'Ammonite',
      note: 'Level 100 · Replace Dolphin',
      type: 'Pet',
      gain: '+5 pp SCC',
      price: 7500000,
      costPerStat: '1,500,000',
    },
  ];

  const handleSaveBuild = () => {
    addSavedBuild({
      id: Date.now().toString(),
      name: `SCC · 5M plan`,
      scc: 70,
      speed: 180,
    });
    alert('Build saved to your account!');
  };

  return (
    <div className={styles.container}>
      {/* Title & Player Tag */}
      <div className={styles.topBar}>
        <div>
          <h1 className={styles.title}>Optimizer</h1>
          <p className={styles.subtitle}>
            Spend smarter. Rank upgrades by the stats that matter to you.
          </p>
        </div>
        <div className={styles.playerTag}>
          {username} / {profile}
        </div>
      </div>

      {/* Target Stat Switcher & Filter Chips */}
      <div className={styles.controlsSection}>
        <div className={styles.statSwitchRow}>
          {['SCC', 'Fishing Speed', 'Mixed'].map((stat) => (
            <button
              key={stat}
              onClick={() => setTargetStat(stat)}
              className={targetStat === stat ? styles.statBtnActive : styles.statBtn}
            >
              {stat}
            </button>
          ))}
          <span className={styles.sccHint}>SCC = Sea Creature Chance</span>
        </div>

        <div className={styles.filterChips}>
          {['Enchantments', 'Armor', 'Reforges', 'Pet', 'Accessory'].map((filter) => {
            const isSelected = selectedFilters.includes(filter);
            return (
              <button
                key={filter}
                onClick={() =>
                  setSelectedFilters((prev) =>
                    isSelected ? prev.filter((f) => f !== filter) : [...prev, filter]
                  )
                }
                className={isSelected ? styles.filterChipActive : styles.filterChip}
              >
                {isSelected && <span>✓ </span>}
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Optimizer Grid: Table & Budget Calculator */}
      <div className={styles.optimizerGrid}>
        {/* Table (2 cols) */}
        <div className={styles.tableCard}>
          <div>
            <div className={styles.tableHeader}>
              <div>
                <h2 className={styles.cardHeading}>Recommended upgrades</h2>
                <p className={styles.cardSub}>
                  Sorted by lowest cost per +1 percentage point of SCC.
                </p>
              </div>
              <span className={styles.countBadge}>{upgrades.length} upgrades</span>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Upgrade</th>
                    <th className={styles.th}>Type</th>
                    <th className={styles.th}>Stat gain</th>
                    <th className={styles.th}>Price</th>
                    <th className={`${styles.th} ${styles.thRight}`}>Cost per +1 stat</th>
                  </tr>
                </thead>
                <tbody>
                  {upgrades.map((u) => (
                    <tr key={u.name} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.upgradeName}>{u.name}</div>
                        <div className={styles.upgradeNote}>{u.note}</div>
                      </td>
                      <td className={`${styles.td} ${styles.typeText}`}>{u.type}</td>
                      <td className={`${styles.td} ${styles.gainVal}`}>{u.gain}</td>
                      <td className={`${styles.td} ${styles.priceVal}`}>
                        {u.price.toLocaleString()}
                      </td>
                      <td className={`${styles.td} ${styles.tdRight} ${styles.costVal}`}>
                        {u.costPerStat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.tableFootNote}>
            Prices in coins · pp = percentage points · Estimated gains relative to your current
            gear.
          </div>
        </div>

        {/* Budget Calculator (1 col) */}
        <div className={styles.calcCard}>
          <h2 className={styles.cardHeading}>Budget calculator</h2>

          <div className={styles.calcField}>
            <label className={styles.calcLabel}>Your budget</label>
            <div className={styles.inputBox}>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className={styles.numInput}
              />
              <span className={styles.currencyText}>coins</span>
            </div>
            <button className={styles.calcBtn}>Calculate</button>
          </div>

          <div className={styles.purchasesSection}>
            <div className={styles.sectionLabel}>Recommended purchases</div>
            <div className={styles.rowBetween}>
              <span>Angler V</span> <span className={styles.priceVal}>400,000</span>
            </div>
            <div className={styles.rowBetween}>
              <span>Submerged</span> <span className={styles.priceVal}>1,200,000</span>
            </div>
            <div className={styles.rowBetween}>
              <span>Deep Sea Orb</span> <span className={styles.priceVal}>2,400,000</span>
            </div>
          </div>

          <div className={styles.totalsSection}>
            <div className={styles.rowBetween}>
              <span className={styles.mutedText}>Total cost</span>
              <span className={styles.monoText}>4,000,000</span>
            </div>
            <div className={styles.rowBetween}>
              <span className={styles.mutedText}>Remaining budget</span>
              <span className={styles.monoText}>1,000,000</span>
            </div>
            <div className={styles.projectedBox}>
              <div className={styles.projectedLabel}>Projected Sea Creature Chance</div>
              <div className={styles.projectedValues}>
                <span className={styles.projectedNumbers}>64% → 70%</span>
                <span className={styles.gainVal}>+6 pp</span>
              </div>
            </div>
          </div>

          <button onClick={handleSaveBuild} className={styles.saveBuildBtn}>
            Save build
          </button>
        </div>
      </div>
    </div>
  );
}
