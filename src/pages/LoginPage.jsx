import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('angler@example.com');
  const [password, setPassword] = useState('password123');
  const { user, isAuthenticated, login, register, demoLogin, logout, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = isRegister ? await register(email, password) : await login(email, password);
    if (result.success) {
      navigate('/account');
    }
  };

  const handleDemoLogin = async () => {
    const result = await demoLogin();
    if (result.success) {
      navigate('/account');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* If already logged in, show current session status */}
        {isAuthenticated && user && (
          <div className={styles.activeSessionBanner}>
            <div className={styles.activeSessionHeader}>
              <span className={styles.statusDot}>●</span>
              <span>
                Signed in as <strong>{user.email}</strong>
              </span>
            </div>
            <div className={styles.activeSessionActions}>
              <button
                type="button"
                onClick={() => navigate('/account')}
                className={styles.sessionLinkBtn}
              >
                Go to Account →
              </button>
              <button type="button" onClick={logout} className={styles.sessionLogoutBtn}>
                Log out
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={!isRegister ? styles.tabActive : styles.tabInactive}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={isRegister ? styles.tabActive : styles.tabInactive}
          >
            Register
          </button>
        </div>

        {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>Email</label>
            <div className={styles.inputBox}>
              <span className={styles.icon}>✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="angler@example.com"
              />
            </div>
          </div>

          <div>
            <div className={styles.labelRow}>
              <label className={styles.label}>Password</label>
              <span className={styles.forgotLink}>Forgot password?</span>
            </div>
            <div className={styles.inputBox}>
              <span className={styles.icon}>🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? 'Зачекайте...' : isRegister ? 'Register' : 'Log in'}
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className={styles.demoBtn}
            title="Швидкий тестовий вхід без введення пароля"
          >
            ⚡ Quick Demo Sign-in (1 click)
          </button>
        </form>

        <p className={styles.footnote}>Log in to sync your saved builds across devices.</p>
      </div>
    </div>
  );
}
