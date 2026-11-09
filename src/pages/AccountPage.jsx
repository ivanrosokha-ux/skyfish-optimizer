import { usePlayerStore } from '../store/usePlayerStore';
import styles from './AccountPage.module.css';

export default function AccountPage() {
  const { username, setUsername } = usePlayerStore();

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
            <span className={styles.badge}>Signed in</span>
          </div>

          <div className={styles.formFields}>
            <div>
              <label className={styles.fieldLabel}>Email</label>
              <div className={styles.inputBox}>
                <span className={styles.fieldIcon}>✉️</span>
                <input
                  type="text"
                  disabled
                  value="angler@example.com"
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.inputActive}
                />
              </div>
            </div>

            <button className={styles.saveBtn}>Save</button>
          </div>
        </div>

        {/* Saved Builds */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Saved builds</h2>
            <span className={styles.badgeMuted}>2 saved builds</span>
          </div>

          <div className={styles.buildsList}>
            {/* Build 1 */}
            <div className={styles.buildCard}>
              <div className={styles.buildTitleRow}>
                <span>🔖</span>
                <span className={styles.buildName}>Everyday fishing</span>
              </div>
              <div className={styles.buildMeta}>Current equipment · Lime</div>
              <div className={styles.buildStats}>64% SCC &nbsp;&nbsp; 180 speed</div>
            </div>

            {/* Build 2 */}
            <div className={styles.buildCard}>
              <div className={styles.buildTitleRow}>
                <span>🔖</span>
                <span className={styles.buildName}>SCC · 5M plan</span>
              </div>
              <div className={styles.buildMeta}>3 upgrades · 4,000,000 coins</div>
              <div className={styles.buildStats}>70% SCC &nbsp;&nbsp; 180 speed</div>
            </div>
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
          <span className={styles.badgeMuted}>Before vs After</span>
        </div>

        <div className={styles.compareGrid}>
          {/* Selectors Column */}
          <div className={styles.selectorCol}>
            <div>
              <div className={styles.fieldLabel}>Before</div>
              <div className={styles.dropdownBox}>
                <span>Everyday fishing</span>
                <span>▾</span>
              </div>
            </div>
            <div>
              <div className={styles.fieldLabel}>After</div>
              <div className={styles.dropdownBox}>
                <span>SCC · 5M plan</span>
                <span>▾</span>
              </div>
            </div>
          </div>

          {/* Metric 1: SCC */}
          <div className={styles.metricBox}>
            <div className={styles.metricLabel}>Sea Creature Chance</div>
            <div className={styles.metricValues}>
              <div className={styles.metricRow}>
                64% <span className={styles.metricRowSub}>Before</span>
              </div>
              <div className={styles.metricRow}>
                70% <span className={styles.metricRowSub}>After</span>
              </div>
            </div>
            <div className={styles.deltaGain}>+6 pp</div>
          </div>

          {/* Metric 2: Speed */}
          <div className={styles.metricBox}>
            <div className={styles.metricLabel}>Fishing Speed</div>
            <div className={styles.metricValues}>
              <div className={styles.metricRowAccent}>
                180 <span className={styles.metricRowSub}>Before</span>
              </div>
              <div className={styles.metricRowAccent}>
                180 <span className={styles.metricRowSub}>After</span>
              </div>
            </div>
            <div className={styles.deltaNone}>No change</div>
          </div>

          {/* Metric 3: Treasure */}
          <div className={styles.metricBox}>
            <div className={styles.metricLabel}>Treasure Chance</div>
            <div className={styles.metricValues}>
              <div className={styles.metricRow}>
                12% <span className={styles.metricRowSub}>Before</span>
              </div>
              <div className={styles.metricRow}>
                12% <span className={styles.metricRowSub}>After</span>
              </div>
            </div>
            <div className={styles.deltaNone}>No change</div>
          </div>

          {/* Metric 4: Wisdom */}
          <div className={styles.metricBox}>
            <div className={styles.metricLabel}>Fishing Wisdom</div>
            <div className={styles.metricValues}>
              <div className={styles.metricRow}>
                30 <span className={styles.metricRowSub}>Before</span>
              </div>
              <div className={styles.metricRow}>
                30 <span className={styles.metricRowSub}>After</span>
              </div>
            </div>
            <div className={styles.deltaNone}>No change</div>
          </div>
        </div>
      </div>
    </div>
  );
}
