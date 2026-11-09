import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/account');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            onClick={() => setIsRegister(false)}
            className={!isRegister ? styles.tabActive : styles.tabInactive}
          >
            Login
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={isRegister ? styles.tabActive : styles.tabInactive}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>Email</label>
            <div className={styles.inputBox}>
              <span className={styles.icon}>✉️</span>
              <input type="email" defaultValue="angler@example.com" className={styles.input} />
            </div>
          </div>

          <div>
            <div className={styles.labelRow}>
              <label className={styles.label}>Password</label>
              <span className={styles.forgotLink}>Forgot password?</span>
            </div>
            <div className={styles.inputBox}>
              <span className={styles.icon}>🔒</span>
              <input type="password" defaultValue="••••••••••••" className={styles.input} />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            {isRegister ? 'Register' : 'Log in'}
          </button>
        </form>

        <p className={styles.footnote}>Log in to sync your saved builds across devices.</p>
      </div>
    </div>
  );
}
