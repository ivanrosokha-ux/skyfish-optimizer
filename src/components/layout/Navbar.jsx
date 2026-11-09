import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
  const location = useLocation();

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
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
