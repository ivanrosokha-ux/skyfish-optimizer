import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('angler@example.com');
  const [password, setPassword] = useState('password123');
  const { login, register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = isRegister ? await register(email, password) : await login(email, password);
    if (result.success) {
      navigate('/account');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
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

        {error && <div className={styles.errorBanner}>{error}</div>}

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
        </form>

        <p className={styles.footnote}>Log in to sync your saved builds across devices.</p>
      </div>
    </div>
  );
}
