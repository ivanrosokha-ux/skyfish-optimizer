import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();

  const links = [
    { path: '/', label: 'Profile' },
    { path: '/optimizer', label: 'Optimizer' },
    { path: '/account', label: 'Account' },
    { path: '/login', label: 'Login' },
  ];

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        SkyFish
      </Link>

      <nav className={styles.nav}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
          >
            {link.label}
          </NavLink>
        ))}

        {isAuthenticated && user ? (
          <span className={styles.userBadge} title={`Signed in as ${user.email}`}>
            <span className={styles.userDot}>●</span>
            {user.name || user.email.split('@')[0]}
          </span>
        ) : (
          <span className={styles.guestBadge}>
            <span className={styles.guestDot}>○</span>
            Guest
          </span>
        )}
      </nav>
    </header>
  );
}
