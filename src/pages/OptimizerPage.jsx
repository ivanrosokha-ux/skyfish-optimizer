import { useState } from 'react';
import { useOptimizer } from '../hooks/useOptimizer';
import { usePlayerStore } from '../store/usePlayerStore';
import styles from './OptimizerPage.module.css';

export default function OptimizerPage() {
  const { username, profile } = usePlayerStore();
  const {
    rankedUpgrades,
    budgetAllocation,
    selectedFilters,
    toggleFilter,
    targetStat,
    setTargetStat,
    budget,
    setBudget,
    saveCurrentBuild,
  } = useOptimizer();

  const [inputBudget, setInputBudget] = useState(budget);
  const [saveMessage, setSaveMessage] = useState('');

  const handleCalculate = (e) => {
    e.preventDefault();
    setBudget(Number(inputBudget) || 0);
  };

  const handleSave = () => {
    const planName = saveCurrentBuild();
    setSaveMessage(`✓ Збережено: "${planName}" у вашому кабінеті!`);
    setTimeout(() => setSaveMessage(''), 3000);
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
              type="button"
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
                type="button"
                onClick={() => toggleFilter(filter)}
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
                <p className={styles.cardSub}>Sorted by lowest cost per +1 unit of {targetStat}.</p>
              </div>
              <span className={styles.countBadge}>{rankedUpgrades.length} upgrades</span>
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
                  {rankedUpgrades.map((u) => (
                    <tr key={u.id || u.name} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.upgradeName}>{u.name}</div>
                        <div className={styles.upgradeNote}>{u.note}</div>
                      </td>
                      <td className={`${styles.td} ${styles.typeText}`}>{u.type}</td>
                      <td className={`${styles.td} ${styles.gainVal}`}>{u.displayGain}</td>
                      <td className={`${styles.td} ${styles.priceVal}`}>
                        {u.price.toLocaleString()}
                      </td>
                      <td className={`${styles.td} ${styles.tdRight} ${styles.costVal}`}>
                        {u.costPerStat}
                      </td>
                    </tr>
                  ))}
                  {rankedUpgrades.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className={styles.td}
                        style={{ textAlign: 'center', padding: '2rem' }}
                      >
                        Немає оновлень за вибраними фільтрами.
                      </td>
                    </tr>
                  )}
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

          <form onSubmit={handleCalculate} className={styles.calcField}>
            <label className={styles.calcLabel}>Your budget</label>
            <div className={styles.inputBox}>
              <input
                type="number"
                value={inputBudget}
                onChange={(e) => setInputBudget(e.target.value)}
                className={styles.numInput}
                min={0}
                step={50000}
              />
              <span className={styles.currencyText}>coins</span>
            </div>
            <div className={styles.presetRow}>
              <button
                type="button"
                onClick={() => {
                  const b = (Number(inputBudget) || 0) + 1000000;
                  setInputBudget(b);
                  setBudget(b);
                }}
                className={styles.presetBtn}
              >
                +1M
              </button>
              <button
                type="button"
                onClick={() => {
                  const b = (Number(inputBudget) || 0) + 5000000;
                  setInputBudget(b);
                  setBudget(b);
                }}
                className={styles.presetBtn}
              >
                +5M
              </button>
              <button
                type="button"
                onClick={() => {
                  const b = (Number(inputBudget) || 0) + 10000000;
                  setInputBudget(b);
                  setBudget(b);
                }}
                className={styles.presetBtn}
              >
                +10M
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputBudget(5000000);
                  setBudget(5000000);
                }}
                className={styles.presetBtn}
              >
                Reset (5M)
              </button>
            </div>
            <button type="submit" className={styles.calcBtn}>
              Calculate
            </button>
          </form>

          <div className={styles.purchasesSection}>
            <div className={styles.sectionLabel}>
              Recommended purchases ({budgetAllocation.selectedItems.length})
            </div>
            {budgetAllocation.selectedItems.map((item) => (
              <div key={item.id || item.name} className={styles.rowBetween}>
                <span>{item.name}</span>
                <span className={styles.priceVal}>{item.cost.toLocaleString()}</span>
              </div>
            ))}
            {budgetAllocation.selectedItems.length === 0 && (
              <div className={styles.mutedText}>
                Бюджет занадто малий для рекомендованих покупок.
              </div>
            )}
          </div>

          <div className={styles.totalsSection}>
            <div className={styles.rowBetween}>
              <span className={styles.mutedText}>Total cost</span>
              <span className={styles.monoText}>{budgetAllocation.totalCost.toLocaleString()}</span>
            </div>
            <div className={styles.rowBetween}>
              <span className={styles.mutedText}>Remaining budget</span>
              <span className={styles.monoText}>
                {budgetAllocation.remainingBudget.toLocaleString()}
              </span>
            </div>
            <div className={styles.projectedBox}>
              <div className={styles.projectedLabel}>Projected Sea Creature Chance</div>
              <div className={styles.projectedValues}>
                <span className={styles.projectedNumbers}>
                  {budgetAllocation.currentSCC}% → {budgetAllocation.projectedSCC}%
                </span>
                <span className={styles.gainVal}>+{budgetAllocation.totalGain} pp</span>
              </div>
            </div>
          </div>

          {saveMessage && (
            <div style={{ color: 'var(--color-gain)', fontSize: '0.75rem', textAlign: 'center' }}>
              {saveMessage}
            </div>
          )}

          <button type="button" onClick={handleSave} className={styles.saveBuildBtn}>
            Save build
          </button>
        </div>
      </div>
    </div>
  );
}
