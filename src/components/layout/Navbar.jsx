import { Link, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar() {
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
      </nav>
    </header>
  );
}
