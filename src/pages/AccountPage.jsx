import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePlayerStore } from '../store/usePlayerStore';
import styles from './AccountPage.module.css';

export default function AccountPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const { username, setUsername, savedBuilds, removeSavedBuild } = usePlayerStore();
  const navigate = useNavigate();

  const [inputNick, setInputNick] = useState(username);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync nickname with global store
  useEffect(() => {
    if (username) {
      setInputNick(username);
    }
  }, [username]);

  // Before vs After build selection
  const [beforeBuildId, setBeforeBuildId] = useState(savedBuilds[0]?.id || '1');
  const [afterBuildId, setAfterBuildId] = useState(savedBuilds[savedBuilds.length - 1]?.id || '2');

  useEffect(() => {
    if (savedBuilds.length > 0) {
      if (!savedBuilds.some((b) => b.id === beforeBuildId)) {
        setBeforeBuildId(savedBuilds[0].id);
      }
      if (!savedBuilds.some((b) => b.id === afterBuildId)) {
        setAfterBuildId(savedBuilds[savedBuilds.length - 1].id);
      }
    }
  }, [savedBuilds, beforeBuildId, afterBuildId]);

  const beforeBuild = savedBuilds.find((b) => b.id === beforeBuildId) || savedBuilds[0] || {};
  const afterBuild =
    savedBuilds.find((b) => b.id === afterBuildId) || savedBuilds[savedBuilds.length - 1] || {};

  const deltaSCC = (afterBuild.scc || 0) - (beforeBuild.scc || 0);
  const deltaSpeed = (afterBuild.speed || 0) - (beforeBuild.speed || 0);
  const deltaTreasure = (afterBuild.treasure || 12) - (beforeBuild.treasure || 12);
  const deltaWisdom = (afterBuild.wisdom || 30) - (beforeBuild.wisdom || 30);

  const handleSaveNick = (e) => {
    e.preventDefault();
    setUsername(inputNick);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>Account</h1>
        <p className={styles.subtitle}>
          Keep your builds together and see what each upgrade changes.
        </p>
      </div>

      <div className={styles.grid2}>
        {/* Account Details */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Account details</h2>
            <span className={styles.badge}>{isAuthenticated ? '● Signed in' : '○ Guest'}</span>
          </div>

          <form onSubmit={handleSaveNick} className={styles.formFields}>
            <div>
              <label className={styles.fieldLabel}>Email</label>
              <div className={styles.inputBox}>
                <span className={styles.fieldIcon}>✉️</span>
                <input
                  type="text"
                  disabled
                  value={user?.email || 'angler@example.com'}
                  className={styles.inputDisabled}
                />
              </div>
            </div>

            <div>
              <label className={styles.fieldLabel}>Default nickname</label>
              <div className={styles.inputBox}>
                <span className={styles.fieldIcon}>👤</span>
                <input
                  type="text"
                  value={inputNick}
                  onChange={(e) => setInputNick(e.target.value)}
                  className={styles.inputActive}
                />
              </div>
            </div>

            {saveSuccess && (
              <div style={{ color: 'var(--color-gain)', fontSize: '0.75rem' }}>
                ✓ Нікнейм оновлено!
              </div>
            )}

            <button type="submit" className={styles.saveBtn}>
              Save
            </button>
            <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
              Log out
            </button>
          </form>
        </div>

        {/* Saved Builds */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Saved builds</h2>
            <span className={styles.badgeMuted}>{savedBuilds.length} saved builds</span>
          </div>

          <div className={styles.buildsList}>
            {savedBuilds.map((build) => (
              <div key={build.id} className={styles.buildCard}>
                <div className={styles.buildTitleRow}>
                  <span>🔖</span>
                  <span className={styles.buildName}>{build.name}</span>
                  {savedBuilds.length > 1 && (
                    <button
                      type="button"
                      title="Видалити білд"
                      onClick={() => removeSavedBuild(build.id)}
                      className={styles.deleteBtn}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className={styles.buildMeta}>
                  {build.meta || `${build.scc}% SCC · ${build.speed} speed`}
                </div>
                <div className={styles.buildStats}>
                  {build.scc}% SCC &nbsp;&nbsp; {build.speed} speed
                </div>
              </div>
            ))}
          </div>

          <div className={styles.footerNotice}>
            <span>🔏</span> Builds saved to your account.
          </div>
        </div>
      </div>

      {/* Compare Builds Matrix */}
      <div className={styles.compareCard}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Compare builds</h2>
          <span className={styles.badgeMuted}>Before vs After (Dynamic Analysis)</span>
        </div>

        <div className={styles.compareGrid}>
          {/* Selectors Column */}
          <div className={styles.selectorCol}>
            <div>
              <label className={styles.fieldLabel}>Before</label>
              <select
                value={beforeBuildId}
                onChange={(e) => setBeforeBuildId(e.target.value)}
                className={styles.selectBox}
              >
                {savedBuilds.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.fieldLabel}>After</label>
              <select
                value={afterBuildId}
                onChange={(e) => setAfterBuildId(e.target.value)}
                className={styles.selectBox}
              >
                {savedBuilds.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Metric 1: SCC */}
          <div className={styles.metricBox}>
            <div className={styles.metricLabel}>Sea Creature Chance</div>
            <div className={styles.metricValues}>
              <div className={styles.metricRow}>
                {beforeBuild.scc || 0}% <span className={styles.metricRowSub}>Before</span>
              </div>
              <div className={styles.metricRow}>
                {afterBuild.scc || 0}% <span className={styles.metricRowSub}>After</span>
              </div>
            </div>
            <div className={deltaSCC > 0 ? styles.deltaGain : styles.deltaNone}>
              {deltaSCC > 0 ? `+${deltaSCC} pp` : deltaSCC === 0 ? 'No change' : `${deltaSCC} pp`}
            </div>
          </div>

          {/* Metric 2: Speed */}
          <div className={styles.metricBox}>
            <div className={styles.metricLabel}>Fishing Speed</div>
            <div className={styles.metricValues}>
              <div className={styles.metricRowAccent}>
                {beforeBuild.speed || 0} <span className={styles.metricRowSub}>Before</span>
              </div>
              <div className={styles.metricRowAccent}>
                {afterBuild.speed || 0} <span className={styles.metricRowSub}>After</span>
              </div>
            </div>
            <div className={deltaSpeed > 0 ? styles.deltaGain : styles.deltaNone}>
              {deltaSpeed > 0 ? `+${deltaSpeed}` : deltaSpeed === 0 ? 'No change' : `${deltaSpeed}`}
            </div>
          </div>

          {/* Metric 3: Treasure */}
          <div className={styles.metricBox}>
            <div className={styles.metricLabel}>Treasure Chance</div>
            <div className={styles.metricValues}>
              <div className={styles.metricRow}>
                {beforeBuild.treasure || 12}% <span className={styles.metricRowSub}>Before</span>
              </div>
              <div className={styles.metricRow}>
                {afterBuild.treasure || 12}% <span className={styles.metricRowSub}>After</span>
              </div>
            </div>
            <div className={deltaTreasure > 0 ? styles.deltaGain : styles.deltaNone}>
              {deltaTreasure > 0 ? `+${deltaTreasure}%` : 'No change'}
            </div>
          </div>

          {/* Metric 4: Wisdom */}
          <div className={styles.metricBox}>
            <div className={styles.metricLabel}>Fishing Wisdom</div>
            <div className={styles.metricValues}>
              <div className={styles.metricRow}>
                {beforeBuild.wisdom || 30} <span className={styles.metricRowSub}>Before</span>
              </div>
              <div className={styles.metricRow}>
                {afterBuild.wisdom || 30} <span className={styles.metricRowSub}>After</span>
              </div>
            </div>
            <div className={deltaWisdom > 0 ? styles.deltaGain : styles.deltaNone}>
              {deltaWisdom > 0 ? `+${deltaWisdom}` : 'No change'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
