import { useState, useEffect } from 'react';
import { useOptimizer } from '../hooks/useOptimizer';
import { usePlayerStore } from '../store/usePlayerStore';
import { fetchBazaarSummary } from '../services/api';
import styles from './OptimizerPage.module.css';

function getRarityColorClass(rarity) {
  switch ((rarity || '').toUpperCase()) {
    case 'MYTHIC':
      return styles.colorMythic;
    case 'LEGENDARY':
      return styles.colorLegendary;
    case 'EPIC':
      return styles.colorEpic;
    case 'RARE':
      return styles.colorRare;
    case 'UNCOMMON':
      return styles.colorUncommon;
    default:
      return styles.colorCommon;
  }
}

function getRarityGlowClass(rarity) {
  switch ((rarity || '').toUpperCase()) {
    case 'MYTHIC':
      return styles.glowMythic;
    case 'LEGENDARY':
      return styles.glowLegendary;
    case 'EPIC':
      return styles.glowEpic;
    case 'RARE':
      return styles.glowRare;
    case 'UNCOMMON':
      return styles.glowUncommon;
    default:
      return styles.glowCommon;
  }
}

export default function OptimizerPage() {
  const { username, profile, stats } = usePlayerStore();
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
  const [bazaarPrices, setBazaarPrices] = useState(null);

  useEffect(() => {
    setInputBudget(budget);
  }, [budget]);

  useEffect(() => {
    let mounted = true;
    fetchBazaarSummary().then((data) => {
      if (mounted && data) setBazaarPrices(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

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
              {stat === 'SCC' && (
                <img
                  src="/assets/minecraft/icons/scc.png"
                  className={styles.filterChipIcon}
                  alt=""
                />
              )}
              {stat === 'Fishing Speed' && (
                <img
                  src="/assets/minecraft/icons/fishing_speed.png"
                  className={styles.filterChipIcon}
                  alt=""
                />
              )}
              {stat === 'Mixed' && (
                <img
                  src="/assets/minecraft/icons/rod.png"
                  className={styles.filterChipIcon}
                  alt=""
                />
              )}
              {stat}
            </button>
          ))}
          <span className={styles.sccHint}>SCC = Sea Creature Chance</span>
        </div>

        <div className={styles.filterChips}>
          {[
            { name: 'Enchantments', icon: '/assets/minecraft/icons/enchanted_book.png' },
            { name: 'Armor', icon: '/assets/minecraft/diamond_chestplate.png' },
            { name: 'Reforges', icon: '/assets/minecraft/icons/scc.png' },
            { name: 'Pet', icon: '/assets/minecraft/pets/dolphin.png' },
            { name: 'Accessory', icon: '/assets/minecraft/necklace.png' },
          ].map((filter) => {
            const isSelected = selectedFilters.includes(filter.name);
            return (
              <button
                key={filter.name}
                type="button"
                onClick={() => toggleFilter(filter.name)}
                className={isSelected ? styles.filterChipActive : styles.filterChip}
              >
                <img src={filter.icon} alt="" className={styles.filterChipIcon} />
                {isSelected && <span>✓ </span>}
                {filter.name}
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
                        <div className={styles.upgradeItemRow}>
                          <div
                            className={`${styles.upgradeIconSlot} ${getRarityGlowClass(u.rarity)}`}
                          >
                            <img
                              src={u.texture || '/assets/minecraft/icons/rod.png'}
                              alt={u.name}
                              className={styles.upgradeItemTexture}
                            />
                          </div>
                          <div className={styles.upgradeItemDetails}>
                            <div className={styles.upgradeTitleRow}>
                              <span
                                className={`${styles.upgradeName} ${getRarityColorClass(u.rarity)}`}
                              >
                                {u.name}
                              </span>
                              {u.wikiUrl && (
                                <a
                                  href={u.wikiUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.wikiBadgeLink}
                                  title={`Переглянути ${u.name} на офіційній Hypixel SkyBlock Wiki`}
                                >
                                  Wiki ↗
                                </a>
                              )}
                              {u.liveMarket && (
                                <span className={styles.bazaarPillBadge} title={u.marketSource}>
                                  ● Bazaar
                                </span>
                              )}
                            </div>
                            <div className={styles.upgradeNote}>{u.note}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`${styles.td} ${styles.typeText}`}>
                        <span className={styles.categoryBadge}>{u.type}</span>
                      </td>
                      <td className={`${styles.td} ${styles.gainVal}`}>
                        <span
                          className={
                            u.statType === 'speed' ? styles.statBadgeSpeed : styles.statBadgeSCC
                          }
                        >
                          {u.displayGain}
                        </span>
                      </td>
                      <td className={`${styles.td} ${styles.priceVal}`}>
                        <div className={styles.priceRow}>
                          <img
                            src="/assets/minecraft/icons/coin.png"
                            alt="Coins"
                            className={styles.coinPixelIcon}
                          />
                          <span>{u.price.toLocaleString()}</span>
                        </div>
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

          {bazaarPrices && (
            <div className={styles.bazaarTicker}>
              <span className={styles.bazaarTag}>
                <span className={styles.livePulseDot} /> Hypixel Bazaar Live:
              </span>
              <span className={styles.bazaarItem}>
                <img
                  src="/assets/minecraft/icons/shard.png"
                  alt=""
                  className={styles.tickerPixelIcon}
                />
                Shark Fin: ~
                {Math.round(bazaarPrices.ENCHANTED_SHARK_FIN?.buyPrice || 58999).toLocaleString()}{' '}
                coins
              </span>
              <span>·</span>
              <span className={styles.bazaarItem}>
                <img
                  src="/assets/minecraft/icons/nautilus.png"
                  alt=""
                  className={styles.tickerPixelIcon}
                />
                Wet Sponge: ~
                {Math.round(bazaarPrices.ENCHANTED_WET_SPONGE?.buyPrice || 80199).toLocaleString()}{' '}
                coins
              </span>
              <span>·</span>
              <span className={styles.bazaarItem}>
                <img
                  src="/assets/minecraft/icons/bone.png"
                  alt=""
                  className={styles.tickerPixelIcon}
                />
                Tiger Tooth: ~
                {Math.round(bazaarPrices.TIGER_SHARK_TOOTH?.buyPrice || 123980).toLocaleString()}{' '}
                coins
              </span>
            </div>
          )}
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
              {stats.purse > 0 && (
                <button
                  type="button"
                  title="Використати монети з гаманця"
                  onClick={() => {
                    setInputBudget(stats.purse);
                    setBudget(stats.purse);
                  }}
                  className={styles.presetBtn}
                >
                  Purse ({Math.round(stats.purse / 1000000)}M)
                </button>
              )}
              {stats.bank > 0 && (
                <button
                  type="button"
                  title="Використати баланс банку"
                  onClick={() => {
                    setInputBudget(stats.bank);
                    setBudget(stats.bank);
                  }}
                  className={styles.presetBtn}
                >
                  Bank ({Math.round(stats.bank / 1000000)}M)
                </button>
              )}
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
                <div className={styles.purchaseItemLeft}>
                  {item.texture && (
                    <img src={item.texture} alt="" className={styles.purchaseMiniIcon} />
                  )}
                  <span>{item.name}</span>
                </div>
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
